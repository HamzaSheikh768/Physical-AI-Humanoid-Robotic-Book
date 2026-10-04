# Component API Contract: HeroSection

## Component: HeroSection

### Props Interface
```typescript
interface HeroSectionProps {
  title: string;              // Main heading text (required)
  subtitle?: string;          // Secondary descriptive text (optional)
  primaryButtonText?: string; // Text for primary call-to-action button (optional)
  primaryButtonLink?: string; // URL for primary button (optional)
  secondaryButtonText?: string; // Text for secondary call-to-action button (optional)
  secondaryButtonLink?: string; // URL for secondary button (optional)
  imageUrl?: string;          // Path to hero image (optional)
  imageAlt?: string;          // Alt text for accessibility (optional)
}
```

### Visual Requirements
- Background: True black (#000000) as specified in the feature requirements
- Typography: Consistent with global font stack
- Spacing: Consistent with global spacing system
- Responsive: Maintains layout integrity across desktop breakpoints

### Functional Requirements
- Primary button must be a Link component with proper routing
- Secondary button must be a Link component with proper routing
- All links must be accessible and keyboard navigable
- Image must have proper alt text for accessibility
- Component must be reusable across different pages

### Styling Contract
- Uses HeroSection.module.css for scoped styles
- Follows CSS Modules pattern for class names
- Maintains visual consistency with design specification
- Compatible with Docusaurus theme system

### Integration Requirements
- Compatible with Docusaurus v3 component system
- Follows Docusaurus best practices for custom components
- Properly imports required dependencies (React, Link, useDocusaurusContext)