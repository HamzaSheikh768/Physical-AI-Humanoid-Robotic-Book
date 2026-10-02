# Quickstart Guide: AI Book Landing Page Updates

## Prerequisites

- Node.js 18+ installed
- Yarn or npm package manager
- Git for version control
- Code editor (VS Code recommended)

## Setup Instructions

### 1. Clone and Navigate to Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies
```bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Start Development Server
```bash
# Using yarn
yarn start

# Or using npm
npm run start
```

## Implementation Steps

### 1. Create Custom Components
Create the following component files in the `src/components/` directory:

- `HeroSection.tsx` - Two-column layout with text and book image
- `FeatureCard.tsx` - Themed cards for the four AI topics
- `Sidebar.tsx` - Enhanced sidebar with animations

### 2. Add Custom Styles
Create CSS module files in the `src/css/` directory:

- `HeroSection.module.css` - Styles for the hero section
- `FeatureCard.module.css` - Styles for the feature cards
- `Sidebar.module.css` - Styles for the sidebar

### 3. Implement Animations
Add CSS keyframes and transitions in the respective CSS modules:

- Floating animation for the book image
- Hover effects for buttons and cards
- Slide-in/out animation for the sidebar

### 4. Integrate Components
Update the main landing page to use the new components:

- Replace existing hero section with the new `HeroSection` component
- Add the `FeatureCard` components with the four specified topics
- Implement the enhanced `Sidebar` component

## Key Configuration

### Font Setup
Ensure Poppins font is loaded in `src/css/custom.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

:root {
  --ifm-font-family-base: "Poppins", system-ui, sans-serif;
}
```

### Theme Variables
Add custom CSS variables for the dark theme in `src/css/custom.css`:
```css
:root {
  --ifm-color-primary: #2563eb; /* Blue for hover effects */
}
```

## Testing Checklist

- [ ] Hero section displays two-column layout on desktop
- [ ] Book image is vertically centered with floating animation
- [ ] Primary button changes to blue on hover with smooth transition
- [ ] Feature cards display the four specified topics
- [ ] Feature cards have dark background with blue hover effects
- [ ] Sidebar has smooth slide-in/out animations
- [ ] Active section is highlighted in the sidebar
- [ ] All elements are responsive on mobile and tablet
- [ ] Existing navbar and footer remain unchanged
- [ ] Dark theme is maintained throughout

## Deployment

### Build for Production
```bash
# Using yarn
yarn build

# Or using npm
npm run build
```

### Serve Production Build Locally
```bash
# Using yarn
yarn serve

# Or using npm
npm run serve
```

## Troubleshooting

### Common Issues

1. **Font not loading**: Verify the Poppins font import in `custom.css`
2. **Animations not working**: Check that CSS transforms and transitions are properly applied
3. **Responsive layout issues**: Verify media queries are correctly set for different screen sizes
4. **Image not displaying**: Ensure the book image is placed in the `static/img/` directory

### Performance Tips

- Use CSS containment for optimized rendering
- Implement proper image optimization with srcset for different screen sizes
- Use hardware-accelerated CSS properties (transform, opacity) for animations
- Implement lazy loading for images outside the viewport