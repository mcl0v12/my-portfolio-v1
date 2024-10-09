<!-- Disclaimer.vue -->

<template>
    <img
      src="/img/alliance-logo.png"
      draggable="false"
      alt="Alliance Logo"
      class="w-[70px] xl:w-[100px] absolute top-5 left-5"
    />
    <div class="max-w-base w-full px-base mx-auto flex flex-col hr:flex-row hr:items-center">
      <div class="w-full hr:w-1/2 flex flex-col items-center space-lg hr:mb-0">
        <div class="flex flex-col items-start text-notice-color text-left text-shadow leading-relaxed">
          <h3 class="heading-base mb-3">READ!</h3>
          <p>
            My page uses sound effects to make things more "realistic". To
            prevent a heart attack, I recommend checking your system audio
            before starting the intro.
          </p>
          <p class="text-sm mt-1 space-lg">
            Note: Sound starts playing after you click on somewhere on this page.
          </p>
          <ThemeButton
            buttonText="Start Intro"
            :buttonTextSize="16"
            :height="35"
            @click="startInteraction"
          />
        </div>
      </div>
      <Camel />
    </div>
  </template>
  
  <script setup>
  import ThemeButton from "~/components/misc/ThemeButton.vue";
  import Camel from "~/components/pre/Camel.vue";
  import { useTooltipStore } from "~/store/tooltip.js";
  
  const emit = defineEmits(["startInteraction"]);
  const tooltipStore = useTooltipStore();
  
  const startInteraction = () => {
    emit("startInteraction");
    tooltipStore.hideTooltip();
  };
  </script>
  
  <style scoped></style>
  