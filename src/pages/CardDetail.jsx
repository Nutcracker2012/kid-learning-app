import React from 'react'
import { useParams } from 'react-router-dom'
import DetailHeader from '../components/DetailHeader'
import SearchBar from '../components/SearchBar'
import FlipCard from '../components/FlipCard'
import './CardDetail.css'

// Sample card data - in a real app this would come from an API or state management
const cardSets = {
  'dinosaur': {
    id: 1,
    title: 'Dinosaur',
    cardCount: 30,
    description: 'A set of learning cards designed to help children recognize and remember different dinosaurs with pictures and simple facts.',
    cards: [
      { id: 1, name: 'Tyrannosaurus Rex', image: 'tyrannosaurusRex' },
      { id: 2, name: 'Triceratops', image: 'triceratops' },
      { id: 3, name: 'Velociraptor', image: 'velociraptor' },
      { id: 4, name: 'Stegosaurus', image: 'stegosaurus' },
      { id: 5, name: 'Brachiosaurus', image: 'brachiosaurus' },
      { id: 6, name: 'Apatosaurus', image: 'apatosaurus' },
      { id: 7, name: 'Spinosaurus', image: 'spinosaurus' },
      { id: 8, name: 'Ankylosaurus', image: 'ankylosaurus' },
      { id: 9, name: 'Allosaurus', image: 'allosaurus' },
      { id: 10, name: 'Diplodocus', image: 'diplodocus' },
      { id: 11, name: 'Parasaurolophus', image: 'parasaurolophus' },
      { id: 12, name: 'Iguanodon', image: 'iguanodon' },
      { id: 13, name: 'Carnotaurus', image: 'carnotaurus' },
      { id: 14, name: 'Pteranodon', image: 'pteranodon' },
      { id: 15, name: 'Dilophosaurus', image: 'dilophosaurus' },
      { id: 16, name: 'Therizinosaurus', image: 'therizinosaurus' },
      { id: 17, name: 'Pachycephalosaurus', image: 'pachycephalosaurus' },
      { id: 18, name: 'Giganotosaurus', image: 'giganotosaurus' },
      { id: 19, name: 'Deinonychus', image: 'deinonychus' },
      { id: 20, name: 'Compsognathus', image: 'compsognathus' },
      { id: 21, name: 'Microraptor', image: 'microraptor' },
      { id: 22, name: 'Oviraptor', image: 'oviraptor' },
      { id: 23, name: 'Gallimimus', image: 'gallimimus' },
      { id: 24, name: 'Utahraptor', image: 'utahraptor' },
      { id: 25, name: 'Suchomimus', image: 'suchomimus' },
      { id: 26, name: 'Albertosaurus', image: 'albertosaurus' },
      { id: 27, name: 'Corythosaurus', image: 'corythosaurus' },
      { id: 28, name: 'Protoceratops', image: 'protoceratops' },
      { id: 29, name: 'Maiasaura', image: 'maiasaura' },
      { id: 30, name: 'Archaeopteryx', image: 'archaeopteryx' }
    ]
  },
  'fruit': {
    id: 2,
    title: 'Fruit',
    cardCount: 10,
    description: 'Learn about different fruits with colorful pictures and fun facts.',
    cards: [
      { id: 1, name: 'Apple', image: 'apple' },
      { id: 2, name: 'Banana', image: 'banana' },
      { id: 3, name: 'Orange', image: 'orange' },
      { id: 4, name: 'Grape', image: 'grape' },
      { id: 5, name: 'Strawberry', image: 'strawberry' },
      { id: 6, name: 'Pineapple', image: 'pineapple' },
      { id: 7, name: 'Mango', image: 'mango' },
      { id: 8, name: 'Watermelon', image: 'watermelon' },
      { id: 9, name: 'Cherry', image: 'cherry' },
      { id: 10, name: 'Peach', image: 'peach' }
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
  
  // Convert route param to lowercase to match cardSets keys
  // Handle both hyphenated and non-hyphenated IDs
  const setIdLower = setId?.toLowerCase() || 'dinosaur'
  const cardSet = cardSets[setIdLower] || cardSets['dinosaur']

  const handleAddClick = () => {
    // Handle add card functionality
    console.log('Add card clicked')
  }

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
          <div className="card-detail-cards-container">
            {cardSet.cards.map((card) => (
              <FlipCard
                key={card.id}
                name={card.name}
                image={card.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardDetail

