<!-- Me.vue -->

<template>
  <div
    style="transition-delay: 900ms"
    class="max-w-stacked mx-auto speech-cursor fade-item"
    :ref="animationRef"
    data-animation="enter"
    @click="startAnimation"
  >
    <picture>
      <div class="flex flex-col flex-center gap-6">
        <svg
          class="max-w-obj h-full relative left-[-1.5%]"
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="120"
          viewBox="0 0 80 120"
        >
          <path
            v-for="(path, index) in getLargeIconPaths()"
            :key="index"
            :d="path.d"
            :style="{
              fill: path.fill,
              stroke: path.stroke,
              strokeWidth: path.strokeWidth,
            }"
          />
        </svg>

        <img
          v-show="
            currentState === 'stand' ||
            (currentState === 'special' && !isSpecialGifLoaded)
          "
          :src="standGifUrl"
          draggable="false"
          alt="standing"
        />

        <img
          v-show="currentState === 'special' && isSpecialGifLoaded"
          :src="dynamicSpecialGifUrl"
          draggable="false"
          alt="talking"
          @load="onSpecialGifLoad"
        />
      </div>
    </picture>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { animationObserver } from "~/composables/useIntersectionObserver";

import { useQuestStore } from "~/store/handleInteraction.js";
import { iconPaths } from "~/data/questPaths.js";
import { questData } from "~/data/questData.js";

const questStore = useQuestStore();

const isTaskCompleted = (questId) => {
  return questStore.taskCompletedIds.includes(questId);
};

const getLargeIconPaths = () => {
  const acceptedQuests = questStore.acceptedQuestIds;
  const completedQuests = questStore.completedQuestIds;

  // Finde die aktive Quest (akzeptiert, aber nicht abgeschlossen)
  const activeQuest = questData.find(
    (quest) =>
      acceptedQuests.includes(quest.id) && !completedQuests.includes(quest.id)
  );

  let paths = [];

  if (activeQuest) {
    paths = iconPaths.largeQuestionMark;
  } else {
    paths = iconPaths.largeExclamationMark;
  }

  return paths.map((path) => ({
    ...path,
    fill: isTaskCompleted(activeQuest?.id)
      ? path.completedFill
      : path.defaultFill || path.fill,
  }));
};

// Transition Logic
const intersectionItems = ref([]);
const animationRef = (el) => {
  if (el) {
    intersectionItems.value.push(el);
  }
};

animationObserver([intersectionItems]);

// Gif Logic
const isLandscape = ref(false);

const checkLandscapeOrientation = () => {
  isLandscape.value = window.matchMedia("(orientation: landscape)").matches;
};

const currentState = ref("stand");
const standGifUrl = "/gif/stand.gif";
const specialGifUrl = "/gif/emoteTalk.gif";
const dynamicSpecialGifUrl = ref(specialGifUrl);
const specialGifDuration = 2000;

const isSpecialGifLoaded = ref(false);

let gifTimeout = null;

const startAnimation = () => {
  checkLandscapeOrientation();

  questStore.startInteraction();

  if (isLandscape.value && currentState.value === "stand") {
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
    if (nextState === "stand") {
      questStore.triggerTalkAnimation = false;
    }
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

defineExpose({
  startAnimation,
});

onMounted(() => {
  checkLandscapeOrientation();
  window.addEventListener("resize", checkLandscapeOrientation);
});

onBeforeUnmount(() => {
  clearGifTimeout();
  window.removeEventListener("resize", checkLandscapeOrientation);
});
</script>

<style scoped></style>
