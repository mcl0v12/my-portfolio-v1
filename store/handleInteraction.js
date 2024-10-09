// /store/handleInteraction.js
import { defineStore } from "pinia";
import { questData } from "~/data/questData.js";
import { npcData } from "~/data/npcData.js";
import { useTooltipStore } from "~/store/tooltip";
import { useObjectivesStore } from "~/store/handleObjectives.js";
import { useBackpackStore } from "~/store/backpack.js";
import { SoundManager } from "~/utils/soundManager";

const npcGreetingSounds = new SoundManager([
  "/sounds/greetings/HumanMaleOfficialNPCGreeting01.ogg",
  "/sounds/greetings/HumanMaleOfficialNPCGreeting02.ogg",
  "/sounds/greetings/HumanMaleOfficialNPCGreeting03.ogg",
  "/sounds/greetings/HumanMaleOfficialNPCGreeting04.ogg",
  "/sounds/greetings/HumanMaleOfficialNPCGreeting05.ogg",
  "/sounds/greetings/HumanMaleOfficialNPCGreeting06.ogg",
]);

const npcFarewellSounds = new SoundManager([
  "/sounds/farewells/HumanMaleOfficialNPCFarewell01.ogg",
  "/sounds/farewells/HumanMaleOfficialNPCFarewell02.ogg",
  "/sounds/farewells/HumanMaleOfficialNPCFarewell03.ogg",
  "/sounds/farewells/HumanMaleOfficialNPCFarewell04.ogg",
]);

const interfaceSounds = {
  questLogOpen: new SoundManager(["/sounds/interface/iQuestLogOpen.ogg"]),
  questLogClose: new SoundManager(["/sounds/interface/iQuestLogClose.ogg"]),
  questActivate: new SoundManager(["/sounds/interface/iQuestActivate.ogg"]),
  questComplete: new SoundManager(["/sounds/interface/iQuestComplete.ogg"]),
  characterSheetOpen: new SoundManager([
    "/sounds/utils/uCharacterSheetOpen.ogg",
  ]),
  characterSheetClose: new SoundManager([
    "/sounds/utils/uCharacterSheetClose.ogg",
  ]),
};

export const useQuestStore = defineStore("quest", {
  state: () => ({
    currentCharacterId: null,
    showQuests: false,
    showQuestId: null,
    acceptedQuestIds: [],
    taskCompletedIds: [],
    completedQuestIds: [],
  }),
  getters: {
    // count all 'Objective' quests
    totalObjectiveQuests() {
      return questData.filter((quest) => quest.type === "Objective").length;
    },

    // count accepted 'Objective' quests
    acceptedObjectiveQuests() {
      return this.acceptedQuestIds.filter((acceptedId) => {
        const quest = questData.find((q) => q.id === acceptedId);
        return quest && quest.type === "Objective";
      }).length;
    },

    // character specific quests that arent completed
    availableQuests(state) {
      if (!state.currentCharacterId) return [];

      const character = npcData[state.currentCharacterId];
      const characterQuestIds = character ? character.quests : [];

      return questData.filter((quest) => {
        if (!characterQuestIds.includes(quest.id)) return false;
        if (quest.id === 3 && !state.completedQuestIds.includes(2))
          return false;
        return !state.completedQuestIds.includes(quest.id);
      });
    },
  },
  actions: {
    startInteraction() {
      this.showQuests = true;
      npcGreetingSounds.playNextSound();
    },

    setCharacterId(characterId) {
      this.currentCharacterId = characterId;
    },

    closeInteraction() {
      const backpackStore = useBackpackStore();
      const tooltipStore = useTooltipStore();

      tooltipStore.hideTooltip();

      if (this.showQuestId === 99) {
        backpackStore.closeBackpack();
        interfaceSounds.characterSheetClose.playNextSound();
      }

      if (this.showQuestId !== null) {
        const quest = questData.find((q) => q.id === this.showQuestId);
        if (quest && quest.type === "Objective") {
          interfaceSounds.questLogClose.playNextSound();
        }
      }

      // close Talk.vue and Quest Objectives
      this.showQuests = false;
      this.showQuestId = null;

      npcFarewellSounds.playNextSound();
    },

    showQuest(id) {
      const backpackStore = useBackpackStore();
      this.showQuestId = id;

      if (id === 99) {
        backpackStore.openBackpack();
        interfaceSounds.characterSheetOpen.playNextSound();
      } else {
        const quest = questData.find((q) => q.id === id);
        if (quest && quest.type === "Objective") {
          interfaceSounds.questLogOpen.playNextSound();
        }
      }
    },

    deselectQuest() {
      this.showQuestId = null;
      interfaceSounds.questLogClose.playNextSound();
    },

    acceptQuest(id) {
      if (!this.acceptedQuestIds.includes(id)) {
        this.acceptedQuestIds.push(id);
        if (import.meta.client) {
          localStorage.setItem(
            "acceptedQuests",
            JSON.stringify(this.acceptedQuestIds)
          );
        }

        interfaceSounds.questActivate.playNextSound();
      }
      const objectivesStore = useObjectivesStore();
      objectivesStore.addObjectiveByQuestId(id);
      this.deselectQuest();
    },

    markAsTaskComplete(id) {
      if (!this.taskCompletedIds.includes(id)) {
        this.taskCompletedIds.push(id);
        if (import.meta.client) {
          localStorage.setItem(
            "taskCompletedQuests",
            JSON.stringify(this.taskCompletedIds)
          );
        }
        const quest = questData.find((quest) => quest.id === id);
        if (quest) quest.completed = false;
      }
    },

    completeQuest(id) {
      if (!this.completedQuestIds.includes(id)) {
        this.completedQuestIds.push(id);
        if (import.meta.client) {
          localStorage.setItem(
            "completedQuests",
            JSON.stringify(this.completedQuestIds)
          );
        }

        const objectivesStore = useObjectivesStore();
        const quest = questData.find((q) => q.id === id);
        if (quest) objectivesStore.removeObjective(quest.title);

        interfaceSounds.questComplete.playNextSound();

        this.deselectQuest();
      }
    },

    loadProgress() {
      if (import.meta.client) {
        const savedAcceptedQuests = JSON.parse(
          localStorage.getItem("acceptedQuests")
        );
        const savedTaskCompletedQuests = JSON.parse(
          localStorage.getItem("taskCompletedQuests")
        );
        const savedCompletedQuests = JSON.parse(
          localStorage.getItem("completedQuests")
        );

        if (savedAcceptedQuests) this.acceptedQuestIds = savedAcceptedQuests;
        if (savedTaskCompletedQuests)
          this.taskCompletedIds = savedTaskCompletedQuests;
        if (savedCompletedQuests) this.completedQuestIds = savedCompletedQuests;

        this.completedQuestIds.forEach((completedId) => {
          const quest = questData.find((q) => q.id === completedId);
          if (quest) quest.completed = true;
        });
      }
    },
  },
});
