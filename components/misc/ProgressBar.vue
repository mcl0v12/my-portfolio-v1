<!-- /components/misc/ProgressBar.vue -->

<template>
    <div
      class="progress-bar-container w-full max-w-[300px] h-[25px] fixed top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden z-[2]"
    >
      <span
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-default text-white text-sm z-[2]"
      >
        Opening
      </span>
      <div class="progress-bar h-full absolute top-0 left-0" :style="{ width: progress + '%' }">
        <div
          class="progress-end-marker w-[2px] h-full absolute right-0 top-0"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    progress: {
      type: Number,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .progress-bar-container {
    background-color: rgba(0, 0, 0, 0.2);
    border: 2px solid var(--gray-80);
    border-radius: 1rem;
  }
  
  .progress-bar {
    transition: width 0.05s linear;
    box-shadow: inset 0 3px 3px rgba(26, 26, 26, 0.8),
      inset 0 -3px 3px rgba(26, 26, 26, 0.8);
    background: linear-gradient(to bottom, #b98000, #8c5d00);
  }
  
  .progress-end-marker {
    will-change: transform;
    background-color: rgba(255, 221, 0, 1);
    box-shadow: 0 0 10px 5px rgba(255, 255, 200, 0.5);
  }
  </style>
  