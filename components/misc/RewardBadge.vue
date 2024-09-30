<!-- RewardBadge.vue -->

<template>
  <div class="reward-badge">
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" class="w-full">
      <defs>
        <linearGradient
          :id="'reward-gradient-' + gradientId + '-' + uniqueId"
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
        <clipPath :id="'clip-reward-' + uniqueId">
          <polygon
            points="5.586,0.5 54.414,0.5 59.5,5.586 59.5,54.414 54.414,59.5 5.586,59.5 0.5,54.414 0.5,5.586"
          />
        </clipPath>
      </defs>

      <polygon
        points="6.145,0.55 59.855,0.55 65.45,6.145 65.45,59.855 59.855,65.45 6.145,65.45 0.55,59.855 0.55,6.145"
        :fill="'url(#reward-gradient-' + gradientId + '-' + uniqueId + ')'"
        stroke="black"
        stroke-width="1"
      />

      <g transform="translate(3, 3)">
        <image
          :href="imageUrl"
          x="0"
          y="0"
          width="60"
          height="60"
          :clip-path="'url(#clip-reward-' + uniqueId + ')'"
        />
        <polygon
          points="5.586,0.5 54.414,0.5 59.5,5.586 59.5,54.414 54.414,59.5 5.586,59.5 0.5,54.414 0.5,5.586"
          fill="none"
          stroke="black"
          stroke-width="1"
        />
      </g>
    </svg>
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
});

const viewBox = "0 0 66 66";
const uniqueId = nanoid();
</script>

<style scoped>
.reward-badge {
  width: 100%;
  max-width: 66px;
  margin-right: 0.125rem;
}
</style>
