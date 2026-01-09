/**
 * Example usage of design tokens
 * This file demonstrates how to use tokens in React components
 * 
 * NOTE: This is for reference only - not imported anywhere
 */

import { 
  colors, 
  typography, 
  spacing, 
  radius, 
  getDinoColor,
  getTypographyStyle 
} from './index'

// Example 1: Using tokens directly in inline styles
export const exampleInlineStyles = {
  card: {
    backgroundColor: colors.dino.blue1,
    color: colors.text.onColor,
    padding: spacing.spacing05,
    borderRadius: radius.small,
    fontFamily: typography.heading05.family,
    fontSize: typography.heading05.size,
    fontWeight: typography.heading05.weight,
    lineHeight: typography.heading05.lineHeight
  },
  searchBar: {
    backgroundColor: colors.background.searchBar,
    height: '60px',
    borderRadius: radius.medium,
    padding: spacing.spacing05,
    opacity: 0.6
  }
}

// Example 2: Using helper functions
export const exampleWithHelpers = {
  // Get Dino color dynamically
  getCardColor: (colorName) => ({
    backgroundColor: getDinoColor(colorName),
    color: colors.text.onColor
  }),
  
  // Get typography style
  getHeadingStyle: (variant) => getTypographyStyle(variant)
}

// Example 3: React component example (commented out - not actual component)
/*
import React from 'react'
import { colors, typography, spacing, radius } from '../tokens'

const ExampleCard = ({ color = 'blue' }) => {
  const cardColor = getDinoColor(color)
  
  return (
    <div style={{
      backgroundColor: cardColor,
      color: colors.text.onColor,
      padding: spacing.spacing05,
      borderRadius: radius.small,
      ...getTypographyStyle('heading05')
    }}>
      Card Content
    </div>
  )
}
*/

// Example 4: Using CSS variables (in CSS file)
export const cssExample = `
.my-card {
  background-color: var(--color-dino-blue1);
  color: var(--color-text-on-color);
  padding: var(--spacing-05);
  border-radius: var(--radius-small);
  font-size: var(--typography-heading-05-size);
  font-weight: var(--typography-heading-05-weight);
  line-height: var(--typography-heading-05-line-height);
}
`
