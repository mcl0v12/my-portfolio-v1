<!-- CloseModalButton.vue -->
<template>
  <button
    :style="{
      width: `${scaledOuterWidth}px`,
      height: `${scaledOuterHeight}px`,
    }"
    class="relative group select-none"
    @click="handleClick"
  >
    <!-- Outer SVG -->
    <svg
      :width="scaledOuterWidth"
      :height="scaledOuterHeight"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="outerViewBox"
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#dddddd" stop-opacity="1" />
          <stop offset="50%" stop-color="#777777" stop-opacity="1" />
          <stop offset="100%" stop-color="#444444" stop-opacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M5.625 1.40625 H24.375 L28.59375 5.625 V24.375 L24.375 28.59375 H5.625 L1.40625 24.375 V5.625 Z"
        fill="url(#metalGradient)"
        stroke="#000"
        stroke-width="1"
      />
    </svg>

    <!-- Inner SVG -->
    <svg
      :width="scaledInnerWidth"
      :height="scaledInnerHeight"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="innerViewBox"
      class="inner-layer absolute top-0"
      :style="innerLayerStyle"
    >
      <path
        d="M3.5 1.25 H20.5 L22.75 3.5 V20.5 L20.5 22.75 H3.5 L1.25 20.5 V3.5 Z"
        fill="none"
        stroke="black"
        stroke-width="1"
      />

      <!-- X-Zeichen -->
      <g v-if="symbol === 'X'">
        <line
          x1="4.5"
          y1="4.5"
          x2="19.5"
          y2="19.5"
          stroke="currentColor"
          stroke-width="2"
        />
        <line
          x1="19.5"
          y1="4.5"
          x2="4.5"
          y2="19.5"
          stroke="currentColor"
          stroke-width="2"
        />
      </g>

      <!-- Minus-Zeichen -->
      <g v-if="symbol === '-'">
        <line
          x1="4.5"
          y1="12"
          x2="19.5"
          y2="12"
          stroke="currentColor"
          stroke-width="2"
        />
      </g>

      <!-- Plus-Zeichen -->
      <g v-if="symbol === '+'">
        <line
          x1="4.5"
          y1="12"
          x2="19.5"
          y2="12"
          stroke="currentColor"
          stroke-width="2"
        />
        <line
          x1="12"
          y1="4.5"
          x2="12"
          y2="19.5"
          stroke="currentColor"
          stroke-width="2"
        />
      </g>
    </svg>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { SoundManager } from "~/utils/soundManager";

const buttonClickSound = new SoundManager([
  "/sounds/interface/iInterfaceButton.ogg",
]);

const props = defineProps({
  width: {
    type: Number,
    default: 30,
  },
  height: {
    type: Number,
    default: 30,
  },
  symbol: {
    type: String,
    default: "X",
  },
});

const emit = defineEmits(["click"]);

const scaleFactor = computed(() =>
  Math.min(props.width / 30, props.height / 30)
);

const scaledOuterWidth = computed(() => Math.round(30 * scaleFactor.value));
const scaledOuterHeight = computed(() => Math.round(30 * scaleFactor.value));
const outerViewBox = "0 0 30 30";

const scaledInnerWidth = computed(() => Math.round(24 * scaleFactor.value));
const scaledInnerHeight = computed(() => Math.round(24 * scaleFactor.value));
const innerViewBox = "0 0 24 24";

const innerLayerStyle = computed(() => ({
  transform: `translate(${Math.round(3 * scaleFactor.value)}px, ${Math.round(
    3 * scaleFactor.value
  )}px)`,
}));

const handleClick = (event) => {
  buttonClickSound.playNextSound();
  emit("click", event);
};
</script>

<style scoped>
.inner-layer {
  will-change: clip-path, transform, filter;
  color: var(--theme-color);
  background: var(--theme-gradient);
  clip-path: polygon(
    14.6% 5.2%,
    85.4% 5.2%,
    94.8% 14.6%,
    94.8% 85.4%,
    85.4% 94.8%,
    14.6% 94.8%,
    5.2% 85.4%,
    5.2% 14.6%
  );
  transition: filter 200ms ease, color 200ms ease;
}

.inner-layer:hover {
  filter: brightness(1.2);
  color: var(--white);
}

.group:active .inner-layer {
  box-shadow: inset 0px 8px 10px rgba(0, 0, 0, 0.7);
}

.group:active .inner-layer g {
  transform: translate(1px, 2px);
}
</style>
