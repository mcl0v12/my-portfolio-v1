<!-- /quests/Vendor.vue -->
<template>
  <div
    v-if="showQuestId === 99"
    class="grid grid-cols-1 xl:grid-cols-2 px-5 gap-4 font-default text-white text-shadow"
  >
    <div v-for="(column, index) in columns" :key="index" class="flex">
      <template v-if="column.id">
        <div class="item-wrap">
          <ItemBadge
            :size="50"
            :overlayScale="1"
            :imageUrl="column.imageUrl"
            :gradientId="index"
            :gradientTopColor="getGradientColor(column.rarity, 'top', true)"
            :gradientMidColor="getGradientColor(column.rarity, 'mid', true)"
            :gradientBottomColor="
              getGradientColor(column.rarity, 'bottom', true)
            "
            @mouseenter="
              handleMouseEnter(
                $event,
                column.title,
                column.description,
                getColorFromRarity(column.rarity),
                column.vendor?.requiredLevel, 
                column
              )
            "
            @mouseleave="handleMouseLeave"
            @click="handleItemClick(column)"
            :class="{
              'cursor-buy':
                canAffordItem(column.vendor?.costs) && !isItemDisabled(column),
              'cursor-no-buy':
                isItemDisabled(column) || !canAffordItem(column.vendor?.costs),
            }"
            :isDisabled="isItemDisabled(column)"
          />
        </div>

        <div
          class="item-description w-full relative p-2 rounded-lg z-[1]"
          :class="isItemDisabled(column) ? 'bg-disabled' : 'bg-black'"
        >
          <p
            class="text-sm"
            :style="{ color: getColorFromRarity(column.rarity) }"
          >
            {{ column.title }}
          </p>
          <div
            class="flex mt-2"
            :class="{ 'text-gray-80': !canAffordItem(column.vendor?.costs) }"
          >
            <CurrencyDisplay
              :gold="column.vendor?.costs?.gold || 0"
              :silver="column.vendor?.costs?.silver || 0"
              :copper="column.vendor?.costs?.copper || 0"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="item-wrap">
          <div class="empty-item"></div>
        </div>
        <div
          class="item-description w-full relative bg-black p-2 rounded-lg z-[1]"
        ></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useBackpackStore } from "~/store/backpack";
import { useCurrencyStore } from "~/store/currency";
import { useExperienceStore } from "~/store/experience";

import { useTooltipStore } from "~/store/tooltip.js";
import { useUiOverlayStore } from "~/store/uiOverlay";
import { useRarityColors } from "~/composables/useRarityColors";

import ItemBadge from "~/components/misc/ItemBadge.vue";
import CurrencyDisplay from "~/components/main/CurrencyDisplay.vue";
import { onUseItems } from "~/data/onUseItems.js";
import { SoundManager } from "~/utils/soundManager";

const props = defineProps({
  showQuestId: Number,
});

const experienceStore = useExperienceStore();
const tooltipStore = useTooltipStore();
const currencyStore = useCurrencyStore();
const uiOverlayStore = useUiOverlayStore();
const backpackStore = useBackpackStore();
const { getColorFromRarity, getGradientColor } = useRarityColors();

const maxSlots = 10;

const vendorSounds = {
  notBuyable: new SoundManager(["/sounds/utils/notBuyable.ogg"]),
};

const isItemDisabled = (item) => {
  return !!(item.vendor?.requiredLevel && experienceStore.level < item.vendor?.requiredLevel);
};

const columns = [
  ...onUseItems,
  ...Array(maxSlots - onUseItems.length).fill({}),
];

const canAffordItem = (costs, requiredLevel = 0) => {
  const currentGold = currencyStore.gold;
  const currentSilver = currencyStore.silver;
  const currentCopper = currencyStore.copper;

  if (experienceStore.level < requiredLevel) {
    return false;
  }

  if (currentGold > (costs?.gold || 0)) return true;
  if (currentGold === (costs?.gold || 0)) {
    if (currentSilver > (costs?.silver || 0)) return true;
    if (currentSilver === (costs?.silver || 0) && currentCopper >= (costs?.copper || 0))
      return true;
  }
  return false;
};

const handleItemClick = (column) => {
  if (!canAffordItem(column.vendor?.costs, column.vendor?.requiredLevel)) {
    vendorSounds.notBuyable.playNextSound();

    uiOverlayStore.showMessage(
      experienceStore.level < column.vendor?.requiredLevel
        ? `You don't have the required Level to buy this item.`
        : "You don't have enough money.",
      3000
    );
  } else {
    currencyStore.subtractCurrency(
      column.vendor?.costs?.gold || 0,
      column.vendor?.costs?.silver || 0,
      column.vendor?.costs?.copper || 0
    );
    backpackStore.addItemToBackpack(column);
  }
};

const handleMouseEnter = (
  event,
  title,
  description,
  color,
  requiredLevel,
  column
) => {
  tooltipStore.showTooltip(event, {
    title,
    description,
    titleColor: color,
    descriptionColor: column.descriptionColor,
    requiredLevel,
  });
};

const handleMouseLeave = () => {
  tooltipStore.hideTooltip();
};
</script>

<style scoped></style>
