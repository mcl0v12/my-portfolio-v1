// stores/handleMail.js
import { defineStore } from 'pinia';

export const useHandleMailStore = defineStore('handleMail', {
  state: () => ({
    isModalOpen: false,
    isFormValid: false, 
    emailSuccess: false, 
  }),
  actions: {
    openModal() {
      this.isModalOpen = true; 
    },
    closeModal() {
      this.isModalOpen = false; 
    },
    setFormValidity(isValid) {
      this.isFormValid = isValid; 
    },
    setEmailSuccess(success) {
      this.emailSuccess = success; 
    },
  },
});
