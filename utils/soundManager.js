// /utils/soundManager.js
export class SoundManager {
  constructor(sounds) {
      this.sounds = sounds;
      this.currentIndex = 0;
      this.isPlaying = false;
      this.loopInterval = null;
  }

  // Spielt die nächsten Sounds für 3 Sekunden in einer Schleife
  playLoop(duration = 3000) {
      if (this.isPlaying) return;
      this.isPlaying = true;

      // Definiere eine Schleife, die die Sounds in einem Intervall abspielt
      this.loopInterval = setInterval(() => {
          this.playNextSound();
      }, 300); // Setzt die Abspielrate auf 300ms pro Sound

      // Stoppt die Schleife nach der angegebenen Dauer (3 Sekunden)
      setTimeout(() => {
          this.stopLoop();
      }, duration);
  }

  // Spielt den nächsten Sound in der Liste ab
  playNextSound() {
      const soundToPlay = this.sounds[this.currentIndex];
      const audio = new Audio(soundToPlay);
      audio.play();
      
      this.currentIndex = (this.currentIndex + 1) % this.sounds.length; // Nächster Sound
  }

  // Stoppt die Sound-Schleife
  stopLoop() {
      clearInterval(this.loopInterval);
      this.isPlaying = false;
      this.loopInterval = null;
  }

  // Spielt einen einzelnen Sound (für "finish"-GIF)
  playSingleSound(soundPath) {
      const audio = new Audio(soundPath);
      audio.play();
  }
}

  