<!-- BackpackInventory.vue -->

<template>
  <div class="grid grid-cols-4 gap-1 text-white">
    <template v-for="(slot, index) in filledSlots" :key="index">
      <ItemBadge
        :imageUrl="slot.id ? slot.imageUrl : '/img/empty-slot.png'"
        :gradientId="index"
        :gradientTopColor="getGradientColor(slot.rarity, 'top', !!slot.id)"
        :gradientMidColor="getGradientColor(slot.rarity, 'mid', !!slot.id)"
        :gradientBottomColor="
          getGradientColor(slot.rarity, 'bottom', !!slot.id)
        "
        @click="slot.id ? handleItemClick(slot, index) : null"
        @mouseenter="slot.id ? handleMouseEnter($event, slot) : null"
        @mouseleave="handleMouseLeave"
        :class="{
          'cursor-buy': isQuest99Active && slot.sellPrice,
          'cursor-pointer': !isQuest99Active && slot.sellPrice,
        }"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useBackpackStore } from "~/store/backpack.js";
import { useQuestStore } from "~/store/handleInteraction.js";
import { useCurrencyStore } from "~/store/currency.js";
import { useOnUseItemEffectsStore } from "~/store/onUseItemEffects.js";
import ItemBadge from "~/components/misc/ItemBadge.vue";
import { useTooltipStore } from "~/store/tooltip.js";
import { useRarityColors } from "~/composables/useRarityColors";

const backpackStore = useBackpackStore();
const questStore = useQuestStore();
const currencyStore = useCurrencyStore();
const tooltipStore = useTooltipStore();
const { getColorFromRarity, getGradientColor } = useRarityColors();
const onUseItemEffectsStore = useOnUseItemEffectsStore();

const filledSlots = computed(() => {
  return backpackStore.items.concat(
    Array(16 - backpackStore.items.length).fill({ id: null })
  );
});

const isQuest99Active = computed(() => questStore.showQuestId === 99);

const handleItemClick = (slot, index) => {
  if (isQuest99Active.value) {
    if (slot.sellPrice) {
      const { gold, silver, copper } = slot.sellPrice;
      currencyStore.addCurrency(gold, silver, copper);
    }
    backpackStore.replaceItemWithEmpty(index);
    tooltipStore.hideTooltip();
  } else {
    onUseItemEffectsStore.applyItemEffect(slot.id);
  }
};

const handleMouseEnter = (event, slot) => {
  const color = getColorFromRarity(slot.rarity);
  tooltipStore.showTooltip(event, {
    title: slot.text,
    description: slot.description,
    color,
    sellPrice: slot.sellPrice,
  });
};

const handleMouseLeave = () => {
  tooltipStore.hideTooltip();
};
</script>

<style></style>
