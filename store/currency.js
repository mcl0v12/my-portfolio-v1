// /store/currency.js
import { defineStore } from "pinia";

export const useCurrencyStore = defineStore("currency", {
  state: () => ({
    gold: 0,
    silver: 0,
    copper: 0,
  }),

  actions: {
    addCurrency(g, s, c) {
      this.copper += c;
      this.silver += s;
      this.gold += g;

      // Umwandlung von Kupfer zu Silber und Silber zu Gold
      if (this.copper >= 100) {
        this.silver += Math.floor(this.copper / 100);
        this.copper %= 100;
      }
      if (this.silver >= 100) {
        this.gold += Math.floor(this.silver / 100);
        this.silver %= 100;
      }

      this.saveCurrency();
    },

    subtractCurrency(g, s, c) {
      this.copper -= c;
      this.silver -= s;
      this.gold -= g;

      // Anpassung negativer Werte für Kupfer und Silber
      if (this.copper < 0) {
        this.silver -= Math.ceil(Math.abs(this.copper) / 100);
        this.copper = ((this.copper % 100) + 100) % 100;
      }
      if (this.silver < 0) {
        this.gold -= Math.ceil(Math.abs(this.silver) / 100);
        this.silver = ((this.silver % 100) + 100) % 100;
      }

      this.saveCurrency();
    },

    saveCurrency() {
      localStorage.setItem(
        "currency",
        JSON.stringify({
          gold: this.gold,
          silver: this.silver,
          copper: this.copper,
        })
      );
    },

    loadCurrency() {
      const savedCurrency = JSON.parse(localStorage.getItem("currency"));
      if (savedCurrency) {
        this.gold = savedCurrency.gold || 0;
        this.silver = savedCurrency.silver || 0;
        this.copper = savedCurrency.copper || 0;
      }
    },
  },
});
