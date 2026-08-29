import { nextTick, onMounted, onUnmounted, ref, type Ref } from 'vue';

/** Fade/slide-in when element enters the viewport */
export function useReveal(el: Ref<HTMLElement | null>, options?: IntersectionObserverInit) {
  const visible = ref(false);
  let observer: IntersectionObserver | null = null;
  let fallback: ReturnType<typeof setTimeout> | null = null;

  onMounted(async () => {
    await nextTick();
    const node = el.value;
    if (!node || typeof IntersectionObserver === 'undefined') {
      visible.value = true;
      return;
    }

    // Always show within 600ms so content never stays invisible
    fallback = setTimeout(() => {
      visible.value = true;
      observer?.disconnect();
    }, 600);

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          visible.value = true;
          if (fallback) clearTimeout(fallback);
          observer?.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px 0px 0px', ...options },
    );
    observer.observe(node);
  });

  onUnmounted(() => {
    if (fallback) clearTimeout(fallback);
    observer?.disconnect();
  });

  return { visible };
}
