<!-- SendMailButtons.vue -->
<template>
      <ThemeButton
        :height="30"
        buttonText="Send"
        :disabled="!mailStore.isFormValid"
        :buttonTextSize="14"
        @click="sendMail"
      />
</template>

<script setup>
import { onMounted, onBeforeUnmount, defineEmits } from "vue";
import ThemeButton from "~/components/misc/ThemeButton.vue";

import { useHandleMailStore } from "~/store/handleMail.js";

const emit = defineEmits(["sendMail"]);

const mailStore = useHandleMailStore();


const cancelMail = () => {
  mailStore.closeModal();
};

const sendMail = () => {
  emit("sendMail");
};

const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    cancelMail();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
</style>
