import React from 'react'
import { getImageUrl, getIconUrl } from '../config/assets'
import './Card.css'

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
 * Card Component
 * @param {Object} props
 * @param {string} props.name - Card name (e.g., "Tyrannosaurus Rex")
 * @param {string} props.property1 - Card variant: "Front" | "Back"
 * @param {string} [props.image] - Image key for the card image
 * @param {string} [props.nameEnglish] - English name with Chinese translation (for back side)
 * @param {string} [props.pronunciation] - Pronunciation guide (for back side)
 * @param {string} [props.note] - Note text (for back side)
 * @param {Function} [props.onClick] - Click handler
 */
const Card = ({ 
  name = 'Tyrannosaurus Rex',
  property1 = 'Front',
  image = 'tyrannosaurusRex2',
  nameEnglish,
  pronunciation,
  note,
  onClick
}) => {
  const imageSrc = getImageUrl(image)
  const soundButtonIcon = getIconUrl('soundButton')

  if (property1 === 'Back') {
    return (
      <button className="card card-back" onClick={onClick}>
        <div className="card-back-container">
          <div className="card-sound-button">
            <div className="sound-button-background">
              {soundButtonIcon && <img alt="" src={soundButtonIcon} />}
            </div>
            <VolumeUp className="volume-up-overlay" />
          </div>
          <div className="card-info-container">
            {nameEnglish && (
              <div className="card-name-container">
                <p className="card-name-text">{nameEnglish}</p>
              </div>
            )}
            {pronunciation && (
              <div className="card-pronunciation-container">
                <p className="card-pronunciation-text">{pronunciation}</p>
              </div>
            )}
          </div>
          {note && (
            <div className="card-note-container">
              <p className="card-note-label">Note:</p>
              <p className="card-note-text">{note}</p>
            </div>
          )}
        </div>
      </button>
    )
  }

  // Front variant
  return (
    <button className="card card-front" onClick={onClick}>
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
  )
}

export default Card

