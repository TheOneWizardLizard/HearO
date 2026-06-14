---
name: Serene Pulse
colors:
  surface: '#fdf9f6'
  surface-dim: '#ddd9d6'
  surface-bright: '#fdf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f0'
  surface-container: '#f1edea'
  surface-container-high: '#ebe7e4'
  surface-container-highest: '#e5e2df'
  on-surface: '#1c1b1a'
  on-surface-variant: '#414847'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f4f0ed'
  outline: '#717977'
  outline-variant: '#c0c8c7'
  surface-tint: '#416562'
  primary: '#416562'
  on-primary: '#ffffff'
  primary-container: '#769b98'
  on-primary-container: '#0b3230'
  inverse-primary: '#a8cecb'
  secondary: '#725a41'
  on-secondary: '#ffffff'
  secondary-container: '#ffdcbd'
  on-secondary-container: '#796046'
  tertiary: '#456275'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a98ac'
  on-tertiary-container: '#103041'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c3eae7'
  primary-fixed-dim: '#a8cecb'
  on-primary-fixed: '#00201e'
  on-primary-fixed-variant: '#294d4a'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#e1c1a2'
  on-secondary-fixed: '#291805'
  on-secondary-fixed-variant: '#59422b'
  tertiary-fixed: '#c8e7fd'
  tertiary-fixed-dim: '#accbe0'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#2d4a5c'
  background: '#fdf9f6'
  on-background: '#1c1b1a'
  surface-variant: '#e5e2df'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  safe-margin: 24px
  gutter: 16px
  section-gap: 40px
  touch-target: 48px
---

## Brand & Style

The design system is centered on the concept of "Adaptive Tranquility." It is specifically tailored for individuals experiencing high-stress states, PTSD, or anxiety, where the UI must act as a sensory stabilizer rather than a source of stimulation. 

The style blends **Minimalism** with **Glassmorphism** and **Tactile** elements to create a "Soft UI" experience. Surfaces should feel like layered silk or polished sea glass—translucent, light, and physically soft. Visual noise is aggressively eliminated to lower cognitive load. Interaction patterns prioritize gentle transitions over snappy animations to maintain a rhythmic, calming pace.

## Colors
The palette is derived from natural, desaturated environments: sea foam, sun-bleached sand, and misty horizons. 

- **Primary (Sea Foam):** Used for active states and primary therapeutic progress indicators.
- **Secondary (Sand):** Used for grounding elements and tactile controls.
- **Tertiary (Misty Blue):** Used for background depth and secondary navigation.
- **SOS (Muted Coral):** A specialized "Safe Alert" color. It provides necessary visibility for emergency features without the jarring, high-vibration frequency of pure red.

**Backgrounds:** Use subtle linear gradients (Top-Left to Bottom-Right) rather than flat colors to mimic the natural diffusion of light through soft fabric or water.

## Typography
The typography system uses rounded, humanist letterforms to avoid "sharpness" in reading. 

- **Plus Jakarta Sans** provides a friendly, optimistic structure for headlines and labels.
- **Be Vietnam Pro** is used for body text; its contemporary, warm terminals ensure high readability during episodes of stress where focus may be diminished.

Keep line lengths short (max 60 characters) and use generous line heights to ensure the text "breathes," preventing a cramped or overwhelming visual density.

## Layout & Spacing
The layout follows a **Fluid Grid** model with an emphasis on "Organic Breathing Room." 

- **Safe Margins:** Use a minimum of 24px on mobile devices to push content away from screen edges, creating a sense of safety and enclosure.
- **Vertical Rhythm:** Utilize large gaps (40px+) between different therapeutic modules to allow the eye to rest.
- **Centering:** Primary controls (like the Sound Player) should be centrally weighted to provide a balanced, grounded focal point.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Backdrop Blurs** rather than harsh shadows.

1.  **Base Layer:** The primary gradient background.
2.  **Surface Layer:** Semi-transparent white (#FFFFFF at 40-60% opacity) with a `20px` background blur. This creates a "frosted glass" effect that feels light and premium.
3.  **Active Elevation:** Use soft, ambient shadows tinted with the primary color (Sea Foam) rather than black. Shadows should have a high blur radius (30px+) and low opacity (10%) to simulate an object resting on silk.

## Shapes
Sharp corners are strictly prohibited. The design system utilizes a high degree of roundedness to evoke softness and safety.

- **Standard Containers:** 16px (1rem) corner radius.
- **Interactive Controls:** 24px+ or full pill-shape for sliders and buttons.
- **Icon Enclosures:** Always use "squircle" or circular backdrops to house environment icons, ensuring no hard 90-degree angles are present in the visual field.

## Components

### Buttons & Controls
- **Primary Buttons:** Pill-shaped with a soft gradient fill. Use "Sand" for grounding or "Sea Foam" for action. Text should be medium weight.
- **The SOS Button:** A large, circular floating action button or centered card. Use the `sos_color_hex` with a slow, rhythmic "pulse" animation (shadow expansion) to make it findable without being alarming.
- **Sliders:** The track should be thick (8px+) and soft-colored. The thumb (handle) should be a large, tactile circle (32px) to ensure ease of use even if a user's hands are shaking.

### Cards
- **Soft Cards:** Use the frosted glass effect. No borders; use the subtle ambient shadow and backdrop blur to define the edges against the background gradient.

### Environment Icons
- **Iconography Style:** Use thick strokes (2px) with rounded caps and joins. 
    - **Cafe:** A steaming cup with soft, curved vapor lines.
    - **Busy Street:** Simplified rounded car silhouettes and a stylized lamp post.
    - **Beach:** Three varying-length soft waves.
    - **Quiet Forest:** Two rounded "organic" tree shapes (conifers) of different heights.

### Progress Indicators
- Use flowing, liquid-like fills for progress bars rather than blocks. Use "Sea Foam" for therapeutic progress and "Misty Blue" for session duration.