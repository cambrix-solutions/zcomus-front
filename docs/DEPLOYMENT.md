# Deployment — GitHub Actions to aaPanel (no Docker)

The storefront builds to static files, so deployment is just "build the artifact, copy it
to the server". The build runs on the GitHub runner; **the server never needs Node,
npm or a toolchain**. That deliberately avoids the `vue-tsc` memory cost and the
`EPERM` failures that server-side builds hit under aaPanel.

Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
Trigger: every push to **`production`**, plus manual **Run workflow**.

`main` is the integration branch and never deploys. Ship by merging `main` into
`production`:

```bash
git checkout production && git merge --ff-only main && git push
git checkout main
```

The `production` branch must exist on the remote before the workflow can run:

```bash
git checkout -b production main && git push -u origin production
```

---

## 1. One-time server preparation

SSH in as `root` and run:

```bash
# rsync is required on the server side
command -v rsync || apt-get install -y rsync   # or: yum install -y rsync

# Release directory. Do NOT create `current` — the workflow makes it a symlink.
mkdir -p /www/wwwroot/zcomus-front/releases
rm -rf /www/wwwroot/zcomus-front/current       # only if it exists as a real folder
```

Layout after the first deploy:

```
/www/wwwroot/zcomus-front/
├── releases/
│   ├── 20260829T120000-a1b2c3d/   ← previous
│   └── 20260829T133000-e4f5g6h/   ← newest
└── current -> releases/20260829T133000-e4f5g6h
```

## 2. Deploy SSH key

Generate a key **dedicated to deploys**, with no passphrase:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/zcomus_deploy -N ""
cat ~/.ssh/zcomus_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Value for the SSH_KEY secret (the PRIVATE key):
cat ~/.ssh/zcomus_deploy

# Value for the optional SSH_KNOWN_HOSTS secret:
ssh-keyscan -H <server-ip>
```

## 3. GitHub secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Required | Example |
|---|---|---|
| `SSH_HOST` | yes | `107.172.206.x` |
| `SSH_USER` | yes | `root` |
| `SSH_KEY` | yes | contents of the **private** key, including the BEGIN/END lines |
| `DEPLOY_PATH` | yes | `/www/wwwroot/zcomus-front` |
| `SSH_PORT` | no (defaults to 22) | `22` |
| `SSH_KNOWN_HOSTS` | recommended | output of `ssh-keyscan -H <ip>` |

Without `SSH_KNOWN_HOSTS` the workflow trusts the host key on first connect
(`ssh-keyscan`), which is convenient but not protected against a man-in-the-middle.
Pinning it is one extra secret and closes that gap.

## 4. Point nginx at `current`

Edit the site's nginx config and change only the `root` line:

```nginx
root /www/wwwroot/zcomus-front/current;

location / {
    try_files $uri $uri/ /index.html;   # required: history-mode routing
}

# The service worker must never be cached, or clients keep the old app.
location = /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    expires off;
}
```

Then `nginx -t && nginx -s reload`.

**If the site 403s after switching to `current`:** aaPanel sometimes adds
`disable_symlinks if_not_owner from=$document_root;`, which blocks nginx from
following the release symlink. Remove that directive, or make sure the symlink and
release files are owned by `www`.

---

## Rollback

Releases are kept (5 most recent), so rolling back is a symlink swap:

```bash
cd /www/wwwroot/zcomus-front
ls -1dt releases/*/                      # list, newest first
ln -sfn releases/<older-release> current.tmp && mv -Tf current.tmp current
```

No rebuild, no downtime.

---

## Notes

- **Atomic swap.** Files are rsynced into a *new* release directory and only then does
  the `current` symlink move, via `mv -T`. Visitors never see a half-written site.
- **The build gates the deploy.** `vite-plugin-checker` runs `vue-tsc` and ESLint during
  `quasar build`, so a type or lint error fails the workflow before anything is uploaded.
- **Returning visitors and the service worker.** A PWA client keeps serving its cached
  app until the new service worker activates, so a deploy is not instantly visible to
  people who already have the site open. The `no-cache` header on `/sw.js` above keeps
  that window as short as possible.
- **Do not commit `dist/`.** It is gitignored; the runner builds it.
- **API URL is baked in at build time, and `.env` decides it.** Quasar loads `.env` for
  every mode and then `.env.prod` for production builds, with the later file winning.
  `resolveAppMode()` reads `VITE_APP_MODE` *before* falling back to Vite's `PROD` flag, so
  a `.env` containing `VITE_APP_MODE=local` would ship a bundle pointing at
  `https://zcomus.test` even from `quasar build`. `.env.prod` therefore sets
  `VITE_APP_MODE=production` (→ `https://api.zcomus.site`) and **must be committed** so
  the CI runner picks it up. Verify after any change to these files:

  ```bash
  npx quasar build -m pwa
  grep -o 'return`production`' dist/pwa/assets/index-*.js   # expect a match
  ```

  To point at a different backend without touching modes, set `VITE_API_URL`.
