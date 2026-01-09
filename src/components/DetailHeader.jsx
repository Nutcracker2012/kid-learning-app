import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getIconUrl } from '../config/assets'
import addIcon from '../assets/add-icon.svg'
import './DetailHeader.css'

const DetailHeader = ({ onAddClick }) => {
  const navigate = useNavigate()
  const arrowLeftIcon = getIconUrl('arrowLeft')

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <header className="detail-header">
      <div className="detail-header-library-container">
        <div className="detail-header-library-content">
          <button className="detail-header-back-button" onClick={handleBack} type="button">
            {arrowLeftIcon && (
              <div className="detail-header-arrow-icon">
                <img alt="Back" src={arrowLeftIcon} className="arrow-icon-img" />
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="detail-header-create-container">
        <button 
          className="detail-header-create-button-container"
          onClick={onAddClick}
          type="button"
        >
          <div className="detail-header-create-text-container">
            <p className="detail-header-create-text">Add</p>
          </div>
          <div className="detail-header-add-icon">
            <img alt="Add" src={addIcon} className="add-icon-img" />
          </div>
        </button>
      </div>
    </header>
  )
}

export default DetailHeader

