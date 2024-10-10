// /store/currency.ts
import { defineStore } from "pinia";
import { SoundManager } from "~/utils/soundManager";

const currencyLargeSound = new SoundManager([
  "/sounds/pick-up/LootCoinLarge.ogg",
]);
const currencySmallSound = new SoundManager([
  "/sounds/pick-up/LootCoinSmall.ogg",
]);
const coinFlipSound = new SoundManager(["/sounds/utils/coinFlips.ogg"]);

interface CurrencyState {
  gold: number;
  silver: number;
  copper: number;
}

type ContextType = "default" | "quest" | "sell" | "loot";

export const useCurrencyStore = defineStore("currency", {
  state: (): CurrencyState => ({
    gold: 0,
    silver: 0,
    copper: 0,
  }),

  actions: {
    addCurrency(
      g: number,
      s: number,
      c: number,
      context: ContextType = "default"
    ) {
      this.copper += c;
      this.silver += s;
      this.gold += g;

      if (this.copper >= 100) {
        this.silver += Math.floor(this.copper / 100);
        this.copper %= 100;
      }
      if (this.silver >= 100) {
        this.gold += Math.floor(this.silver / 100);
        this.silver %= 100;
      }

      // Spiele Sound basierend auf dem Kontext ab
      if (context === "quest" || context === "sell") {
        currencyLargeSound.playNextSound();
      } else if (context === "loot") {
        currencySmallSound.playNextSound();
      }

      this.saveCurrency();
    },

    subtractCurrency(g: number, s: number, c: number) {
      this.copper -= c;
      this.silver -= s;
      this.gold -= g;

      if (this.copper < 0) {
        this.silver -= Math.ceil(Math.abs(this.copper) / 100);
        this.copper = ((this.copper % 100) + 100) % 100;
      }
      if (this.silver < 0) {
        this.gold -= Math.ceil(Math.abs(this.silver) / 100);
        this.silver = ((this.silver % 100) + 100) % 100;
      }

      coinFlipSound.playNextSound();

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
      const savedCurrency = localStorage.getItem("currency");
      if (savedCurrency) {
        const parsedCurrency = JSON.parse(
          savedCurrency
        ) as Partial<CurrencyState>;
        this.gold = parsedCurrency.gold || 0;
        this.silver = parsedCurrency.silver || 0;
        this.copper = parsedCurrency.copper || 0;
      }
    },
  },
});
