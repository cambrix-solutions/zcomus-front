import { onMounted, ref } from 'vue';

/** Shows a short boot/skeleton window even when data resolves instantly. */
export function useBootLoad(loader?: () => Promise<unknown>, minMs = 400) {
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
