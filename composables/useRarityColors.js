// composables/useRarityColors.js
import { ref, onMounted } from 'vue';

export function useRarityColors() {
  const rootStyles = ref(null);

  onMounted(() => {
    rootStyles.value = getComputedStyle(document.documentElement);
  });

  const getColorFromRarity = (rarity) => {
    if (!rootStyles.value) {
      return "#fff"; 
    }
    switch (rarity) {
      case "epic":
        return rootStyles.value.getPropertyValue("--epic-color");
      case "rare":
        return rootStyles.value.getPropertyValue("--rare-color");
      case "uncommon":
        return rootStyles.value.getPropertyValue("--uncommon-color");
      default:
        return "#fff"; 
    }
  };

  const getGradientColor = (rarity, position, hasContent) => {
    if (!rootStyles.value) {
      return "#dddddd";
    }

    if (!hasContent) {
      return position === "top"
        ? rootStyles.value.getPropertyValue("--empty-gradient-top")
        : position === "mid"
        ? rootStyles.value.getPropertyValue("--empty-gradient-mid")
        : rootStyles.value.getPropertyValue("--empty-gradient-bottom");
    }

    switch (rarity) {
      case "epic":
        return position === "top"
          ? rootStyles.value.getPropertyValue("--epic-gradient-top")
          : position === "mid"
          ? rootStyles.value.getPropertyValue("--epic-gradient-mid")
          : rootStyles.value.getPropertyValue("--epic-gradient-bottom");
      case "rare":
        return position === "top"
          ? rootStyles.value.getPropertyValue("--rare-gradient-top")
          : position === "mid"
          ? rootStyles.value.getPropertyValue("--rare-gradient-mid")
          : rootStyles.value.getPropertyValue("--rare-gradient-bottom");
      case "uncommon":
        return position === "top"
          ? rootStyles.value.getPropertyValue("--uncommon-gradient-top")
          : position === "mid"
          ? rootStyles.value.getPropertyValue("--uncommon-gradient-mid")
          : rootStyles.value.getPropertyValue("--uncommon-gradient-bottom");
      default:
        return "#dddddd"; 
    }
  };

  return {
    getColorFromRarity,
    getGradientColor,
  };
}
