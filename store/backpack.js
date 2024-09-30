// /store/backpack.js
import { defineStore } from "pinia";

export const useBackpackStore = defineStore("backpack", {
  state: () => ({
    isBackpackOpen: false,
    items: Array(16).fill({ id: null }), // 16 leere Slots
  }),

  actions: {
    openBackpack() {
      this.isBackpackOpen = true;
    },

    closeBackpack() {
      this.isBackpackOpen = false;
    },

    toggleBackpack() {
      this.isBackpackOpen = !this.isBackpackOpen;
    },

    addItemToBackpack(item) {
      const emptySlotIndex = this.items.findIndex((slot) => slot.id === null);

      if (emptySlotIndex !== -1) {
        this.items[emptySlotIndex] = item;
      } else {
        this.items.push(item);
      }

      this.saveBackpackItems();
    },

    replaceItemWithEmpty(index) {
      this.items.splice(index, 1, { id: null });
      this.saveBackpackItems();
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
