<!-- /components/quest/ObjectivesTracker.vue -->
<template>
  <div class="max-w-[220px] w-full fixed bottom-0 right-0 flex flex-col z-[2]">
    <div
      :class="[{ 'item--open': isOpen }]"
      @click="toggleIcon"
      class="pr-5 pb-5"
    >
      <div
        class="objectives-header relative p-[2px] text-theme-color text-shadow cursor-pointer"
      >
        <div
          class="w-full flex justify-between items-center p-2 bg-gradient-shadow-top"
        >
          <span class="quest-text">Objectives</span>
          <CloseModalButton
            :width="20"
            :height="20"
            :symbol="isOpen ? '-' : '+'"
          ></CloseModalButton>
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="text-white-color text-shadow">
      <ol class="pr-5 pb-5 text-sm">
        <li
          v-for="(objective, index) in objectives"
          :key="index"
          class="flex mb-3"
        >
          <div class="status-indicator"></div>
          <div class="flex flex-col">
            <p
              class="text-theme-color mb-1"
              :class="{ 'shimmer-effect': !playedAnimations.has(index) }"
              @animationend="onAnimationEnd(index)"
            >
              {{ objective.name }}
            </p>
            <p>
              {{ objective.progress }}/{{ objective.total }}
              {{ objective.description }}
            </p>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useObjectivesStore } from "~/store/handleObjectives.js";
import CloseModalButton from "~/components/misc/CloseModalButton.vue";

const objectivesStore = useObjectivesStore();
const objectives = computed(() => objectivesStore.objectives);

const isOpen = ref(true);
const playedAnimations = ref(new Set());

const toggleIcon = () => {
  isOpen.value = !isOpen.value;
};

const onAnimationEnd = (index) => {
  playedAnimations.value.add(index);
};
</script>

<style scoped>
</style>
