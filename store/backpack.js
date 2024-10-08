// /store/backpack.js
import { defineStore } from "pinia";
import { SoundManager } from "~/utils/soundManager";

// SoundManager für Backpack-Sounds initialisieren
const backpackSounds = {
  open: new SoundManager(['/sounds/interface/iBackpackOpen.ogg']),
  close: new SoundManager(['/sounds/interface/iBackpackClose.ogg']),
  coinFlip: new SoundManager(['/sounds/utils/coinFlips.ogg']), // Neuer CoinFlip Sound
};

export const useBackpackStore = defineStore("backpack", {
  state: () => ({
    isBackpackOpen: false,
    items: Array(16).fill({ id: null }), // 16 leere Slots
  }),

  actions: {
    openBackpack() {
      this.isBackpackOpen = true;
      backpackSounds.open.playNextSound(); // Sound abspielen wenn geöffnet
    },

    closeBackpack() {
      this.isBackpackOpen = false;
      backpackSounds.close.playNextSound(); // Sound abspielen wenn geschlossen
    },

    toggleBackpack() {
      this.isBackpackOpen = !this.isBackpackOpen;
      if (this.isBackpackOpen) {
        backpackSounds.open.playNextSound(); // Sound abspielen wenn geöffnet
      } else {
        backpackSounds.close.playNextSound(); // Sound abspielen wenn geschlossen
      }
    },

    addItemToBackpack(item) {
      const emptySlotIndex = this.items.findIndex((slot) => slot.id === null);

      if (emptySlotIndex !== -1) {
        this.items[emptySlotIndex] = item;
      } else {
        this.items.push(item);
      }

      this.saveBackpackItems();
      backpackSounds.coinFlip.playNextSound(); // Sound abspielen wenn ein Item hinzugefügt wird
    },

    replaceItemWithEmpty(index) {
      this.items.splice(index, 1, { id: null });
      this.saveBackpackItems();
      backpackSounds.coinFlip.playNextSound();
    },

    loadBackpackItems() {
      const savedItems = JSON.parse(localStorage.getItem("backpackItems"));
      if (savedItems) {
        this.items = savedItems;
      }
    },

    saveBackpackItems() {
      localStorage.setItem("backpackItems", JSON.stringify(this.items));
    },

    clearBackpackStorage() {
      localStorage.removeItem("backpackItems");
    },

    $reset() {
      this.items = Array(16).fill({ id: null });
      this.clearBackpackStorage();
      this.closeBackpack();
    }
  }
});
