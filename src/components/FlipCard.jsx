import React, { useState, useRef, useEffect } from 'react'
import { getImageUrl, getIconUrl } from '../config/assets'
import { getCardDataByImage } from '../config/cardData'
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
  const speechSynthesisRef = useRef(null)
  const currentUtteranceRef = useRef(null)

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

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (currentUtteranceRef.current) {
        window.speechSynthesis.cancel()
      }
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
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      currentUtteranceRef.current = null
    } else {
      playAudioSequence()
    }
  }

  const playAudioSequence = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support text-to-speech. Please use a modern browser.')
      return
    }

    setIsPlaying(true)
    window.speechSynthesis.cancel()
    currentUtteranceRef.current = null

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
        rate: 0.9,
        pitch: 1.1,
        pause: 800
      },
      // Step 2: Translate the object name into Chinese and say it
      {
        text: `中文是${data.nameChinese}。${data.nameChinese}。`,
        lang: 'zh-CN',
        rate: 0.85,
        pitch: 1.0,
        pause: 800
      },
      // Step 3: Teach the child how to pronounce the English word, slowly and clearly
      {
        text: `Let's learn how to say ${data.nameEnglish}. Listen carefully: ${data.nameEnglish}. Say it with me: ${data.nameEnglish}. Great job!`,
        lang: 'en-US',
        rate: 0.7,
        pitch: 1.1,
        pause: 1000
      },
      // Step 4: Explain how to recognize the object in a simple, kid-friendly way
      {
        text: `Here's how you can recognize a ${data.nameEnglish}:`,
        lang: 'en-US',
        rate: 0.85,
        pitch: 1.1,
        pause: 600
      },
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
        text: `Here's a fun fact: ${data.funFact}`,
        lang: 'zh-CN',
        rate: 0.85,
        pitch: 1.0,
        pause: 0
      }
    ]

    let currentIndex = 0

    const speakNext = () => {
      if (currentIndex >= sequence.length) {
        setIsPlaying(false)
        currentUtteranceRef.current = null
        return
      }

      const item = sequence[currentIndex]
      const utterance = new SpeechSynthesisUtterance(item.text)
      utterance.lang = item.lang
      utterance.rate = item.rate
      utterance.pitch = item.pitch
      utterance.volume = 1.0

      utterance.onend = () => {
        // Add pause between utterances
        setTimeout(() => {
          currentIndex++
          speakNext()
        }, item.pause || 500)
      }

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error)
        setIsPlaying(false)
        currentUtteranceRef.current = null
      }

      currentUtteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    speakNext()
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
              aria-label="Play audio"
            >
              <div className="sound-button-background">
                {soundButtonIcon && <img alt="" src={soundButtonIcon} />}
              </div>
              <VolumeUp className="volume-up-overlay" />
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

