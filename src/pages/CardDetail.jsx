import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DetailHeader from '../components/DetailHeader'
import SearchBar from '../components/SearchBar'
import CardStatus from '../components/CardStatus'
import './CardDetail.css'

// Sample card data - in a real app this would come from an API or state management
const cardSets = {
  'dinosaur': {
    id: 1,
    title: 'Dinosaur',
    cardCount: 10,
    description: 'A set of learning cards designed to help children recognize and remember different dinosaurs with pictures and simple facts.',
    cards: [
      { id: 1, name: 'Tyrannosaurus Rex', image: 'tyrannosaurusRex2' },
      { id: 2, name: 'Triceratops', image: 'tyrannosaurusRex' },
      { id: 3, name: 'Brachiosaurus', image: 'tyrannosaurusRex2' },
      { id: 4, name: 'Stegosaurus', image: 'tyrannosaurusRex' },
      { id: 5, name: 'Velociraptor', image: 'tyrannosaurusRex2' },
      { id: 6, name: 'Pterodactyl', image: 'tyrannosaurusRex' },
      { id: 7, name: 'Spinosaurus', image: 'tyrannosaurusRex2' },
      { id: 8, name: 'Ankylosaurus', image: 'tyrannosaurusRex' },
      { id: 9, name: 'Diplodocus', image: 'tyrannosaurusRex2' },
      { id: 10, name: 'Allosaurus', image: 'tyrannosaurusRex' }
    ]
  },
  'fruit': {
    id: 2,
    title: 'Fruit',
    cardCount: 10,
    description: 'Learn about different fruits with colorful pictures and fun facts.',
    cards: [
      { id: 1, name: 'Apple', image: 'tyrannosaurusRex2' },
      { id: 2, name: 'Banana', image: 'tyrannosaurusRex' },
      { id: 3, name: 'Orange', image: 'tyrannosaurusRex2' },
      { id: 4, name: 'Grape', image: 'tyrannosaurusRex' },
      { id: 5, name: 'Strawberry', image: 'tyrannosaurusRex2' },
      { id: 6, name: 'Pineapple', image: 'tyrannosaurusRex' },
      { id: 7, name: 'Mango', image: 'tyrannosaurusRex2' },
      { id: 8, name: 'Watermelon', image: 'tyrannosaurusRex' },
      { id: 9, name: 'Cherry', image: 'tyrannosaurusRex2' },
      { id: 10, name: 'Peach', image: 'tyrannosaurusRex' }
    ]
  },
  'animals': {
    id: 3,
    title: 'Animals',
    cardCount: 10,
    description: 'Discover various animals from around the world.',
    cards: [
      { id: 1, name: 'Lion', image: 'tyrannosaurusRex2' },
      { id: 2, name: 'Elephant', image: 'tyrannosaurusRex' },
      { id: 3, name: 'Tiger', image: 'tyrannosaurusRex2' },
      { id: 4, name: 'Giraffe', image: 'tyrannosaurusRex' },
      { id: 5, name: 'Monkey', image: 'tyrannosaurusRex2' },
      { id: 6, name: 'Zebra', image: 'tyrannosaurusRex' },
      { id: 7, name: 'Bear', image: 'tyrannosaurusRex2' },
      { id: 8, name: 'Panda', image: 'tyrannosaurusRex' },
      { id: 9, name: 'Kangaroo', image: 'tyrannosaurusRex2' },
      { id: 10, name: 'Penguin', image: 'tyrannosaurusRex' }
    ]
  }
}

const CardDetail = () => {
  const { setId } = useParams()
  const navigate = useNavigate()
  
  // Convert route param to lowercase to match cardSets keys
  // Handle both hyphenated and non-hyphenated IDs
  const setIdLower = setId?.toLowerCase() || 'dinosaur'
  const cardSet = cardSets[setIdLower] || cardSets['dinosaur']

  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < cardSet.cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleCardClick = (index) => {
    if (index === currentIndex) {
      // If clicking the active card, flip it (can be implemented later)
      return
    }
    setCurrentIndex(index)
  }

  const handleAddClick = () => {
    // Handle add card functionality
    console.log('Add card clicked')
  }

  const handleSearch = () => {
    // Handle search functionality
    console.log('Search clicked')
  }

  // Get visible cards (current and next 2)
  const getVisibleCards = () => {
    const visible = []
    const maxVisible = 3
    
    for (let i = 0; i < maxVisible; i++) {
      const index = currentIndex + i
      if (index < cardSet.cards.length) {
        visible.push({
          ...cardSet.cards[index],
          index,
          isActive: i === 0
        })
      }
    }
    return visible
  }

  const visibleCards = getVisibleCards()

  return (
    <div className="card-detail">
      <div className="card-detail-container">
        <DetailHeader onAddClick={handleAddClick} />
        <div className="card-detail-content">
          <div className="card-detail-info">
            <div className="card-detail-title-container">
              <h1 className="card-detail-title">{cardSet.title}</h1>
              <p className="card-detail-count">{cardSet.cardCount} Cards</p>
            </div>
            <div className="card-detail-description-container">
              <p className="card-detail-description">{cardSet.description}</p>
            </div>
          </div>
          <SearchBar />
          <div 
            className="card-detail-cards-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {visibleCards.map((card, i) => (
              <div
                key={card.id}
                className={`card-detail-card-wrapper ${card.isActive ? 'card-active' : 'card-inactive'}`}
                style={{
                  zIndex: cardSet.cards.length - card.index,
                  transform: `translateY(${i * -280}px)`
                }}
                onClick={() => handleCardClick(card.index)}
              >
                <CardStatus
                  status={card.isActive}
                  name={card.name}
                  image={card.image}
                  onClick={() => handleCardClick(card.index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardDetail

