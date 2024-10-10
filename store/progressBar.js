// store/progressBar.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useProgressBarStore = defineStore("progressBar", () => {
  const showProgress = ref(false);
  const progress = ref(0);
  const progressDurations = ref({}); 
  let animationFrame = null;
  let completionCallback = null;

  const setProgressDuration = (lootId, duration) => {
    progressDurations.value[lootId] = duration;
  };

  const setCompletionCallback = (callback) => {
    completionCallback = callback;
  };

  const startProgress = (lootId) => {
    if (showProgress.value) return;

    const duration = progressDurations.value[lootId];
    showProgress.value = true;
    progress.value = 0;
    const startTime = performance.now();

    const updateProgress = (timestamp) => {
      const elapsed = timestamp - startTime;
      progress.value = Math.min((elapsed / duration) * 100, 100);

      if (progress.value < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        showProgress.value = false;
        if (completionCallback) {
          completionCallback();
        }
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
  };

  const clearProgress = () => {
    cancelAnimationFrame(animationFrame);
    showProgress.value = false;
    progress.value = 0;
  };

  return {
    showProgress,
    progress,
    setProgressDuration,
    setCompletionCallback,
    startProgress,
    clearProgress,
  };
});
