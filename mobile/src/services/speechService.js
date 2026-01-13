import * as Speech from 'expo-speech';

class SpeechService {
  constructor() {
    this.isSpeaking = false;
    this.onStateChange = null;
  }

  async speak(text, options = {}) {
    const {
      language = 'en-US',
      rate = 0.8,
      pitch = 1.0,
      onDone,
      onError,
    } = options;

    return new Promise((resolve, reject) => {
      Speech.speak(text, {
        language,
        rate,
        pitch,
        onDone: () => {
          if (onDone) onDone();
          resolve();
        },
        onError: (error) => {
          if (onError) onError(error);
          reject(error);
        },
      });
    });
  }

  async speakSequence(sequence, callbacks = {}) {
    const { onEnd, onError, onPlayingStateChange } = callbacks;
    
    this.isSpeaking = true;
    if (onPlayingStateChange) onPlayingStateChange(true);
    if (this.onStateChange) this.onStateChange(true);

    try {
      for (const item of sequence) {
        if (!this.isSpeaking) break;

        await this.speak(item.text, {
          language: item.lang || 'en-US',
          rate: item.rate || 0.8,
          pitch: item.pitch || 1.0,
        });

        // Add pause between items
        if (item.pause && this.isSpeaking) {
          await this.delay(item.pause);
        }
      }

      this.isSpeaking = false;
      if (onPlayingStateChange) onPlayingStateChange(false);
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
    } catch (error) {
      this.isSpeaking = false;
      if (onPlayingStateChange) onPlayingStateChange(false);
      if (this.onStateChange) this.onStateChange(false);
      if (onError) onError(error);
    }
  }

  stop() {
    this.isSpeaking = false;
    Speech.stop();
    if (this.onStateChange) this.onStateChange(false);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setOnStateChange(callback) {
    this.onStateChange = callback;
  }
}

export default new SpeechService();

