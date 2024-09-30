// /composables/usePreloader.js
import { ref } from 'vue';

const isPreloaderVisible = ref(true);

function hidePreloader() {
  isPreloaderVisible.value = false;
}

function showPreloader() {
  isPreloaderVisible.value = true;
}

export function usePreloader() {
  return {
    isPreloaderVisible,
    hidePreloader,
    showPreloader
  };
}
