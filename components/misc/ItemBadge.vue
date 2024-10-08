<!-- ItemBadge.vue -->
<template>
  <div
    class="item-badge relative"
    :style="{ width: size + 'px', height: size + 'px' }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <svg
      :width="size"
      :height="size"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="'0 0 ' + size + ' ' + size"
    >
      <defs>
        <linearGradient
          :id="'item-gradient-' + gradientId + '-' + uniqueId"
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop
            offset="0%"
            :style="{ stopColor: gradientTopColor, stopOpacity: 1 }"
          />
          <stop
            offset="50%"
            :style="{ stopColor: gradientMidColor, stopOpacity: 1 }"
          />
          <stop
            offset="100%"
            :style="{ stopColor: gradientBottomColor, stopOpacity: 1 }"
          />
        </linearGradient>

        <!-- Clip Path -->
        <clipPath :id="'clip-item-' + uniqueId">
          <polygon :points="calculateClipPathPoints(size)"></polygon>
        </clipPath>
      </defs>

      <!-- Äußeres Polygon -->
      <polygon
        :points="calculateOuterPolygonPoints(size)"
        :fill="'url(#item-gradient-' + gradientId + '-' + uniqueId + ')'"
        stroke="black"
        stroke-width="1"
      />

      <!-- Inneres Polygon -->
      <polygon
        :points="calculateInnerPolygonPoints(size)"
        fill="none"
        stroke="black"
        stroke-width="1"
      />

      <!-- Image mit Clip-Path und dynamischer Größe -->
      <image
        :href="imageUrl"
        :x="imagePositionX"
        :y="imagePositionY"
        :width="innerSize"
        :height="innerSize"
        :style="'clip-path: url(#clip-item-' + uniqueId + ');'"
      />
    </svg>

    <div
      v-if="isDisabled"
      class="absolute inset-0"
      :style="
        'will-change: transform; background: var(--disabled); clip-path: url(#clip-item-' +
        uniqueId +
        ')'
      "
    ></div>

    <div
      class="glassy-overlay absolute inset-0"
      :style="{
        'clip-path': 'url(#clip-item-' + uniqueId + ')',
        'box-shadow': currentShadowStyle,
      }"
    ></div>
  </div>
</template>

<script setup>
import { nanoid } from "nanoid";
import { computed, ref, onMounted } from "vue";

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  gradientTopColor: {
    type: String,
    default: "#ffcc00",
  },
  gradientMidColor: {
    type: String,
    default: "#ff6600",
  },
  gradientBottomColor: {
    type: String,
    default: "#cc3300",
  },
  gradientId: {
    type: [String, Number],
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 80,
  },
  overlayScale: {
    type: Number,
    default: 1,
  },
});

const uniqueId = ref("");
const isActive = ref(false);
const isHover = ref(false);

onMounted(() => {
  uniqueId.value = nanoid();
});

const innerSize = computed(() => props.size * 0.875);
const imagePositionX = computed(() => (props.size - innerSize.value) / 2);
const imagePositionY = computed(() => (props.size - innerSize.value) / 2);

// Dynamisches Box-Shadow Styling für :hover und :active
const hoverShadowStyle = computed(() => {
  const scale = props.overlayScale;
  return `inset 0 0 ${5 * scale}px ${3 * scale}px rgba(135, 206, 250, 0.5),
          inset 0 0 ${8 * scale}px ${4 * scale}px rgba(173, 216, 230, 0.2)`;
});

const activeShadowStyle = computed(() => {
  const scale = props.overlayScale;
  return `inset 0 0 ${6 * scale}px ${4 * scale}px rgba(135, 206, 250, 0.6),
          inset 0 0 ${10 * scale}px ${5 * scale}px rgba(173, 216, 230, 0.4)`;
});

// Aktueller Schattenstil basierend auf hover oder active Zustand
const currentShadowStyle = computed(() => {
  if (isActive.value) {
    return activeShadowStyle.value;
  } else if (isHover.value) {
    return hoverShadowStyle.value;
  }
  return "none";
});

// Event-Handler für Hover und Active Zustände
function onMouseEnter() {
  isHover.value = true;
}

function onMouseLeave() {
  isHover.value = false;
  isActive.value = false;
}

function onMouseDown() {
  isActive.value = true;
}

function onMouseUp() {
  isActive.value = false;
}

// Berechne die Punkte für die inneren und äußeren Polygone sowie den Clip Path
function calculateInnerPolygonPoints(size) {
  const scale = size / 80;
  return [
    7.965 * scale + "," + 4.5 * scale,
    72.035 * scale + "," + 4.5 * scale,
    75.5 * scale + "," + 7.965 * scale,
    75.5 * scale + "," + 72.035 * scale,
    72.035 * scale + "," + 75.5 * scale,
    7.965 * scale + "," + 75.5 * scale,
    4.5 * scale + "," + 72.035 * scale,
    4.5 * scale + "," + 7.965 * scale,
  ].join(" ");
}

function calculateClipPathPoints(size) {
  const scale = size / 80;
  return [
    8.18 * scale + "," + 5 * scale,
    71.82 * scale + "," + 5 * scale,
    75 * scale + "," + 8.18 * scale,
    75 * scale + "," + 71.82 * scale,
    71.82 * scale + "," + 75 * scale,
    8.18 * scale + "," + 75 * scale,
    5 * scale + "," + 71.82 * scale,
    5 * scale + "," + 8.18 * scale,
  ].join(" ");
}

function calculateOuterPolygonPoints(size) {
  const scale = size / 80;
  return [
    6.25 * scale + "," + 1 * scale,
    73.75 * scale + "," + 1 * scale,
    79 * scale + "," + 6.25 * scale,
    79 * scale + "," + 73.75 * scale,
    73.75 * scale + "," + 79 * scale,
    6.25 * scale + "," + 79 * scale,
    1 * scale + "," + 73.75 * scale,
    1 * scale + "," + 6.25 * scale,
  ].join(" ");
}
</script>

<style scoped></style>
