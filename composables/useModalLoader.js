// /composables/useModalLoader.js

import { ref, onMounted } from 'vue';

export function useModalLoader(resources = []) {
  const isLoaded = ref(false);
  const loadedResources = ref(0);

  const checkResourcesLoaded = () => {
    if (loadedResources.value >= resources.length) {
      isLoaded.value = true;
    }
  };

  const loadResource = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedResources.value++;
        checkResourcesLoaded();
        resolve();
      };
      img.onerror = () => {
        loadedResources.value++;
        checkResourcesLoaded();
        resolve();
      };
    });
  };

  onMounted(async () => {
    await Promise.all(resources.map((src) => loadResource(src)));
  });

  return {
    isLoaded,
  };
}
