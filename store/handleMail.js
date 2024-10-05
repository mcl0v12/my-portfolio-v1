// stores/handleMail.js
import { defineStore } from 'pinia';
import { SoundManager } from '~/utils/soundManager';

// Initialisiere SoundManager für Modal-Sounds
const modalSounds = {
  open: new SoundManager(['/sounds/interface/iQuestLogOpen.ogg']),
  close: new SoundManager(['/sounds/interface/iQuestLogClose.ogg']),
  coinFlip: new SoundManager(['/sounds/interface/coinFlips.ogg']), // Für das Senden der Mail
};

export const useHandleMailStore = defineStore('handleMail', {
  state: () => ({
    isModalOpen: false,
    isFormValid: false, 
    emailSuccess: false, 
  }),
  actions: {
    openModal() {
      this.isModalOpen = true; 
      modalSounds.open.playNextSound(); // Spiele den Sound für das Öffnen des Modals
    },
    closeModal() {
      this.isModalOpen = false;
      modalSounds.close.playNextSound(); // Spiele den Sound für das Schließen des Modals
    },
    setFormValidity(isValid) {
      this.isFormValid = isValid; 
    },
    setEmailSuccess(success) {
      this.emailSuccess = success; 
    },
    sendMail() {
      modalSounds.coinFlip.playNextSound(); // Spiele den Coinflip-Sound ab
    },
  },
});
