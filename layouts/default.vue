<!-- /layouts/default.vue -->

<template>
  <Preloader />
  <Header />
  <NuxtPage />

  <UiOverlay />

  <ObjectivesTracker v-if="hasObjectives" />

  <ExperienceBar
    :currentExperience="experienceStore.currentExperience"
    :experienceToLevel="experienceStore.experienceToLevel"
  />

  <Tooltip />

  <BackpackModal v-if="backpackStore.isBackpackOpen" />

  <!-- ProgressBar -->
  <ProgressBar
    v-if="progressBarStore.showProgress"
    :progress="progressBarStore.progress"
  />

  <!-- LootModal: Überprüfe, ob ein Modal geöffnet ist und zeige es an -->
  <LootModal v-if="lootStore.isAnyModalOpen" :chestId="lootStore.activeChestId" />
</template>

<script setup>
import { computed, onMounted } from "vue";
import Preloader from "~/components/pre/Preloader.vue";
import Header from "~/layouts/header.vue";
import UiOverlay from "~/components/misc/UiOverlay.vue";
import ObjectivesTracker from "~/components/main/ObjectivesTracker.vue";
import ExperienceBar from "~/components/misc/ExperienceBar.vue";
import Tooltip from "~/components/main/Tooltip.vue";
import BackpackModal from "~/components/main/backpack-components/BackpackModal.vue";
import ProgressBar from "~/components/misc/ProgressBar.vue";
import LootModal from "~/components/main/loot-components/LootModal.vue";

import { useExperienceStore } from "~/store/experience.js";
import { useQuestStore } from "~/store/handleInteraction.js";
import { useProgressBarStore } from "~/store/progressBar.js";
import { useObjectivesStore } from "~/store/handleObjectives.js";
import { useBackpackStore } from "~/store/backpack.js";
import { useCurrencyStore } from "~/store/currency.js";
import { useOnUseItemEffectsStore } from "~/store/onUseItemEffects.js";
import { useLootStore } from "~/store/loot.js";
import { lootItemsData } from "~/data/lootItems.js";

const questStore = useQuestStore();
const objectivesStore = useObjectivesStore();
const progressBarStore = useProgressBarStore();
const experienceStore = useExperienceStore();
const backpackStore = useBackpackStore();
const currencyStore = useCurrencyStore();
const onUseItemEffectsStore = useOnUseItemEffectsStore();
const lootStore = useLootStore();

// Liste aller Chest-IDs
const chestIds = Object.keys(lootItemsData);

// Check, ob es Objectives gibt (mindestens eines vorhanden)
const hasObjectives = computed(() => objectivesStore.objectives.length > 0);

// Lade alle Daten, wenn die Seite gemountet wird
onMounted(() => {
  questStore.loadProgress();
  objectivesStore.loadObjectives();
  experienceStore.loadExperience();
  currencyStore.loadCurrency();
  backpackStore.loadBackpackItems();
  onUseItemEffectsStore.loadResumeKeyUsed();

  // Lade die entfernten Items aus allen Chests
  lootStore.loadAllRemovedItems(chestIds);
});
</script>

<style scoped></style>
