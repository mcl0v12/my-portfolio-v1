<!-- Contact.vue -->
<template>
  <section id="mailbox" ref="contactSection">
    <div
      class="max-w-base mx-auto px-base py-16 lg:py-24 text-white text-shadow leading-relaxed"
    >
      <h2 class="numbered-heading heading-lg mb-6">Write me a letter</h2>

      <div class="mb-8">
        <img
          src="/gif/mailbox.gif"
          alt="Mailbox Animation"
          class="w-[300px] md:w-[400px] mx-auto mail-cursor"
          draggable="false"
          @click="openModal"
        />
      </div>

      <ContactModal v-if="openMail" />
    </div>
  </section>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import ContactModal from "~/components/main/contact-components/ContactModal.vue";

import { useHandleMailStore } from "~/store/handleMail.js";
import { useUiOverlayStore } from "~/store/uiOverlay";
import { useCurrencyStore } from "~/store/currency";

const mailStore = useHandleMailStore();
const uiOverlayStore = useUiOverlayStore();
const currencyStore = useCurrencyStore();

const openMail = computed(() => mailStore.isModalOpen);
const emailSuccess = computed(() => mailStore.emailSuccess);

const contactSection = ref(null);
const observer = ref(null);

const openModal = () => {
  mailStore.openModal();
};

watch(emailSuccess, (newValue) => {
  if (newValue) {
    mailStore.setEmailSuccess(false);
    mailStore.resetForm();
    uiOverlayStore.showMessage("Send successfully!", 3000, "notification");
    currencyStore.subtractCurrency(0, 0, 30);
  }
});

const closeModalIfOutOfView = () => {
  mailStore.closeModal();
};

const createObserver = () => {
  if (observer.value) {
    observer.value.disconnect();
  }

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          closeModalIfOutOfView();
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  if (contactSection.value) {
    observer.value.observe(contactSection.value);
  }
};

onMounted(() => {
  nextTick(() => {
    createObserver();
  });
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style></style>
