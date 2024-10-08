<template>
  <div class="loot-items">
    <ul class="loot-list space-y-1">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="loot-item flex bg-black cursor-pointer"
        @click="handleItemClick(item)"
        @mouseenter="handleMouseEnter($event, item, index)"
        @mouseleave="handleMouseLeave($event, index)"
        @mousedown="forwardEventToBadge('mousedown', index)"
        @mouseup="forwardEventToBadge('mouseup', index)"
      >
        <div class="item-badge-wrap">
          <ItemBadge
            ref="itemBadges"
            :size="50"
            :overlayScale="1"
            :imageUrl="item.imageUrl"
            :gradientId="index"
            :gradientTopColor="getGradientColor(item.rarity, 'top', !!item.id)"
            :gradientMidColor="getGradientColor(item.rarity, 'mid', !!item.id)"
            :gradientBottomColor="
              getGradientColor(item.rarity, 'bottom', !!item.id)
            "
          />
        </div>
        <div
          class="w-full text-sm mt-1 ml-2 select-none"
          :style="{ color: getColorFromRarity(item.rarity) }"
        >
          {{ item.title }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRarityColors } from "~/composables/useRarityColors";
import { useTooltipStore } from "~/store/tooltip.js";
import { useBackpackStore } from "~/store/backpack.js";
import { useLootStore } from "~/store/loot.js";
import { useCurrencyStore } from "~/store/currency.js";
import { ref } from "vue";
import ItemBadge from "~/components/misc/ItemBadge.vue";

const props = defineProps({
  chestId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const itemBadges = ref([]);

const backpackStore = useBackpackStore();
const lootStore = useLootStore();
const currencyStore = useCurrencyStore();
const { getColorFromRarity, getGradientColor } = useRarityColors();
const tooltipStore = useTooltipStore();

const handleItemClick = (item) => {
  if (item.type === "currency") {
    currencyStore.addCurrency(item.gold, item.silver, item.copper);
  } else {
    backpackStore.addItemToBackpack(item);
  }

  lootStore.removeLootItem(props.chestId, item.id);
};

const handleMouseEnter = (event, item, index) => {
  forwardEventToBadge("mouseenter", index);

  if (item.type === "currency") {
    tooltipStore.hideTooltip();
  } else {
    const color = getColorFromRarity(item.rarity);

    tooltipStore.showTooltip(event, {
      title: item.title,
      description: item.description,
      titleColor: color,
      descriptionColor: item.descriptionColor,
    });
  }
};

const handleMouseLeave = (event, index) => {
  forwardEventToBadge("mouseleave", index);

  const relatedTarget = event.relatedTarget;

  if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
    tooltipStore.hideTooltip();
  }
};

const forwardEventToBadge = (eventType, index) => {
  const itemBadge = itemBadges.value[index];
  if (itemBadge && itemBadge.$el) {
    const event = new Event(eventType);
    itemBadge.$el.dispatchEvent(event);
  }
};
</script>

<style scoped></style>
