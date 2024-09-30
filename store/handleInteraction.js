// /store/handleInteraction.js
import { defineStore } from "pinia";
import { questItems } from "~/data/questItems.js";
import { useObjectivesStore } from "~/store/handleObjectives.js";
import { useBackpackStore } from "~/store/backpack.js";

export const useQuestStore = defineStore("quest", {
  state: () => ({
    showQuests: false,
    showQuestId: null,
    acceptedQuestIds: [],
    taskCompletedIds: [], 
    completedQuestIds: [], 
    triggerTalkAnimation: false,
  }),
  getters: {
    // Alle 'Objective' Quests zählen
    totalObjectiveQuests() {
      return questItems.filter((quest) => quest.type === "Objective").length;
    },

    // Akzeptierte 'Objective' Quests zählen
    acceptedObjectiveQuests() {
      return this.acceptedQuestIds.filter((acceptedId) => {
        const quest = questItems.find((q) => q.id === acceptedId);
        return quest && quest.type === "Objective";
      }).length;
    },

    // Verfügbare Quests, die nicht abgeschlossen sind
    availableQuests() {
      return questItems.filter((quest) => {
        // Quest 3 nur anzeigen, wenn Quest 2 abgeschlossen ist (z.B. Quest-Kette)
        if (quest.id === 3 && !this.completedQuestIds.includes(2)) return false; 
        return !this.completedQuestIds.includes(quest.id);
      });
    },
  },
  actions: {
    startInteraction() {
      this.showQuests = true;
      this.triggerTalkAnimation = true;
    },
    
    closeInteraction() {
      const backpackStore = useBackpackStore();
      if (this.showQuestId === 99) backpackStore.closeBackpack();
      this.showQuests = false;
      this.showQuestId = null;
      this.triggerTalkAnimation = false;
    },

    showQuest(id) {
      const backpackStore = useBackpackStore();
      this.showQuestId = id;
      if (id === 99) backpackStore.openBackpack();
    },

    deselectQuest() {
      this.showQuestId = null;
    },

    acceptQuest(id) {
      if (!this.acceptedQuestIds.includes(id)) {
        this.acceptedQuestIds.push(id);
        if (import.meta.client) {
          localStorage.setItem("acceptedQuests", JSON.stringify(this.acceptedQuestIds));
        }
      }
      const objectivesStore = useObjectivesStore();
      objectivesStore.addObjectiveByQuestId(id);
      this.deselectQuest();
    },

    markAsTaskComplete(id) {
      if (!this.taskCompletedIds.includes(id)) {
        this.taskCompletedIds.push(id);
        if (import.meta.client) {
          localStorage.setItem("taskCompletedQuests", JSON.stringify(this.taskCompletedIds));
        }
        const quest = questItems.find((quest) => quest.id === id);
        if (quest) quest.completed = false; 
      }
    },

    completeQuest(id) {
      if (!this.completedQuestIds.includes(id)) {
        this.completedQuestIds.push(id);
        if (import.meta.client) {
          localStorage.setItem("completedQuests", JSON.stringify(this.completedQuestIds));
        }

        const objectivesStore = useObjectivesStore();
        const quest = questItems.find((q) => q.id === id);
        if (quest) objectivesStore.removeObjective(quest.title);

        this.deselectQuest();
      }
    },

    loadProgress() {
      if (import.meta.client) {
        const savedAcceptedQuests = JSON.parse(localStorage.getItem("acceptedQuests"));
        const savedTaskCompletedQuests = JSON.parse(localStorage.getItem("taskCompletedQuests"));
        const savedCompletedQuests = JSON.parse(localStorage.getItem("completedQuests"));

        if (savedAcceptedQuests) this.acceptedQuestIds = savedAcceptedQuests;
        if (savedTaskCompletedQuests) this.taskCompletedIds = savedTaskCompletedQuests;
        if (savedCompletedQuests) this.completedQuestIds = savedCompletedQuests;

        this.completedQuestIds.forEach((completedId) => {
          const quest = questItems.find((q) => q.id === completedId);
          if (quest) quest.completed = true;
        });
      }
    },
  },
});
