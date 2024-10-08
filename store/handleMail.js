// stores/handleMail.js
import { defineStore } from "pinia";
import { SoundManager } from "~/utils/soundManager";

const modalSounds = {
  open: new SoundManager(["/sounds/interface/iQuestLogOpen.ogg"]),
  close: new SoundManager(["/sounds/interface/iQuestLogClose.ogg"]),
  coinFlip: new SoundManager(["/sounds/utils/coinFlips.ogg"]), 
};

export const useHandleMailStore = defineStore("handleMail", {
  state: () => ({
    isModalOpen: false,
    isFormValid: false,
    emailSuccess: false,
    name: "",
    subject: "",
    email: "",
    additionalInfo: "", 
  }),
  actions: {
    openModal() {
      this.isModalOpen = true;
      modalSounds.open.playNextSound(); 
    },
    closeModal() {
      if (this.isModalOpen) {
        this.isModalOpen = false;
        this.isFormValid = false;
        modalSounds.close.playNextSound(); 
      }
    },
    setFormValidity(isValid) {
      this.isFormValid = isValid;
    },
    setEmailSuccess(success) {
      this.emailSuccess = success;
    },
    sendMail() {
      modalSounds.coinFlip.playNextSound(); 
    },
    // Setter für die Form-Felder
    setName(name) {
      this.name = name;
    },
    setSubject(subject) {
      this.subject = subject;
    },
    setEmail(email) {
      this.email = email;
    },
    setAdditionalInfo(info) {
      this.additionalInfo = info;
    },
    resetForm() {
      this.name = "";
      this.subject = "";
      this.email = "";
      this.additionalInfo = "";
      this.isFormValid = false;
    },
  },
});
