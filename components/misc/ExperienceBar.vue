<!-- ExperienceBar.vue -->
<template>
  <div class="max-w-base px-base mx-auto sticky bottom-0">
    <div class="w-full h-[12px] border border-solid border-gray-50 rounded-lg overflow-hidden relative">

      <div 
        class="experience-bar__fill"
        :class="{ 'transition-none!': noTransition }"
        :style="{ width: fillPercentage + '%' }"
        @transitionend="handleTransitionEnd"
      ></div>

      <div
        v-for="n in 9"
        :key="n"
        class="absolute inset-0 w-[1px]"
        style="background-color: rgba(255, 255, 255, 0.5);"
        :style="{ left: (n * 10) + '%' }"
      ></div>


      <div class="experience-bar__text">
        XP: {{ displayedExperience }} / {{ experienceToLevel }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useExperienceStore } from '~/store/experience.js';

const experienceStore = useExperienceStore();
const currentExperience = computed(() => experienceStore.currentExperience);
const experienceToLevel = computed(() => experienceStore.experienceToLevel);

const displayedExperience = ref(currentExperience.value);
const fillPercentage = ref((displayedExperience.value / experienceToLevel.value) * 100);

const noTransition = ref(false);


watch(currentExperience, (newVal) => {
  if (newVal === 0) {
    // Level-Up passiert, setze Transition auf 0 % sofort
    noTransition.value = true;
    fillPercentage.value = 0;
  } else {
    noTransition.value = false;
    displayedExperience.value = newVal;
    fillPercentage.value = (displayedExperience.value / experienceToLevel.value) * 100;
  }
});

const handleTransitionEnd = () => {
  if (fillPercentage.value === 0) {
    noTransition.value = false;
  }
};
</script>

<style scoped>
.experience-bar__fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #2e0057 0%,    
    #6d00a8 60%,   
    #8b24d9 100%   
  );
  transition: width 1s cubic-bezier(0.42, 0, 0.58, 1); 
}

.experience-bar__text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-family: var(--default-font);
  font-size: 11px;
  font-weight: bold;
  z-index: 3;
  pointer-events: none;
}
</style>
