<!-- /components/misc/Chest.vue -->

<template>
  <div
    style="width: 300px; height: 300px"
    class="cursor-pointer"
    @click="startProgress"
  >
    <img
      v-show="currentState === 'closed'"
      :src="closedPngUrl"
      draggable="false"
      alt="Chest closed"
      @load="onImageLoad('closed')"
    />
    <img
      v-show="currentState === 'opened'"
      :src="openedPngUrl"
      draggable="false"
      alt="Chest opened"
      @load="onImageLoad('opened')"
    />
    <img
      v-show="currentState === 'opening' && isOpeningGifLoaded"
      :src="dynamicOpeningGifUrl"
      draggable="false"
      alt="Chest opening"
      @load="onOpeningGifLoad"
    />
    <img
      v-show="currentState === 'closing'"
      :src="closingGifUrl"
      draggable="false"
      alt="Chest closing"
      @load="onImageLoad('closing')"
    />
  </div>

  <div
    v-if="showProgress"
    class="progress-bar-container w-full max-w-[300px] h-[25px] fixed top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden"
  >
    <span
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm z-[2]"
      >Opening</span
    >
    <div
      class="progress-bar h-full absolute top-0 left-0"
      :style="{ width: progress + '%' }"
    >
      <div
        class="progress-end-marker w-[2px] h-full absolute right-0 top-0"
      ></div>
    </div>
  </div>

  <LootModal :chestId="props.chestId" />
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from "vue";
import LootModal from "~/components/main/loot-components/LootModal.vue";
import { lootItemsData } from "~/data/lootItems.js";
import { useLootStore } from "~/store/loot.js";

const props = defineProps({
  chestId: {
    type: String,
    required: true,
  },
});

const lootStore = useLootStore();
const currentState = ref("closed");

const closedPngUrl = "/chest/closed.png";
const openingGifUrl = "/chest/open.gif";
const openedPngUrl = "/chest/opened.png";
const closingGifUrl = "/chest/close.gif";

const dynamicOpeningGifUrl = ref(openingGifUrl);

const showProgress = ref(false);
const progress = ref(0);
const progressDuration = 1000;
const gifDuration = 1000;

let gifTimeout = null;
let animationFrame = null;

// Lade-Status für Bilder
const imageLoadStates = {
  closed: ref(false),
  opened: ref(false),
  opening: ref(false),
  closing: ref(false),
};

const isOpeningGifLoaded = ref(false);

onMounted(() => {
  if (props.chestId && lootItemsData[props.chestId]) {
    lootStore.initializeLoot(props.chestId, lootItemsData[props.chestId]);
  } else {
    console.error(`No loot items found for chestId: ${props.chestId}`);
  }

  watch(
    () => lootStore.openModals[props.chestId],
    (isModalOpen) => {
      if (!isModalOpen) {
        playChestClosing();
      }
    }
  );

  window.addEventListener("keydown", handleEscKey);
});

const startProgress = () => {
  if (showProgress.value || !imageLoadStates.closed.value) return;

  if (currentState.value === "closed") {
    showProgress.value = true;
    progress.value = 0;
    const startTime = performance.now();

    const updateProgress = (timestamp) => {
      const elapsed = timestamp - startTime;
      progress.value = Math.min((elapsed / progressDuration) * 100, 100);

      if (progress.value < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        showProgress.value = false;
        playChestOpening();
        lootStore.openLootModal(props.chestId);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    window.addEventListener("scroll", handleScrollCancel);
  }
};

const onImageLoad = (state) => {
  imageLoadStates[state].value = true;
};

const onOpeningGifLoad = () => {
  isOpeningGifLoaded.value = true;
};

const handleEscKey = (event) => {
  if (event.key === "Escape") {
    if (lootStore.openModals[props.chestId]) {
      lootStore.closeLootModal(props.chestId);
    } else {
      clearProgress();
    }
  }
};

const handleScrollCancel = () => {
  clearProgress();
};

const clearProgress = () => {
  cancelProgressAnimation();
  showProgress.value = false;
  progress.value = 0;
  window.removeEventListener("scroll", handleScrollCancel);
};

const cancelProgressAnimation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
};

const playChestOpening = () => {
  currentState.value = "opening";
  reloadGif(dynamicOpeningGifUrl, openingGifUrl);
  isOpeningGifLoaded.value = false; // Reset before loading
  playGif("opened", gifDuration);
  clearProgress();
};

const playChestClosing = () => {
  currentState.value = "closing";
  playGif("closed", 1000);
};

const playGif = (nextState, duration) => {
  clearGifTimeout();
  gifTimeout = setTimeout(() => {
    currentState.value = nextState;
  }, duration);
};

const reloadGif = (dynamicGifRef, gifUrl) => {
  dynamicGifRef.value = `${gifUrl}?t=${new Date().getTime()}`;
};

const clearGifTimeout = () => {
  if (gifTimeout) {
    clearTimeout(gifTimeout);
    gifTimeout = null;
  }
};

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScrollCancel);
  window.removeEventListener("keydown", handleEscKey);
});
</script>

<style scoped>
.progress-bar-container {
  background-color: rgba(0, 0, 0, 0.2);
  border: 2px solid var(--gray-80);
  border-radius: 1rem;
}

.progress-bar {
  transition: width 0.05s linear;
  box-shadow: inset 0 3px 3px rgba(26, 26, 26, 0.8),
    inset 0 -3px 3px rgba(26, 26, 26, 0.8);
  background: linear-gradient(to bottom, #b98000, #8c5d00);
}

.progress-end-marker {
  will-change: transform;
  background-color: rgba(255, 221, 0, 1);
  box-shadow: 0 0 10px 5px rgba(255, 255, 200, 0.5);
}
</style>
