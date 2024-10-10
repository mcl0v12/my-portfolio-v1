// /store/backpack.ts
import { defineStore } from "pinia";
import { SoundManager } from "~/utils/soundManager";

export interface Vendor {
  sellPrice?: {
    gold?: number;
    silver?: number;
    copper?: number;
  };
  quantity: number;
  requiredLevel?: number;
}

export interface BackpackItem {
  id: number | null;
  type?: "currency" | "water" | "ring" | "wand";
  imageUrl?: string;
  title?: string;
  description?: string;
  descriptionColor?: string;
  rarity?: "common" | "uncommon" | "rare" | "epic";
  vendor?: Vendor;
}

interface BackpackState {
  isBackpackOpen: boolean;
  items: BackpackItem[];
  totalSlots: number;
}

const backpackSounds: Record<string, SoundManager> = {
  open: new SoundManager(["/sounds/interface/iBackpackOpen.ogg"]),
  close: new SoundManager(["/sounds/interface/iBackpackClose.ogg"]),
  coinFlip: new SoundManager(["/sounds/utils/coinFlips.ogg"]),
  currency: new SoundManager(["/sounds/pick-up/LootCoinLarge.ogg"]),
  water: new SoundManager(["/sounds/pick-up/PickUpWater.ogg"]),
  ring: new SoundManager(["/sounds/pick-up/PickUpRing.ogg"]),
  wand: new SoundManager(["/sounds/pick-up/PickUpWand.ogg"]),
};

export const useBackpackStore = defineStore("backpack", {
  state: (): BackpackState => ({
    isBackpackOpen: false,
    items: Array(16).fill({ id: null }),
    totalSlots: 16,
  }),
  getters: {
    freeSlots(state): number {
      const filledSlots = state.items.filter((item) => item.id !== null).length;
      return state.totalSlots - filledSlots;
    },
  },

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
      this.isBackpackOpen
        ? backpackSounds.open.playNextSound()
        : backpackSounds.close.playNextSound();
    },

    addItemToBackpack(item: BackpackItem) {
      const emptySlotIndex = this.items.findIndex((slot) => slot.id === null);
      if (emptySlotIndex !== -1) {
        this.items[emptySlotIndex] = item;
      } else {
        this.items.push(item);
      }
      this.playSoundForItem(item);
      this.saveBackpackItems();
    },

    playSoundForItem(item: BackpackItem) {
      const sound = item.type ? backpackSounds[item.type] : undefined;
      if (sound) sound.playNextSound();
    },

    replaceItemWithEmpty(index: number) {
      this.items.splice(index, 1, { id: null });
      this.saveBackpackItems();
      backpackSounds.coinFlip.playNextSound();
    },

    removeItemFromBackpack(itemId: number) {
      const index = this.items.findIndex((item) => item.id === itemId);
      if (index !== -1) this.replaceItemWithEmpty(index);
    },

    loadBackpackItems() {
      const savedItems = localStorage.getItem("backpackItems");
      if (savedItems) this.items = JSON.parse(savedItems);
    },

    saveBackpackItems() {
      localStorage.setItem("backpackItems", JSON.stringify(this.items));
    },

    clearBackpackStorage() {
      localStorage.removeItem("backpackItems");
    },

    $reset() {
      this.items = Array.from({ length: 16 }).map(() => ({ id: null }));
      this.clearBackpackStorage();
      this.closeBackpack();
    },
  },
});
