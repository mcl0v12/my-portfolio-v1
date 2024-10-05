<!-- PreloaderAnimation.vue -->

<template>
  <div class="relative h-screen flex flex-center overflow-hidden">
    <!-- Zeige das richtige Bild oder GIF basierend auf dem aktuellen Zustand -->
    <div class="max-w-lg">
      <img
        v-show="currentState === 'run'"
        :src="runGifUrl"
        draggable="false"
        alt="Running Animation"
        class="scale-up-animation"
      />
      <img
        v-show="currentState === 'finish'"
        :src="finishRunGifUrl"
        draggable="false"
        alt="Finish Run Animation"
        class="transition-opacity duration-1000 ease-in-out"
        :class="fadeOut ? 'opacity-0' : 'opacity-100'"
      />
    </div>
    <!-- Onyxia GIF: fliegt von links nach rechts -->
    <img
      v-if="showOnyxia"
      :src="onyxiaGifUrl"
      alt="Onyxia Animation"
      class="onyxia-animation"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["animationEnded"]); // Emit an Event when animation ends

// Initialer Zustand und Bild-URLs
const currentState = ref("run"); // Startzustand ist das "run" GIF
const runGifUrl = "/gif/preloader/run.gif";
const finishRunGifUrl = "/gif/preloader/finishRun.gif";
const onyxiaGifUrl = "/gif/preloader/onyxia.gif";

// Neues Onyxia GIF
const showOnyxia = ref(false); // Zustand für das Onyxia-GIF

// GIF-Dauern (in Millisekunden)
const runGifDuration = 3000; // 4 Sekunden für das "run" GIF
const finishRunGifDuration = 4000; // 4 Sekunden für das "finishRun" GIF + FadeOut-Dauer

let gifTimeout = null;
const fadeOut = ref(false); // Zustand für Opacity-Effekt

// Funktion zum Starten der Animation
const startAnimation = () => {
  if (currentState.value === "run") {
    playGif("finish", runGifDuration);

    showOnyxia.value = true;
    setTimeout(() => {
      showOnyxia.value = false; // Verstecke das GIF nach der Animation
    }, 3000);
  }
};

// Funktion, um das nächste GIF nach einer gewissen Zeit anzuzeigen
const playGif = (nextState, duration) => {
  clearGifTimeout(); // Stellt sicher, dass keine doppelten Zeitüberschreitungen laufen
  gifTimeout = setTimeout(() => {
    currentState.value = nextState; // Ändere den Zustand auf "finish"

    if (nextState === "finish") {
      setTimeout(() => {
        fadeOut.value = true; // Führe Opacity-Transition aus

        // Warte, bis der FadeOut-Übergang abgeschlossen ist, bevor der Preloader verschwindet
        setTimeout(() => {
          emit("animationEnded"); // Emit event when fade-out finishes
        }, 1000); // Dauer des FadeOut-Effekts (1 Sekunde in diesem Beispiel)
      }, finishRunGifDuration); // Warte, bis das GIF abgespielt wurde
    }
  }, duration);
};

// Funktion, um die laufenden GIF-Zeitüberschreitungen zu löschen
const clearGifTimeout = () => {
  if (gifTimeout) {
    clearTimeout(gifTimeout);
    gifTimeout = null;
  }
};

// Startet die Animation, sobald die Komponente geladen wird
onMounted(() => {
  startAnimation();
});
</script>

<style scoped>
/* CSS für Skalierungseffekt */
.scale-up-animation {
  animation: scaleUp 3s ease-in-out forwards;
}

@keyframes scaleUp {
  0% {
    transform: scale(0.3); /* Startgröße 50% */
  }
  100% {
    transform: scale(1); /* Endgröße 100% (Originalgröße) */
  }
}

/* Animation für das Onyxia-GIF: von links nach rechts */
.onyxia-animation {
  position: absolute;
  top: 30%;
  left: -500px;
  transform: translateY(-50%);
  width: 500px;
  animation: flyAcross 3s linear forwards;
}

@keyframes flyAcross {
  0% {
    left: -500px;
  }
  100% {
    left: calc(100vw + 500px);
  }
}
</style>
