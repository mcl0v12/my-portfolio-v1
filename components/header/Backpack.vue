<!-- /components/main/Backpack.vue -->
<template>
  <div
    :ref="animationRef"
    data-animation="enter"
    class="fade-item relative w-10 xl:w-12 cursor-pointer"
    @click="backpackStore.toggleBackpack"
  >
    <img
      src="/img/backpack.png"
      alt="Backpack"
      draggable="false"
      class="rounded-full"
    />
    <div
      class="text-sm font-default text-white text-shadow absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"
    >
      ({{ backpackStore.freeSlots }})
    </div>
  </div>
</template>

<script setup>
import { useBackpackStore } from "~/store/backpack.ts";

import { animationObserver } from "~/composables/useIntersectionObserver";

const intersectionItem = ref([]);

const animationRef = (el) => {
  if (el) intersectionItem.value.push(el);
};

animationObserver([intersectionItem]);

const backpackStore = useBackpackStore();
</script>

<style scoped></style>
