import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#131313',
        'surface-dim': '#131313',
        'surface-bright': '#393939',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1c1b1b',
        'surface-container': '#201f1f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353534',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#e0c0af',
        'inverse-surface': '#e5e2e1',
        'inverse-on-surface': '#313030',
        outline: '#a78b7c',
        'outline-variant': '#584235',
        'surface-tint': '#ffb68b',
        primary: '#ffb68b',
        'on-primary': '#522300',
        'primary-container': '#ff7a00',
        'on-primary-container': '#5c2800',
        'inverse-primary': '#994700',
        secondary: '#c6c6c7',
        'on-secondary': '#2f3131',
        'secondary-container': '#454747',
        'on-secondary-container': '#b4b5b5',
        tertiary: '#95ccff',
        'on-tertiary': '#003352',
        'tertiary-container': '#00a8ff',
        'on-tertiary-container': '#003a5c',
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
        background: '#131313',
        'on-background': '#e5e2e1',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      }
    },
  },
  plugins: [],
};

export default config;
