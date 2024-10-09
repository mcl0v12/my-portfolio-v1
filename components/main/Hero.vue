<!-- Intro.vue -->

<template>
  <section
    id="hero-section"
    ref="heroSection"
    class="min-h-screen flex flex-center"
  >
    <div
      class="max-w-base w-full px-base mx-auto flex flex-col hr:flex-row hr:items-center"
    >
      <div
        class="w-full hr:w-1/2 flex flex-col items-start space-lg hr:mb-0 lg:mr-20"
      >
        <div
          class="text-white text-left text-shadow leading-relaxed space-y-3 space-lg"
        >
          <div
            style="transition-delay: 900ms"
            class="fly-item"
            :ref="animationRef"
            data-animation="enter-up"
          >
            <h1 class="heading-base text-theme-color font-normal">
              My name is
            </h1>
          </div>

          <div
            style="transition-delay: 1000ms"
            class="fly-item"
            :ref="animationRef"
            data-animation="enter-up"
          >
            <h2 class="heading-xl">Fabian.</h2>
          </div>

          <div
            style="transition-delay: 1100ms"
            class="fly-item"
            :ref="animationRef"
            data-animation="enter-up"
          >
            <p class="text-gray-40">
              A versatile developer who specializes in creating standout digital
              experiences that are built to work for everyone.
              <!--   <a
              href="https://www.codieshub.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-theme-color ml-1 hover:underline"
            >   <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="none"
                class="mr-1.5 drop-shadow"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M 1.3333333,1.3333333 H 14.666667 V 14.666667" />
                <path d="M 1.3333333,14.666667 14.666667,1.3333333" />
              </svg>
              Codieshub </a>.-->
            </p>
          </div>
        </div>

        <ThemeButton
          :disabled="showQuests"
          buttonText="Talk to Me"
          :height="35"
          :lg-height="50"
          :buttonTextSize="16"
          :lg-buttonTextSize="18"
          @click="startInteraction"
          :transition="{
            ref: animationRef,
            'data-animation': 'enter-up',
            class: 'fly-item',
            style: 'transition-delay: 1200ms;',
          }"
        />
      </div>
      <Me ref="fabian" />
    </div>
  </section>
  <CharacterModal v-if="showQuests" characterId="fabian" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

import ThemeButton from "~/components/misc/ThemeButton.vue";
import Me from "~/components/characters/Me/Me.vue";
import CharacterModal from "~/components/main/character-components/CharacterModal.vue";
import { useQuestStore } from "~/store/handleInteraction.js";

import { animationObserver } from "~/composables/useIntersectionObserver";

const questStore = useQuestStore();
const showQuests = computed(() => questStore.showQuests);

const heroSection = ref(null);
const observer = ref(null);
const rootMargin = ref("0px");

const intersectionItems = ref([]);

const animationRef = (el) => {
  if (el) {
    intersectionItems.value.push(el);
  }
};

animationObserver([intersectionItems]);

const fabian = ref(null);

const startInteraction = () => {
  rootMargin.value = "-25%";

  if (fabian.value && fabian.value.startAnimation) {
    fabian.value.startAnimation();
  }
};

const closeQuestIfOutOfView = () => {
  if (showQuests.value) {
    questStore.closeInteraction();
  }
};

const createObserver = () => {
  if (observer.value) {
    observer.value.disconnect();
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          closeQuestIfOutOfView();
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: rootMargin.value,
    }
  );

  if (heroSection.value) {
    observer.value.observe(heroSection.value);
  }
};

watch(rootMargin, () => {
  if (observer.value && heroSection.value) {
    observer.value.disconnect();
    createObserver();
  }
});

onMounted(() => {
  createObserver();
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style scoped></style>
