<!-- BackpackInventory.vue -->
<template>
  <div class="grid grid-cols-4 gap-1 text-white">
    <template v-for="(slot, index) in filledSlots" :key="index">
      <ItemBadge
        :size="50"
        :overlayScale="1"
        :imageUrl="slot?.imageUrl || '/img/empty-slot.png'"
        :gradientId="index"
        :gradientTopColor="
          getGradientColor(slot?.rarity, 'top', slot?.id !== null)
        "
        :gradientMidColor="
          getGradientColor(slot?.rarity, 'mid', slot?.id !== null)
        "
        :gradientBottomColor="
          getGradientColor(slot?.rarity, 'bottom', slot?.id !== null)
        "
        @click="slot && slot.id !== null ? handleItemClick(slot, index) : null"
        @mouseenter="
          slot && slot.id !== null ? handleMouseEnter($event, slot) : null
        "
        @mouseleave="handleMouseLeave"
        :class="{
          'cursor-buy':
            slot?.id !== null && isQuest99Active && slot?.vendor?.sellPrice,
          'cursor-pointer':
            slot?.id !== null && !isQuest99Active && slot?.vendor?.sellPrice,
        }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBackpackStore } from "~/store/backpack";
import { useCurrencyStore } from "~/store/currency";
import { useQuestStore } from "~/store/handleInteraction";
import { useOnUseItemEffectsStore } from "~/store/onUseItemEffects";
import { useTooltipStore } from "~/store/tooltip";
import { useRarityColors } from "~/composables/useRarityColors";
import ItemBadge from "~/components/misc/ItemBadge.vue";
import type { BackpackItem } from "~/store/backpack";

const backpackStore = useBackpackStore();
const questStore = useQuestStore();
const currencyStore = useCurrencyStore();
const tooltipStore = useTooltipStore();
const { getColorFromRarity, getGradientColor } = useRarityColors();
const onUseItemEffectsStore = useOnUseItemEffectsStore();

const filledSlots = computed<(BackpackItem | null)[]>(
  () => backpackStore.items
);

const isQuest99Active = computed(() => questStore.showQuestId === 99);

const handleItemClick = (slot: BackpackItem, index: number) => {
  if (!slot.id) return;

  if (isQuest99Active.value && slot.vendor?.sellPrice) {
    const { gold = 0, silver = 0, copper = 0 } = slot.vendor.sellPrice;
    currencyStore.addCurrency(gold, silver, copper, "sell");
    backpackStore.replaceItemWithEmpty(index);
    tooltipStore.hideTooltip();
  } else {
    onUseItemEffectsStore.applyItemEffect(slot.id);
  }
};

const handleMouseEnter = (event: MouseEvent, slot: BackpackItem) => {
  if (!slot.id) return;

  const titleColor = getColorFromRarity(slot.rarity);
  tooltipStore.showTooltip(event, {
    title: slot.title,
    description: slot.description,
    titleColor,
    descriptionColor: slot.descriptionColor,
    sellPrice: slot.vendor?.sellPrice,
  });
};

const handleMouseLeave = () => {
  tooltipStore.hideTooltip();
};
</script>

<style scoped></style>
