// /store/experience.ts
import { defineStore } from "pinia";
import { useUiOverlayStore } from "~/store/uiOverlay";
import { SoundManager } from "~/utils/soundManager";

interface ExperienceState {
  currentExperience: number;
  experienceToLevel: number;
  level: number;
}

const interfaceSounds = {
  levelUp: new SoundManager(["/sounds/utils/LevelUp.ogg"]),
};

export const useExperienceStore = defineStore("experience", {
  state: (): ExperienceState => ({
    currentExperience: 0,
    experienceToLevel: 1000,
    level: 1,
  }),
  actions: {
    addExperience(amount: number) {
      this.currentExperience += amount;
      if (import.meta.env.SSR === false) {
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
    levelUp(overflow: number) {
      this.level += 1;
      this.currentExperience = overflow;
      if (import.meta.env.SSR === false) {
        localStorage.setItem(
          "currentExperience",
          JSON.stringify(this.currentExperience)
        );
        localStorage.setItem("level", JSON.stringify(this.level));
      }

      interfaceSounds.levelUp.playNextSound();

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
      if (import.meta.env.SSR === false) {
        const savedExperience = JSON.parse(
          localStorage.getItem("currentExperience") || "0"
        );
        const savedLevel = JSON.parse(localStorage.getItem("level") || "1");
        this.currentExperience = savedExperience;
        this.level = savedLevel;
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
