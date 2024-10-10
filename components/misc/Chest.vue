<template>
  <!-- Opening Video -->
  <video
    ref="openingVideo"
    v-if="
      currentState === 'opening' ||
      (currentState === 'closing' && !isClosingVideoLoaded)
    "
    class="cursor-pointer"
    src="/webm/chest/open.webm"
    @click="startProgressBar"
    @ended="onOpeningVideoEnd"
    draggable="false"
    :controls="false"
    disablePictureInPicture
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
const isClosingVideoLoaded = ref(false);
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

const openLootModal = () => {
  lootStore.openLootModal(props.lootId);
};

const handleScrollCancel = () => {
  if (lootStore.openModals[props.lootId]) {
    lootStore.closeLootModal(props.lootId);
  }
};

const clearProgress = () => {
  progressBarStore.clearProgress();
};

const handleEscKey = (event) => {
  if (event.key === "Escape") {
    if (lootStore.openModals[props.lootId]) {
      lootStore.closeLootModal(props.lootId);
    }
    progressBarStore.clearProgress();
  }
};

const playLootOpening = () => {
  if (openingVideo.value) {
    currentState.value = "opening";
    openVideoFullyPlayed = false;
    requestAnimationFrame(() => {
      openingVideo.value.play();
    });
  }
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
  currentState.value = "closing";
  isClosingVideoLoaded.value = false;
  await nextTick();

  if (closingVideo.value) {
    closingVideo.value.load();
  }
};

const onClosingVideoEnd = async () => {
  currentState.value = "opening";
  openVideoFullyPlayed = false;
  await nextTick();
};

const onClosingVideoLoad = () => {
  isClosingVideoLoaded.value = true;
  if (currentState.value === "closing") {
    requestAnimationFrame(() => {
      closingVideo.value.play();
    });
  }
};

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScrollCancel);
  window.removeEventListener("scroll", clearProgress);
  window.removeEventListener("keydown", handleEscKey);

  if (closingVideo.value) {
    closingVideo.value.removeEventListener("loadeddata", onClosingVideoLoad);
  }
});
</script>

<style scoped></style>
