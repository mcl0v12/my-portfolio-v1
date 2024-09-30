// tooltip.js

import { defineStore } from "pinia";
import { ref, nextTick } from "vue";

export const useTooltipStore = defineStore("tooltip", () => {
  const visible = ref(false);
  const position = ref({ top: 0, left: 0 });
  const content = ref("");

  async function showTooltip(event, tooltipContent) {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();

    content.value = tooltipContent;
    visible.value = true;

    await nextTick();

    const tooltipElement = document.getElementById("item-description");
    const tooltipHeight = tooltipElement ? tooltipElement.offsetHeight : 0;
    const tooltipWidth = tooltipElement ? tooltipElement.offsetWidth : 0;

    const offsetX = 10;
    const offsetY = -tooltipHeight;

    const isRightSide = rect.right > window.innerWidth / 2;

    let top = rect.top + offsetY;
    let left = isRightSide
      ? rect.left - tooltipWidth - offsetX
      : rect.right + offsetX;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth - 10;
    }

    if (left < 0) {
      left = 10;
    }

    if (top < 0) {
      top = rect.bottom + offsetX;
    }

    position.value = { top, left };
  }

  function hideTooltip() {
    visible.value = false;
    position.value = { top: 0, left: 0 };
  }

  return {
    visible,
    position,
    content,
    showTooltip,
    hideTooltip,
  };
});
