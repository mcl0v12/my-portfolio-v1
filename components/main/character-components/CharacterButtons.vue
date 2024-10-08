<!-- CharacterButtons.vue -->
<template>
  <div
    class="bottom-wrap w-full h-full flex justify-between items-center px-5 gap-4"
  >
    <!-- Nur für Quest mit ID 99 das CurrencyDisplay anzeigen -->
    <div
      v-if="selectedQuest?.id === 99"
      class="w-full h-[20px] flex justify-end px-2 font-default text-white text-shadow bg-black border border-solid border-theme-color rounded-lg"
    >
      <CurrencyDisplay :gold="gold" :silver="silver" :copper="copper" />
    </div>

    <ThemeButton
      v-if="!isQuestAccepted && selectedQuest?.id !== 99"
      :class="{ invisible: !isObjectiveQuest }"
      :height="30"
      buttonText="Accept"
      :buttonTextSize="14"
      @click="acceptQuest"
    />
    <ThemeButton
      v-else-if="selectedQuest?.id !== 99"
      :class="{ invisible: !isObjectiveQuest }"
      :height="30"
      buttonText="Complete"
      :buttonTextSize="14"
      :disabled="isCompleteDisabled"
      @click="handleCompleteQuest"
    />
    <ThemeButton
      :height="30"
      buttonText="Goodbye"
      :buttonTextSize="14"
      @click="handleExit"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ThemeButton from "~/components/misc/ThemeButton.vue";
import { useCurrencyStore } from "~/store/currency";
import { useExperienceStore } from "~/store/experience";

import CurrencyDisplay from "~/components/main/CurrencyDisplay.vue";
import { questData } from "~/data/questData.js";
import { useQuestStore } from "~/store/handleInteraction.js";

const questStore = useQuestStore();
const experienceStore = useExperienceStore();
const currencyStore = useCurrencyStore();

const gold = computed(() => currencyStore.gold);
const silver = computed(() => currencyStore.silver);
const copper = computed(() => currencyStore.copper);

// Zugriff auf die ausgewählte Quest basierend auf der ID im Store
const selectedQuest = computed(() => {
  return questStore.showQuestId
    ? questData.find((quest) => quest.id === questStore.showQuestId)
    : null;
});

// Prüfen, ob die ausgewählte Quest vom Typ 'Objective' ist
const isObjectiveQuest = computed(() => {
  return selectedQuest.value && selectedQuest.value.type === "Objective";
});

// Prüfen, ob die ausgewählte Quest akzeptiert wurde
const isQuestAccepted = computed(() => {
  return (
    selectedQuest.value &&
    questStore.acceptedQuestIds.includes(selectedQuest.value.id)
  );
});

const isCompleteDisabled = computed(() => {
  if (!selectedQuest.value) return true;

  const isTaskCompleted = questStore.taskCompletedIds.includes(
    selectedQuest.value.id
  );
  const isQuestCompleted = questStore.completedQuestIds.includes(
    selectedQuest.value.id
  );

  return !isTaskCompleted || isQuestCompleted;
});

const acceptQuest = () => {
  if (selectedQuest.value) {
    questStore.acceptQuest(selectedQuest.value.id);
  }
};

const handleCompleteQuest = () => {
  if (!isCompleteDisabled.value && selectedQuest.value) {
    completeQuest();
  }
};

// Quest abschließen und Belohnungen zuweisen
const completeQuest = () => {
  if (selectedQuest.value && !questStore.completedQuestIds.includes(selectedQuest.value.id)) {
    if (isObjectiveQuest.value && selectedQuest.value.experience) {
      experienceStore.addExperience(selectedQuest.value.experience);
    }

    const { gold, silver, copper } = selectedQuest.value.rewards;
    if (gold || silver || copper) {
      currencyStore.addCurrency(gold, silver, copper, "quest"); 
    }

    questStore.completeQuest(selectedQuest.value.id);
  }
};

const handleExit = () => {
  questStore.closeInteraction();
};

const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    handleExit();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped></style>
