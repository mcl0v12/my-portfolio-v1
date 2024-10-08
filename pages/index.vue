<!-- components/index.vue -->

<template>
  <Intro />
  <main>
    <Background />
    <Achievments />
    <Work />
    <Contact />
  </main>
</template>

<script setup>
import { useHead } from '@vueuse/head'; // Verwende useHead, um body-Klassen zu setzen
import { ref, onMounted } from "vue";

import Intro from "~/components/main/Hero.vue";
import Background from "~/components/main/Background.vue";
import Achievments from "~/components/main/Achievments.vue";
import Work from "~/components/main/Work.vue";
import Contact from "~/components/main/Contact.vue";

// Setze die Klasse "overflow-hidden" standardmäßig beim Laden der Seite
useHead({
  bodyAttrs: {
    class: 'overflow-hidden' // Setze die Klasse, um Scrollen zu verhindern
  }
});

const textVisible = ref(false);
const blinkCaret = ref(true);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          textVisible.value = true;

          setTimeout(() => {
            blinkCaret.value = false;
          }, 6000);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  const section = document.querySelector(".observe");
  if (section) {
    observer.observe(section);
  }
});
</script>

<style scoped>
</style>
