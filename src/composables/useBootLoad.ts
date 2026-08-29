import { onMounted, ref } from 'vue';

/**
 * Skeleton window while `loader` runs. `minMs` can hold the skeleton open a
 * little longer to avoid a flash, but defaults to 0 — a deliberate delay is
 * indistinguishable from a slow site.
 */
export function useBootLoad(loader?: () => Promise<unknown>, minMs = 0) {
  const booting = ref(true);

  onMounted(async () => {
    const started = Date.now();
    try {
      if (loader) await loader();
    } finally {
      const wait = Math.max(0, minMs - (Date.now() - started));
      if (wait) await new Promise((r) => setTimeout(r, wait));
      booting.value = false;
    }
  });

  return { booting };
}
