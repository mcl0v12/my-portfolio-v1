<!-- /components/main/LootModal.vue -->

<template>
  <div
    class="fixed z-[2]"
    v-if="isVisible && isLoaded"
    :style="{ top: `${modalPosition.y}px`, left: `${modalPosition.x}px` }"
  >
    <div
      class="relative"
      ref="svgContainer"
      :style="{
        width: containerWidth + 'px',
        height: containerHeightStyle,
      }"
    >
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="`0 0 ${containerWidth} ${containerHeight}`"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="metalGradientLoot"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stop-color="#dddddd" stop-opacity="1" />
            <stop offset="50%" stop-color="#777777" stop-opacity="1" />
            <stop offset="100%" stop-color="#444444" stop-opacity="1" />
          </linearGradient>

          <clipPath :id="cutCornersId">
            <polygon
              :points="
                scalePoints(
                  '14.815,5.5 385.185,5.5 394.5,14.815 394.5,585.185 385.185,594.5 14.815,594.5 5.5,585.185 5.5,14.815'
                )
              "
            />
          </clipPath>
        </defs>

        <!-- Outer Polygon -->
        <polygon
          :points="
            scalePoints('13,1 387,1 399,13 399,587 387,599 13,599 1,587 1,13')
          "
          fill="url(#metalGradientLoot)"
          stroke="black"
          stroke-width="1"
        ></polygon>

        <!-- Inner Polygon -->
        <polygon
          :points="
            scalePoints(
              '14.6,5 385.4,5 395,14.6 395,585.4 385.4,595 14.6,595 5,585.4 5,14.6'
            )
          "
          fill="none"
          stroke="black"
          stroke-width="1"
        ></polygon>
      </svg>

      <!-- Wrapper for Top and Content Elements -->
      <div
        class="absolute top-0 left-0 light-gradient-to-b"
        :style="wrapperStyle"
      >
        <div class="element-wrap">
          <!-- Top Element -->
          <div class="relative" :style="topDivStyle">
            <div class="top-wrap flex justify-between items-center px-4 py-2">
              <p
                class="w-full text-sm text-theme-color text-shadow flex flex-center"
              >
                Items
              </p>
              <CloseModalButton
                :width="30"
                :height="30"
                symbol="X"
                @click="closeModal"
              />
            </div>
          </div>

          <!-- Content Element (Loot Items) -->
          <div class="relative" :style="contentDivStyle">
            <div class="content-wrap py-4 px-2">
              <LootItems ref="lootItems" :lootId="lootId" :items="lootItems" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import CloseModalButton from "~/components/misc/CloseModalButton.vue";
import LootItems from "~/components/main/loot-components/LootItems.vue";
import { useModalLoader } from "~/composables/useModalLoader";
import { lootItemsData } from "~/data/lootItems.js";
import { useLootStore } from "~/store/loot.js";

const lootStore = useLootStore();
const props = defineProps({
  lootId: {
    type: String,
    required: true,
  },
});

const lootItems = computed(() => {
  return lootStore.lootItems[props.lootId] || [];
});

const isVisible = computed(() => {
  return lootStore.openModals[props.lootId];
});

const modalPosition = ref({ x: 0, y: 0 });
let observer = null;

const closeModal = () => {
  lootStore.closeLootModal(props.lootId);
};

watch(lootItems, (newItems) => {
  if (newItems.length === 0) {
    closeModal();
  }
});

const resources =
  lootItemsData[props.lootId]?.items.map((item) => item.imageUrl) || [];
const { isLoaded } = useModalLoader(resources);

// Polygon Logic
const originalWidth = 400;
const originalHeight = 600;
const targetWidth = ref(400);
const padding = 20;
const uniqueId = "L";

const cutCornersId = computed(() => `clip-${uniqueId}`);
const scaleFactorX = computed(() => targetWidth.value / originalWidth);
const containerWidth = computed(() => targetWidth.value);
const containerHeight = computed(() => originalHeight * scaleFactorX.value);

const svgWidth = computed(() => targetWidth.value);
const svgHeight = computed(() => containerHeight.value);

const containerHeightStyle = computed(() => {
  return `${(originalHeight * targetWidth.value) / originalWidth}px`;
});

const wrapperStyle = computed(() => ({
  width: `${targetWidth.value}px`,
  height: containerHeightStyle.value,
  clipPath: `url(#${cutCornersId.value})`,
}));

const topDivStyle = computed(() => ({
  height: `37px`,
}));

const contentDivStyle = computed(() => ({
  height: `calc(100% - 37px)`,
}));

const scalePoints = (points) => {
  return points
    .split(" ")
    .map((point) => {
      const [x, y] = point.split(",").map(Number);
      return `${x * scaleFactorX.value},${y * scaleFactorX.value}`;
    })
    .join(" ");
};

// Update modal position based on cursor and first item position
const updateModalPosition = async () => {
  await nextTick();

  const { x: cursorX, y: cursorY } = lootStore.cursorPosition;
  const firstItemBadge = document.querySelector(".item-badge");
  const screenWidth = window.innerWidth;

  if (firstItemBadge && screenWidth >= 1025) {
    const rect = firstItemBadge.getBoundingClientRect();
    const itemCenterX = rect.width / 2;
    const itemCenterY = rect.height / 2;

    const offsetAdjustmentX = 15;
    const offsetAdjustmentY = 60;

    modalPosition.value = {
      x: cursorX - itemCenterX - offsetAdjustmentX,
      y: cursorY - itemCenterY - offsetAdjustmentY,
    };
  } else {
    modalPosition.value = {
      x: (window.innerWidth - containerWidth.value) / 2,
      y: (window.innerHeight - containerHeight.value) / 2,
    };
  }
};

const updateDimensions = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isLandscape = screenWidth > screenHeight;

  targetWidth.value = 230;

  if (isLandscape && screenWidth <= 1024) {
    targetWidth.value = Math.min(250, screenWidth - 2 * padding);
  }
};

onMounted(() => {
  updateDimensions();

  observer = new MutationObserver(() => {
    if (document.querySelector(".item-badge")) {
      updateModalPosition();
      observer.disconnect();
    } else {
      updateModalPosition();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("resize", updateDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
  if (observer) observer.disconnect();
});
</script>

<style scoped></style>
