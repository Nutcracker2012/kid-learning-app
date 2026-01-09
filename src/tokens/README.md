# Design Tokens

This directory contains the design token system built from the Figma design variables. All tokens are sourced from `design-system.json` and organized for easy use in React components.

## Structure

```
src/tokens/
├── tokens.js          # Main token definitions loaded from JSON
├── index.js           # Main entry point for imports
├── css-variables.css  # CSS custom properties for use in CSS files
├── utils.js           # Utility functions for working with tokens
└── README.md          # This file
```

## Usage

### In React Components (JavaScript)

```javascript
import { colors, typography, spacing, radius, getDinoColor } from '../tokens'

// Use colors
const style = {
  backgroundColor: colors.dino.blue1,
  color: colors.text.onColor
}

// Use typography
const headingStyle = {
  fontFamily: typography.heading05.family,
  fontSize: typography.heading05.size,
  fontWeight: typography.heading05.weight,
  lineHeight: typography.heading05.lineHeight
}

// Use spacing
const containerStyle = {
  padding: spacing.spacing05,
  margin: spacing.spacing06
}

// Use helper functions
const dinoColor = getDinoColor('blue') // Returns #00a3fe
```

### Using Utility Functions

```javascript
import { getColor, getSpacing, getRadius, createStyleFromTokens } from '../tokens/utils'

// Get color by path
const primaryColor = getColor('text.primary')
const dinoBlue = getColor('dino.blue1')

// Get spacing
const padding = getSpacing('spacing05') // Returns "16px"

// Get radius
const borderRadius = getRadius('medium') // Returns "16px"

// Create complete style object
const cardStyle = createStyleFromTokens({
  backgroundColor: 'dino.blue1',
  color: 'text.onColor',
  typography: 'heading05',
  spacing: 'spacing05',
  radius: 'small',
  padding: true
})
```

### In CSS Files

```css
/* Import CSS variables */
@import '../tokens/css-variables.css';

.my-component {
  background-color: var(--color-dino-blue1);
  color: var(--color-text-on-color);
  font-size: var(--typography-heading-05-size);
  padding: var(--spacing-05);
  border-radius: var(--radius-medium);
}
```

### In React Inline Styles with CSS Variables

```javascript
import '../tokens/css-variables.css'

const MyComponent = () => {
  return (
    <div style={{
      backgroundColor: 'var(--color-dino-blue1)',
      color: 'var(--color-text-on-color)',
      fontSize: 'var(--typography-heading-05-size)',
      padding: 'var(--spacing-05)',
      borderRadius: 'var(--radius-medium)'
    }}>
      Hello World
    </div>
  )
}
```

## Available Tokens

### Colors

- **Text**: `primary`, `placeholder`, `onColor`
- **Background**: `primary`, `searchBar`, `card`, `light`
- **Dino**: `blue1`, `pink`, `yellow`, `purple`, `green`, `red`, `orange`, `navy`, `mint`
- **Cool Gray**: `_10`, `_70`, `_90`
- **Inverse**: `white`, `black`
- **Accessibility**: `white`
- **Icon**: `onColor`

### Typography

- `heading03` - 20px, Regular, line-height 28px
- `heading04` - 28px, Regular, line-height 36px
- `heading05` - 32px, SemiBold, line-height 40px
- `headingCompact01` - 14px, SemiBold, line-height 18px
- `bodyCompact02` - 16px, Regular, line-height 22px

### Spacing

- `spacing03` - 8px
- `spacing05` - 16px
- `spacing06` - 24px
- `spacing07` - 32px

### Radius

- `small` - 4px
- `medium` - 16px
- `large` - 32px
- `cover` - 2.962px

### Dimensions

- Card: `height`, `setHeight`, `imageSize`, `imageContainerSize`, etc.
- Header: `height`
- Icon: `size`, `searchSize`, `buttonSize`
- SearchBar: `height`

### Transforms

- `cardRotation` - 28deg
- `imageRotation` - 2deg

## Helper Functions

### `getDinoColor(colorName)`

Get a Dino color by name (case-insensitive).

```javascript
getDinoColor('blue')   // Returns #00a3fe
getDinoColor('Pink')   // Returns #fba7b4
getDinoColor('yellow') // Returns #fac042
```

### `getTypographyStyle(variant)`

Get a complete typography style object for a variant.

```javascript
const style = getTypographyStyle('heading05')
// Returns: { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
```

### `getColor(colorPath)`

Get a color value by path.

```javascript
getColor('text.primary')    // Returns #161616
getColor('dino.blue1')       // Returns #00a3fe
getColor('background.card') // Returns #ffffff
```

## Source of Truth

All tokens are loaded from `design-system.json` at the root of the project. This JSON file is the single source of truth and should be updated when Figma variables change.

## Best Practices

1. **Always import from `src/tokens`** - Don't import directly from `design-system.json`
2. **Use helper functions** - They provide type safety and fallbacks
3. **Prefer CSS variables in CSS files** - Use `css-variables.css` for CSS files
4. **Use JavaScript tokens in React** - Import tokens directly for inline styles
5. **Keep tokens consistent** - Update `design-system.json` first, then tokens will update automatically

## Future Enhancements

- TypeScript definitions for type safety
- Token validation on build
- Automatic CSS variable generation
- Theme switching support
