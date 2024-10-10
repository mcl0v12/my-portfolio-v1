// /store/backpack.js
import { defineStore } from "pinia";
import { SoundManager } from "~/utils/soundManager";

const backpackSounds = {
  open: new SoundManager(["/sounds/interface/iBackpackOpen.ogg"]),
  close: new SoundManager(["/sounds/interface/iBackpackClose.ogg"]),
  coinFlip: new SoundManager(["/sounds/utils/coinFlips.ogg"]),

  // Item specific Sounds
  currency: new SoundManager(["/sounds/pick-up/LootCoinLarge.ogg"]),
  water: new SoundManager(["/sounds/pick-up/PickUpWater.ogg"]),
  ring: new SoundManager(["/sounds/pick-up/PickUpRing.ogg"]),
  wand: new SoundManager(["/sounds/pick-up/PickUpWand.ogg"]),
};

export const useBackpackStore = defineStore("backpack", {
  state: () => ({
    isBackpackOpen: false,
    items: Array(16).fill({ id: null }),
  }),

  actions: {
    openBackpack() {
      this.isBackpackOpen = true;
      backpackSounds.open.playNextSound();
    },
    closeBackpack() {
      this.isBackpackOpen = false;
      backpackSounds.close.playNextSound();
    },
    toggleBackpack() {
      this.isBackpackOpen = !this.isBackpackOpen;
      if (this.isBackpackOpen) {
        backpackSounds.open.playNextSound();
      } else {
        backpackSounds.close.playNextSound();
      }
    },

    addItemToBackpack(item) {
      const emptySlotIndex = this.items.findIndex((slot) => slot.id === null);

      if (emptySlotIndex !== -1) {
        this.items[emptySlotIndex] = item;
      } else {
        this.items.push(item);
      }

      // Sound abspielen, basierend auf dem Item-Typ
      this.playSoundForItem(item);

      this.saveBackpackItems();
    },

    // Spielt den spezifischen Sound für das hinzugefügte Item ab
    playSoundForItem(item) {
      const sound = backpackSounds[item.type];
      if (sound) {
        sound.playNextSound();
      }
    },

    // For Selling Items
    replaceItemWithEmpty(index) {
      this.items.splice(index, 1, { id: null });
      this.saveBackpackItems();
      backpackSounds.coinFlip.playNextSound();
    },

    removeItemFromBackpack(itemId) {
      const index = this.items.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        this.replaceItemWithEmpty(index);
      }
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
    },
  },
});
