<!-- BackpackModal.vue -->

<template>
  <div
    v-if="isLoaded"
    class="fixed bottom-[20px] right-[20px] flex justify-center items-center z-[2]"
  >
    <div class="relative flex justify-center hr:justify-end">
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
              id="metalGradient"
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
            fill="url(#metalGradient)"
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

        <ModalImage
          imageSrc="/img/backpack.png"
          wrapperClass="max-w-[4rem] -translate-x-1/2 -translate-y-1/2 absolute top-[25px] left-[25px] z-[3]"
          patternId="backpackPattern"
        />

        <div
          :class="['absolute light-gradient-to-b top-0 left-0']"
          :style="wrapperStyle"
        >
          <div class="element-wrap">
            <!-- Top Element -->
            <div class="relative" :style="topDivStyle">
              <div class="top-wrap">
                <p
                  class="w-full text-sm text-theme-color text-shadow flex flex-center ml-[4rem]"
                >
                  Backpack
                </p>
                <CloseModalButton
                  :width="30"
                  :height="30"
                  symbol="X"
                  @click="toggleBackpack"
                />
              </div>
            </div>
            <!-- Content Element -->
            <div class="relative" :style="contentDivStyle">
              <div class="content-wrap">
                <BackpackInventory />
              </div>
            </div>

            <!-- Bottom Element -->
            <div class="relative" :style="bottomDivStyle">
              <div class="bottom-wrap w-full h-full flex items-center px-2">
                <div
                  class="w-full h-[20px] flex justify-end px-2 font-default text-white text-shadow bg-black border border-solid border-theme-color rounded-lg"
                >
                  <CurrencyDisplay
                    :gold="gold"
                    :silver="silver"
                    :copper="copper"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ModalImage from "~/components/main/character-components/ModalImage.vue";
import CloseModalButton from "~/components/misc/CloseModalButton.vue";

import BackpackInventory from "~/components/main/backpack-components/BackpackInventory.vue";
import CurrencyDisplay from "~/components/main/CurrencyDisplay.vue";

import { useModalLoader } from "~/composables/useModalLoader";

import { useBackpackStore } from "~/store/backpack.js";
import { useCurrencyStore } from "~/store/currency.js";

const resources = [
  "/img/blackish-bg.png",
  "/img/empty-slot.png",
  "/img/currency/goldcoin.png",
  "/img/currency/silvercoin.png",
  "/img/currency/coppercoin.png",
];

const { isLoaded } = useModalLoader(resources);

const backpackStore = useBackpackStore();
const currencyStore = useCurrencyStore();

const toggleBackpack = () => {
  backpackStore.toggleBackpack();
};

const gold = computed(() => currencyStore.gold);
const silver = computed(() => currencyStore.silver);
const copper = computed(() => currencyStore.copper);

// Polygon Logic
const originalWidth = 400;
const originalHeight = 600;
const targetWidth = ref(400);
const padding = 20;
const uniqueId = "B";

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
  height: `calc(100% - 37px - 30px`,
}));

const bottomDivStyle = computed(() => ({
  height: `30px`,
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
  window.addEventListener("resize", updateDimensions);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
});
</script>

<style scoped>
</style>
