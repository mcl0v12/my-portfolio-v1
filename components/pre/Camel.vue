<!-- Camel.vue -->

<template>
  <div class="max-w-stacked--lg relative mx-auto">
    <picture>
      <img
        v-show="
          currentState === 'stand' ||
          (currentState === 'special' && !isSpecialGifLoaded)
        "
        :src="standGifUrl"
        draggable="false"
        alt="Camel standing"
        @click="playSpecialAnimation"
        class="cursor-pointer"
      />
      <img
        v-show="currentState === 'special' && isSpecialGifLoaded"
        :src="dynamicSpecialGifUrl"
        draggable="false"
        alt="Camel special animation"
        @load="onSpecialGifLoad"
        class="relative z-[2]"
      />
    </picture>
    <picture>
      <img
        src="/gif/preloader/palm.png"
        alt="Palm tree"
        class="w-[100px] lg:w-[200px] absolute top-1/2 left-[80%] -translate-y-1/2 z-[1]"
      />
    </picture>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";

const currentState = ref("stand");
const standGifUrl = "/gif/preloader/camel-stand.gif";
const specialGifUrl = "/gif/preloader/camel-special.gif";
const dynamicSpecialGifUrl = ref(specialGifUrl);
const specialGifDuration = 2500;

const isSpecialGifLoaded = ref(false);

let gifTimeout = null;

const playSpecialAnimation = () => {
  if (currentState.value === "stand") {
    currentState.value = "special";
    reloadGif(dynamicSpecialGifUrl, specialGifUrl);
    isSpecialGifLoaded.value = false;
  }
};

const onSpecialGifLoad = () => {
  isSpecialGifLoaded.value = true;
  playGif("stand", specialGifDuration);
};

const playGif = (nextState, duration) => {
  clearGifTimeout();
  gifTimeout = setTimeout(() => {
    currentState.value = nextState;
  }, duration);
};

const reloadGif = (dynamicGifRef, gifUrl) => {
  dynamicGifRef.value = `${gifUrl}?t=${new Date().getTime()}`;
};

const clearGifTimeout = () => {
  if (gifTimeout) {
    clearTimeout(gifTimeout);
    gifTimeout = null;
  }
};

onBeforeUnmount(() => {
  clearGifTimeout();
});
</script>

<style scoped></style>
