<!-- QuestModal.vue -->

<template>
  <div class="fixed inset-0 flex justify-center items-center z-[2]">
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

        <ElitePlayerFrame />
        <!-- Wrapper for Top, Content, and Bottom Elements -->
        <div
          :class="['absolute light-gradient-to-b top-0 left-0']"
          :style="wrapperStyle"
        >
          <div class="element-wrap">
            <!-- Top Element -->
            <div :class="['relative']" :style="topDivStyle">
              <div class="top-wrap">
                <p
                  class="w-full text-sm text-theme-color text-shadow flex flex-center ml-[18vw] md:ml-[100px]"
                >
                 Grand Marshal Fabian
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
            <div :class="['relative']" :style="contentDivStyle">
              <div class="scroll-wrapper">
                <div
                  class="scroll-content"
                  ref="scrollContent"
                  :style="{
                    backgroundImage:
                      showQuestId === 99
                        ? 'url(/img/blackish-bg.png)'
                        : 'url(/img/quest-paper.png)',
                  }"
                >
                  <QuestOverview />
                </div>
                <div class="scrollbar-utils">
                  <div class="scrollbar-track">
                    <button class="scroll-button up" @click="scrollUp">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>

                    <div
                      class="scrollbar-thumb"
                      ref="scrollbar"
                      @mousedown="startDrag"
                    ></div>

                    <button class="scroll-button down" @click="scrollDown">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        class="w-5 h-5"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Element -->
            <div :class="['relative']" :style="bottomDivStyle">
              <QuestButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ElitePlayerFrame from "~/components/quest-elements/ElitePlayerFrame.vue";
import QuestButtons from "~/components/quest-elements/QuestButtons.vue";
import QuestOverview from "~/components/quest-elements/QuestOverview.vue";
import CloseModalButton from "~/components/misc/CloseModalButton.vue";
import { useQuestStore } from "~/store/handleInteraction.js";

const questStore = useQuestStore();
const showQuestId = computed(() => questStore.showQuestId);

const closeQuestModal = () => {
  questStore.closeInteraction(); 
};

const scrollbar = ref(null);
const scrollContent = ref(null);
let isDragging = false;
let startY = 0;
let startScrollTop = 0;

// Reactive variables
const originalWidth = 450;
const originalHeight = 600;
const targetWidth = ref(450); 
const padding = 30; 
const uniqueId = "F"; 

// Computed properties
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
  height: `80px`, // Feste Höhe von 37px
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
    // Skalierung basierend auf Bildschirmbreite für kleine Bildschirme
    targetWidth.value = screenWidth - 2 * padding;
  } else if (screenWidth <= 1024) {
    // Maximal 320px bei max-width: 1024px
    targetWidth.value = Math.min(420, screenWidth - 2 * padding);
  } else {
    // Standardbreite für größere Bildschirme
    targetWidth.value = 450;
  }
  // Anpassung im Querformat
  if (isLandscape && screenWidth <= 1024) {
    targetWidth.value = Math.min(320, screenWidth - 2 * padding);
  }
};

const handleScroll = () => {
  if (scrollContent.value && scrollbar.value) {
    const containerHeight = scrollContent.value.clientHeight;
    const contentHeight = scrollContent.value.scrollHeight;
    const thumbHeight = scrollbar.value.clientHeight;
    const trackHeight = scrollbar.value.parentElement.clientHeight;

    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRatio =
      scrollContent.value.scrollTop / (contentHeight - containerHeight);

    const thumbTop = scrollRatio * maxThumbTop;
    scrollbar.value.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
  }
};

const scrollUp = () => {
  if (scrollContent.value) {
    scrollContent.value.scrollTop -= 20;
  }
};

const scrollDown = () => {
  if (scrollContent.value) {
    scrollContent.value.scrollTop += 20;
  }
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
