<!-- Chest.vue -->

<template>
  <!-- Opening Video -->
  <video
    ref="openingVideo"
    v-show="currentState === 'opening'"
    class="cursor-pointer"
    src="/chest/open.webm"
    @click="startProgressBar"
    @ended="onOpeningVideoEnd"
    draggable="false"
    preload="auto"
    :controls="false"
  ></video>

  <!-- Closing Video -->
  <video
    ref="closingVideo"
    v-show="currentState === 'closing'"
    src="/chest/close.webm"
    @ended="onClosingVideoEnd"
    draggable="false"
    preload="auto"
    :controls="false"
  ></video>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from "vue";
import { useLootStore } from "~/store/loot.js";
import { useProgressBarStore } from "~/store/progressBar.js";
import { lootItemsData } from "~/data/lootItems.js";

const props = defineProps({
  chestId: {
    type: String,
    required: true,
  },
});

const lootStore = useLootStore();
const progressBarStore = useProgressBarStore();
const currentState = ref("opening");

const openingVideo = ref(null);
const closingVideo = ref(null);

const playClosingAfterOpening = ref(false);

let modalOpenedInitially = false;
let openVideoFullyPlayed = false;

onMounted(() => {
  const chestData = lootItemsData[props.chestId];
  if (chestData) {
    lootStore.initializeLoot(props.chestId, chestData.items);
    
    const chestDuration = chestData.duration; 
    progressBarStore.setProgressDuration(props.chestId, chestDuration);
  }

  if (openingVideo.value) {
    openingVideo.value.load();
  }
  if (closingVideo.value) {
    closingVideo.value.load();
  }

  progressBarStore.setCompletionCallback(() => {
    openLootModal(); 
    playChestOpening();
  });

  watch(
    () => lootStore.openModals[props.chestId],
    (isModalOpen, previousModalOpen) => {
      if (isModalOpen) {
        modalOpenedInitially = true;
        window.addEventListener("scroll", handleScrollCancel);
      } else if (previousModalOpen && !isModalOpen) {
        window.removeEventListener("scroll", handleScrollCancel);
        if (openVideoFullyPlayed) {
          playChestClosing();
        } else {
          playClosingAfterOpening.value = true;
        }
      }
    }
  );

  window.addEventListener("scroll", clearProgress);
  window.addEventListener("keydown", handleEscKey); 
});

const startProgressBar = () => {
  progressBarStore.startProgress(props.chestId);
};

const handleEscKey = (event) => {
  if (event.key === "Escape") {
    if (lootStore.openModals[props.chestId]) {
      lootStore.closeLootModal(props.chestId);
    }
    progressBarStore.clearProgress();
  }
};

const handleScrollCancel = () => {
  if (lootStore.openModals[props.chestId]) {
    lootStore.closeLootModal(props.chestId);
  }
};

const clearProgress = () => {
  progressBarStore.clearProgress();
};

const playChestOpening = () => {
  currentState.value = "opening";
  openVideoFullyPlayed = false;
  openingVideo.value.play();
};

const openLootModal = () => {
  lootStore.openLootModal(props.chestId);
};

const onOpeningVideoEnd = () => {
  openVideoFullyPlayed = true;

  if (playClosingAfterOpening.value) {
    playChestClosing();
    playClosingAfterOpening.value = false;
  } else {
    lootStore.openLootModal(props.chestId);
  }
};

const playChestClosing = () => {
  currentState.value = "closing";
  closingVideo.value.play();
};

const onClosingVideoEnd = () => {
  if (openingVideo.value) {
    openingVideo.value.currentTime = 0;
  }
  currentState.value = "opening";
};

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScrollCancel);
  window.removeEventListener("scroll", clearProgress); 
  window.removeEventListener("keydown", handleEscKey);
});
</script>



