// store/loot.js
import { defineStore } from "pinia";
import { useTooltipStore } from "~/store/tooltip.js";

export const useLootStore = defineStore("loot", {
  state: () => ({
    lootItems: {}, 
    removedItems: {}, 
    openModals: {}, 
  }),

  actions: {
    openLootModal(chestId) {
      this.openModals[chestId] = true;
    },

    closeLootModal(chestId) {
      this.openModals[chestId] = false;
      useTooltipStore().hideTooltip();
    },

    // Initialisiere Loot-Items und filtere entfernte
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

    // Entferne Item und speichere es
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
