<!-- QuestOverview.vue -->

<template>
  <!-- Wenn keine Quest ausgewählt ist -->
  <p v-if="!showQuestId" class="px-4 mb-3">
    Greetings, how can I help you?
  </p>

  <!-- Show Available Quest -->
  <div
    v-if="!showQuestId"
    v-for="quest in availableQuests"
    :key="quest.id"
    class="quest-item w-full px-2 py-1.5 flex items-center cursor-pointer select-none"
    @click="showQuest(quest)"
  >
    <!-- Für QA-Quests -->
    <img
      v-if="quest.type === 'Talk'"
      :src="quest.iconSrc"
      alt="Dialogue"
      class="w-5 h-5 mr-2"
    />

    <!-- Normale Quests -->
    <svg
      v-else
      class="w-5 h-5 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 29 25"
    >
      <path
        v-for="(path, index) in getIconPaths(quest)"
        :key="index"
        :d="path.d"
        :style="{
          fill:
            isTaskCompleted(quest.id) && path.completedFill
              ? path.completedFill
              : path.fill || path.defaultFill,
          stroke: path.stroke,
          strokeWidth: path.strokeWidth,
        }"
      />
    </svg>

    <span>{{ quest.title }}</span>
  </div>

  <!-- Talk -->
  <WhoAreYou v-else-if="showQuestId === 1" />
  <Vendor v-else-if="showQuestId === 99" />

  <!-- Objectives -->
  <ClickLogoChallenge v-else-if="showQuestId === 2" />
  <ExtremeClickLogoChallenge v-else-if="showQuestId === 3" />

  <!-- Fallback -->
  <div v-else class="px-4 mb-3">
    <p>No details available for this quest.</p>
    <button @click="goBack">Back to Quests</button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useQuestStore } from "~/store/handleInteraction.js";

import WhoAreYou from "~/components/quests/WhoAreYou.vue";

import ClickLogoChallenge from "~/components/quests/ClickLogoChallenge.vue";
import ExtremeClickLogoChallenge from "~/components/quests/ExtremeClickLogoChallenge.vue";
import Vendor from "~/components/quests/Vendor.vue";

const questStore = useQuestStore();
const showQuestId = computed(() => questStore.showQuestId);
const availableQuests = computed(() => questStore.availableQuests); 

const showQuest = (quest) => {
  questStore.showQuest(quest.id);
};
const goBack = () => {
  questStore.deselectQuest();
};

// Überprüfe, ob die Aufgabe für die Quest abgeschlossen wurde
const isTaskCompleted = (questId) => {
  return questStore.taskCompletedIds.includes(questId);
};

const getIconPaths = (quest) => {
  if (questStore.acceptedQuestIds.includes(quest.id)) {
    return quest.questionMarkPaths || quest.iconSvg.paths;
  }
  return quest.iconSvg.paths;
};
</script>
