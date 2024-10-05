// /utils/soundManager.js
export class SoundManager {
    constructor(sounds) {
      this.sounds = sounds;
      this.currentIndex = 0; 
    }
  
    playNextSound() {
      const soundToPlay = this.sounds[this.currentIndex];
      const audio = new Audio(soundToPlay);
      audio.play();
      
      this.currentIndex = (this.currentIndex + 1) % this.sounds.length;
    }
  }
  