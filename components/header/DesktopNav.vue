<!-- /components/header/DesktopNav.vue  -->
<template>
  <nav
    id="navbar"
    class="hidden relative text-gray-30 text-sm text-shadow font-special hr-lg:flex hr-lg:items-center hr-lg:justify-center"
    tabindex="-1"
  >
    <ol class="flex gap-4 z-[2]" @mouseleave="resetBackground">
      <li
        v-for="(link, index) in links"
        :key="link.href"
        :style="{ transitionDelay: `${index * 100}ms` }"
        class="fly-item"
        :ref="animationRef"
        data-animation="enter-down"
        @mouseover="moveBackground($event)"
      >
        <a
          :href="link.href"
          class="flex p-2.5 hover:text-theme-color transition-color duration-300 ease"
        >
          {{ link.text }}
        </a>
      </li>
    </ol>

    <div
      style="transition-delay: 400ms"
      class="fly-item z-[2]"
      :ref="animationRef"
      data-animation="enter-down"
    >
      <a
        :href="resumeHref"
        target="_blank"
        class="resume text-theme-color ml-4 p-2.5 flex items-center hover:underline z-[2]"
        @click.prevent="handleResumeClick"
      >
        <!-- SVG wechseln basierend auf resumeKeyUsed -->
        <svg
          v-if="!resumeKeyUsed"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          class="mr-1.5"
          fill="none"
        >
          <!-- Standard-SVG -->
          <path
            d="M13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V14Z"
            fill="currentColor"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7 8.12037C5.3161 8.53217 4 9.95979 4 11.7692V17.3077C4 19.973 6.31545 22 9 22H15C17.6846 22 20 19.973 20 17.3077V11.7692C20 9.95979 18.6839 8.53217 17 8.12037V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V8.12037ZM15 7V8H9V7C9 6.64936 9.06015 6.31278 9.17071 6C9.58254 4.83481 10.6938 4 12 4C13.3062 4 14.4175 4.83481 14.8293 6C14.9398 6.31278 15 6.64936 15 7ZM6 11.7692C6 10.866 6.81856 10 8 10H16C17.1814 10 18 10.866 18 11.7692V17.3077C18 18.7208 16.7337 20 15 20H9C7.26627 20 6 18.7208 6 17.3077V11.7692Z"
            fill="currentColor"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mr-1.5"
        >
          <!-- Alternativ-SVG -->
          <path d="M7 7h10v10"></path>
          <path d="M7 17 17 7"></path>
        </svg>

        Resume
      </a>
    </div>

    <div
      ref="navbarBg"
      class="absolute inset-0 bg-gray-100 rounded-lg opacity-0"
    ></div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { animationObserver } from "~/composables/useIntersectionObserver";
import { useOnUseItemEffectsStore } from "~/store/onUseItemEffects.js";
import { useUiOverlayStore } from '~/store/uiOverlay.js';
import { storeToRefs } from "pinia";

let isFirstHover = true;
const navbarBg = ref(null);
const intersectionItems = ref([]);

// Links für die Navigation
const links = [
  { href: "#about", text: "About" },
  { href: "#experience", text: "Experience" },
  { href: "#work", text: "Work" },
  { href: "#contact", text: "Contact" },
];

// Zugriff auf den UiOverlay Store
const uiOverlayStore = useUiOverlayStore();

const onUseItemEffectsStore = useOnUseItemEffectsStore();
const { resumeKeyUsed } = storeToRefs(onUseItemEffectsStore);


// Berechne die href basierend auf dem Zustand
const resumeHref = computed(() => {
  return resumeKeyUsed.value ? "/resume.pdf" : "#";
});

// Klick-Handler für den Resume-Link
const handleResumeClick = (event) => {
  if (!resumeKeyUsed.value) {
    event.preventDefault();

    // Zeige die Fehlermeldung über das UI-Overlay an
    uiOverlayStore.showMessage('You need to use the Resume Key to unlock the resume.', 3000, 'error');
  }
};

// moveBackground Funktion auskommentiert
const moveBackground = (event) => {
  const linkRect = event.currentTarget.getBoundingClientRect();
  const navRect = event.currentTarget.closest("nav").getBoundingClientRect();

  const translateX = linkRect.left - navRect.left;
  const linkHeight = linkRect.height; // Höhe des <a>-Elements

  requestAnimationFrame(() => {
    navbarBg.value.style.width = `${linkRect.width}px`;
    navbarBg.value.style.height = `${linkHeight}px`;
    navbarBg.value.style.transform = `translate3D(${translateX}px, ${
      linkRect.top - navRect.top
    }px, 0)`;
  });

  if (isFirstHover) {
    navbarBg.value.classList.add("initial-hover", "opacity-100");
    navbarBg.value.classList.remove("switch-hover", "opacity-0");
    isFirstHover = false;
  } else {
    navbarBg.value.classList.add("switch-hover", "opacity-100");
    navbarBg.value.classList.remove("initial-hover", "opacity-0");
  }
};

// resetBackground Funktion auskommentiert
const resetBackground = () => {
  navbarBg.value.classList.add("opacity-0");
  navbarBg.value.classList.remove("opacity-100");
  isFirstHover = true;
};

// Funktion zum Hinzufügen von Elementen zum menuItems-Array
const animationRef = (el) => {
  if (el) {
    intersectionItems.value.push(el);
  }
};

animationObserver([intersectionItems], { threshold: 0.1 }, null);
</script>

<style scoped>
.initial-hover {
  transition: opacity 200ms ease;
}

.switch-hover {
  transition: width 300ms ease, transform 300ms ease;
}
</style>
