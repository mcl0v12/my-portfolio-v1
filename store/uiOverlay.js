// /store/uiOverlay.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUiOverlayStore = defineStore("uiOverlay", () => {
  const messages = ref([]);

  const showMessage = (msg, duration = 3000, type = "error") => {
    const message = { type, text: msg };
    messages.value.push(message);

    setTimeout(() => {
      messages.value.shift();
    }, duration);

    if (messages.value.length > 3) {
      messages.value.shift();
    }
  };

  return {
    messages,
    showMessage,
  };
});
