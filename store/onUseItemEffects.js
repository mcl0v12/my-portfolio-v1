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
    case 1: 
      resumeKeyUsed.value = true;
      localStorage.setItem('resumeKeyUsed', JSON.stringify(true));
      backpackStore.removeItemFromBackpack(itemId);
      alert("You have unlocked the resume!");
      break;

    case 3: 
      if (confirm("Are you sure you want to start from new?")) {
        Object.keys(lootStore.lootItems).forEach(chestId => {
          localStorage.removeItem(`removedItems_${chestId}`);
        });

        lootStore.$reset();
        
        // Nur `items` aus `lootItemsData` an `initializeLoot` übergeben
        Object.keys(lootItemsData).forEach(chestId => {
          lootStore.initializeLoot(chestId, lootItemsData[chestId].items);
        });

        localStorage.removeItem("acceptedQuests");
        localStorage.removeItem("completedQuests");
        localStorage.removeItem("taskCompletedQuests");
        localStorage.removeItem("objectives");
        localStorage.removeItem("currency");
        localStorage.removeItem("resumeKeyUsed"); 

        resumeKeyUsed.value = false;
        questStore.$reset();
        objectivesStore.$reset();
        currencyStore.$reset();
        backpackStore.$reset();
        experienceStore.resetExperience();
        tooltipStore.hideTooltip();
      }
      break;

    case 2:
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
