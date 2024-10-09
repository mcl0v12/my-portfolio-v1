<!-- CharacterModal.vue -->

<template>
  <div
    v-if="isLoaded"
    class="fixed inset-0 flex justify-center items-center z-[2]"
  >
    <div
      class="max-w-base w-full px-base relative flex justify-center hr:justify-start"
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

            <!-- General Clip-Path for all corners -->
            <clipPath :id="cutCornersId">
              <polygon
                :points="
                  scalePoints(
                    '4.5,12.25 12.25,4.5 437.75,4.5 445.5,12.25 445.5,587.75 437.75,595.5 12.25,595.5 4.5,587.75'
                  )
                "
              />
            </clipPath>
          </defs>
          <!-- Outer Polygon -->
          <polygon
            :points="
              scalePoints('1,10 10,1 440,1 449,10 449,590 440,599 10,599 1,590')
            "
            fill="url(#metalGradient)"
            stroke="black"
            stroke-width="1"
          ></polygon>
          <!-- Inner Polygon -->
          <polygon
            :points="
              scalePoints('4,12 12,4 438,4 446,12 446,588 438,596 12,596 4,588')
            "
            fill="none"
            stroke="black"
            stroke-width="1"
          ></polygon>
        </svg>

        <!-- 'ElitePlayerFrame.vue ' or 'ModalImage.vue' -->
        <component
          :is="character.FrameComponent"
          :imageSrc="character.imageSrc"
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
                  class="w-full text-sm text-theme-color text-shadow flex flex-center ml-[18vw] md:ml-[100px]"
                >
                  {{ character.name }}
                </p>
                <CloseModalButton
                  :width="30"
                  :height="30"
                  symbol="X"
                  @click="closeQuestModal"
                />
              </div>
            </div>

            <!-- Content Element -->
            <div class="relative" :style="contentDivStyle">
              <div class="scroll-wrapper">
                <div
                  class="scroll-content"
                  ref="scrollContent"
                  @scroll="handleScroll"
                  :style="{
                    backgroundImage:
                      showQuestId === 99
                        ? 'url(/img/blackish-bg.png)'
                        : 'url(/img/quest-paper.png)',
                  }"
                >
                  <!-- Character 'Talk.vue' Component -->
                  <component
                    :is="character.TalkComponent"
                    @update="updateScrollButtons"
                  />
                </div>
                <div class="scrollbar-utils">
                  <div class="scrollbar-track">
                    <button
                      class="scroll-button up"
                      @click="scrollUp"
                      :style="{
                        backgroundImage: `url(${
                          showUpButton
                            ? '/img/buttons/up-button--enabled.png'
                            : '/img/buttons/up-button.png'
                        })`,
                      }"
                    ></button>

                    <div
                      class="scrollbar-thumb"
                      ref="scrollbar"
                      @mousedown="startDrag"
                      :style="{ transform: thumbTop }"
                    ></div>

                    <button
                      class="scroll-button down"
                      @click="scrollDown"
                      :style="{
                        backgroundImage: `url(${
                          showDownButton
                            ? '/img/buttons/down-button--enabled.png'
                            : '/img/buttons/down-button.png'
                        })`,
                      }"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Element -->
            <div class="relative" :style="bottomDivStyle">
              <CharacterButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import CloseModalButton from "~/components/misc/CloseModalButton.vue";
import CharacterButtons from "~/components/main/character-components/CharacterButtons.vue";

import { useModalLoader } from "~/composables/useModalLoader";
import { useQuestStore } from "~/store/handleInteraction.js";

const resources = [
  "/img/epf.png",
  "/img/char-profile.png",
  "/img/quest-paper.png",
  "/svg/speechbubble.svg",
  "/svg/vendor.svg",
];

const { isLoaded } = useModalLoader(resources);

import { npcData } from "~/data/npcData";

const props = defineProps({
  characterId: {
    type: String,
  },
});

const character = npcData[props.characterId];

const questStore = useQuestStore();
const showQuestId = computed(() => questStore.showQuestId);

const closeQuestModal = () => {
  questStore.closeInteraction();
};

// Polygon Logic
const originalWidth = 450;
const originalHeight = 600;
const targetWidth = ref(450);
const padding = 30;
const uniqueId = "C";

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
  height: `80px`,
}));

const contentDivStyle = computed(() => ({
  height: `calc(100% - 80px - (60px * ${targetWidth.value} / ${originalWidth}))`,
}));

const bottomDivStyle = computed(() => ({
  height: `calc(60px * ${targetWidth.value} / ${originalWidth})`,
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

  if (screenWidth <= 767) {
    // Skalierung basierend auf Bildschirmbreite
    targetWidth.value = screenWidth - 2 * padding;
  } else if (screenWidth <= 1024) {
    // Maximal 420px
    targetWidth.value = Math.min(420, screenWidth - 2 * padding);
  } else {
    // Standardbreite
    targetWidth.value = 450;
  }
  // Anpassung im Querformat
  if (isLandscape && screenWidth <= 1024) {
    targetWidth.value = Math.min(320, screenWidth - 2 * padding);
  }
};

// Scrollbar Logic
const scrollbar = ref(null);
const scrollContent = ref(null);

let isDragging = false;
let startY = 0;
let startScrollTop = 0;

const showUpButton = ref(false);
const showDownButton = ref(false);

const updateScrollButtons = () => {
  if (scrollContent.value) {
    const containerHeight = scrollContent.value.clientHeight;
    const contentHeight = scrollContent.value.scrollHeight;

    showUpButton.value = scrollContent.value.scrollTop > 0;
    showDownButton.value =
      scrollContent.value.scrollTop + containerHeight < contentHeight;
  }
};

onUpdated(() => {
  updateScrollButtons();
});

const thumbTop = ref("translate3d(0, 0, 0)");

const handleScroll = () => {
  if (scrollContent.value && scrollbar.value) {
    const containerHeight = scrollContent.value.clientHeight;
    const contentHeight = scrollContent.value.scrollHeight;
    const trackHeight = scrollbar.value.parentElement.clientHeight;
    const thumbHeight = 22;

    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRatio =
      scrollContent.value.scrollTop / (contentHeight - containerHeight);
    const translateY = scrollRatio * maxThumbTop;

    thumbTop.value = `translate3d(0, ${translateY}px, 0)`;
    updateScrollButtons();
  }
};

const scrollUp = () => {
  if (scrollContent.value) {
    scrollContent.value.scrollTop -= 20;
  }
  handleScroll();
};

const scrollDown = () => {
  if (scrollContent.value) {
    scrollContent.value.scrollTop += 20;
  }
  handleScroll();
};

const startDrag = (event) => {
  isDragging = true;
  startY = event.clientY;
  startScrollTop = scrollContent.value.scrollTop;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", stopDrag);
};

const onMouseMove = (event) => {
  if (isDragging && scrollContent.value && scrollbar.value) {
    const thumbHeight = scrollbar.value.clientHeight;
    const trackHeight = scrollbar.value.parentElement.clientHeight;
    const maxScrollTop =
      scrollContent.value.scrollHeight - scrollContent.value.clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;
    const deltaY = event.clientY - startY;
    const scrollRatio = deltaY / maxThumbTop;
    scrollContent.value.scrollTop = Math.min(
      maxScrollTop,
      Math.max(0, startScrollTop + scrollRatio * maxScrollTop)
    );
  }
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", stopDrag);
};

onMounted(() => {
  updateDimensions();
  updateScrollButtons();
  nextTick(() => {
    if (scrollContent.value) {
      scrollContent.value.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("resize", updateDimensions);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
  if (scrollContent.value) {
    scrollContent.value.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped>
.top-wrap::before {
  height: 50px;
  content: "";
  position: absolute;
  top: 37px;
  left: 0;
  right: 0;
  box-shadow: inset 0px 20px 20px -10px rgba(0, 0, 0, 0.5);
}
</style>
