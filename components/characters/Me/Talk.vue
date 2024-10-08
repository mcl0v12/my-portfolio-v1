<!-- Talk.vue -->
<template>
  <p v-if="!showQuestId" class="px-4 mb-3">Hi, how can I help you?</p>

  <!-- Available Quest -->
  <div
    v-if="!showQuestId"
    v-for="quest in availableQuests"
    :key="quest.id"
    class="quest-item w-full px-2 py-1.5 flex items-center cursor-pointer select-none"
    @click="showQuest(quest)"
  >
    <!-- QA-Quests -->
    <img
      v-if="quest.type === 'Talk'"
      :src="quest.iconSrc"
      alt="Dialogue"
      class="w-5 h-5 mr-2"
    />

    <!-- Objectives -->
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
          fill: isTaskCompleted(quest.id)
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
  <WhoAreYou v-if="showQuestId === 1" />
  <Vendor v-if="showQuestId === 99" :showQuestId="showQuestId" />

  <!-- Objectives -->
  <ClickLogoChallenge v-if="showQuestId === 2" :showQuestId="showQuestId" />
  <ExtremeClickLogoChallenge v-if="showQuestId === 3" />
</template>

<script setup>
import { computed, watch } from "vue";
import { useQuestStore } from "~/store/handleInteraction.js";
import { iconPaths } from "~/data/questPaths.js";
import { useModalLoader } from "~/composables/useModalLoader";

import WhoAreYou from "~/components/quests/WhoAreYou.vue";
import ClickLogoChallenge from "~/components/quests/ClickLogoChallenge.vue";
import ExtremeClickLogoChallenge from "~/components/quests/ExtremeClickLogoChallenge.vue";
import Vendor from "~/components/quests/Vendor.vue";

const questStore = useQuestStore();
const showQuestId = computed(() => questStore.showQuestId);
const availableQuests = computed(() => questStore.availableQuests);

// Vendor.vue
const vendorResources = [
  "/img/blackish-bg.png",
  "/img/items/speed.png",
  "/img/items/time-warp.png",
  "/img/items/key.jpg",
  "/img/empty-slot.png",
];


// ClickLogoChallenge.vue
const clickLogoChallengeResources = [
  "/img/questRewards/social-credit.png",
  "/img/currency/goldcoin.png",
  "/img/currency/silvercoin.png",
  "/img/currency/coppercoin.png",
];

const { isLoaded: isVendorLoaded } = useModalLoader(vendorResources);
const { isLoaded: isClickLogoLoaded } = useModalLoader(
  clickLogoChallengeResources
);

const showQuest = (quest) => {
  if (quest.id === 99) {
    if (isVendorLoaded.value) {
      questStore.showQuest(quest.id);
    } else {
      const unwatch = watch(isVendorLoaded, (loaded) => {
        if (loaded) {
          questStore.showQuest(quest.id);
          unwatch();
        }
      });
    }
  } else if (quest.id === 2) {
    if (isClickLogoLoaded.value) {
      questStore.showQuest(quest.id);
    } else {
      const unwatch = watch(isClickLogoLoaded, (loaded) => {
        if (loaded) {
          questStore.showQuest(quest.id);
          unwatch();
        }
      });
    }
  } else {
    questStore.showQuest(quest.id);
  }
};

const isTaskCompleted = (questId) => {
  return questStore.taskCompletedIds.includes(questId);
};

const getIconPaths = (quest) => {
  if (questStore.acceptedQuestIds.includes(quest.id)) {
    return iconPaths.questionMark;
  }
  return iconPaths.exclamationMark;
};
</script>
