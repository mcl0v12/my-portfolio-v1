<!-- ThemeButton.vue -->

<template>
  <button
    :style="buttonStyle"
    :disabled="disabled"
    class="relative group origin-top-left select-none"
  >
    <!-- Outer Layer -->
    <svg
      :width="scaledWidth"
      :height="scaledHeight"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="viewBox"
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#dddddd" stop-opacity="1" />
          <stop offset="50%" stop-color="#777777" stop-opacity="1" />
          <stop offset="100%" stop-color="#444444" stop-opacity="1" />
        </linearGradient>
      </defs>
      <g>
        <path
          d="m 5.385,0.5 h 155.229 l 4.886,5 v 45 l -4.886,5 H 5.385 L 0.5,50.5 v -45 z"
          fill="url(#metalGradient)"
          stroke="#000"
          stroke-width="1"
        />
      </g>
    </svg>

    <!-- Inner Layer -->
    <div
      :style="innerLayerStyle"
      :class="[ 'inner-layer absolute top-0 left-0', { 'inner-layer__disabled': disabled } ]"
    >
      <svg
        :width="scaledInnerWidth"
        :height="scaledInnerHeight"
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="innerViewBox"
      >
        <g>
          <path
            d="m 4.42,0.5 h 151.16 l 3.92,3.9 v 41.2 l -3.92,3.9 H 4.42 L 0.5,45.6 V 4.4 Z"
            fill="none"
            stroke="#000"
            stroke-width="1"
          />
        </g>
      </svg>

      <div class="absolute inset-0 flex items-center justify-center">
        <span :style="{ fontSize: `${buttonTextSize}px` }">{{ buttonText }}</span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  width: { type: Number, default: 160 },
  height: { type: Number, default: 50 },
  buttonText: { type: String, default: "Let's Talk" },
  buttonTextSize: { type: Number, default: 18 },
  disabled: { type: Boolean, default: false },
});

const scaleFactor = computed(() => Math.min(props.width / 160, props.height / 50));
const scaledWidth = computed(() => Math.round(166 * scaleFactor.value));
const scaledHeight = computed(() => Math.round(56 * scaleFactor.value));
const viewBox = "0 0 166 56";

const scaledInnerWidth = computed(() => 160 * scaleFactor.value);
const scaledInnerHeight = computed(() => 50 * scaleFactor.value);
const innerViewBox = "0 0 160 50";

const buttonStyle = computed(() => ({
  width: `${scaledWidth.value}px`,
  height: `${scaledHeight.value}px`,
}));

const innerLayerStyle = computed(() => ({
  transform: `translate(${Math.round(3 * scaleFactor.value)}px, ${Math.round(3 * scaleFactor.value)}px)`,
}));
</script>

<style scoped>
button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

.inner-layer {
  will-change: clip-path, transform, filter;
  color: var(--theme-color);
  background: var(--theme-gradient);
  clip-path: polygon(
    2.7% 0%,
    97.3% 0%,
    100% 8.5%,
    100% 91.5%,
    97.3% 100%,
    2.7% 100%,
    0% 91.5%,
    0% 8.5%
  );
  transition: filter 200ms ease, color 200ms ease;
}

.inner-layer__disabled {
  color: var(--gray-40);
  background: var(--gray-90);
}

.inner-layer:hover {
  filter: brightness(1.2);
  color: var(--white);
}

.group:active .inner-layer {
  box-shadow: inset 0px 8px 10px rgba(0, 0, 0, 0.7);
}

.group:active .inner-layer span {
  transform: translate(1px, 2px);
}
</style>
