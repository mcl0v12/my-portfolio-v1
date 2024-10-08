<!-- components/Background.vue -->

<template>
  <section
    id="background"
    style="transition-delay: 0ms"
    class="fly-item"
    :ref="animationRef"
    data-animation="enter-up"
  >
    <div
      class="max-w-6xl mx-auto px-base py-16 lg:py-32 text-shadow leading-relaxed"
    >
      <h2 class="numbered-heading heading-lg text-white mb-6">Background</h2>

      <div
        class="flex flex-col items-center lg:flex-row lg:justify-between lg:items-start text-gray-30"
      >
        <div class="lg:w-2/3 lg:mr-12">
          <p class="mb-6">
            Hello! My name is Fabian, and I enjoy creating things that live on
            the internet. My interest in web development began in 2013 when I
            started customizing my World of Warcraft UI with WeakAuras. That
            eventually led me to explore programming languages like Lua and XML.
          </p>

          <p class="mb-6">
            Since then, I've had the chance to work on all sorts of projects
            from
            <span class="text-theme-color">landing pages</span> to
            <span class="text-theme-color">web applications</span> and
            <span class="text-theme-color">headless e-commerce solutions</span>.
            My main focus currently is on building inclusive digital products
            that deliver great user experiences.
          </p>

          <p class="mb-6">Here are a few technologies I like working with:</p>
          <ul class="techs-list">
            <li
              v-for="tech in techs"
              :key="tech"
              @click="selectTech(tech)"
              :class="[
                'w-max relative flex items-center px-2 ml-6 transition-background-color ease duration-300 rounded-lg select-none cursor-pointer',
                { 'bg-theme-bg--light': selectedTech === tech },
              ]"
            >
              {{ tech }}
            </li>
          </ul>
        </div>

        <!-- Particles Component -->
        <div class="mt-12 lg:mt-0">
          <Particles :selectedTech="selectedTech" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import Particles from "~/components/misc/Particles.vue";
import { SoundManager } from "~/utils/soundManager";

import { animationObserver } from "~/composables/useIntersectionObserver";

const intersectionItems = ref([]);

const animationRef = (el) => {
  if (el) {
    intersectionItems.value.push(el);
  }
};

animationObserver([intersectionItems]);

const scrollButtonSound = new SoundManager(["/sounds/utils/uScrollButton.ogg"]);

const techs = [
  "Shopify API",
  "Vue.js",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "GraphQL",
];

const selectedTech = ref("Shopify API");

const selectTech = (tech) => {
  if (selectedTech.value !== tech) {
    selectedTech.value = tech;
    scrollButtonSound.playNextSound();
  }
};
</script>

<style scoped></style>
