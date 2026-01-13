import * as Speech from 'expo-speech';

class SpeechService {
  constructor() {
    this.isSpeaking = false;
    this.onStateChange = null;
    this.currentSequence = [];
    this.currentIndex = 0;
    this.isAvailable = true;
    
    // Check if speech is available
    this.checkAvailability();
  }

  async checkAvailability() {
    try {
      // Try to get available voices to verify speech is available
      const voices = await Speech.getAvailableVoicesAsync();
      this.isAvailable = voices && voices.length > 0;
      if (!this.isAvailable) {
        console.warn('Speech: No voices available');
      } else {
        console.log(`Speech: ${voices.length} voices available`);
      }
    } catch (error) {
      console.warn('Speech: Could not check availability:', error);
      // Continue anyway - speech might still work
    }
  }

  speak(text, options = {}) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.warn('Speech: Empty or invalid text provided');
      if (options.onError) {
        options.onError(new Error('Empty text'));
      }
      return;
    }

    const {
      language = 'en-US',
      rate = 0.8,
      pitch = 1.0,
      onDone,
      onError,
    } = options;

    // Stop any current speech first
    Speech.stop();

    try {
      Speech.speak(text.trim(), {
        language,
        rate: Math.max(0.1, Math.min(1.0, rate)), // Clamp rate between 0.1 and 1.0
        pitch: Math.max(0.5, Math.min(2.0, pitch)), // Clamp pitch between 0.5 and 2.0
        onStart: () => {
          this.isSpeaking = true;
          console.log('Speech started:', text.substring(0, 50));
        },
        onDone: () => {
          this.isSpeaking = false;
          console.log('Speech done:', text.substring(0, 50));
          if (onDone) {
            onDone();
          }
        },
        onStopped: () => {
          this.isSpeaking = false;
          console.log('Speech stopped');
        },
        onError: (error) => {
          this.isSpeaking = false;
          console.error('Speech error:', error, 'Text:', text.substring(0, 50));
          if (onError) {
            onError(error);
          }
        },
      });
    } catch (error) {
      console.error('Speech speak error:', error);
      this.isSpeaking = false;
      if (onError) {
        onError(error);
      }
    }
  }

  speakSequence(sequence, callbacks = {}) {
    const { onEnd, onError, onPlayingStateChange } = callbacks;
    
    if (!sequence || sequence.length === 0) {
      console.warn('Speech: Empty sequence provided');
      if (onError) onError(new Error('Empty sequence'));
      return;
    }
    
    // Stop any current speech
    Speech.stop();
    
    this.currentSequence = sequence;
    this.currentIndex = 0;
    this.isSpeaking = true;
    
    if (onPlayingStateChange) onPlayingStateChange(true);
    if (this.onStateChange) this.onStateChange(true);

    // Start speaking the first item
    this.speakNextItem(sequence, callbacks);
  }

  speakNextItem(sequence, callbacks = {}) {
    const { onEnd, onError, onPlayingStateChange } = callbacks;

    if (!this.isSpeaking || this.currentIndex >= sequence.length) {
      // Sequence complete
      this.isSpeaking = false;
      if (onPlayingStateChange) onPlayingStateChange(false);
      if (this.onStateChange) this.onStateChange(false);
      if (onEnd) onEnd();
      return;
    }

    const item = sequence[this.currentIndex];
    
    // Speak the current item
    this.speak(item.text, {
      language: item.lang || 'en-US',
      rate: item.rate || 0.8,
      pitch: item.pitch || 1.0,
      onDone: () => {
        // Move to next item after a pause
        const pause = item.pause || 500;
        setTimeout(() => {
          if (this.isSpeaking) {
            this.currentIndex++;
            this.speakNextItem(sequence, callbacks);
          }
        }, pause);
      },
      onError: (error) => {
        this.isSpeaking = false;
        if (onPlayingStateChange) onPlayingStateChange(false);
        if (this.onStateChange) this.onStateChange(false);
        if (onError) onError(error);
      },
    });
  }

  stop() {
    this.isSpeaking = false;
    this.currentSequence = [];
    this.currentIndex = 0;
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

