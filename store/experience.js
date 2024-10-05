// /store/experience.js
import { defineStore } from "pinia";
import { useUiOverlayStore } from "~/store/uiOverlay";
import { SoundManager } from "~/utils/soundManager";

// Interface Sounds (für LevelUp Sound)
const interfaceSounds = {
  levelUp: new SoundManager(["/sounds/interface/LevelUp.ogg"]),
};

export const useExperienceStore = defineStore("experience", {
  state: () => ({
    currentExperience: 0,
    experienceToLevel: 1000,
    level: 1,
  }),
  actions: {
    addExperience(amount) {
      this.currentExperience += amount;
      if (import.meta.client) {
        localStorage.setItem(
          "currentExperience",
          JSON.stringify(this.currentExperience)
        );
        localStorage.setItem("level", JSON.stringify(this.level));
      }
      this.processLevelUp();
    },
    processLevelUp() {
      if (this.currentExperience >= this.experienceToLevel) {
        const overflow = this.currentExperience - this.experienceToLevel;
        setTimeout(() => {
          this.levelUp(overflow);
        }, 1000);
      }
    },
    levelUp(overflow) {
      this.level += 1;
      this.currentExperience = overflow;
      if (import.meta.client) {
        localStorage.setItem(
          "currentExperience",
          JSON.stringify(this.currentExperience)
        );
        localStorage.setItem("level", JSON.stringify(this.level));
      }

      // Spiele den LevelUp-Sound ab
      interfaceSounds.levelUp.playNextSound();

      // Zeige Level-Up-Nachricht
      const uiOverlayStore = useUiOverlayStore();
      uiOverlayStore.showMessage(
        {
          title: `You've Reached Level`,
          content: `Level ${this.level}`,
        },
        3000,
        "level-up"
      );

      this.processLevelUp();
    },
    loadExperience() {
      if (import.meta.client) {
        const savedExperience = JSON.parse(
          localStorage.getItem("currentExperience")
        );
        const savedLevel = JSON.parse(localStorage.getItem("level"));
        if (savedExperience !== null) this.currentExperience = savedExperience;
        if (savedLevel !== null) this.level = savedLevel;
      }
    },
    resetExperience() {
      this.currentExperience = 0;
      this.level = 1;
      localStorage.removeItem("currentExperience");
      localStorage.removeItem("level");
    },
  },
});
