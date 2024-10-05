<!-- Preloader.vue -->

<template>
  <div v-if="isPreloaderVisible" class="preloader">
    <PreloaderAnimation @animationEnded="onAnimationEnd" />
  </div>
</template>

<script setup>
import { usePreloader } from "~/composables/usePreloader";
import PreloaderAnimation from "~/components/Preloader/PreloaderAnimation.vue";

const { isPreloaderVisible, hidePreloader } = usePreloader();

function onAnimationEnd() {
  hidePreloader(); 
  document.body.classList.remove('overflow-hidden'); 
}
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: var(--theme-bg);
  z-index: 1000;
  overflow-y: hidden;
}
</style>
