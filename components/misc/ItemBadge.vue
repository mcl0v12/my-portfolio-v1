<!-- ItemBadge.vue -->

<template>
  <div class="relative" style="width: 50px; height: 50px">
    <svg
      width="50"
      height="50"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
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

        <clipPath :id="'clip-item-' + uniqueId">
          <polygon
            points="4.015,2.5 42.985,2.5 44.5,4.015 44.5,42.985 42.985,44.5 4.015,44.5 2.5,42.985 2.5,4.015"
          />
        </clipPath>
      </defs>

      <polygon
        points="4,1 46,1 49,4 49,46 46,49 4,49 1,46 1,4"
        :fill="'url(#item-gradient-' + gradientId + '-' + uniqueId + ')'"
        stroke="black"
        stroke-width="1"
      />
    </svg>

    <div
      class="inner-layer absolute top-0"
      style="transform: translate(1.5px, 1.5px); width: 48px; height: 48px"
    >
      <svg
        width="48"
        height="48"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <!-- Inneres Polygon -->
        <polygon
          points="3.8,2 43.2,2 45,3.8 45,43.2 43.2,45 3.8,45 2,43.2 2,3.8"
          fill="none"
          stroke="black"
          stroke-width="1"
        />

        <image
          :href="imageUrl"
          x="0"
          y="0"
          width="48"
          height="48"
          :style="'clip-path: url(#clip-item-' + uniqueId + ')'"
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
        class="glassy-overlay absolute inset-0 opacity-0"
        :style="'clip-path: url(#clip-item-' + uniqueId + ')'"
      />
    </div>
  </div>
</template>

<script setup>
import { nanoid } from "nanoid";

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
});

const uniqueId = nanoid();
</script>

<style scoped>
.inner-layer:hover .glassy-overlay,
.loot-item:hover .glassy-overlay {
  opacity: 1;
  box-shadow: inset 0 0 5px 3px rgba(135, 206, 250, 0.5),
    inset 0 0 8px 4px rgba(173, 216, 230, 0.2);
}

.inner-layer:active .glassy-overlay,
.loot-item:active .glassy-overlay {
  box-shadow: inset 0 0 6px 4px rgba(135, 206, 250, 0.6),
    inset 0 0 10px 5px rgba(173, 216, 230, 0.4);
}
</style>
