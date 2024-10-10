<!-- Me.vue -->

<template>
  <div
    style="transition-delay: 1000ms"
    class="max-w-stacked mx-auto fade-item"
    :ref="animationRef"
    data-animation="enter"
    @click="startAnimation"
  >
    <picture>
      <div class="flex flex-col flex-center gap-6 speech-cursor">
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

        <!-- Stand Video (Loop) -->
        <video
          v-if="
            currentState === 'stand' ||
            (currentState === 'special' && !isSpecialVideoLoaded)
          "
          src="/webm/npc/me/stand.webm"
          draggable="false"
          :controls="false"
          loop
          autoplay
          muted
          disablePictureInPicture
        ></video>

        <!-- Emote Talk Video -->
        <video
          ref="specialVideo"
          v-if="currentState === 'special'"
          v-show="isSpecialVideoLoaded"
          src="/webm/npc/me/emoteTalk.webm"
          @ended="onSpecialVideoEnd"
          @loadeddata="onSpecialVideoLoad"
          draggable="false"
          :controls="false"
          disablePictureInPicture
        ></video>
      </div>
    </picture>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import { animationObserver } from "~/composables/useIntersectionObserver";
import { useQuestStore } from "~/store/handleInteraction.js";
import { iconPaths } from "~/data/questPaths.js";
import { questData } from "~/data/questData.js";

const questStore = useQuestStore();

const currentState = ref("stand");
const specialVideo = ref(null);
const isSpecialVideoLoaded = ref(false);
const isLandscape = ref(false);

// Transition Logic
const intersectionItems = ref([]);
const animationRef = (el) => {
  if (el) {
    intersectionItems.value.push(el);
  }
};

animationObserver([intersectionItems]);

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

const startAnimation = async () => {
  checkLandscapeOrientation();
  questStore.startInteraction();

  if (isLandscape.value && currentState.value === "stand") {
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

const checkLandscapeOrientation = () => {
  isLandscape.value = window.matchMedia("(orientation: landscape)").matches;
};

defineExpose({
  startAnimation,
});

onMounted(() => {
  checkLandscapeOrientation();
  window.addEventListener("resize", checkLandscapeOrientation);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkLandscapeOrientation);

  if (specialVideo.value) {
    specialVideo.value.removeEventListener("loadeddata", onSpecialVideoLoad);
  }
});
</script>

<style scoped></style>
