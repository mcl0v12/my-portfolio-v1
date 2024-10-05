<!-- ContactForm.vue -->
<template>
  <form @submit.prevent="submitForm" class="h-full flex flex-col px-5">
    <div class="flex-grow">
      <textarea
        v-model="form.additionalInfo"
        id="additional-info"
        rows="4"
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

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const form = ref({
  additionalInfo: "",
});

const hcaptchaRef = ref(null);
const isLoading = ref(false);
const formSubmitAttempted = ref(false);

const isFormValid = computed(() => {
  return (
    props.name && props.subject && props.email && form.value.additionalInfo
  );
});

watch(isFormValid, (newValue) => {
  mailStore.setFormValidity(newValue);
});

// Erweitere resetForm, um alle Felder zurückzusetzen
const resetForm = () => {
  form.value.additionalInfo = ""; // Nur interne Daten zurücksetzen
  formSubmitAttempted.value = false;
};

const sendFormData = async (recaptchaToken) => {
  console.log("Sending recaptchaToken to server:", recaptchaToken);

  const formData = {
    name: props.name,
    subject: props.subject,
    email: props.email,
    additionalInfo: form.value.additionalInfo,
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
  console.log("Generated recaptchaToken:", recaptchaToken);

  await sendFormData(recaptchaToken);
};

defineExpose({
  submitForm,
  resetForm,
});
</script>

<style scoped></style>
