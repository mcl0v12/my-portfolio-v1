<!-- components/index.vue -->

<template>
  <Intro />
  <main>
    <About />
    <Experience />
    <Work />
    <Contact />
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";

import Intro from "~/components/main/Intro.vue";
import About from "~/components/main/About.vue";
import Experience from "~/components/main/Experience.vue";
import Work from "~/components/main/Work.vue";
import Contact from "~/components/main/Contact.vue";

// import Particles from "~/components/useLater/particles.vue";
// import Slideshow from "@/components/slideshow.vue";

// import Character from '~/components/BlizzCharacter.vue';
// import CharacterStats from '~/components/characterStats.vue';
// import 3DModelViewer from "~/components/3DModelViewer.vue";

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
.typewriter {
  display: flex;
  width: max-content;
  position: relative;
}

.typewriter-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 0.12rem solid black;
  animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
}

.no-blink {
  border-right: none;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: black;
  }
}
</style>
