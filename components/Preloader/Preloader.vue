<!-- Preloader.vue -->
<template>
  <div v-if="isPreloaderVisible" class="w-screen fixed top-0 left-0 bg-theme-bg overflow-hidden z-[1000]">
    <PreloaderAnimation @animationEnded="onAnimationEnd" />
  </div>
</template>

<script setup>
import { usePreloader } from "~/composables/usePreloader";
import PreloaderAnimation from "~/components/preloader/PreloaderAnimation.vue";

const { isPreloaderVisible, hidePreloader } = usePreloader();

function onAnimationEnd() {
  hidePreloader(); 
  document.body.classList.remove('overflow-hidden'); 
}
</script>

<style scoped>
</style>
