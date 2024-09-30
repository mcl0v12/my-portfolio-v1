<!-- /layouts/header-nav.vue -->

<template>
  <header :class="headerClass" class="fixed w-full z-header">
    <div
      class="max-w-base h-full px-base mx-auto flex justify-between items-center"
    >
      <div class="flex items-center space-x-10">
        <Logo />
        <MenuIcon :isMenuOpen="isMenuOpen" @toggle="toggleMenu" />
      </div>

      <DesktopNav />

      <Backpack />
    </div>

    <MobileMenu :isMenuOpen="isMenuOpen" :toggleMenu="toggleMenu" />

    <div
      class="w-full h-full fixed inset-0 transition-background-color duration-300 ease-in-out bg-overlay z-[-1]"
      :class="{
        'visible opacity-100': isMenuOpen,
        'invisible opacity-0': !isMenuOpen,
      }"
    ></div>
  </header>
</template>

<script setup>
import Logo from "~/components/header/Logo.vue";
import DesktopNav from "~/components/header/DesktopNav.vue";

import MenuIcon from "~/components/header/MenuIcon.vue";
import MobileMenu from "~/components/header/MobileMenu.vue";

import Backpack from "~/components/main/Backpack.vue";

import { useQuestStore } from "~/store/handleInteraction.js";

import { ref, onMounted, onUnmounted, computed } from "vue";

const questStore = useQuestStore();
const showQuests = computed(() => questStore.showQuests);

const isMenuOpen = ref(false);

const headerClass = computed(() => {
  if (isMenuOpen.value) return "start";
  if (showQuests.value) return "out";
  if (isAtTop.value) return "start";
  return isScrollingDown.value ? "out" : "in";
});

const isAtTop = ref(true);
const isScrollingDown = ref(false);
let lastScrollPosition = 0;

const handleScroll = () => {
  if (isMenuOpen.value) return;

  requestAnimationFrame(() => {
    const currentScrollPosition = window.scrollY;
    isScrollingDown.value = currentScrollPosition > lastScrollPosition;
    isAtTop.value = currentScrollPosition === 0;
    lastScrollPosition = currentScrollPosition;
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped></style>
