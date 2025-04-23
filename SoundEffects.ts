export class SoundEffects {
  private static audioContext: AudioContext | null = null;
  private static sounds: Map<string, AudioBuffer> = new Map();

  static async initialize() {
    try {
      this.audioContext = new AudioContext();
      
      // Load sound effects
      const soundEffects = {
        'rep-complete': '/sounds/success.mp3',
        'warning': '/sounds/warning.mp3',
        'error': '/sounds/error.mp3',
        'milestone': '/sounds/achievement.mp3',
        'countdown': '/sounds/beep.mp3'
      };

      for (const [name, path] of Object.entries(soundEffects)) {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds.set(name, audioBuffer);
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  static play(soundName: string, volume = 1.0) {
    if (!this.audioContext || !this.sounds.has(soundName)) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = this.sounds.get(soundName)!;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start();
  }
} 