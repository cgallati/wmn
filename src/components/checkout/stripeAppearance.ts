import type { Appearance, CssFontSource } from '@stripe/stripe-js'

/**
 * Stripe Elements styled into the White Cube system: white ground, ink, hairline borders,
 * square corners, tracked uppercase labels. Errors stay ink with plain copy (the One Red Rule
 * reserves red for explicit content).
 */
const INK = 'hsl(222.2 84% 4.9%)'
const HAIRLINE = 'hsl(240 6% 90%)'
const LABEL_GRAY = '#525252'

export const stripeFonts: CssFontSource[] = [
  // The same Adobe Fonts kit as the site. If the kit refuses Stripe's iframe origin, Elements
  // falls back to the next family in fontFamily below.
  { cssSrc: 'https://use.typekit.net/who5iig.css' },
]

export const stripeAppearance: Appearance = {
  theme: 'flat',
  labels: 'above',
  variables: {
    colorPrimary: INK,
    colorBackground: '#ffffff',
    colorText: INK,
    colorTextSecondary: LABEL_GRAY,
    colorTextPlaceholder: '#737373',
    colorDanger: INK,
    colorIcon: LABEL_GRAY,
    fontFamily: 'neue-haas-grotesk-display, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSizeBase: '16px',
    borderRadius: '0px',
    spacingUnit: '4px',
    gridRowSpacing: '20px',
    focusBoxShadow: 'none',
    focusOutline: `2px solid ${INK}`,
  },
  rules: {
    '.Label': {
      fontSize: '12px',
      fontWeight: '500',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: LABEL_GRAY,
      marginBottom: '8px',
    },
    '.Input': {
      backgroundColor: '#ffffff',
      border: `1px solid ${HAIRLINE}`,
      boxShadow: 'none',
      padding: '12px',
    },
    '.Input:focus': { border: `1px solid ${INK}`, boxShadow: 'none' },
    '.Input--invalid': { border: `1px solid ${INK}`, boxShadow: 'none' },
    '.Error': { color: INK, fontSize: '14px' },
    '.Tab': { border: `1px solid ${HAIRLINE}`, boxShadow: 'none', backgroundColor: '#ffffff' },
    '.Tab:hover': { border: `1px solid ${INK}` },
    // Selected stays a white tile with an ink border: the only filled control is Pay.
    '.Tab--selected': {
      backgroundColor: '#ffffff',
      color: INK,
      border: `1px solid ${INK}`,
      boxShadow: 'none',
    },
    '.Tab--selected:hover': { backgroundColor: '#ffffff', color: INK },
    '.TabIcon--selected': { fill: INK, color: INK },
    '.TabLabel--selected': { color: INK },
    '.Block': { border: `1px solid ${HAIRLINE}`, boxShadow: 'none' },
    '.AccordionItem': { border: `1px solid ${HAIRLINE}`, boxShadow: 'none' },
  },
}
