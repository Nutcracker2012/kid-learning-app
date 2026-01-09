/**
 * Text-to-Speech Service
 * Provides natural, kid-friendly text-to-speech using edge-tts backend service
 * with high-quality neural voices optimized for children's learning
 */

// Backend API configuration
const TTS_BACKEND_URL = import.meta.env.VITE_TTS_BACKEND_URL || 'http://localhost:8000'

// Voice configuration mapping (backend will handle voice selection, but we keep this for reference)
const VOICE_CONFIG = {
  'en-US': 'en-US-AnaNeural',  // Child-friendly English
  'zh-CN': 'zh-CN-XiaoYiNeural', // Lively, kid-friendly Chinese
  'zh-TW': 'zh-TW-HsiaoYuNeural', // Friendly Taiwanese Mandarin
}

class TTSService {
  constructor() {
    this.speechSequence = []
    this.currentSequenceIndex = 0
    this.onSequenceEnd = null
    this.onSequenceError = null
    this.onPlayingStateChange = null
    this.currentAudio = null
    this.currentUtterance = null // For Web Speech API fallback
    this.isInitialized = true // Always initialized (no voice loading needed)
    this.audioCache = new Map() // Cache audio URLs by text+lang+params
    this.backendAvailable = true // Track backend availability
    this.useFallback = false // Use Web Speech API fallback
    this.maxRetries = 2 // Maximum retry attempts
    this.retryDelay = 1000 // Delay between retries (ms)
  }

  /**
   * Initialize service - maintained for API compatibility
   * @returns {Promise}
   */
  initializeVoices() {
    // No initialization needed for backend service
    return Promise.resolve()
  }

  /**
   * Convert rate, pitch, volume to edge-tts format
   * @param {number} rate - Speech rate (0.5 to 2.0, where 1.0 is normal)
   * @param {number} pitch - Pitch multiplier (0.5 to 2.0, where 1.0 is normal)
   * @param {number} volume - Volume (0.0 to 1.0)
   * @returns {Object} Formatted parameters
   */
  formatTTSParams(rate, pitch, volume) {
    // Convert rate: 0.8 -> -20%, 1.0 -> +0%, 1.2 -> +20%
    const ratePercent = Math.round((rate - 1.0) * 100)
    const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`
    
    // Convert pitch: 1.0 -> +0Hz, 1.15 -> +15Hz (approximate)
    // Note: edge-tts pitch is in Hz, we approximate based on multiplier
    const pitchHz = Math.round((pitch - 1.0) * 20) // Rough conversion
    const pitchStr = pitchHz >= 0 ? `+${pitchHz}Hz` : `${pitchHz}Hz`
    
    // Convert volume: 0.95 -> +0% (edge-tts volume is relative)
    const volumePercent = Math.round((volume - 1.0) * 100)
    const volumeStr = volumePercent >= 0 ? `+${volumePercent}%` : `${volumePercent}%`
    
    return { rate: rateStr, pitch: pitchStr, volume: volumeStr }
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
   * Fetch audio from backend TTS service with retry logic
   * @param {string} text - Text to convert to speech
   * @param {string} lang - Language code
   * @param {Object} params - Speech parameters (rate, pitch, volume)
   * @param {number} retryCount - Current retry attempt
   * @returns {Promise<string>} Audio URL
   */
  async fetchAudioFromBackend(text, lang, params = {}, retryCount = 0) {
    const cacheKey = `${text}|${lang}|${JSON.stringify(params)}`
    
    // Check cache first
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)
    }

    // If backend is known to be unavailable, skip to fallback
    if (!this.backendAvailable && retryCount === 0) {
      throw new Error('Backend unavailable, using fallback')
    }

    try {
      const ttsParams = this.formatTTSParams(
        params.rate || 1.0,
        params.pitch || 1.0,
        params.volume || 1.0
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${TTS_BACKEND_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          lang: lang,
          rate: ttsParams.rate,
          pitch: ttsParams.pitch,
          volume: ttsParams.volume,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status} ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      
      // Cache the blob URL
      const audioUrl = URL.createObjectURL(audioBlob)
      this.audioCache.set(cacheKey, audioUrl)
      
      // Mark backend as available
      this.backendAvailable = true
      
      return audioUrl
    } catch (error) {
      // Retry logic
      if (retryCount < this.maxRetries && !error.message.includes('aborted')) {
        console.warn(`TTS request failed, retrying (${retryCount + 1}/${this.maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        return this.fetchAudioFromBackend(text, lang, params, retryCount + 1)
      }
      
      // Mark backend as unavailable after max retries
      if (retryCount >= this.maxRetries) {
        this.backendAvailable = false
        console.warn('TTS backend unavailable, will use fallback for future requests')
      }
      
      throw error
    }
  }

  /**
   * Fallback to Web Speech API
   * @param {string} text - Text to speak
   * @param {string} lang - Language code
   * @param {Object} params - Speech parameters
   * @returns {Promise} Resolves when speech completes
   */
  speakWithWebSpeechAPI(text, lang, params) {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Web Speech API not available'))
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = params.rate || 1.0
      utterance.pitch = params.pitch || 1.0
      utterance.volume = params.volume || 1.0

      utterance.onend = () => {
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (error) => {
        this.currentUtterance = null
        reject(error)
      }

      this.currentUtterance = utterance
      window.speechSynthesis.speak(utterance)
    })
  }

  /**
   * Play audio from URL
   * @param {string} audioUrl - URL to audio file
   * @returns {Promise} Resolves when audio finishes playing
   */
  playAudio(audioUrl) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl)
      this.currentAudio = audio

      audio.onended = () => {
        this.currentAudio = null
        resolve()
      }

      audio.onerror = (error) => {
        this.currentAudio = null
        reject(new Error('Audio playback failed'))
      }

      audio.onabort = () => {
        this.currentAudio = null
        reject(new Error('Audio playback aborted'))
      }

      // Start playing
      audio.play().catch((error) => {
        this.currentAudio = null
        reject(error)
      })
    })
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
  async speakNext() {
    if (this.currentSequenceIndex >= this.speechSequence.length) {
      // Sequence complete
      if (this.onSequenceEnd) {
        this.onSequenceEnd()
      }
      if (this.onPlayingStateChange) {
        this.onPlayingStateChange(false)
      }
      this.currentAudio = null
      return
    }

    const item = this.speechSequence[this.currentSequenceIndex]
    const lang = item.lang || 'en-US'
    
    // Get kid-friendly parameters, with item overrides
    const baseParams = this.getKidFriendlyParams(lang)
    const params = {
      ...baseParams,
      rate: item.rate !== undefined ? item.rate : baseParams.rate,
      pitch: item.pitch !== undefined ? item.pitch : baseParams.pitch,
      volume: item.volume !== undefined ? item.volume : baseParams.volume,
    }

    try {
      // Try to fetch audio from backend
      const audioUrl = await this.fetchAudioFromBackend(item.text, lang, params)
      
      // Play audio
      await this.playAudio(audioUrl)
      
      // Handle pause between items
      const pause = item.pause || 600
      if (pause > 0) {
        await new Promise(resolve => setTimeout(resolve, pause))
      }
      
      // Move to next item
      this.currentSequenceIndex++
      this.speakNext()
    } catch (error) {
      // Fallback to Web Speech API if backend fails
      console.warn('Backend TTS failed, falling back to Web Speech API:', error)
      
      try {
        await this.speakWithWebSpeechAPI(item.text, lang, params)
        
        // Handle pause between items
        const pause = item.pause || 600
        if (pause > 0) {
          await new Promise(resolve => setTimeout(resolve, pause))
        }
        
        // Move to next item
        this.currentSequenceIndex++
        this.speakNext()
      } catch (fallbackError) {
        console.error('Both backend and Web Speech API failed:', fallbackError)
        if (this.onSequenceError) {
          this.onSequenceError(fallbackError)
        }
        if (this.onPlayingStateChange) {
          this.onPlayingStateChange(false)
        }
        this.currentAudio = null
        this.currentUtterance = null
      }
    }
  }

  /**
   * Stop current speech
   */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }
    if (window.speechSynthesis && this.currentUtterance) {
      window.speechSynthesis.cancel()
      this.currentUtterance = null
    }
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
    const audioPlaying = this.currentAudio !== null && !this.currentAudio.paused
    const speechPlaying = window.speechSynthesis?.speaking || false
    return audioPlaying || speechPlaying
  }

  /**
   * Clear audio cache (useful for memory management)
   */
  clearCache() {
    // Revoke all object URLs
    this.audioCache.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
    this.audioCache.clear()
  }
}

// Export singleton instance
const ttsService = new TTSService()

export default ttsService
