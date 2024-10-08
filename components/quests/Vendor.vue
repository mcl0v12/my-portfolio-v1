<!-- /quests/Vendor.vue -->
<template>
  <div
    v-if="showQuestId === 99"
    class="grid grid-cols-1 xl:grid-cols-2 px-5 gap-4 font-default text-white text-shadow"
  >
    <div v-for="(column, index) in columns" :key="index" class="flex">
      <template v-if="column.id">
        <!-- Belegter Slot mit Item -->
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
                column.requiredLevel,
                column
              )
            "
            @mouseleave="handleMouseLeave"
            @click="handleItemClick(column)"
            :class="{
              'cursor-buy':
                canAffordItem(column.costs) && !isItemDisabled(column),
              'cursor-no-buy':
                isItemDisabled(column) || !canAffordItem(column.costs),
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
          <!-- CurrencyDisplay für jedes Item -->
          <div
            class="flex mt-2"
            :class="{ 'text-gray-80': !canAffordItem(column.costs) }"
          >
            <CurrencyDisplay
              :gold="column.costs.gold"
              :silver="column.costs.silver"
              :copper="column.costs.copper"
            />
          </div>
        </div>
      </template>

      <!-- Leerer Slot mit Hintergrundbild -->
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
import { useTooltipStore } from "~/store/tooltip.js";
import { useCurrencyStore } from "~/store/currency.js";
import { useUiOverlayStore } from "~/store/uiOverlay";
import { useBackpackStore } from "~/store/backpack.js";
import { useExperienceStore } from "~/store/experience.js";
import { useRarityColors } from "~/composables/useRarityColors";


import ItemBadge from "~/components/misc/ItemBadge.vue";
import CurrencyDisplay from "~/components/main/CurrencyDisplay.vue";
import { onUseItems } from "~/data/onUseItems.js";
import { SoundManager } from "~/utils/soundManager";

const experienceStore = useExperienceStore();

const tooltipStore = useTooltipStore();
const currencyStore = useCurrencyStore();
const uiOverlayStore = useUiOverlayStore();
const backpackStore = useBackpackStore();
const { getColorFromRarity, getGradientColor } = useRarityColors();

const maxSlots = 10;

const vendorSounds = {
  notBuyable: new SoundManager(["/sounds/utils/notBuyable.ogg"]), // Sound für nicht käuflich
};

const isItemDisabled = (item) => {
  return !!(item.requiredLevel && experienceStore.level < item.requiredLevel);
};

const columns = [
  ...onUseItems,
  ...Array(maxSlots - onUseItems.length).fill({}),
];

// Überprüfung, ob der Spieler das Item kaufen kann (Währung und Level)
const canAffordItem = (costs, requiredLevel = 0) => {
  const currentGold = currencyStore.gold;
  const currentSilver = currencyStore.silver;
  const currentCopper = currencyStore.copper;

  // Überprüfen, ob der Spieler das benötigte Level hat
  if (experienceStore.level < requiredLevel) {
    return false;
  }

  if (currentGold > costs.gold) return true;
  if (currentGold === costs.gold) {
    if (currentSilver > costs.silver) return true;
    if (currentSilver === costs.silver && currentCopper >= costs.copper)
      return true;
  }
  return false;
};

const handleItemClick = (column) => {
  if (!canAffordItem(column.costs, column.requiredLevel)) {
    vendorSounds.notBuyable.playNextSound();

    uiOverlayStore.showMessage(
      experienceStore.level < column.requiredLevel
        ? `You dont have the required Level to buy this item.`
        : "You don't have enough money.",
      3000
    );
  } else {
    // Geld abziehen und Item zum Rucksack hinzufügen
    currencyStore.subtractCurrency(
      column.costs.gold,
      column.costs.silver,
      column.costs.copper
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
