import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "error-container": "var(--error-container)",
        "tertiary": "var(--tertiary)",
        "on-secondary-container": "var(--on-secondary-container)",
        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
        "on-primary-container": "var(--on-primary-container)",
        "secondary-fixed": "var(--secondary-fixed)",
        "on-secondary": "var(--on-secondary)",
        "surface": "var(--surface)",
        "secondary": "var(--secondary)",
        "primary": "var(--primary)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-dim": "var(--surface-dim)",
        "primary-fixed": "var(--primary-fixed)",
        "surface-bright": "var(--surface-bright)",
        "on-surface-variant": "var(--on-surface-variant)",
        "surface-variant": "var(--surface-variant)",
        "on-background": "var(--on-background)",
        "tertiary-container": "var(--tertiary-container)",
        "inverse-primary": "var(--inverse-primary)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "surface-container": "var(--surface-container)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "surface-tint": "var(--surface-tint)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
        "on-error-container": "var(--on-error-container)",
        "on-surface": "var(--on-surface)",
        "outline-variant": "var(--outline-variant)",
        "on-tertiary": "var(--on-tertiary)",
        "secondary-container": "var(--secondary-container)",
        "primary-container": "var(--primary-container)",
        "on-error": "var(--on-error)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
        "background": "var(--background)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",
        "on-primary": "var(--on-primary)",
        "outline": "var(--outline)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-container-high": "var(--surface-container-high)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "inverse-surface": "var(--inverse-surface)",
        "error": "var(--error)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)"
      },
      keyframes: {
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        }
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "16px",
        "full": "9999px"
      },
      spacing: {
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-xl": "64px",
        "margin-desktop": "48px",
        "container-max": "1200px",
        "stack-xs": "4px",
        "margin-mobile": "16px",
        "unit": "4px",
        "gutter": "24px",
        "stack-lg": "32px"
      },
      fontFamily: {
        "headline-lg-mobile": ["var(--font-geist)"],
        "body-lg": ["var(--font-geist)"],
        "headline-md": ["var(--font-geist)"],
        "display": ["var(--font-geist)"],
        "body-sm": ["var(--font-geist)"],
        "caption": ["var(--font-geist)"],
        "label-md": ["var(--font-jetbrains-mono)"],
        "headline-lg": ["var(--font-geist)"]
      },
      fontSize: {
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-md": ["20px", {"lineHeight": "1.4", "fontWeight": "600"}],
        "display": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700"}],
        "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "caption": ["12px", {"lineHeight": "1.4", "fontWeight": "400"}],
        "label-md": ["12px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "500"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600"}]
      }
    },
  },
  plugins: [],
};

export default config;
