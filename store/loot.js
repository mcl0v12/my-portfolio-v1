// store/loot.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { SoundManager } from "~/utils/soundManager";

// SoundManager-Instanz für die Loot-Sounds
const lootSounds = {
  open: new SoundManager(["/sounds/chest/Treasurechest_GoldenDragon_Open.ogg"]),
  close: new SoundManager(["/sounds/chest/Treasurechest_GoldenDragon_Close.ogg"]),
};

export const useLootStore = defineStore("loot", {
  state: () => ({
    lootItems: {}, 
    removedItems: {}, 
    openModals: {},
    cursorPosition: ref({ x: 0, y: 0 }) // Hinzugefügt: speichert die Klick-Position
  }),
  getters: {
    isAnyModalOpen(state) {
      return Object.values(state.openModals).includes(true);
    },
    activeLootId(state) {
      return Object.keys(state.openModals).find(lootId => state.openModals[lootId]);
    }
  },
  actions: {
    openLootModal(lootId) {
      if (lootId.startsWith("chest")) { 
        lootSounds.open.playNextSound();
      }
      this.openModals[lootId] = true;
    },

    closeLootModal(lootId) {
      if (lootId.startsWith("chest")) { 
        lootSounds.close.playNextSound();
      }
      this.openModals[lootId] = false;
    },

    initializeLoot(lootId, items) {
      const storedRemovedItems = localStorage.getItem(`removedItems_${lootId}`);
      this.removedItems[lootId] = storedRemovedItems ? JSON.parse(storedRemovedItems) : [];
      this.lootItems[lootId] = items.filter(
        (item) => !this.removedItems[lootId].includes(item.id)
      );
    },

    loadAllRemovedItems(lootTypes) {
      lootTypes.forEach((lootId) => {
        const storedRemovedItems = localStorage.getItem(`removedItems_${lootId}`);
        this.removedItems[lootId] = storedRemovedItems ? JSON.parse(storedRemovedItems) : [];
      });
    },

    removeLootItem(lootId, itemId) {
      if (this.lootItems[lootId]) {
        this.lootItems[lootId] = this.lootItems[lootId].filter((item) => item.id !== itemId);
        this.removedItems[lootId].push(itemId);
        localStorage.setItem(
          `removedItems_${lootId}`,
          JSON.stringify(this.removedItems[lootId])
        );
      }
    },

    // Methode zum Speichern der Klick-Position
    setCursorPosition(x, y) {
      this.cursorPosition = { x, y };
    },
  },
});