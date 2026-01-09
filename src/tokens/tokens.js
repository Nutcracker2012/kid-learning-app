// Design tokens loaded from design-system.json
// This file serves as the single source of truth for design tokens
// Note: Vite handles JSON imports automatically, no special syntax needed

import designSystem from '../../design-system.json'

/**
 * Design Tokens
 * All tokens are extracted from design-system.json and structured for easy use in React components
 */

// Colors
export const colors = {
  text: {
    primary: designSystem.colors.text.primary,
    placeholder: designSystem.colors.text.placeholder,
    onColor: designSystem.colors.text.onColor
  },
  background: {
    primary: designSystem.colors.background.primary,
    searchBar: designSystem.colors.background.searchBar,
    card: designSystem.colors.background.card,
    light: designSystem.colors.background.light
  },
  dino: {
    blue1: designSystem.colors.dino.blue1,
    pink: designSystem.colors.dino.pink,
    yellow: designSystem.colors.dino.yellow,
    purple: designSystem.colors.dino.purple,
    green: designSystem.colors.dino.green,
    red: designSystem.colors.dino.red,
    orange: designSystem.colors.dino.orange,
    navy: designSystem.colors.dino.navy,
    mint: designSystem.colors.dino.mint
  },
  coolGray: {
    _10: designSystem.colors.coolGray['10'],
    _70: designSystem.colors.coolGray['70'],
    _90: designSystem.colors.coolGray['90']
  },
  inverse: {
    white: designSystem.colors.inverse.white,
    black: designSystem.colors.inverse.black
  },
  accessibility: {
    white: designSystem.colors.accessibility.white
  },
  icon: {
    onColor: designSystem.colors.icon.onColor
  }
}

// Typography
export const typography = {
  heading03: {
    family: designSystem.typography.heading03.family,
    style: designSystem.typography.heading03.style,
    size: `${designSystem.typography.heading03.size}px`,
    weight: designSystem.typography.heading03.weight,
    lineHeight: `${designSystem.typography.heading03.lineHeight}px`,
    letterSpacing: `${designSystem.typography.heading03.letterSpacing}px`
  },
  heading04: {
    family: designSystem.typography.heading04.family,
    style: designSystem.typography.heading04.style,
    size: `${designSystem.typography.heading04.size}px`,
    weight: designSystem.typography.heading04.weight,
    lineHeight: `${designSystem.typography.heading04.lineHeight}px`,
    letterSpacing: `${designSystem.typography.heading04.letterSpacing}px`
  },
  heading05: {
    family: designSystem.typography.heading05.family,
    style: designSystem.typography.heading05.style,
    size: `${designSystem.typography.heading05.size}px`,
    weight: designSystem.typography.heading05.weight,
    lineHeight: `${designSystem.typography.heading05.lineHeight}px`,
    letterSpacing: `${designSystem.typography.heading05.letterSpacing}px`
  },
  headingCompact01: {
    family: designSystem.typography.headingCompact01.family,
    style: designSystem.typography.headingCompact01.style,
    size: `${designSystem.typography.headingCompact01.size}px`,
    weight: designSystem.typography.headingCompact01.weight,
    lineHeight: `${designSystem.typography.headingCompact01.lineHeight}px`,
    letterSpacing: `${designSystem.typography.headingCompact01.letterSpacing}px`
  },
  bodyCompact02: {
    family: designSystem.typography.bodyCompact02.family,
    style: designSystem.typography.bodyCompact02.style,
    size: `${designSystem.typography.bodyCompact02.size}px`,
    weight: designSystem.typography.bodyCompact02.weight,
    lineHeight: `${designSystem.typography.bodyCompact02.lineHeight}px`,
    letterSpacing: `${designSystem.typography.bodyCompact02.letterSpacing}px`
  }
}

// Spacing
export const spacing = {
  spacing03: designSystem.spacing.spacing03,
  spacing05: designSystem.spacing.spacing05,
  spacing06: designSystem.spacing.spacing06,
  spacing07: designSystem.spacing.spacing07,
  paragraphSpacing: {
    heading05: designSystem.spacing.paragraphSpacing.heading05,
    display03: designSystem.spacing.paragraphSpacing.display03
  }
}

// Radius / Border Radius
export const radius = {
  small: designSystem.radius.small,
  medium: designSystem.radius.medium,
  large: designSystem.radius.large,
  cover: designSystem.radius.cover
}

// Dimensions
export const dimensions = {
  searchBar: {
    height: designSystem.dimensions.searchBar.height
  },
  card: {
    height: designSystem.dimensions.card.height,
    setHeight: designSystem.dimensions.card.setHeight,
    imageSize: designSystem.dimensions.card.imageSize,
    imageContainerSize: designSystem.dimensions.card.imageContainerSize,
    imageAspectRatio: designSystem.dimensions.card.imageAspectRatio,
    contentWidth: designSystem.dimensions.card.contentWidth,
    imageWidth: designSystem.dimensions.card.imageWidth
  },
  cardFull: {
    aspectRatio: designSystem.dimensions.cardFull.aspectRatio
  },
  header: {
    height: designSystem.dimensions.header.height
  },
  icon: {
    size: designSystem.dimensions.icon.size,
    searchSize: designSystem.dimensions.icon.searchSize,
    buttonSize: designSystem.dimensions.icon.buttonSize
  }
}

// Transforms
export const transforms = {
  cardRotation: designSystem.transforms.cardRotation,
  imageRotation: designSystem.transforms.imageRotation
}

// Layout
export const layout = {
  containerWidth: designSystem.layout.containerWidth,
  cardSetWidth: designSystem.layout.cardSetWidth,
  cardContentWidth: designSystem.layout.cardContentWidth,
  cardImageWidth: designSystem.layout.cardImageWidth,
  searchBarWidth: designSystem.layout.searchBarWidth
}

// Opacity
export const opacity = {
  searchBar: designSystem.opacity.searchBar
}

// Component Metadata
export const cardSets = {
  availableColors: designSystem.cardSets.availableColors
}

export const cardTypes = {
  front: designSystem.cardTypes.front,
  back: designSystem.cardTypes.back
}

export const componentStates = {
  default: designSystem.componentStates.default,
  active: designSystem.componentStates.active,
  hover: designSystem.componentStates.hover,
  disabled: designSystem.componentStates.disabled
}

// Helper: Get Dino color by name
export const getDinoColor = (colorName) => {
  const normalizedName = colorName.toLowerCase()
  const colorMap = {
    blue: colors.dino.blue1,
    pink: colors.dino.pink,
    yellow: colors.dino.yellow,
    purple: colors.dino.purple,
    green: colors.dino.green,
    red: colors.dino.red,
    orange: colors.dino.orange,
    navy: colors.dino.navy,
    mint: colors.dino.mint
  }
  return colorMap[normalizedName] || colors.dino.blue1
}

// Helper: Get typography style object for CSS
export const getTypographyStyle = (variant) => {
  const typo = typography[variant]
  if (!typo) {
    console.warn(`Typography variant "${variant}" not found. Using bodyCompact02.`)
    return typography.bodyCompact02
  }
  return {
    fontFamily: typo.family,
    fontStyle: typo.style,
    fontSize: typo.size,
    fontWeight: typo.weight,
    lineHeight: typo.lineHeight,
    letterSpacing: typo.letterSpacing
  }
}

// Export all tokens as a single object
export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  dimensions,
  transforms,
  layout,
  opacity,
  cardSets,
  cardTypes,
  componentStates
}

export default tokens
