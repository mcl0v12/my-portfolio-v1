<!-- UiOverlay.vue -->
<template>
  <transition-group
    class="w-full max-w-lg px-base fixed top-[15%] left-1/2 -translate-x-1/2 text-center z-[1000]"
    tag="div"
    leave-active-class="transition-opacity ease duration-500"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-for="(message, index) in uiOverlayStore.messages" :key="index">
      <!-- Level-Up-Messages und Error-Messages -->
      <template v-if="message.type === 'level-up'">
        <div
          class="objectives-header relative p-[2px] text-theme-color text-shadow"
        >
          <div
            class="w-full flex flex-center flex-col p-2 bg-gradient-shadow-top"
          >
            <p class="text-white-color text-sm">{{ message.text.title }}</p>
            <p class="text-theme-color text-3xl">{{ message.text.content }}</p>
          </div>
        </div>
      </template>
      <template v-if="message.type === 'notification'">
        <!-- Standard Error-Messages -->
        <p class="text-shadow text-theme-color mt-2 select-none">
          {{ message.text }}
        </p>
      </template>
      <template v-else>
        <!-- Standard Error-Messages -->
        <p class="text-shadow text-notice-color mt-2 select-none">
          {{ message.text }}
        </p>
      </template>
    </div>
  </transition-group>
</template>

<script setup>
import { useUiOverlayStore } from "~/store/uiOverlay";

const uiOverlayStore = useUiOverlayStore();
</script>

<style scoped></style>
