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

const emit = defineEmits(["sendMail"]);

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

<style scoped></style>
