import React from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CardList from './components/CardList'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <Header />
        <div className="content-section">
          <SearchBar />
          <CardList />
        </div>
      </div>
    </div>
  )
}

export default App
