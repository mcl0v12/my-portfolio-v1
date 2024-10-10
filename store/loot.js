// store/loot.js
import { defineStore } from "pinia";
import { useTooltipStore } from "~/store/tooltip.js";

export const useLootStore = defineStore("loot", {
  state: () => ({
    lootItems: {}, 
    removedItems: {}, 
    openModals: {}, 
  }),

  getters: {
    isAnyModalOpen(state) {
      return Object.values(state.openModals).includes(true);
    },
    activeChestId(state) {
      return Object.keys(state.openModals).find(chestId => state.openModals[chestId]);
    }
  },

  actions: {
    openLootModal(chestId) {
      this.openModals[chestId] = true;
    },

    closeLootModal(chestId) {
      this.openModals[chestId] = false;
      useTooltipStore().hideTooltip();
    },

    initializeLoot(chestId, items) {
      const storedRemovedItems = localStorage.getItem(`removedItems_${chestId}`);
      this.removedItems[chestId] = storedRemovedItems ? JSON.parse(storedRemovedItems) : [];
      this.lootItems[chestId] = items.filter(
        (item) => !this.removedItems[chestId].includes(item.id)
      );
    },

    loadAllRemovedItems(chests) {
      chests.forEach((chestId) => {
        const storedRemovedItems = localStorage.getItem(`removedItems_${chestId}`);
        this.removedItems[chestId] = storedRemovedItems ? JSON.parse(storedRemovedItems) : [];
      });
    },

    removeLootItem(chestId, itemId) {
      if (this.lootItems[chestId]) {
        this.lootItems[chestId] = this.lootItems[chestId].filter((item) => item.id !== itemId);
        this.removedItems[chestId].push(itemId);
        localStorage.setItem(
          `removedItems_${chestId}`,
          JSON.stringify(this.removedItems[chestId])
        );
        useTooltipStore().hideTooltip();
      }
    },
  },
});
