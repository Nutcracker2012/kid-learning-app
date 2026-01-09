import React from 'react'
import Card from './Card'
import './CardStatus.css'

/**
 * CardStatus Component
 * @param {Object} props
 * @param {boolean} props.status - Card status: true for active, false for inactive
 * @param {string} props.name - Card name (passed to Card component)
 * @param {string} [props.image] - Image key (passed to Card component)
 * @param {Function} [props.onClick] - Click handler
 */
const CardStatus = ({ 
  status = false, 
  name = 'Tyrannosaurus Rex',
  image = 'tyrannosaurusRex',
  onClick 
}) => {
  return (
    <div className={`card-status ${status ? 'card-status-active' : 'card-status-inactive'}`}>
      <Card 
        name={name}
        property1="Front"
        image={image}
        onClick={onClick}
      />
    </div>
  )
}

export default CardStatus

