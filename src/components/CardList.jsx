import React from 'react'
import CardSet from './CardSet'
import './CardList.css'

const CardList = () => {
  const cards = [
    {
      id: 1,
      title: 'Dinosaur',
      subtitle: '10 cards',
      color: 'blue',
      image: 'dinosaur.png'
    },
    {
      id: 2,
      title: 'Fruit',
      subtitle: '10 cards',
      color: 'pink',
      image: 'fruit.png'
    },
    {
      id: 3,
      title: 'Animals',
      subtitle: '10 cards',
      color: 'yellow',
      image: 'animals.png'
    }
  ]

  return (
    <div className="card-list">
      <div className="card-container">
        {cards.map((card) => (
          <CardSet
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            color={card.color}
            image={card.image}
          />
        ))}
      </div>
    </div>
  )
}

export default CardList
