<!-- /components/MobileMenu.vue -->
<template>
  <div
    v-if="shouldRenderMenu"
    ref="menu"
    :style="{ height: menuHeight }"
    class="mobile-menu overflow-hidden mx-auto mt-6 rounded-md transition-height duration-300 ease-in-out"
  >
    <nav class="p-8 text-gray-30 text-sm text-shadow font-special">
      <ol class="flex flex-col space-y-4 mb-4">
        <li>
          <a
            @click="props.toggleMenu"
            href="#about"
            class="w-full inline-block bg-gray-100 rounded-lg p-2.5"
          >
            About
          </a>
        </li>
        <li>
          <a
            @click="props.toggleMenu"
            href="#experience"
            class="w-full inline-block bg-gray-100 rounded-lg p-2.5"
          >
            Experience
          </a>
        </li>
        <li>
          <a
            @click="props.toggleMenu"
            href="#work"
            class="w-full inline-block bg-gray-100 rounded-lg p-2.5"
          >
            Work
          </a>
        </li>
        <li>
          <a
            @click="props.toggleMenu"
            href="#contact"
            class="w-full inline-block bg-gray-100 rounded-lg p-2.5"
          >
            Contact
          </a>
        </li>
      </ol>

      <!-- Resume Button -->

      <a
        href="/resume.pdf"
        target="_blank"
        class="resume text-theme-color p-2.5 flex items-center"
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
    </nav>
  </div>
</template>

<script setup>
import { ref, nextTick, watchEffect, onUnmounted } from "vue";
import { useUiOverlayStore } from "~/store/uiOverlay.js"; // Importiere den UiOverlay Store
import { useOnUseItemEffectsStore } from "~/store/onUseItemEffects.js"; // Importiere den OnUseItemEffects Store
import { storeToRefs } from "pinia"; // Verwende Pinia's storeToRefs

const uiOverlayStore = useUiOverlayStore();
const onUseItemEffectsStore = useOnUseItemEffectsStore();
const { resumeKeyUsed } = storeToRefs(onUseItemEffectsStore);

const handleResumeClick = (event) => {
  if (!resumeKeyUsed.value) {
    event.preventDefault();
    // Zeige die Fehlermeldung über das UI-Overlay an
    uiOverlayStore.showMessage(
      "You need to use the Resume Key to unlock the resume.",
      3000,
      "error"
    );
  }
};

// Props definieren
const props = defineProps({
  isMenuOpen: Boolean,
  toggleMenu: Function,
});

const shouldRenderMenu = ref(false);
const menu = ref(null);
const menuHeight = ref("0px");

const openMenu = () => {
  shouldRenderMenu.value = true;
  nextTick(() => {
    menuHeight.value = `${menu.value.scrollHeight}px`;
  });
  if (typeof document !== "undefined") {
    document.body.classList.add("overflow-hidden");
  }
};

const closeMenu = () => {
  menuHeight.value = "0px";
  menu.value?.addEventListener("transitionend", handleTransitionEnd);
  if (typeof document !== "undefined") {
    document.body.classList.remove("overflow-hidden");
  }
};

const handleTransitionEnd = (event) => {
  if (event.propertyName === "height" && !props.isMenuOpen) {
    shouldRenderMenu.value = false;
    menuHeight.value = "0px";
  }
};

watchEffect(() => {
  if (props.isMenuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
});

onUnmounted(() => {
  if (typeof document !== "undefined") {
    document.body.classList.remove("overflow-hidden");
  }
});
</script>

<style scoped>
.mobile-menu {
  width: calc(100% - var(--padding-x) * 2);
  background-color: rgba(10, 30, 64, 0.95);
}
</style>
