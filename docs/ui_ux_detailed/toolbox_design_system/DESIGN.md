---
name: Toolbox Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e0c0af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a78b7c'
  outline-variant: '#584235'
  surface-tint: '#ffb68b'
  primary: '#ffb68b'
  on-primary: '#522300'
  primary-container: '#ff7a00'
  on-primary-container: '#5c2800'
  inverse-primary: '#994700'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#95ccff'
  on-tertiary: '#003352'
  tertiary-container: '#00a8ff'
  on-tertiary-container: '#003a5c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#ffb68b'
  on-primary-fixed: '#321200'
  on-primary-fixed-variant: '#753400'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#95ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004a75'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style
The brand personality is rooted in high-performance utility and technical excellence. It targets developers and power users who value speed, privacy, and open-source transparency. The UI should feel like a precision instrument: fast, lightweight, and premium.

The design style follows a **Modern/Minimalist** approach with **Glassmorphism** and **Tactile** nuances. Taking inspiration from high-end developer tools, the system utilizes a dark-first aesthetic characterized by deep charcoal surfaces, vibrant high-contrast accents, and subtle layered depth. Key visual drivers include:
- **Precision:** 1px borders and monospaced accents to emphasize technical accuracy.
- **Translucency:** Subtle backdrop blurs to maintain context and depth.
- **Vibrancy:** A singular, high-energy primary color used exclusively for "points of intent."

## Colors
The palette is dominated by a "Deep Charcoal" ecosystem to reduce eye strain during long sessions. 
- **Primary Orange (#FF7A00):** Reserved for primary actions, progress completion, and critical highlights. It should never be used for large backgrounds.
- **Neutrals:** A scale of grays from `#0A0A0A` (Base) to `#EDEDED` (High-contrast text).
- **Glass Effects:** Use white at 4-10% opacity for borders and surface overlays to create a "sheen" effect against the dark background.
- **Semantic Colors:** Desaturated versions of emerald, amber, and rose are used for status indicators, ensuring they don't overpower the primary orange.

## Typography
The system uses **Geist** for its clean, geometric, and developer-centric aesthetic. It provides excellent legibility at small sizes while looking sharp and modern in hero sections.
- **Monospace Integration:** **JetBrains Mono** is used for labels, metadata, file paths, and technical specs to reinforce the "utility tool" feel.
- **Hierarchy:** Use tight letter-spacing for large headlines to create a "compact" premium look. For body text, ensure a generous line height (1.6) to improve readability of documentation and logs.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width to maintain readability on ultra-wide monitors.
- **Rhythm:** A 4px baseline grid ensures all components align perfectly.
- **Desktop:** 12-column grid with 24px gutters. Content is centered with large 48px side margins.
- **Mobile:** 4-column grid with 16px margins.
- **Sectioning:** Use large vertical gaps (stack-xl) between major functional blocks to maintain the "Minimalist" feel and allow the glassmorphic cards room to breathe.

## Elevation & Depth
Depth is created through a combination of **Tonal Layering** and **Backdrop Blurs**.
- **Level 0 (Base):** `#0A0A0A` - The canvas.
- **Level 1 (Cards/Containers):** `#161616` with a 1px `rgba(255,255,255,0.08)` border.
- **Level 2 (Modals/Popovers):** `#1C1C1C` with a 20px backdrop blur (Glassmorphism) and a deep, soft shadow: `0 20px 40px rgba(0,0,0,0.4)`.
- **Highlights:** A subtle inner-glow (top border only) on primary buttons and active states adds a tactile, hardware-like quality.

## Shapes
The shape language is sophisticated and modern.
- **Main Components:** A standard radius of `0.75rem (12px)` for cards and large containers.
- **Interactive Elements:** Buttons and input fields use `0.5rem (8px)` to feel precise.
- **Icons & Badges:** Smaller elements use `4px` or full `pill` shapes for status indicators.
- **Borders:** Always 1px. Avoid thick borders; let the contrast between surface colors and subtle inner glows define the edges.

## Components
- **Buttons:** 
  - *Primary:* Vibrant Orange background, white text, subtle top-inner-white-glow. 
  - *Secondary:* Ghost style with 1px white/10 border, white text, and a slight background shift on hover.
- **Glassmorphic Cards:** Use a background of `rgba(22, 22, 22, 0.7)` with `backdrop-filter: blur(12px)`. This is essential for the "Toolbox" dashboard feeling.
- **Upload Areas:** Large dashed-border zones (1px, `rgba(255,255,255,0.2)`) that transition to a solid Orange border and subtle glow on drag-over.
- **Progress Indicators:** Sleek, thin (4px height) bars. The track is `rgba(255,255,255,0.1)` and the fill is the Primary Orange with a slight outer glow to simulate activity.
- **Chips/Tags:** Monospaced text inside small, low-contrast capsules for file types (e.g., .JSON, .PDF).
- **Inputs:** Darker than the card background, focused state highlighted by a 1px Primary Orange border and 0.5 opacity orange shadow spread.