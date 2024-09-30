<!-- ~/components/header/MenuIcon.vue -->
<template>
  <div
    class="hr-lg:hidden fade-item"
    :ref="animationRef"
    data-animation="enter"
    @click="$emit('toggle')"
  >
      <div class="w-5 h-5 relative flex items-center py-3">
        <span
          :class="[
            'absolute w-full h-[2px] bg-theme-color rounded transition-transform duration-200 ease-in-out',
            isMenuOpen ? 'rotate-45' : '-translate-y-1',
          ]"
        ></span>
        <span
          :class="[
            'absolute w-full h-[2px] bg-theme-color rounded transition-transform duration-200 ease-in-out',
            isMenuOpen ? '-rotate-45' : 'translate-y-1',
          ]"
        ></span>
      </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";
import { animationObserver } from "~/composables/useIntersectionObserver";

const intersectionItem = ref([]);
const animationRef = (el) => {
  if (el) {
    intersectionItem.value.push(el);
  }
};
animationObserver([intersectionItem]);

const props = defineProps({
  isMenuOpen: Boolean,
});
</script>

<style scoped></style>
