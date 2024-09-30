// /store/handleObjectives.js
import { defineStore } from "pinia";

export const useObjectivesStore = defineStore("objectives", {
  state: () => ({
    objectives: [],
  }),
  actions: {
    addObjectiveByQuestId(id) {
      if (id === 2) {
        this.addObjective({
          name: "Logo Challenge",
          progress: 0,
          total: 10,
          description: "Logo Clicked",
        });
      } else if (id === 3) {
        this.addObjective({
          name: "Logo Challenge x2",
          progress: 0,
          total: 20,
          description: "Logo Clicked",
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
    updateObjectiveProgress(name, progress) {
      const objective = this.objectives.find((o) => o.name === name);
      if (objective) {
        objective.progress = Math.min(progress, objective.total);
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
