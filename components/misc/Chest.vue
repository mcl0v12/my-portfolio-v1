<!-- Chest.vue -->

<template>
  <!-- Opening Video -->
  <video
    ref="openingVideo"
    v-if="currentState === 'opening' || (currentState === 'closing' && !isClosingVideoLoaded)"
    class="cursor-pointer"
    src="/webm/chest/open.webm"
    @click="startProgressBar"
    @ended="onOpeningVideoEnd"
    @loadeddata="onOpeningVideoLoad"
    draggable="false"
    preload="auto"
    :controls="false"
    disablePictureInPicture
    loop
    autoplay
    muted
  ></video>

  <!-- Closing Video -->
  <video
    ref="closingVideo"
    v-if="currentState === 'closing'"
    v-show="isClosingVideoLoaded"
    src="/webm/chest/close.webm"
    @ended="onClosingVideoEnd"
    @loadeddata="onClosingVideoLoad"
    draggable="false"
    preload="auto"
    :controls="false"
    disablePictureInPicture
  ></video>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted, watch, nextTick } from "vue";
import { useLootStore } from "~/store/loot.js";
import { useProgressBarStore } from "~/store/progressBar.js";
import { lootItemsData } from "~/data/lootItems.js";

const props = defineProps({
  lootId: {
    type: String,
    required: true,
  },
});

const lootStore = useLootStore();
const progressBarStore = useProgressBarStore();
const currentState = ref("opening");

const openingVideo = ref(null);
const closingVideo = ref(null);
const isOpeningVideoLoaded = ref(false);
const isClosingVideoLoaded = ref(false);
const isClosingTriggered = ref(false);
let openVideoFullyPlayed = false;
let autoCloseAfterOpening = false;

onMounted(() => {
  const lootData = lootItemsData[props.lootId];
  if (lootData) {
    lootStore.initializeLoot(props.lootId, lootData.items);
    const lootDuration = lootData.duration;
    progressBarStore.setProgressDuration(props.lootId, lootDuration);
  }

  if (openingVideo.value) {
    openingVideo.value.load();
    openingVideo.value.addEventListener("loadeddata", onOpeningVideoLoad);
  }

  progressBarStore.setCompletionCallback(() => {
    openLootModal();
    playLootOpening();
  });

  watch(
    () => lootStore.openModals[props.lootId],
    (isModalOpen) => {
      if (isModalOpen) {
        window.addEventListener("scroll", handleScrollCancel);
      } else {
        window.removeEventListener("scroll", handleScrollCancel);
        if (openVideoFullyPlayed) {
          startClosingSequence();
        } else {
          autoCloseAfterOpening = true;
        }
      }
    }
  );

  window.addEventListener("scroll", clearProgress);
  window.addEventListener("keydown", handleEscKey);
});

const startProgressBar = () => {
  progressBarStore.startProgress(props.lootId);
};

const handleEscKey = (event) => {
  if (event.key === "Escape") {
    if (lootStore.openModals[props.lootId]) {
      lootStore.closeLootModal(props.lootId);
    }
    progressBarStore.clearProgress();
  }
};

const handleScrollCancel = () => {
  if (lootStore.openModals[props.lootId]) {
    lootStore.closeLootModal(props.lootId);
  }
};

const clearProgress = () => {
  progressBarStore.clearProgress();
};

const playLootOpening = () => {
  if (isOpeningVideoLoaded.value && openingVideo.value) {
    currentState.value = "opening";
    openVideoFullyPlayed = false;
    requestAnimationFrame(() => {
      openingVideo.value.play();
    });
  }
};

const openLootModal = () => {
  lootStore.openLootModal(props.lootId);
};

const onOpeningVideoEnd = async () => {
  openVideoFullyPlayed = true;
  if (autoCloseAfterOpening) {
    autoCloseAfterOpening = false;
    await nextTick();
    startClosingSequence();
  }
};

const startClosingSequence = async () => {
  isClosingTriggered.value = true;
  currentState.value = "closing";
  await nextTick();
  if (closingVideo.value) {
    closingVideo.value.load();
  }
};

const onOpeningVideoLoad = () => {
  isOpeningVideoLoaded.value = true;
};

const onClosingVideoLoad = () => {
  isClosingVideoLoaded.value = true;
  if (currentState.value === "closing" && closingVideo.value) {
    requestAnimationFrame(() => {
      closingVideo.value.play();
    });
  }
};

const onClosingVideoEnd = async () => {
  if (openingVideo.value) {
    openingVideo.value.currentTime = 0;
  }
  currentState.value = "opening";
  openVideoFullyPlayed = false;
  isClosingTriggered.value = false;
  await nextTick();
};

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScrollCancel);
  window.removeEventListener("scroll", clearProgress);
  window.removeEventListener("keydown", handleEscKey);

  if (openingVideo.value) {
    openingVideo.value.removeEventListener("loadeddata", onOpeningVideoLoad);
  }
  if (closingVideo.value) {
    closingVideo.value.removeEventListener("loadeddata", onClosingVideoLoad);
  }
});
</script>

<style scoped></style>
