# Data Model: AI Book Landing Page Components

## Component Structure

### HeroSection Component
- **Props**:
  - title: string (main heading text)
  - description: string (subheading/description text)
  - ctaText: string (call-to-action button text)
  - bookImageSrc: string (path to book image)
  - primaryButtonColor: string (color for primary button hover state)

### FeatureCard Component
- **Props**:
  - title: string (feature topic title)
  - description: string (optional description)
  - icon?: string (optional icon class/name)
  - themeColor: string (color theme for the card)

### Sidebar Component
- **Props**:
  - items: Array<{title: string, href: string, isActive: boolean}>
  - isCollapsed: boolean (whether sidebar is in collapsed state)
  - onToggle: () => void (callback for toggling sidebar state)

## State Management

### HeroSection State
- isButtonHovered: boolean (tracks hover state for primary button)
- isImageLoaded: boolean (tracks image loading state)

### FeatureCard State
- isHovered: boolean (tracks hover state for card lift effect)

### Sidebar State
- isOpen: boolean (tracks open/closed state)
- activeItem: string (tracks currently active sidebar item)

## CSS Custom Properties (Theme Variables)

### Color Palette
- --ifm-color-primary: #2563eb (blue for primary elements)
- --ifm-color-emphasis-0: #000000 (dark background)
- --ifm-color-emphasis-100: #1a1a1a (darker gray)
- --ifm-color-emphasis-200: #333333 (medium gray)
- --ifm-color-emphasis-300: #4d4d4d (lighter gray)

### Typography
- --ifm-font-family-base: "Poppins", system-ui, sans-serif
- --ifm-font-family-monospace: "Fira Code", monospace
- --ifm-h1-font-size: 3rem
- --ifm-h2-font-size: 2rem
- --ifm-h3-font-size: 1.5rem

### Spacing
- --ifm-spacing-vertical: 1.5rem
- --ifm-spacing-horizontal: 2rem
- --ifm-global-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)

### Animation
- --ifm-transition-fast: 0.2s ease
- --ifm-transition-medium: 0.3s ease
- --ifm-transition-slow: 0.5s ease

## Animation Specifications

### Floating Animation (Book Image)
- Duration: 3s
- Timing: ease-in-out
- Iteration: infinite
- Transform: translateY(0) to translateY(-10px) and back

### Hover Effects
- Button: color transition 0.3s ease
- Card: transform translateY(-5px) with shadow increase
- Sidebar Item: background color and transform effects

## Responsive Breakpoints

### Desktop
- Min-width: 1024px
- Two-column layout for hero section
- Grid layout for feature cards (2-4 per row)

### Tablet
- Min-width: 768px and max-width: 1023px
- Adjusted column layout
- Medium-sized elements

### Mobile
- Max-width: 767px
- Stacked layout (hero image below text)
- Single column for feature cards
- Collapsible sidebar