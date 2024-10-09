// /store/handleObjectives.js

import { defineStore } from "pinia";
import { questData } from "~/data/questData.js";

export const useObjectivesStore = defineStore("objectives", {
  state: () => ({
    objectives: [],
  }),
  actions: {
    addObjectiveByQuestId(id) {
      const quest = questData.find((q) => q.id === id && q.type === 'Objective');
      if (quest && quest.objective) {
        this.addObjective({
          name: quest.title,
          progress: quest.objective.progress,
          total: quest.objective.total,
          description: quest.objective.description,
        });
      }
      this.saveObjectives();
    },
    addObjective(objective) {
      const exists = this.objectives.find((o) => o.name === objective.name);
      if (!exists) {
        this.objectives.push(objective);
        this.saveObjectives();
      }
    },
    completeObjective(name) {
      const objective = this.objectives.find((o) => o.name === name);
      if (objective) {
        objective.progress = objective.total;
        this.saveObjectives();
      }
    },
    updateObjectiveProgress(name, progress) {
      const objective = this.objectives.find((o) => o.name === name);
      if (objective) {
        objective.progress = Math.min(progress, objective.total);
        this.saveObjectives();
      }
    },
    loadObjectives() {
      if (import.meta.client) {
        const savedObjectives = JSON.parse(localStorage.getItem("objectives"));
        if (savedObjectives) {
          this.objectives = savedObjectives;
        }
      }
    },
    saveObjectives() {
      if (import.meta.client) {
        localStorage.setItem("objectives", JSON.stringify(this.objectives));
      }
    },
    removeObjective(name) {
      this.objectives = this.objectives.filter(
        (objective) => objective.name !== name
      );
      this.saveObjectives();
    },
  },
});
