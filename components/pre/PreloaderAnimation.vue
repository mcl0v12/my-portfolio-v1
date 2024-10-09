<!-- PreloaderAnimation.vue -->

<template>
  <div class="relative h-screen flex flex-center">
    <Disclaimer v-if="!hasInteracted" @startInteraction="startInteraction" />

    <!-- Animationen -->
    <div v-if="hasInteracted" class="max-w-lg">
      <img
        v-show="currentState === 'run'"
        :src="runGifUrl"
        draggable="false"
        alt="Running Animation"
        class="scale-up-animation will-change-transform select-none"
      />
      <img
        v-show="currentState === 'finish'"
        :src="finishRunGifUrl"
        draggable="false"
        alt="Finish Run Animation"
        class="transition-opacity duration-1000 ease-in-out select-none"
        :class="fadeOut ? 'opacity-0' : 'opacity-100'"
      />
    </div>

    <img
      v-if="showOnyxia"
      :src="onyxiaGifUrl"
      alt="Onyxia Animation"
      class="onyxia-animation"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { SoundManager } from "@/utils/soundManager";
import Disclaimer from "~/components/pre/Disclaimer.vue";
import { useTooltipStore } from "~/store/tooltip.js";

const emit = defineEmits(["animationEnded"]);
const tooltipStore = useTooltipStore();

const currentState = ref("run");
const runGifUrl = "/gif/preloader/run.gif";
const finishRunGifUrl = "/gif/preloader/finishRun.gif";
const onyxiaGifUrl = "/gif/preloader/onyxia.gif";
const showOnyxia = ref(false);

const runGifDuration = 10;
const finishRunGifDuration = 10;

const fadeOut = ref(false);
const hasInteracted = ref(false);

const footstepSounds = [
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_01.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_02.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_03.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_04.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_05.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_06.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_07.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_08.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_09.ogg",
  "/sounds/utils/MON_Footstep_Bipedal_Foot_Small_Stone_10.ogg",
];
const soundManager = new SoundManager(footstepSounds);

const startInteraction = () => {
  hasInteracted.value = true;
  startAnimation();
  tooltipStore.hideTooltip();
};

const startAnimation = () => {
  if (currentState.value === "run") {
    soundManager.playLoop(runGifDuration);
    playGif("finish", runGifDuration);

    showOnyxia.value = true;
    setTimeout(() => {
      showOnyxia.value = false;
    }, 3000);
  }
};

const playGif = (nextState, duration) => {
  setTimeout(() => {
    currentState.value = nextState;

    if (nextState === "finish") {
      setTimeout(() => {
        soundManager.playSingleSound("/sounds/utils/ChangeEquip.ogg");
      }, 700);

      setTimeout(() => {
        fadeOut.value = true;

        setTimeout(() => {
          emit("animationEnded");
        }, 1000);
      }, finishRunGifDuration);
    }
  }, duration);
};
</script>

<style scoped></style>
