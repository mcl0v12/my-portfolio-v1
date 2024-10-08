<!-- ActionButton.vue -->

<template>
    <ItemBadge
      :imageUrl="'/img/items/whistle.png'"
      :size="80"
      :overlayScale="1.5"
      :gradientId="'action-button'"
      :gradientTopColor="emptyGradientColors.top"
      :gradientMidColor="emptyGradientColors.mid"
      :gradientBottomColor="emptyGradientColors.bottom"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    />
  </template>
  
  <script setup>
  import { useTooltipStore } from "~/store/tooltip.js";
  import ItemBadge from "~/components/misc/ItemBadge.vue";
  
  const emptyGradientColors = {
    top: "#dddddd",
    mid: "#777777",
    bottom: "#444444",
  };
  
  const tooltipStore = useTooltipStore();
  

  const handleMouseEnter = (event) => {
    tooltipStore.showTooltip(event, {
      title: "Placeholder", 
      titleColor: "#FCFCFE",
      subtitle: "Instant ", 
      subtitleColor: "#FCFCFE",
      description: "Placeholder desc",
      descriptionColor: "#ffd700",
    });
  };
  
  const handleMouseLeave = () => {
    tooltipStore.hideTooltip();
  };
  </script>
  
  <style scoped>
  </style>
  