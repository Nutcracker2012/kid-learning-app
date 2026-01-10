import React, { useState, useEffect } from 'react'
import { getImageUrl, getIconUrl } from '../config/assets'
import { getCardDataByImage } from '../config/cardData'
import ttsService from '../services/ttsService'
import './FlipCard.css'

/**
 * Icon Components
 */
const VolumeUp = ({ className }) => {
  const iconUrl = getIconUrl('volumeUp')
  return (
    <div className={`volume-up-icon ${className || ''}`}>
      <div className="volume-up-icon-vector">
        {iconUrl && <img alt="" src={iconUrl} />}
      </div>
    </div>
  )
}

const StopIcon = ({ className }) => {
  const iconUrl = getIconUrl('stop')
  return (
    <div className={`volume-up-icon ${className || ''}`}>
      <div className="volume-up-icon-vector">
        {iconUrl && <img alt="" src={iconUrl} />}
      </div>
    </div>
  )
}

const ChevronRight = ({ className }) => {
  const iconUrl = getIconUrl('chevronRight')
  return (
    <div className={`chevron-right-icon ${className || ''}`}>
      <div className="chevron-right-icon-vector">
        {iconUrl && <img alt="" src={iconUrl} />}
      </div>
    </div>
  )
}

/**
 * FlipCard Component
 * @param {Object} props
 * @param {string} props.name - Card name (e.g., "Tyrannosaurus Rex")
 * @param {string} [props.image] - Image key for the card image
 * @param {Object} props.cardData - Card data object with audio content
 * @param {string} props.cardData.nameEnglish - English name
 * @param {string} props.cardData.nameChinese - Chinese name
 * @param {string} props.cardData.pronunciation - Pronunciation guide
 * @param {Array<string>} props.cardData.recognitionFeatures - Array of recognition features
 * @param {string} props.cardData.funFact - Fun fact about the object
 */
const FlipCard = ({ 
  name = 'Tyrannosaurus Rex',
  image = 'tyrannosaurusRex2',
  cardData
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const imageSrc = getImageUrl(image)
  const soundButtonIcon = getIconUrl('soundButton')

  // Get card data from config or use provided cardData
  const cardDataFromConfig = getCardDataByImage(image)
  const defaultCardData = {
    nameEnglish: 'Tyrannosaurus Rex',
    nameChinese: '霸王龙',
    pronunciation: '/tɪˌrænəˈsɔːrəs rɛks/',
    recognitionFeatures: [
      '大头与尖牙 – 巨大的头骨里有又长又尖的牙齿，用来吃肉',
      '小手臂 – 非常短的前臂，仅有两根手指',
      '强壮的后腿 – 有力的后腿，适合行走和追捕猎物',
      '长而沉重的尾巴 – 帮助保持平衡',
      '庞大的身体 – 是最大的食肉恐龙之一'
    ],
    funFact: '霸王龙的牙齿和香蕉一样大，而且它那超强的咬合力可以轻松咬碎骨头！'
  }

  const data = cardData || cardDataFromConfig || defaultCardData

  // Initialize TTS service and clean up on unmount
  useEffect(() => {
    // Initialize voices on component mount
    ttsService.initializeVoices().catch((error) => {
      console.warn('Failed to initialize TTS voices:', error)
    })

    // Clean up speech synthesis on unmount
    return () => {
      ttsService.stop()
    }
  }, [])

  const handleCardClick = (e) => {
    // Don't flip if clicking the audio button
    if (e.target.closest('.flip-card-audio-button')) {
      return
    }
    setIsFlipped(!isFlipped)
  }

  const handleAudioClick = (e) => {
    e.stopPropagation()
    if (isPlaying) {
      // Stop current audio
      ttsService.stop()
      setIsPlaying(false)
    } else {
      playAudioSequence()
    }
  }

  const playAudioSequence = () => {
    // Ensure voices are initialized
    ttsService.initializeVoices().then(() => {
      setIsPlaying(true)

      // Audio sequence following exact requirements:
      // 1. Say the object name in English
      // 2. Translate the object name into Chinese and say it
      // 3. Teach the child how to pronounce the English word, slowly and clearly
      // 4. Explain how to recognize the object in a simple, kid-friendly way
      // 5. End with a fun fact about the object

      const sequence = [
        // Step 1: Say the object name in English
        {
          text: data.nameEnglish,
          lang: 'en-US',
          rate: 0.8, // Use TTS service defaults but allow overrides
          pitch: 1.15,
          pause: 800
        },
        // Step 2: Translate the object name into Chinese and say it
        {
          text: data.nameChinese,
          lang: 'zh-CN',
          rate: 0.85,
          pitch: 1.0,
          pause: 800
        },
        // Step 3: Teach the child how to pronounce the English word, slowly and clearly
        {
          text: `${data.nameEnglish}. ${data.nameEnglish}.`,
          lang: 'en-US',
          rate: 0.7, // Slower for teaching pronunciation
          pitch: 1.15,
          pause: 1000
        },
        // Step 4: Explain how to recognize the object in a simple, kid-friendly way
        ...data.recognitionFeatures.map((feature, index) => {
          const parts = feature.split('–')
          const label = parts[0].trim()
          const description = parts[1]?.trim() || ''
          return {
            text: `${label}. ${description}`,
            lang: 'zh-CN',
            rate: 0.8,
            pitch: 1.0,
            pause: index === data.recognitionFeatures.length - 1 ? 800 : 600
          }
        }),
        // Step 5: End with a fun fact about the object
        {
          text: data.funFact,
          lang: 'zh-CN',
          rate: 0.85,
          pitch: 1.0,
          pause: 0
        }
      ]

      // Use TTS service to speak the sequence
      ttsService.speakSequence(sequence, {
        onEnd: () => {
          setIsPlaying(false)
        },
        onError: (error) => {
          console.error('TTS error:', error)
          setIsPlaying(false)
          // User-friendly error message
          if (!error.message.includes('not support')) {
            alert('There was an error playing the audio. Please try again.')
          }
        },
        onPlayingStateChange: (isPlaying) => {
          setIsPlaying(isPlaying)
        }
      })
    }).catch((error) => {
      console.error('Failed to initialize TTS:', error)
      alert('Text-to-speech is not available. Please use a modern browser that supports speech synthesis.')
      setIsPlaying(false)
    })
  }

  // Format recognition features for display
  const formatRecognitionFeatures = () => {
    return data.recognitionFeatures.map((feature, index) => {
      const parts = feature.split('–')
      return (
        <p key={index} className="card-recognition-feature">
          <span className="card-recognition-label">{parts[0].trim()}</span>
          {parts[1] && <span className="card-recognition-desc"> – {parts[1].trim()}</span>}
        </p>
      )
    })
  }

  return (
    <div className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}>
      <div className="flip-card-inner">
        {/* Front Side */}
        <button className="flip-card flip-card-front" onClick={handleCardClick}>
          <div className="card-front-container">
            {imageSrc && (
              <div className="card-image-container">
                <div className="card-image-aspect-wrapper">
                  <img
                    alt={name}
                    src={imageSrc}
                    className="card-image"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="card-title-section">
            <div className="card-title-container">
              <p className="card-title-text">{name}</p>
            </div>
            <div className="card-flip-button">
              <div className="flip-button-background">
                {soundButtonIcon && <img alt="" src={soundButtonIcon} />}
              </div>
              <ChevronRight className="chevron-right-overlay" />
            </div>
          </div>
        </button>

        {/* Back Side */}
        <button className="flip-card flip-card-back" onClick={handleCardClick}>
          <div className="card-back-container">
            <button 
              className={`flip-card-audio-button ${isPlaying ? 'playing' : ''}`}
              onClick={handleAudioClick}
              aria-label={isPlaying ? "Stop audio" : "Play audio"}
            >
              <div className="sound-button-background">
                {soundButtonIcon && <img alt="" src={soundButtonIcon} />}
              </div>
              {isPlaying ? (
                <StopIcon className="volume-up-overlay" />
              ) : (
                <VolumeUp className="volume-up-overlay" />
              )}
            </button>
            <div className="card-info-container">
              <div className="card-name-container">
                <p className="card-name-text">
                  {data.nameEnglish} ({data.nameChinese})
                </p>
              </div>
              <div className="card-pronunciation-container">
                <p className="card-pronunciation-text">{data.pronunciation}</p>
              </div>
            </div>
            <div className="card-note-container">
              <p className="card-note-label">识别特征:</p>
              <div className="card-recognition-features">
                {formatRecognitionFeatures()}
              </div>
            </div>
            <div className="card-fun-fact-container">
              <p className="card-fun-fact-label">趣味小知识:</p>
              <p className="card-fun-fact-text">{data.funFact}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default FlipCard

