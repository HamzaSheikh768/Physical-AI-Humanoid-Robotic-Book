# Performance Checklist: UI Redesign & Animation Implementation

## Performance Audit Process

### T028: Performance Audit - Ensure >60fps on mobile, no jank

**Pre-requisites:**
- [ ] All animations implemented with Framer Motion best practices
- [ ] Variants centralized in src/animations/variants.ts
- [ ] MotionConfig with reducedMotion="user" implemented globally

**Testing Steps:**
1. **Desktop Performance Test**
   - [ ] Open dashboard page on desktop browser
   - [ ] Use browser DevTools Performance tab to record 10-second interaction
   - [ ] Verify consistent 60fps during animations
   - [ ] Check for dropped frames during hover/transition states
   - [ ] Measure time to interactive (TTI) for page loads

2. **Mobile Performance Test**
   - [ ] Use browser DevTools device emulator (iPhone 12, Pixel 5)
   - [ ] Record 10-second interaction with animations
   - [ ] Verify consistent 60fps during animations
   - [ ] Test all interactive elements (buttons, cards, form fields)
   - [ ] Measure time to interactive (TTI) for page loads

3. **Animation Smoothness Check**
   - [ ] Hover over all animated elements
   - [ ] Verify no jank or stutter during animations
   - [ ] Test form interactions (focus, error states)
   - [ ] Verify dashboard card hover animations are smooth
   - [ ] Check mobile drawer open/close animations

4. **Bundle Size Impact**
   - [ ] Measure initial bundle size with Framer Motion
   - [ ] Verify no significant increase in bundle size
   - [ ] Test loading performance on 3G network simulation

**Acceptance Criteria:**
- [ ] All animations maintain 60fps on desktop
- [ ] All animations maintain 50+ fps on mobile devices
- [ ] No dropped frames during interactive animations
- [ ] Page load time < 2 seconds
- [ ] Bundle size increase < 100KB

### T029: Check bundle impact; add LazyMotion if needed for performance

**Bundle Optimization Steps:**
1. **Current Bundle Analysis**
   - [ ] Run `npm run build` to generate production bundle
   - [ ] Analyze bundle size with webpack-bundle-analyzer
   - [ ] Identify Framer Motion contribution to bundle size

2. **LazyMotion Implementation (if needed)**
   - [ ] If bundle size > 100KB increase, implement LazyMotion
   - [ ] Create LazyMotion wrapper for heavy animation components
   - [ ] Test all animations still work correctly after LazyMotion implementation

**Optimization Techniques:**
- [ ] Use `transform` properties instead of animating layout properties
- [ ] Use `will-change` CSS property for elements that will be animated
- [ ] Optimize SVG icons for performance
- [ ] Implement code splitting for animation-heavy components

## Performance Testing Results Template

### Desktop Results
- **Browser:** Chrome 120.0
- **OS:** Windows 10 / macOS 13 / Ubuntu 22.04
- **CPU:** [spec]
- **Memory:** [spec]
- **FPS during animations:** [result]
- **Page load time:** [result]
- **Bundle size impact:** [result]

### Mobile Results
- **Device:** [emulated device or real device]
- **Browser:** Chrome Mobile / Safari Mobile
- **FPS during animations:** [result]
- **Page load time:** [result]
- **Jank/stutter issues:** [result]

## Performance Optimization Checklist

### Animation Performance
- [ ] Use transform and opacity properties for animations
- [ ] Avoid animating layout properties (width, height, top, left, margin, padding)
- [ ] Use `layoutId` for shared element transitions
- [ ] Use `useReducedMotion` hook appropriately
- [ ] Implement proper cleanup for animation components

### Bundle Optimization
- [ ] Import only required Framer Motion components
- [ ] Use LazyMotion for non-critical animations if bundle size is concern
- [ ] Implement code splitting for animation-heavy components
- [ ] Use React.memo for animated components where appropriate

### Render Optimization
- [ ] Use React.memo for components with complex animations
- [ ] Implement proper keys for animated lists
- [ ] Use `transform` and `opacity` for animations (GPU-accelerated)
- [ ] Avoid unnecessary re-renders during animations

## Performance Monitoring

### Metrics to Track
- [ ] Frames Per Second (FPS) during animations
- [ ] Time to Interactive (TTI)
- [ ] Bundle size increase
- [ ] Memory usage during animations
- [ ] CPU usage during animations

### Tools
- [ ] Chrome DevTools Performance tab
- [ ] WebPageTest.org for performance comparison
- [ ] webpack-bundle-analyzer for bundle analysis
- [ ] Lighthouse performance audit