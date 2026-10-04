# Bundle Optimization Contract: UI Redesign & Animation Implementation

## Purpose
This contract defines the approach for optimizing bundle size when implementing Framer Motion animations while maintaining performance and accessibility standards.

## Current State
- Framer Motion version: 12.23.26
- Current implementation uses direct imports from 'framer-motion'
- Animation components are implemented following best practices
- Bundle size impact needs to be assessed post-implementation

## Optimization Strategy

### T029: Check bundle impact; add LazyMotion if needed for performance

**Assessment Criteria:**
1. If bundle size increases significantly (>100KB) due to Framer Motion
2. If performance metrics indicate need for optimization
3. If loading times are impacted significantly

**Implementation Plan:**

**Phase 1: Current Bundle Analysis**
- [x] Implement all animations with standard Framer Motion imports
- [x] Complete all UI components with animations
- [ ] Measure initial bundle size impact after full implementation
- [ ] Run performance audit to establish baseline

**Phase 2: Optimization Decision**
- [ ] If bundle size increase < 50KB: No optimization needed
- [ ] If bundle size increase 50-100KB: Consider selective LazyMotion implementation
- [ ] If bundle size increase > 100KB: Implement LazyMotion for non-critical animations

**Phase 3: LazyMotion Implementation (if required)**
- [ ] Create LazyMotion wrapper components for heavy animation sections
- [ ] Implement code splitting for animation-heavy pages
- [ ] Maintain all accessibility features with LazyMotion
- [ ] Verify all animations continue to work properly

### LazyMotion Implementation Approach

If bundle optimization is required, the following components will be candidates for LazyMotion:

1. **Dashboard Components** (lower priority loading)
```typescript
import { LazyMotion, m, domAnimation } from 'framer-motion';

const DashboardCard = () => (
  <LazyMotion features={domAnimation}>
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
    >
      {/* Card content */}
    </m.div>
  </LazyMotion>
);
```

2. **Animated Forms** (lower priority loading)
```typescript
const AnimatedForm = () => (
  <LazyMotion features={domAnimation}>
    <m.form variants={staggerContainer} animate="animate">
      <m.div variants={staggerChild}>Form fields</m.div>
    </m.form>
  </LazyMotion>
);
```

### Performance Targets
- [ ] Bundle size increase < 100KB from Framer Motion
- [ ] Page load time < 2 seconds
- [ ] Time to Interactive < 3 seconds
- [ ] All animations maintain 60fps on desktop
- [ ] All animations maintain 50fps+ on mobile

### Fallback Strategy
If LazyMotion implementation is needed:
- [ ] Maintain all accessibility features
- [ ] Preserve reduced motion handling
- [ ] Keep all keyboard navigation intact
- [ ] Ensure no functionality is lost

## Quality Gates
- [ ] All animations function properly after optimization
- [ ] Accessibility compliance maintained
- [ ] Performance metrics meet targets
- [ ] No breaking changes to existing functionality
- [ ] All tests pass after optimization

## Rollback Plan
If LazyMotion causes issues:
- [ ] Revert to standard Framer Motion imports
- [ ] Maintain current functionality
- [ ] Document performance impact for future optimization planning