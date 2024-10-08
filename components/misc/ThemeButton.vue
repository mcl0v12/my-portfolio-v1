<!-- ThemeButton.vue -->

<template>
  <button
    :style="buttonStyle"
    :disabled="disabled"
    class="relative group origin-top-left select-none"
    @click="handleClick"
    v-bind="transition"
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
      :class="[
        'inner-layer absolute top-0 left-0',
        { 'inner-layer__disabled': disabled },
      ]"
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
        <span :style="{ fontSize: `${selectedButtonTextSize}px` }">
          {{ buttonText }}
        </span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { SoundManager } from "~/utils/soundManager";

const buttonClickSound = new SoundManager([
  "/sounds/interface/iInterfaceButton.ogg",
]);

const props = defineProps({
  height: { type: Number, default: 50 },
  mdHeight: { type: Number, default: null },
  lgHeight: { type: Number, default: null },
  buttonText: { type: String, default: "null" },
  buttonTextSize: { type: Number, default: null },
  mdButtonTextSize: { type: Number, default: null },
  lgButtonTextSize: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
  transition: { type: Object, default: null },
});

const emit = defineEmits(["click"]);

// Größen anpassen
const selectedHeight = ref(props.height);
const selectedButtonTextSize = ref(props.buttonTextSize || 16);

const updateSizes = () => {
  if (typeof window !== "undefined") {
    if (
      window.matchMedia("(min-width: 1024px)").matches &&
      props.lgHeight &&
      props.lgButtonTextSize
    ) {
      selectedHeight.value = props.lgHeight;
      selectedButtonTextSize.value = props.lgButtonTextSize;
    } else if (
      window.matchMedia("(min-width: 768px)").matches &&
      props.mdHeight &&
      props.mdButtonTextSize
    ) {
      selectedHeight.value = props.mdHeight;
      selectedButtonTextSize.value = props.mdButtonTextSize;
    } else {
      selectedHeight.value = props.height;
      selectedButtonTextSize.value = props.buttonTextSize;
    }
  }
};

onMounted(() => {
  updateSizes();
  window.addEventListener("resize", updateSizes);
});

const scaleFactor = computed(() => selectedHeight.value / 50);
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
  transform: `translate(${(3 * scaleFactor.value).toFixed(3)}px, ${(
    3 * scaleFactor.value
  ).toFixed(3)}px)`,
}));

const handleClick = (event) => {
  if (!props.disabled) {
    buttonClickSound.playNextSound();
    emit("click", event);
  }
};
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  pointer-events: none;
}

.inner-layer {
  will-change: transform;
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
