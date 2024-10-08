<!-- ModalImage.vue -->
<template>
  <div :class="wrapperClass">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#dddddd" stop-opacity="1" />
          <stop offset="50%" stop-color="#777777" stop-opacity="1" />
          <stop offset="100%" stop-color="#444444" stop-opacity="1" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#8c6600;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#ccac00;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffd700;stop-opacity:1" />
        </linearGradient>

        <pattern :id="patternId" patternUnits="userSpaceOnUse" width="100" height="100">
          <image 
            :href="imageSrc" 
            x="0" 
            y="0" 
            width="100" 
            height="100" 
          />
        </pattern>
      </defs>

      <circle cx="50" cy="50" r="49" fill="url(#metalGradient)" stroke="black" stroke-width="1" />
      <circle cx="50" cy="50" r="46" stroke="black" stroke-width="1" fill="url(#goldGradient)" />
      <circle :fill="`url(#${patternId})`" cx="50" cy="50" r="43" stroke="black" stroke-width="1" />
    </svg>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  wrapperClass: {
    type: String,
        default: 'null'
  },
  patternId: {
    type: String,
    default: 'null'
  }
});
</script>

<style scoped></style>
