<!-- misc/WriteText.vue -->
<template>
    <div class="typewriter">
      <span :class="['typewriter-text', { 'no-blink': !blinkCaret }]">{{ displayedText }}</span>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // Der vollständige Text, der geschrieben werden soll
  const fullText = 'Das ist mein Text Text';
  
  // Reaktive Referenzen für den sichtbaren Text und das Blinkverhalten
  const displayedText = ref('');
  const blinkCaret = ref(true);
  
  // Funktion, um den Text Buchstabe für Buchstabe darzustellen
  const typeText = () => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      // Füge nach und nach jeden Buchstaben hinzu
      displayedText.value += fullText[currentIndex];
      currentIndex++;
  
      // Stoppe das Intervall, wenn der gesamte Text geschrieben ist
      if (currentIndex === fullText.length) {
        clearInterval(typingInterval);
  
        // Blinken des Carets nach Ende des Tippens stoppen
        setTimeout(() => {
          blinkCaret.value = false;
        }, 1000); // Optionales Timeout, um das Blinken kurz weiterzuführen
      }
    }, 100); // Intervall zum Schreiben der Buchstaben (anpassbar)
  };
  
  // Startet die Animation beim Laden der Komponente
  onMounted(() => {
    typeText();
  });
  </script>
  
  <style scoped>
  .typewriter {
    display: flex;
    width: max-content;
    position: relative;
  }
  
  .typewriter-text {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 0.12rem solid black;
    animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
  }
  
  .no-blink {
    border-right: none;
  }
  
  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }
  
  @keyframes blink-caret {
    from,
    to {
      border-color: transparent;
    }
    50% {
      border-color: black;
    }
  }
  </style>
  