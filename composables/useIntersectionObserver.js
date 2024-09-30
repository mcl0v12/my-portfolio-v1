// /composables/useIntersectionObserver.js
import { onMounted, watch } from 'vue';
import { usePreloader } from '~/composables/usePreloader'; 

// Singleton für IntersectionObserver
let observerInstance = null;

export function animationObserver(refsArray, options = {}, callback = null) {
  const { isPreloaderVisible } = usePreloader();

  const initializeObserver = () => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const { threshold = 0.1, root = null, rootMargin = '0px', defaultAnimationClass = 'enter' } = options;

      // Observer nur einmal erstellen
      if (!observerInstance) {
        observerInstance = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const animationClass = entry.target.dataset.animation || defaultAnimationClass;
              entry.target.classList.add(animationClass);
              observerInstance.unobserve(entry.target); // Stop observing after animation
            } else if (callback) {
              callback(entry.target);
            }
          });
        }, { threshold, root, rootMargin });
      }

      // Überwache jedes Element in refsArray
      refsArray.forEach(refs => {
        const elements = Array.isArray(refs.value) ? refs.value : [refs.value];
        elements.forEach((el) => {
          if (el) observerInstance.observe(el);
        });
      });
    } else {
      console.warn('IntersectionObserver not supported.');
    }
  };

  onMounted(() => {
    if (!isPreloaderVisible.value) {
      initializeObserver();
    } else {
      // Starte Observer nach Preloader
      watch(isPreloaderVisible, (newVal) => {
        if (!newVal) initializeObserver();
      });
    }
  });
}
