<!-- ContactForm.vue -->
<template>
  <form @submit.prevent="submitForm" class="h-full flex flex-col px-5">
    <div class="flex-grow">
      <textarea
        v-model="mailStore.additionalInfo"
        id="additional-info"
        rows="4"
        placeholder="Write your message here"
      ></textarea>
    </div>

    <VueHcaptcha
      ref="hcaptchaRef"
      sitekey="625cb96c-3b76-477c-aa38-b76440e865dc"
      size="invisible"
      @verify="onVerify"
    />
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha";
import { useHandleMailStore } from "~/store/handleMail.js";

const mailStore = useHandleMailStore();

const hcaptchaRef = ref(null);
const isLoading = ref(false);
const formSubmitAttempted = ref(false);

// Berechne die Gültigkeit des Formulars basierend auf dem Store
const isFormValid = computed(() => {
  return (
    mailStore.name &&
    mailStore.subject &&
    mailStore.email &&
    mailStore.additionalInfo
  );
});

// Überwache die Gültigkeit des Formulars und aktualisiere sie im Store
watch(isFormValid, (newValue) => {
  mailStore.setFormValidity(newValue);
});

const sendFormData = async (recaptchaToken) => {
  const formData = {
    name: mailStore.name,
    subject: mailStore.subject,
    email: mailStore.email,
    additionalInfo: mailStore.additionalInfo,
    recaptchaToken: recaptchaToken,
  };

  try {
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? "/api/send-email"
        : "http://localhost:4000/send-email";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      mailStore.setEmailSuccess(true);
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Send mail error:", error);
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  formSubmitAttempted.value = true;

  if (!isFormValid.value) {
    return;
  }

  try {
    isLoading.value = true;
    hcaptchaRef.value.execute();
  } catch (error) {
    console.error("hCaptcha execution failed", error);
    isLoading.value = false;
  }
};

const onVerify = async (recaptchaToken) => {
  await sendFormData(recaptchaToken);
};

defineExpose({
  submitForm,
});
</script>

<style scoped></style>
