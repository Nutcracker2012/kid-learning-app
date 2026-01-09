import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CardDetail from './pages/CardDetail'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card-set/:setId" element={<CardDetail />} />
      </Routes>
    </Router>
  )
}

export default App
