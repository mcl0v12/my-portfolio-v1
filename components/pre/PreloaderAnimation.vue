<!-- PreloaderAnimation.vue -->

<template>
    <div class="relative h-screen flex flex-center">
      <template v-if="!hasInteracted">
        <img
          src="/img/alliance-logo.png"
          draggable="false"
          alt="Alliance Logo"
          class="w-[70px] xl:w-[100px] absolute top-5 left-5"
        />
        <div
          class="max-w-base w-full px-base mx-auto flex flex-col hr:flex-row hr:items-center"
        >
          <div
            class="w-full hr:w-1/2 flex flex-col items-center space-lg hr:mb-0"
          >
            <div
              class="flex flex-col items-start text-notice-color text-left text-shadow leading-relaxed"
            >
              <h3 class="heading-base mb-3">READ!</h3>
              <p class="space-lg">
                My page uses sound effects to make things more "realistic". To
                prevent a heart attack, I recommend checking your system audio
                before starting the intro.
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
  
      <!-- Animationen -->
      <div v-if="hasInteracted" class="max-w-lg">
        <img
          v-show="currentState === 'run'"
          :src="runGifUrl"
          draggable="false"
          alt="Running Animation"
          class="scale-up-animation select-none"
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
  import ThemeButton from "~/components/misc/ThemeButton.vue";
  import { useTooltipStore } from "~/store/tooltip.js";
  import Camel from "~/components/pre/Camel.vue";
  
  const emit = defineEmits(["animationEnded"]);
  const tooltipStore = useTooltipStore();
  
  const currentState = ref("run");
  const runGifUrl = "/gif/preloader/run.gif";
  const finishRunGifUrl = "/gif/preloader/finishRun.gif";
  const onyxiaGifUrl = "/gif/preloader/onyxia.gif";
  const showOnyxia = ref(false);
  
  const runGifDuration = 3000; /* 3000 */
  const finishRunGifDuration = 3500; /* 3500 */
  
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
  
  <style scoped>
  .scale-up-animation {
    animation: scaleUp 3s ease-in-out forwards;
  }
  
  @keyframes scaleUp {
    0% {
      transform: scale(0.3);
    }
    100% {
      transform: scale(1);
    }
  }
  
  .onyxia-animation {
    position: absolute;
    top: 30%;
    left: -500px;
    transform: translateY(-50%);
    width: 500px;
    animation: flyAcross 3s linear forwards;
  }
  
  @keyframes flyAcross {
    0% {
      left: -500px;
    }
    100% {
      left: calc(100vw + 500px);
    }
  }
  </style>
  