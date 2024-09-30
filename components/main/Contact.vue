<!-- Contact.vue -->
<template>
  <section id="contact" ref="contactSection">
    <div
      class="max-w-base mx-auto px-base py-16 lg:py-24 text-white text-shadow leading-relaxed"
    >
      <h2 class="numbered-heading heading-lg mb-6">Write me a letter</h2>

      <div class="flex justify-center mb-8">
        <img
          src="/gif/mailbox.gif"
          alt="Mailbox Animation"
          class="max-w-sm mail-cursor"
          draggable="false"
          @click="openModal"
        />
      </div>

      <ContactModal v-if="openMail" />

      <SuccessPopup :show="emailSuccess" @close="handlePopupClose" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import ContactModal from "~/components/main/contact-components/ContactModal.vue";
import SuccessPopup from "~/components/main/contact-components/SuccessPopup.vue";

import { useHandleMailStore } from "~/store/handleMail.js";

const mailStore = useHandleMailStore();
const openMail = computed(() => mailStore.isModalOpen);
const emailSuccess = computed(() => mailStore.emailSuccess);

const contactSection = ref(null);
const observer = ref(null);

const openModal = () => {
  mailStore.openModal();
};

const handlePopupClose = () => {
  mailStore.setEmailSuccess(false);
  if (contactFormRef.value && contactFormRef.value.resetForm) {
    contactFormRef.value.resetForm();
  }
};

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
