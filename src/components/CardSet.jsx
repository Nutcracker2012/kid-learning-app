import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../config/assets'
import { getDinoColor } from '../tokens'
import './CardSet.css'

/**
 * CardSet Component
 * @param {Object} props
 * @param {string} props.title - Set name (e.g., "SetName")
 * @param {string} props.subtitle - Card count (e.g., "10 cards")
 * @param {string} props.color - Color variant: "Blue" | "Pink" | "Yellow" | "Purple" | "Green" | "Red" | "Orange" | "Navy" | "Mint"
 * @param {string} props.image - Image key for the set image
 */
const CardSet = ({ title = 'SetName', subtitle = '10 cards', color = 'Blue', image }) => {
  const navigate = useNavigate()
  
  // Map image filenames to asset keys
  const imageKeyMap = {
    'dinosaur.png': 'dinosaur',
    'fruit.png': 'fruit',
    'animals.png': 'animals'
  }
  
  const imageKey = imageKeyMap[image] || image?.replace('.png', '')
  const imageSrc = imageKey ? getImageUrl(imageKey) : null

  // Get background color from tokens
  const backgroundColor = getDinoColor(color)

  // Convert title to route-friendly ID
  const getRouteId = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-')
  }

  const handleClick = () => {
    const routeId = getRouteId(title)
    navigate(`/card-set/${routeId}`)
  }

  return (
    <button
      className="card-set" 
      style={{ backgroundColor }}
      onClick={handleClick}
      type="button"
    >
      <div className="card-set-container">
        <div className="card-title-container">
          <p className="card-title">{title}</p>
        </div>
        <div className="card-subtitle-container">
          <p className="card-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="card-set-image-container">
        <div className="card-image-wrapper">
          <div className="card-image-rotation-outer">
            <div className="card-image-cover">
              <div className="card-image-cover-inner">
                <div className="card-image-rotation-inner">
                  {imageSrc && (
                    <div className="card-image-aspect">
                      <img
                        alt={title}
                        src={imageSrc}
                        className="card-image"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

export default CardSet
