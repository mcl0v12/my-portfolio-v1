<template>
  <div class="max-w-stacked mx-auto speech-cursor" @click="startAnimation">
    <picture>
      <div class="flex flex-col flex-center gap-6">
        <svg
          class="max-w-obj h-full relative left-[-1.5%]"
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="120"
          viewBox="0 0 80 120"
        >
          <!-- Fragezeichen -->
          <path
            v-if="showQuestionMark"
            :style="{ fill: questionMarkFill }"
            d="m 69.157861,16.623117 c 2.737858,4.745842 5.715691,16.22935 2.294317,26.861142 C 64.439225,62.923473 55.542852,50.701079 50.275611,79.711315 47.764463,91.173439 33.750143,93.158014 27.990984,79.228333 21.025077,54.73703 54.221645,41.465648 44.614674,28.712924 41.13216,24.707604 37.612981,25.024605 34.305569,26.995258 30.998151,28.965911 28.230156,32.767229 25.267037,35.199492 16.924677,41.264841 1.6085554,36.510929 8.9243216,18.973303 17.167643,1.060688 52.132005,-11.505725 69.157861,16.623117 Z"
          />

          <!-- Ausrufezeichen -->
          <path
            v-if="!showQuestionMark"
            :style="{ fill: exclamationMarkFill }"
            d="M 38.114021,88.339086 C 36.872892,87.496523 36.384856,86.917771 35.307684,85.011109 29.198048,74.196719 20.435042,23.713508 22.938628,13.753645 27.286804,-3.5444397 50.949564,-4.8956058 57.042821,11.806261 59.164463,17.621765 57.712761,34.643067 53.147828,57.474949 48.6375,80.0338 44.98398,89 40.302088,89 39.422267,89 38.819329,88.817877 38.114021,88.339086 Z"
          />

          <!-- Punkt -->
          <path
            :style="{ fill: dotFill }"
            d="m 37.743931,119.76476 c -3.349195,-0.65512 -6.838944,-3.38537 -8.29891,-6.49277 -5.563451,-11.8413 9.59076,-22.508554 18.860327,-13.276054 8.141275,8.108734 0.731776,21.977794 -10.561417,19.768824 z"
          />
        </svg>

        <img
          v-show="currentState === 'stand'"
          :src="standGifUrl"
          sizes="(max-width: 767px) 50vw, (min-width: 768px) 25vw"
          draggable="false"
          alt="standing"
        />

        <img
          v-show="currentState === 'special'"
          :src="dynamicSpecialGifUrl"
          sizes="(max-width: 767px) 50vw, (min-width: 768px) 25vw"
          draggable="false"
          alt="talking"
        />
      </div>
    </picture>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useQuestStore } from "~/store/handleInteraction.js";
import { useObjectivesStore } from "~/store/handleObjectives.js";

const questStore = useQuestStore();
const objectivesStore = useObjectivesStore();

// Prüfe, ob Quests akzeptiert aber nicht abgeschlossen sind
const questAcceptedButNotCompleted = computed(() => {
  return questStore.acceptedQuestIds.some(
    (id) => !questStore.completedQuestIds.includes(id)
  );
});

// Prüfe, ob akzeptierte Quests als erledigt markiert wurden
const taskCompletedForAcceptedQuests = computed(() => {
  return questStore.taskCompletedIds.some((id) =>
    questStore.acceptedQuestIds.includes(id)
  );
});

// Prüfe, ob eine neue Quest freigeschaltet wurde
const newQuestUnlocked = computed(
  () =>
    questStore.completedQuestIds.includes(2) &&
    !questStore.acceptedQuestIds.includes(3)
);

// Zeige das Fragezeichen, wenn eine Quest aktiv ist
const showQuestionMark = computed(() => {
  if (newQuestUnlocked.value) return false;
  return (
    questAcceptedButNotCompleted.value ||
    taskCompletedForAcceptedQuests.value
  );
});

const exclamationMarkFill = "#FE9F07";

// Setze das Fill des Fragezeichens je nach Fortschritt
const questionMarkFill = computed(() => {
  const anyQuestInProgress = questStore.acceptedQuestIds.some((id) => {
    const objective = objectivesStore.objectives.find(
      (o) => o.name === getQuestNameById(id)
    );
    return objective && objective.progress < objective.total;
  });
  return anyQuestInProgress ? "#A9A9A9" : "#FE9F07";
});

// Punkt abhängig von `showQuestionMark`
const dotFill = computed(() =>
  showQuestionMark.value ? questionMarkFill.value : "#FE9F07"
);

// Hilfsfunktion zur Rückgabe des Quest-Namens
function getQuestNameById(id) {
  if (id === 2) return "The Logo Challenge";
  if (id === 3) return "EXTREME Logo Challenge";
  return null;
}

// Gif Logic
const currentState = ref("stand");
const standGifUrl = "/gif/stand.gif";
const specialGifUrl = "/gif/emoteTalk.gif";
const dynamicSpecialGifUrl = ref(specialGifUrl);
const specialGifDuration = 2000; 

let gifTimeout = null;

const startAnimation = () => {
  questStore.startInteraction();
  if (currentState.value === "stand") {
    currentState.value = "special";
    reloadGif(dynamicSpecialGifUrl, specialGifUrl);
    playGif("stand", specialGifDuration);
  }
};

const playGif = (nextState, duration) => {
  clearGifTimeout();
  gifTimeout = setTimeout(() => {
    currentState.value = nextState;
    if (nextState === "stand") {
      isPlayingSpecial.value = false;
      questStore.triggerTalkAnimation = false;
    }
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

const preloadGif = (url) => {
  const img = new Image();
  img.src = url;
};

onMounted(() => {
  preloadGif(standGifUrl);
  preloadGif(specialGifUrl);
});

watch(
  () => questStore.triggerTalkAnimation,
  (newVal) => {
    if (newVal) {
      startAnimation();
    }
  }
);
</script>

<style scoped></style>
