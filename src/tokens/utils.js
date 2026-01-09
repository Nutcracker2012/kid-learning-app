/**
 * Utility functions for working with design tokens
 */

import { colors, typography, getDinoColor, getTypographyStyle } from './tokens'

/**
 * Get CSS custom property name for a token
 * Converts dot notation to kebab-case
 * 
 * @param {string} path - Token path (e.g., "colors.text.primary")
 * @returns {string} CSS variable name (e.g., "--color-text-primary")
 */
export const getCSSVariableName = (path) => {
  return `--${path.replace(/\./g, '-').toLowerCase()}`
}

/**
 * Get CSS custom property value
 * 
 * @param {string} path - Token path
 * @returns {string} CSS variable usage (e.g., "var(--color-text-primary)")
 */
export const getCSSVariable = (path) => {
  return `var(${getCSSVariableName(path)})`
}

/**
 * Convert color name to valid CSS variable or hex value
 * 
 * @param {string} colorName - Color name (e.g., "blue", "dino.blue1")
 * @returns {string} Hex color value
 */
export const getColor = (colorName) => {
  if (colorName.startsWith('dino.')) {
    const dinoColor = colorName.split('.')[1]
    return getDinoColor(dinoColor)
  }
  
  const parts = colorName.split('.')
  let color = colors
  
  for (const part of parts) {
    if (color[part]) {
      color = color[part]
    } else {
      console.warn(`Color "${colorName}" not found. Returning default.`)
      return colors.text.primary
    }
  }
  
  return typeof color === 'string' ? color : colors.text.primary
}

/**
 * Get spacing value
 * 
 * @param {string} spacingName - Spacing name (e.g., "spacing03", "spacing05")
 * @returns {string} Spacing value with unit
 */
export const getSpacing = (spacingName) => {
  const spacing = {
    spacing03: '8px',
    spacing05: '16px',
    spacing06: '24px',
    spacing07: '32px'
  }
  
  return spacing[spacingName] || '16px'
}

/**
 * Get radius value
 * 
 * @param {string} radiusName - Radius name (e.g., "small", "medium", "large")
 * @returns {string} Radius value with unit
 */
export const getRadius = (radiusName) => {
  const radius = {
    small: '4px',
    medium: '16px',
    large: '32px',
    cover: '2.962px'
  }
  
  return radius[radiusName] || '0px'
}

/**
 * Create a style object from typography variant
 * Useful for React inline styles
 * 
 * @param {string} variant - Typography variant name
 * @returns {Object} Style object
 */
export const getTypographyStyleObject = (variant) => {
  return getTypographyStyle(variant)
}

/**
 * Create a complete style object combining multiple token values
 * 
 * @param {Object} config - Style configuration object
 * @param {string} [config.color] - Color token path
 * @param {string} [config.backgroundColor] - Background color token path
 * @param {string} [config.typography] - Typography variant name
 * @param {string} [config.spacing] - Spacing token name
 * @param {string} [config.radius] - Radius token name
 * @returns {Object} Complete style object
 */
export const createStyleFromTokens = (config = {}) => {
  const style = {}
  
  if (config.color) {
    style.color = getColor(config.color)
  }
  
  if (config.backgroundColor) {
    style.backgroundColor = getColor(config.backgroundColor)
  }
  
  if (config.typography) {
    Object.assign(style, getTypographyStyle(config.typography))
  }
  
  if (config.spacing) {
    const spacingValue = getSpacing(config.spacing)
    if (config.padding) {
      style.padding = spacingValue
    }
    if (config.margin) {
      style.margin = spacingValue
    }
  }
  
  if (config.radius) {
    style.borderRadius = getRadius(config.radius)
  }
  
  return style
}

export default {
  getCSSVariableName,
  getCSSVariable,
  getColor,
  getSpacing,
  getRadius,
  getTypographyStyleObject,
  createStyleFromTokens
}
