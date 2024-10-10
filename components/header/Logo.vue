<!-- components/header/Logo.vue -->
<template>
  <div class="fade-item" :ref="animationRef" data-animation="enter">
    <a href="#" class="group" @click.prevent="handleClick">
      <svg
        class="logo w-10 xl:w-12 overflow-visible font-default text-white text-shadow select-none"
        :class="{ shrink: isShrinking }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 45 52"
        @transitionend="handleTransitionEnd"
      >
        <text
          x="49%"
          y="55%"
          font-size="24"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="0"
          text-anchor="middle"
          dominant-baseline="middle"
          id="logoText"
        >
          {{ level }}
        </text>
        <path
          id="hexagonPath"
          class="text-theme-color transition-transform duration-300 ease origin-center group-hover:scale-103"
          xmlns="http://www.w3.org/2000/svg"
          d="M 22.5,1.43 44,13.715 V 38.285 L 22.5,50.57 1,38.285 V 13.715 Z"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          fill="none"
        />
      </svg>
    </a>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuestStore } from "~/store/handleInteraction.js";
import { useObjectivesStore } from "~/store/handleObjectives.js";
import { useExperienceStore } from "~/store/experience";

import { animationObserver } from "~/composables/useIntersectionObserver";

const isShrinking = ref(false);
const intersectionItem = ref([]);

const questStore = useQuestStore();
const objectivesStore = useObjectivesStore();
const experienceStore = useExperienceStore();

const level = computed(() => experienceStore.level);

function handleClick() {
  startAnimation();
  trackProgress();
}

function startAnimation() {
  isShrinking.value = false;
  void document.querySelector(".logo").offsetWidth;
  isShrinking.value = true;
}

function handleTransitionEnd() {
  if (isShrinking.value) isShrinking.value = false;
}

function trackProgress() {
  const quests = [
    { id: 2, name: "Logo Challenge", total: 10 },
    { id: 3, name: "Logo Challenge x2", total: 20 },
  ];

  for (const quest of quests) {
    if (
      questStore.acceptedQuestIds.includes(quest.id) &&
      !questStore.taskCompletedIds.includes(quest.id)
    ) {
      updateQuestProgress(quest.name, quest.id, quest.total);
      break;
    }
  }
}

function updateQuestProgress(questName, questId, totalProgress) {
  const objective = objectivesStore.objectives.find(
    (o) => o.name === questName
  );

  if (objective) {
    const newProgress = Math.min(objective.progress + 1, totalProgress);
    objectivesStore.updateObjectiveProgress(questName, newProgress);

    if (newProgress >= totalProgress) {
      objectivesStore.completeObjective(questName);
      questStore.markAsTaskComplete(questId);
      console.log(
        `Quest ${questId} (${questName}) ist erledigt, aber noch nicht abgegeben.`
      );
    }
  }
}

const animationRef = (el) => {
  if (el) intersectionItem.value.push(el);
};

animationObserver([intersectionItem]);
</script>

<style scoped></style>
