import React from 'react'
import './Header.css'
import addIcon from '../assets/add-icon.svg'

const Header = () => {
  return (
    <header className="header">
      <div className="header-library-container">
        <div className="header-library-content">
          <p className="header-title">Your library</p>
        </div>
      </div>
      <div className="header-create-container">
        <div className="header-create-button-container">
          <div className="header-create-text-container">
            <p className="header-create-text">Create </p>
          </div>
          <div className="header-add-icon">
            <img alt="Add" src={addIcon} className="add-icon-img" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
