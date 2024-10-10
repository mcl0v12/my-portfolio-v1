<template>
    <div class="max-w-stacked--lg relative mx-auto">
      <!-- Stand Video -->
      <video
        ref="standVideo"
        v-if="currentState === 'stand' || (currentState === 'special' && !isSpecialVideoLoaded)"
        class="cursor-pointer"
        src="/webm/preloader/camel-stand.webm"
        @click="playSpecialAnimation"
        @loadeddata="onStandVideoLoad"
        draggable="false"
        preload="auto"
        :controls="false"
        loop
        autoplay
        muted
      ></video>
  
      <!-- Special Video -->
      <video
        ref="specialVideo"
        v-if="currentState === 'special' && isSpecialVideoLoaded"
        src="/webm/preloader/camel-special.webm"
        @ended="onSpecialVideoEnd"
        @loadeddata="onSpecialVideoLoad"
        draggable="false"
        preload="auto"
        :controls="false"
      ></video>
      
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
  import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
  
  const currentState = ref("stand");
  const standVideo = ref(null);
  const specialVideo = ref(null);
  const isStandVideoLoaded = ref(false);
  const isSpecialVideoLoaded = ref(false);
  const isSpecialTriggered = ref(false);
  
  onMounted(() => {
    if (standVideo.value) {
      standVideo.value.load();
      standVideo.value.addEventListener("loadeddata", onStandVideoLoad);
    }
  });
  
  const playSpecialAnimation = async () => {
    if (currentState.value === "stand") {
      isSpecialTriggered.value = true;
      isSpecialVideoLoaded.value = false;
      if (specialVideo.value) {
        specialVideo.value.load(); // Erst das Video laden, bevor es abgespielt wird
      }
    }
  };
  
  const onStandVideoLoad = () => {
    isStandVideoLoaded.value = true;
  };
  
  const onSpecialVideoLoad = () => {
    isSpecialVideoLoaded.value = true;
    currentState.value = "special"; // Jetzt den Zustand umschalten, wenn das Video geladen ist
    
    if (specialVideo.value) {
      requestAnimationFrame(() => {
        specialVideo.value.play();
      });
    }
  };
  
  const onSpecialVideoEnd = async () => {
    currentState.value = "stand";
    isSpecialTriggered.value = false;
    await nextTick();
  };
  
  onBeforeUnmount(() => {
    if (standVideo.value) {
      standVideo.value.removeEventListener("loadeddata", onStandVideoLoad);
    }
    if (specialVideo.value) {
      specialVideo.value.removeEventListener("loadeddata", onSpecialVideoLoad);
    }
  });
  </script>
  
  <style scoped></style>
  