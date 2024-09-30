// /store/onUseItemEffects.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useQuestStore } from "~/store/handleInteraction.js";
import { useObjectivesStore } from "~/store/handleObjectives.js";
import { useExperienceStore } from "~/store/experience.js";
import { useCurrencyStore } from "~/store/currency.js";
import { useBackpackStore } from "~/store/backpack.js";
import { useTooltipStore } from '~/store/tooltip.js';
import { useLootStore } from '~/store/loot.js'; 
import { lootItemsData } from '~/data/lootItems.js'; 

export const useOnUseItemEffectsStore = defineStore('onUseItemEffects', () => {
  const questStore = useQuestStore();
  const objectivesStore = useObjectivesStore();
  const experienceStore = useExperienceStore();
  const currencyStore = useCurrencyStore();
  const backpackStore = useBackpackStore();
  const tooltipStore = useTooltipStore();
  const lootStore = useLootStore(); 

  // Reaktiver Zustand für den Resume Key
  const resumeKeyUsed = ref(false);

  // Funktion zum Laden des Resume-Key-Zustands aus LocalStorage
  const loadResumeKeyUsed = () => {
    const savedResumeKeyUsed = localStorage.getItem('resumeKeyUsed');
    if (savedResumeKeyUsed) {
      resumeKeyUsed.value = JSON.parse(savedResumeKeyUsed);
    }
  };

  const applyItemEffect = (itemId) => {
    switch (itemId) {
      case 1: // Resume Key (id: 1)
        resumeKeyUsed.value = true; // Zustand auf true setzen
        localStorage.setItem('resumeKeyUsed', JSON.stringify(true)); // In LocalStorage speichern
        backpackStore.removeItemFromBackpack(itemId); // Item aus dem Rucksack entfernen
        alert("You have unlocked the resume!");
        break;

      case 3: // Reset Item (id: 3)
        if (confirm("Are you sure you want to start from new?")) {
          // Entferne den Zustand für die Chests (entfernte Items)
          Object.keys(lootStore.lootItems).forEach(chestId => {
            localStorage.removeItem(`removedItems_${chestId}`); // Entferne die gespeicherten entfernten Items für jede Chest
          });

          // Setze den Loot Store zurück und initialisiere ihn neu
          lootStore.$reset(); // Setze den Zustand der Loot-Items in allen Chests zurück
          
          // Lade die ursprünglichen Loot-Items neu
          Object.keys(lootItemsData).forEach(chestId => {
            lootStore.initializeLoot(chestId, lootItemsData[chestId]);
          });

          // Entferne den Fortschritt aus dem LocalStorage
          localStorage.removeItem("acceptedQuests");
          localStorage.removeItem("completedQuests");
          localStorage.removeItem("taskCompletedQuests");
          localStorage.removeItem("objectives");
          localStorage.removeItem("currency");
          localStorage.removeItem("resumeKeyUsed"); // Zustand des Resume-Keys zurücksetzen

          // Setze alle Stores zurück
          resumeKeyUsed.value = false;
          questStore.$reset();
          objectivesStore.$reset();
          currencyStore.$reset();
          backpackStore.$reset();
          experienceStore.resetExperience();
          tooltipStore.hideTooltip();
        }
        break;

      case 2: // Speed Boost Item (id: 2)
        alert("Your treasure open speed has been increased by 200% for 10 minutes!");
        backpackStore.removeItemFromBackpack(itemId);
        break;

      default:
        alert("This item has no special effect.");
        break;
    }
  };

  return {
    resumeKeyUsed,
    applyItemEffect,
    loadResumeKeyUsed, // Resume Ladefunktion exportieren
  };
});
