<!-- /components/main/LogoAnimation.vue -->

<template>
  <span class="h-screen flex flex-center">
    <svg
      class="logo w-24 text-theme-color select-none"
      :class="{ shrink: isShrinking }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 45 52"
      @transitionend="handleTransitionEnd"
    >
      <text
        x="50%"
        y="55%"
        font-size="26"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="0"
        font-family="Morpheus"
        text-anchor="middle"
        dominant-baseline="middle"
        id="logoText"
        @animationend="handleTextAnimationEnd"
      >
        F
      </text>
      <path
        id="hexagonPath"
        xmlns="http://www.w3.org/2000/svg"
        d="M 22.5,1.5 L 44,13.5 V 38.5 L 22.5,50.5 L 1,38.5 V 13.5 Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="2"
        fill="none"
      />
    </svg>
  </span>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["animationEnded"]);
const isShrinking = ref(false);

function handleTextAnimationEnd() {
  setTimeout(() => {
    isShrinking.value = true;
  }, 250);
}

function handleTransitionEnd() {
  if (isShrinking.value) {
    emit("animationEnded");
  }
}
</script>

<style scoped>
@keyframes drawHexagon {
  0% {
    stroke-dashoffset: 150;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeInText {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#hexagonPath {
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
  animation: drawHexagon 1.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
  will-change: stroke-dashoffset;
}

#logoText {
  opacity: 0;
  animation: fadeInText 0.6s cubic-bezier(0.5, 1.5, 0.5, 1) forwards;
  animation-delay: 1.5s;
}
</style>
