<!-- Intro.vue -->

<template>
  <section
    id="hero-section"
    ref="heroSection"
    class="min-h-screen flex flex-center"
  >
    <div
      class="max-w-base w-full mx-auto flex flex-col items-start hr:flex-row hr:items-center"
    >
      <div
        class="w-full hr:w-1/2 px-base text-white text-left text-shadow leading-relaxed space-lg hr:mb-0"
      >
        <h1 class="heading-base mb-3 text-theme-color font-special font-normal">
          Hi, my name is
        </h1>
        <h2 class="heading-xl mb-3">Fabian.</h2>
        <h3 class="heading-lg mb-3 text-gray-40">
          I build things for the web.
        </h3>
        <p class="space-lg text-gray-40">
          I'm a software engineer focused on creating accessible, user-centered
          digital products at
          <a
            href="https://www.codieshub.com"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center text-theme-color ml-1 hover:underline"
          >
            <svg
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
            Codieshub </a
          >.
        </p>

        <ThemeButton :disabled="showQuests" @click="startInteraction" />
      </div>
      <IntroCharacter ref="introCharacter" />
    </div>
  </section>
  <QuestModal v-if="showQuests" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

import ThemeButton from "~/components/misc/ThemeButton.vue";
import IntroCharacter from "~/components/main/IntroCharacter.vue";
import QuestModal from "~/components/quest-elements/QuestModal.vue";
import { useQuestStore } from "~/store/handleInteraction.js";

const questStore = useQuestStore();
const showQuests = computed(() => questStore.showQuests);

const heroSection = ref(null);
const observer = ref(null);
const rootMargin = ref("0px");

const introCharacter = ref(null);

const startInteraction = () => {
  rootMargin.value = "-25%";

  if (introCharacter.value && introCharacter.value.startAnimation) {
    introCharacter.value.startAnimation();
  }
};

const closeQuestIfOutOfView = () => {
  // Überprüfe, ob das Quest-Log geöffnet ist, bevor closeInteraction aufgerufen wird
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
