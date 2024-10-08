// stores/handleMail.js
import { defineStore } from "pinia";
import { SoundManager } from "~/utils/soundManager";

const modalSounds = {
  open: new SoundManager(["/sounds/interface/iQuestLogOpen.ogg"]),
  close: new SoundManager(["/sounds/interface/iQuestLogClose.ogg"]),
  coinFlip: new SoundManager(["/sounds/interface/coinFlips.ogg"]), 
};

export const useHandleMailStore = defineStore("handleMail", {
  state: () => ({
    isModalOpen: false,
    isFormValid: false,
    emailSuccess: false,
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
  },
});
