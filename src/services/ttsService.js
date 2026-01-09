/**
 * Text-to-Speech Service
 * Provides natural, kid-friendly text-to-speech using Web Speech API
 * with intelligent voice selection and optimized parameters
 */

class TTSService {
  constructor() {
    this.voices = []
    this.voiceCache = new Map() // Cache selected voices by language
    this.isInitialized = false
    this.currentUtterance = null
    this.speechSequence = []
    this.currentSequenceIndex = 0
    this.onSequenceEnd = null
    this.onSequenceError = null
    this.onPlayingStateChange = null
  }

  /**
   * Initialize voices - call this once on app startup
   * Voices may not be immediately available, so we handle async loading
   */
  initializeVoices() {
    if (this.isInitialized) {
      return Promise.resolve()
    }

    // Check if Web Speech API is available
    if (!('speechSynthesis' in window)) {
      console.warn('Web Speech API is not available in this browser')
      return Promise.reject(new Error('Speech synthesis not supported'))
    }

    return new Promise((resolve) => {
      // Get voices synchronously first (may be empty)
      this.voices = window.speechSynthesis.getVoices()

      if (this.voices.length > 0) {
        this.isInitialized = true
        resolve()
      } else {
        // Voices load asynchronously - wait for them
        const onVoicesChanged = () => {
          this.voices = window.speechSynthesis.getVoices()
          if (this.voices.length > 0) {
            window.speechSynthesis.onvoiceschanged = null
            this.isInitialized = true
            resolve()
          }
        }

        window.speechSynthesis.onvoiceschanged = onVoicesChanged

        // Fallback timeout in case voices never load
        setTimeout(() => {
          if (!this.isInitialized && this.voices.length === 0) {
            console.warn('Voices did not load within timeout, continuing with default')
            this.isInitialized = true
            resolve()
          }
        }, 3000)
      }
    })
  }

  /**
   * Check if a voice name matches kid-friendly patterns
   * @param {string} voiceName - Name of the voice
   * @returns {boolean}
   */
  isKidFriendlyVoice(voiceName) {
    const name = voiceName.toLowerCase()
    const kidFriendlyPatterns = [
      'child', 'kid', 'young', 'friendly', 'warm',
      'samantha', 'karen', 'susan', 'zira', 'hazel',
      'ting-ting', 'sin-ji', 'mei-jia', 'xiaoxiao', 'xiaoyan'
    ]
    return kidFriendlyPatterns.some(pattern => name.includes(pattern))
  }

  /**
   * Check if a voice is female (for kid-friendly selection)
   * @param {SpeechSynthesisVoice} voice
   * @returns {boolean}
   */
  isFemaleVoice(voice) {
    const name = voice.name.toLowerCase()
    // Common female voice name patterns
    const femalePatterns = [
      'samantha', 'karen', 'susan', 'zira', 'hazel', 'victoria',
      'ting-ting', 'sin-ji', 'mei-jia', 'xiaoxiao', 'xiaoyan', 
      'yuna', 'sora', 'hiromi', 'maria', 'monica', 'linda'
    ]
    return femalePatterns.some(pattern => name.includes(pattern))
  }

  /**
   * Get the best voice for a given language
   * @param {string} lang - Language code (e.g., 'en-US', 'zh-CN')
   * @param {Object} preferences - Voice preferences
   * @returns {SpeechSynthesisVoice|null}
   */
  getBestVoice(lang, preferences = {}) {
    if (!this.isInitialized || this.voices.length === 0) {
      // Return null if voices aren't loaded - caller should handle fallback
      return null
    }

    // Check cache first
    if (this.voiceCache.has(lang)) {
      return this.voiceCache.get(lang)
    }

    // Filter voices by language
    const langVoices = this.voices.filter(voice => {
      // Check if voice supports the language
      return voice.lang.startsWith(lang.split('-')[0]) || 
             voice.lang === lang ||
             (lang.startsWith('en') && voice.lang.startsWith('en')) ||
             (lang.startsWith('zh') && voice.lang.startsWith('zh'))
    })

    if (langVoices.length === 0) {
      // Fallback: try to find any voice with matching primary language
      const primaryLang = lang.split('-')[0]
      const fallbackVoices = this.voices.filter(voice => 
        voice.lang.startsWith(primaryLang)
      )
      if (fallbackVoices.length > 0) {
        const selected = fallbackVoices[0]
        this.voiceCache.set(lang, selected)
        return selected
      }
      return null
    }

    // Priority order for kid-friendly selection:
    // 1. Kid-friendly AND female voices
    // 2. Female voices
    // 3. Kid-friendly voices
    // 4. Default/local voices
    // 5. Any available voice

    let selectedVoice = null

    // Try kid-friendly + female
    selectedVoice = langVoices.find(voice => 
      this.isKidFriendlyVoice(voice.name) && this.isFemaleVoice(voice)
    )
    if (selectedVoice) {
      this.voiceCache.set(lang, selectedVoice)
      console.log(`Selected kid-friendly female voice for ${lang}:`, selectedVoice.name)
      return selectedVoice
    }

    // Try female voices
    selectedVoice = langVoices.find(voice => this.isFemaleVoice(voice))
    if (selectedVoice) {
      this.voiceCache.set(lang, selectedVoice)
      console.log(`Selected female voice for ${lang}:`, selectedVoice.name)
      return selectedVoice
    }

    // Try kid-friendly voices
    selectedVoice = langVoices.find(voice => this.isKidFriendlyVoice(voice.name))
    if (selectedVoice) {
      this.voiceCache.set(lang, selectedVoice)
      console.log(`Selected kid-friendly voice for ${lang}:`, selectedVoice.name)
      return selectedVoice
    }

    // Try default/local voices (usually better quality)
    selectedVoice = langVoices.find(voice => voice.default || voice.localService)
    if (selectedVoice) {
      this.voiceCache.set(lang, selectedVoice)
      console.log(`Selected default/local voice for ${lang}:`, selectedVoice.name)
      return selectedVoice
    }

    // Fallback to first available
    selectedVoice = langVoices[0]
    if (selectedVoice) {
      this.voiceCache.set(lang, selectedVoice)
      console.log(`Using fallback voice for ${lang}:`, selectedVoice.name)
      return selectedVoice
    }

    return null
  }

  /**
   * Get optimized voice parameters for kid-friendly speech
   * @param {string} lang - Language code
   * @returns {Object} Parameters object
   */
  getKidFriendlyParams(lang) {
    const baseParams = {
      volume: 0.95, // Slightly below max for clarity
    }

    if (lang.startsWith('en')) {
      return {
        ...baseParams,
        rate: 0.8, // Slower for clarity and learning
        pitch: 1.15, // Higher, warmer pitch
      }
    } else if (lang.startsWith('zh')) {
      return {
        ...baseParams,
        rate: 0.85, // Moderate pace for Chinese
        pitch: 1.0, // Natural pitch for Chinese
      }
    }

    // Default parameters
    return {
      ...baseParams,
      rate: 0.8,
      pitch: 1.1,
    }
  }

  /**
   * Speak a sequence of text items with pauses
   * @param {Array<Object>} items - Array of speech items with text, lang, and optional overrides
   * @param {Object} callbacks - Callback functions
   * @param {Function} callbacks.onEnd - Called when sequence completes
   * @param {Function} callbacks.onError - Called on error
   * @param {Function} callbacks.onPlayingStateChange - Called when playing state changes
   */
  speakSequence(items, callbacks = {}) {
    if (!('speechSynthesis' in window)) {
      const error = new Error('Your browser does not support text-to-speech. Please use a modern browser.')
      if (callbacks.onError) {
        callbacks.onError(error)
      } else {
        alert(error.message)
      }
      return
    }

    // Stop any current speech
    this.stop()

    this.speechSequence = items
    this.currentSequenceIndex = 0
    this.onSequenceEnd = callbacks.onEnd
    this.onSequenceError = callbacks.onError
    this.onPlayingStateChange = callbacks.onPlayingStateChange

    if (this.onPlayingStateChange) {
      this.onPlayingStateChange(true)
    }

    this.speakNext()
  }

  /**
   * Speak the next item in the sequence
   * @private
   */
  speakNext() {
    if (this.currentSequenceIndex >= this.speechSequence.length) {
      // Sequence complete
      if (this.onSequenceEnd) {
        this.onSequenceEnd()
      }
      if (this.onPlayingStateChange) {
        this.onPlayingStateChange(false)
      }
      this.currentUtterance = null
      return
    }

    const item = this.speechSequence[this.currentSequenceIndex]
    const lang = item.lang || 'en-US'
    
    // Get voice for this language
    const voice = this.getBestVoice(lang)
    
    // Get kid-friendly parameters, with item overrides
    const baseParams = this.getKidFriendlyParams(lang)
    const params = {
      ...baseParams,
      rate: item.rate !== undefined ? item.rate : baseParams.rate,
      pitch: item.pitch !== undefined ? item.pitch : baseParams.pitch,
      volume: item.volume !== undefined ? item.volume : baseParams.volume,
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(item.text)
    utterance.lang = lang
    
    if (voice) {
      utterance.voice = voice
    }
    
    utterance.rate = params.rate
    utterance.pitch = params.pitch
    utterance.volume = params.volume

    // Handle utterance end
    utterance.onend = () => {
      const pause = item.pause || 600
      setTimeout(() => {
        this.currentSequenceIndex++
        this.speakNext()
      }, pause)
    }

    // Handle errors
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error)
      if (this.onSequenceError) {
        this.onSequenceError(error)
      }
      if (this.onPlayingStateChange) {
        this.onPlayingStateChange(false)
      }
      this.currentUtterance = null
    }

    // Store current utterance
    this.currentUtterance = utterance
    
    // Speak
    window.speechSynthesis.speak(utterance)
  }

  /**
   * Stop current speech
   */
  stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    this.currentUtterance = null
    this.speechSequence = []
    this.currentSequenceIndex = 0
    if (this.onPlayingStateChange) {
      this.onPlayingStateChange(false)
    }
  }

  /**
   * Check if currently speaking
   * @returns {boolean}
   */
  isSpeaking() {
    return window.speechSynthesis?.speaking || false
  }
}

// Export singleton instance
const ttsService = new TTSService()

export default ttsService

