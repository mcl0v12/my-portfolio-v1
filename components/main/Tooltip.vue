<!-- components/main/Tooltip.vue -->
<template>
  <div
    v-if="visible"
    :style="{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }"
    id="item-description"
    class="max-w-[250px] fixed text-white bg-overlay border border-solid border-gray-50 p-2 rounded-lg z-[3]"
  >
    <div :style="{ color: content.color }" class="text-md">{{ content.title }}</div>
    <div style="color: #08e403;" class="text-sm mt-0.5">{{ content.description }}</div>

    <div v-if="requiredLevelNotMet" class="text-notice-color text-sm">
      Requires Level {{ content.requiredLevel }}
    </div>

    <div v-if="content.sellPrice" class="flex text-sm">
      <span class="mr-3">Sell Price: </span>
      <CurrencyDisplay
        :gold="content.sellPrice.gold"
        :silver="content.sellPrice.silver"
        :copper="content.sellPrice.copper"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useTooltipStore } from '~/store/tooltip.js';
import { useExperienceStore } from '~/store/experience.js'; 
import CurrencyDisplay from '~/components/main/CurrencyDisplay.vue';

const tooltipStore = useTooltipStore();
const experienceStore = useExperienceStore(); 

const visible = computed(() => tooltipStore.visible);
const tooltipPosition = computed(() => tooltipStore.position);
const content = computed(() => tooltipStore.content);

const requiredLevelNotMet = computed(() => {
  return content.value.requiredLevel && experienceStore.level < content.value.requiredLevel;
});

const handleScroll = () => {
  tooltipStore.hideTooltip();
};

onMounted(() => {
  document.addEventListener('scroll', handleScroll, true);
});

onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll, true);
});
</script>
