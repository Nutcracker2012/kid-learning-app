import React from 'react'
import './SearchBar.css'
import searchIcon from '../assets/search-icon.svg'

const SearchBar = () => {
  return (
    <button className="search-bar" type="button">
      <div className="search-bar-container">
        <div className="search-icon-container">
          <img alt="Search" src={searchIcon} className="search-icon" />
        </div>
        <p className="search-placeholder">Search</p>
      </div>
    </button>
  )
}

export default SearchBar
