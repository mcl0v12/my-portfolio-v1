<!-- FishingPanda.vue -->

<template>
    <div class="flex flex-center max-w-lg min-h-[600px] mx-auto cursor-pointer text-notice-color" @click="startAnimation">
      <!-- Zeige das richtige Bild oder GIF basierend auf dem aktuellen Zustand -->
      <img v-show="currentState === 'fishing'" :src="fishingLoopUrl" draggable="false" alt="Fishing Panda" />
      <img v-show="currentState === 'stun'" :src="dynamicStunGifUrl" draggable="false" alt="Stunned Panda" />
      <img v-show="currentState === 'death'" :src="dynamicDeathGifUrl" draggable="false" alt="Dying Panda" />
      <img v-show="currentState === 'dead'" :src="deathPngUrl" draggable="false" alt="Dead Panda" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  // Initiale Zustände und Bild-URLs
  const currentState = ref("fishing"); // Startzustand ist das "fishing" GIF
  
  // Pfade zu den Bildern und GIFs
  const fishingLoopUrl = "/gif/fishingPanda/fishingLoop.gif";
  const stunGifUrl = "/gif/fishingPanda/stun.gif";
  const deathGifUrl = "/gif/fishingPanda/dead.gif";
  const deathPngUrl = "/gif/fishingPanda/dead.png";
  
  // Dynamische Referenzen, um die GIFs neu zu laden
  const dynamicStunGifUrl = ref(stunGifUrl);
  const dynamicDeathGifUrl = ref(deathGifUrl);
  
  // GIF-Dauern (in Millisekunden)
  const stunGifDuration = 2000; // 2 Sekunden
  const deathGifDuration = 1900; // 1.9 Sekunden
  
  let gifTimeout = null;
  
  // Funktion zum Starten der Animation
  const startAnimation = () => {
    if (currentState.value === "fishing") {
      // Starte das "stun" GIF
      currentState.value = "stun";
      reloadGif(dynamicStunGifUrl, stunGifUrl);
      
      // Nach Ablauf des "stun" GIFs das "death" GIF abspielen
      playGif("death", stunGifDuration);
    }
  };
  
  // Funktion, um das nächste GIF oder Bild nach einer gewissen Zeit anzuzeigen
  const playGif = (nextState, duration) => {
    clearGifTimeout();
    gifTimeout = setTimeout(() => {
      if (nextState === "death") {
        reloadGif(dynamicDeathGifUrl, deathGifUrl);
      }
      currentState.value = nextState;
  
      // Wenn das "death" GIF endet, zeige das statische "death.png"
      if (nextState === "death") {
        playGif("dead", deathGifDuration);
      }
    }, duration);
  };
  
  // Funktion zum Neuladen eines GIFs (um sicherzustellen, dass es jedes Mal von vorne startet)
  const reloadGif = (dynamicGifRef, gifUrl) => {
    dynamicGifRef.value = `${gifUrl}?t=${new Date().getTime()}`;
  };
  
  // Funktion, um die laufenden GIF-Zeitüberschreitungen zu löschen
  const clearGifTimeout = () => {
    if (gifTimeout) {
      clearTimeout(gifTimeout);
      gifTimeout = null;
    }
  };
  
  // Preload Funktion, um GIFs vorzuladen
  const preloadGif = (url) => {
    const img = new Image();
    img.src = url;
  };
  
  // Lade die GIFs vor, sobald die Komponente gemountet wird
  onMounted(() => {
    preloadGif(fishingLoopUrl);
    preloadGif(stunGifUrl);
    preloadGif(deathGifUrl);
  });
  </script>
  
  <style scoped>
  </style>
  