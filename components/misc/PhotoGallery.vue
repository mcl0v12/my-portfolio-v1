<!-- PhotoGallery.vue -->

<template>
  <div :id="galleryID">
    <a
      :href="images[0].src"
      :data-pswp-width="images[0].w"
      :data-pswp-height="images[0].h"
      target="_blank"
      rel="noreferrer"
    >
      <img
        :src="images[0].src"
        :alt="images[0].alt"
        class="cursor-pointer w-full object-cover rounded-lg shadow-lg mb-4"
        loading="lazy"
      />
    </a>

    <div class="flex gap-2">
      <a
        v-for="(image, index) in images.slice(1)" 
        :key="index" 
        :href="image.src"
        :data-pswp-width="image.w"
        :data-pswp-height="image.h"
        target="_blank"
        rel="noreferrer"
        class="max-w-lg"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          class="cursor-pointer object-cover rounded-lg shadow-lg"
          loading="lazy"
        />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

const props = defineProps({
  images: {
    type: Array,
    required: true,
  }
});

const galleryID = ref('photoswipe-gallery');
let lightbox = null;

onMounted(() => {
    lightbox = new PhotoSwipeLightbox({
    gallery: `#${galleryID.value}`,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    showHideOpacity: true,
    zoom: true,
    maxZoomLevel: 3,
    clickToCloseNonZoomable: false,
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
    wheelToZoom: true,
  });

  lightbox.init();
});

onUnmounted(() => {
  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }
});
</script>

<style scoped>
</style>
