<template>
  <div v-if="isPreloaderVisible" class="preloader px-base">
    <LogoAnimation @animationEnded="onAnimationEnd" />
  </div>
</template>

<script setup>
import LogoAnimation from "~/components/misc/LogoAnimation.vue";
import { usePreloader } from "~/composables/usePreloader";

const { isPreloaderVisible, hidePreloader } = usePreloader();

function onAnimationEnd() {
  hidePreloader();
}
</script>

<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--theme-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
