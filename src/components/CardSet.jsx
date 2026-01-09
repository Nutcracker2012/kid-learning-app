import React from 'react'
import { getImageUrl } from '../config/assets'
import './CardSet.css'

const CardSet = ({ title, subtitle, color, image }) => {
  // Map image filenames to asset keys
  const imageKeyMap = {
    'dinosaur.png': 'dinosaur',
    'fruit.png': 'fruit',
    'animals.png': 'animals'
  }
  
  const imageKey = imageKeyMap[image] || image?.replace('.png', '')
  const imageSrc = imageKey ? getImageUrl(imageKey) : null

  return (
    <div className={`card-set card-set-${color}`}>
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
    </div>
  )
}

export default CardSet
