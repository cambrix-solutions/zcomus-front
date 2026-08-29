# Deployment — GitHub Actions to aaPanel (no Docker)

The storefront builds to static files, so deployment is just "build the artifact, copy it
to the server". The build runs on the GitHub runner; **the server needs no Node, npm or
toolchain**, and no RAM is spent on `vue-tsc` there.

Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
Trigger: every push to **`production`**, plus manual **Run workflow**.

**The server's aaPanel/nginx configuration is not touched by this workflow.** It rsyncs
into the folder nginx already serves and does nothing else.

---

## Server layout (already configured in aaPanel)

| Setting | Value |
|---|---|
| nginx `root` | `/www/wwwroot/zcomus-front/dist/pwa` |
| aaPanel site directory | `/www/wwwroot/zcomus-front/dist` |
| aaPanel running directory | `/pwa` |
| `DEPLOY_PATH` secret | `/www/wwwroot/zcomus-front` |

The workflow writes to `$DEPLOY_PATH/dist/pwa`. Nothing else on the server is created
or modified.

## Branching

`main` is the integration branch and never deploys. Ship by merging into `production`:

```bash
git checkout production && git merge --ff-only main && git push
git checkout main
```

Create the branch once, if it does not exist yet:

```bash
git checkout -b production main && git push -u origin production
```

## GitHub secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Required | Value |
|---|---|---|
| `SSH_HOST` | yes | `107.172.206.228` |
| `SSH_USER` | yes | `root` |
| `SSH_KEY` | yes | private key contents, `-----BEGIN…` to `-----END…` |
| `DEPLOY_PATH` | yes | `/www/wwwroot/zcomus-front` |
| `SSH_PORT` | no (defaults 22) | `22` — confirmed correct for this server |
| `SSH_KNOWN_HOSTS` | recommended | output of `ssh-keyscan -H 107.172.206.228` |

Without `SSH_KNOWN_HOSTS` the workflow trusts the host key on first connect, which is
convenient but unprotected against a man-in-the-middle. Pinning it closes that gap.

Set the key without it passing through a chat window or clipboard history:

```bash
gh secret set SSH_KEY --repo cambrix-solutions/zcomus-front < /root/.ssh/zcomus_deploy
```

## Requirement on the server

Only one: `rsync` must be installed.

```bash
command -v rsync || apt-get install -y rsync
```

---

## How the deploy behaves

- `rsync --delete --delay-updates --delete-after` stages the new files, renames them in
  at the end, and only then removes stale ones — so the window where the site could be
  inconsistent is as small as rsync allows. It is not fully atomic; a symlink-swap scheme
  would be, but that requires changing the nginx `root`.
- **The build gates the deploy.** `vite-plugin-checker` runs `vue-tsc` and ESLint during
  `quasar build`, so a type or lint error fails the workflow before anything is uploaded.
- **The bundle is checked for production API mode** before upload (see below). A build
  accidentally pointing at `zcomus.test` fails the job rather than shipping.
- File ownership is left alone. nginx runs as `www` and can read the root-owned files
  already there; the workflow does not `chown`.

## API URL is baked in at build time

Quasar loads `.env` for every mode, then `.env.prod` for production builds, with the
later file winning. `resolveAppMode()` reads `VITE_APP_MODE` *before* falling back to
Vite's `PROD` flag, so a `.env` containing `VITE_APP_MODE=local` would ship a bundle
calling `https://zcomus.test` even from `quasar build`.

`.env.prod` therefore sets `VITE_APP_MODE=production` (→ `https://api.zcomus.site`) and
**must be committed** so the runner picks it up. To verify locally:

```bash
npx quasar build -m pwa
grep -o 'return`production`' dist/pwa/assets/index-*.js   # expect a match
```

To point at a different backend without touching modes, set `VITE_API_URL`.

## Optional: stop the service worker being cached

Not required, and it does mean editing the site's nginx config — but without it,
returning visitors can keep the previous app version longer than necessary, because
`sw.js` is the file that tells the browser an update exists:

```nginx
location = /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    expires off;
}
```

Your current config caches all `.js` for 12h, which includes `sw.js`. Chrome caps
service-worker caching at 24h, so updates do eventually land either way.
