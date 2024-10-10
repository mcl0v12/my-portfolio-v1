<!-- CamelNew.vue -->

<template>
  <div class="max-w-stacked--lg relative mx-auto">
    <!-- Stand Video /// LOOP -->
    <video
      v-if="
        currentState === 'stand' ||
        (currentState === 'special' && !isSpecialVideoLoaded)
      "
      class="cursor-pointer"
      src="/webm/disclaimer/stand.webm"
      @click="playSpecialAnimation"
      draggable="false"
      :controls="false"
      loop
      autoplay
      muted
      disablePictureInPicture
    ></video>

    <!-- Special Video -->
    <video
      ref="specialVideo"
      v-if="currentState === 'special'"
      v-show="isSpecialVideoLoaded"
      src="/webm/disclaimer/mountSpecial.webm"
      @ended="onSpecialVideoEnd"
      @loadeddata="onSpecialVideoLoad"
      draggable="false"
      :controls="false"
      disablePictureInPicture
    ></video>

    <picture>
      <img
        src="/img/palm.png"
        alt="Palm tree"
        class="w-[100px] lg:w-[200px] absolute top-1/2 left-[80%] -translate-y-1/2 z-[1]"
      />
    </picture>
  </div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from "vue";

const currentState = ref("stand");
const specialVideo = ref(null);
const isSpecialVideoLoaded = ref(false);

const playSpecialAnimation = async () => {
  if (currentState.value === "stand") {
    currentState.value = "special";
    isSpecialVideoLoaded.value = false;
    await nextTick();

    if (specialVideo.value) {
      specialVideo.value.load();
    }
  }
};

const onSpecialVideoLoad = () => {
  isSpecialVideoLoaded.value = true;
  if (currentState.value === "special" && specialVideo.value) {
    requestAnimationFrame(() => {
      specialVideo.value.play();
    });
  }
};

const onSpecialVideoEnd = async () => {
  currentState.value = "stand";
  await nextTick();
};

onBeforeUnmount(() => {
  if (specialVideo.value) {
    specialVideo.value.removeEventListener("loadeddata", onSpecialVideoLoad);
  }
});
</script>

<style scoped></style>
