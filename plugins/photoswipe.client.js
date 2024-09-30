// plugins/photoswipe.client.js
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('photoswipe', {
    PhotoSwipeLightbox,
    PhotoSwipe,
  });
});
