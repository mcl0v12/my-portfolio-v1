<!-- /components/misc/Chest.vue -->

<template>
  <div
    style="width: 300px; height: 300px"
    class="cursor-pointer"
    @click="startProgress"
  >
    <!-- Opening Video (startet per Klick) -->
    <video
      ref="openingVideo"
      v-show="currentState === 'opening' && isOpeningVideoLoaded"
      src="/chest/open-chest.webm"
      @loadeddata="onOpeningVideoLoad"
      @ended="onOpeningVideoEnd"
      draggable="false"
      playsinline
      muted
      :controls="false"
    ></video>

    <!-- Closing Video (startet nach dem Schließen des Loot Modals) -->
    <video
      ref="closingVideo"
      v-show="currentState === 'closing' && isClosingVideoLoaded"
      src="/chest/close-chest.webm"
      @loadeddata="onClosingVideoLoad"
      @ended="onClosingVideoEnd"
      draggable="false"
      playsinline
      muted
      :controls="false"
    ></video>
  </div>

  <ProgressBar v-if="showProgress" :progress="progress" />

  <LootModal :chestId="props.chestId" />
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from "vue";
import ProgressBar from "~/components/misc/ProgressBar.vue";
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
const currentState = ref("opening");

const showProgress = ref(false);
const progress = ref(0);
const progressDuration = 1000;

let animationFrame = null;

const openingVideo = ref(null);
const closingVideo = ref(null);

const isOpeningVideoLoaded = ref(false);
const isClosingVideoLoaded = ref(false);

let modalOpenedInitially = false;
let openVideoFullyPlayed = false;

onMounted(() => {
  if (props.chestId && lootItemsData[props.chestId]) {
    lootStore.initializeLoot(props.chestId, lootItemsData[props.chestId]);
  }

  if (openingVideo.value) {
    openingVideo.value.load();
  }
  if (closingVideo.value) {
    closingVideo.value.load();
  }

  watch(
    () => lootStore.openModals[props.chestId],
    (isModalOpen, previousModalOpen) => {
      if (isModalOpen) {
        modalOpenedInitially = true;
        window.addEventListener("scroll", handleScrollCancel);
        window.addEventListener("keydown", handleEscKey);
      } else if (previousModalOpen && !isModalOpen) {
        window.removeEventListener("scroll", handleScrollCancel);
        window.removeEventListener("keydown", handleEscKey);
        if (modalOpenedInitially && openVideoFullyPlayed) {
          playChestClosing();
        }
      }
    }
  );
});

const startProgress = () => {
  if (showProgress.value || currentState.value !== "opening") return;

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
  if (lootStore.openModals[props.chestId]) {
    lootStore.closeLootModal(props.chestId);
  }
};

const clearProgress = () => {
  cancelProgressAnimation();
  showProgress.value = false;
  progress.value = 0;
};

const cancelProgressAnimation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
};

const playChestOpening = () => {
  if (isOpeningVideoLoaded.value) {
    currentState.value = "opening";
    showProgress.value = false;
    openVideoFullyPlayed = false;
    openingVideo.value.play();
  }
};

const playChestClosing = () => {
  if (isClosingVideoLoaded.value) {
    currentState.value = "closing";
    closingVideo.value.play();
  }
};

const onOpeningVideoLoad = () => {
  isOpeningVideoLoaded.value = true;
};

const onClosingVideoLoad = () => {
  isClosingVideoLoaded.value = true;
};

const onOpeningVideoEnd = () => {
  openVideoFullyPlayed = true; 

  if (lootStore.openModals[props.chestId]) {
    lootStore.openLootModal(props.chestId);
  } else {
    playChestClosing();
  }
};

const onClosingVideoEnd = () => {
  if (openingVideo.value) {
    openingVideo.value.currentTime = 0;
  }
  currentState.value = "opening";
};

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScrollCancel);
  window.removeEventListener("keydown", handleEscKey);
});
</script>

<style scoped>
/* Style-Abschnitt */
</style>
