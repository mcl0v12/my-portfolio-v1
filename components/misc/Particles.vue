<!-- /components/misc/Particles.vue -->

<template>
  <div class="w-[300px] h-[300px] md:w-[350px] md:h-[350px] relative">
    <div
      v-for="(imageSrc, index) in filteredImages"
      :key="index"
      :id="`skill-${index}`"
      class="absolute inset-0"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  selectedTech: { type: String, required: true },
});

const images = ref([
  { src: "/techs/graphql.png", name: "GraphQL" },
  { src: "/techs/javascript.png", name: "JavaScript" },
  { src: "/techs/nodejs.png", name: "Node.js" },
  { src: "/techs/shopify.png", name: "Shopify API" },
  { src: "/techs/typescript.png", name: "TypeScript" },
  { src: "/techs/vue.png", name: "Vue.js" },
]);

// Berechne die gefilterten Bilder basierend auf selectedTech
const filteredImages = computed(() => {
  return images.value
    .filter((image) => image.name === props.selectedTech)
    .map((image) => image.src);
});

const loadParticlesJS = () => {
  if (window.particlesJS) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const loadParticles = async () => {
  await loadParticlesJS();

  filteredImages.value.forEach((imageSrc, index) => {
    const particleConfig = {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 1000 } },
        shape: {
          type: "image",
          image: { src: imageSrc, width: 100, height: 100 },
        },
        opacity: { value: 0.5 },
        size: {
          value: 50,
          random: true,
        },
        move: { enable: true, speed: 7 },
        line_linked: { enable: false },
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true },
        },
        modes: {
          repulse: { distance: 150, duration: 5 },
        },
      },
      retina_detect: true,
    };

    window.particlesJS(`skill-${index}`, particleConfig);
  });
};

onMounted(() => {
  loadParticles();
});

watch(filteredImages, loadParticles);

onBeforeUnmount(() => {
  if (window.pJSDom && window.pJSDom.length) {
    window.pJSDom.forEach((particle) => {
      particle.pJS.fn.vendors.destroypJS();
    });
    window.pJSDom = [];
  }
});
</script>

<style scoped></style>
