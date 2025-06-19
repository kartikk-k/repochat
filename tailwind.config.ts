import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'oklch(var(--color-border)/<alpha-value>)',
        input: 'oklch(var(--color-input)/<alpha-value>)',
        ring: 'oklch(var(--color-ring)/<alpha-value>)',
        background: 'oklch(var(--color-background)/<alpha-value>)',
        foreground: 'oklch(var(--color-foreground)/<alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--color-primary)/<alpha-value>)',
          foreground: 'oklch(var(--color-primary-foreground)/<alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--color-secondary)/<alpha-value>)',
          foreground: 'oklch(var(--color-secondary-foreground)/<alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--color-muted)/<alpha-value>)',
          foreground: 'oklch(var(--color-muted-foreground)/<alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--color-accent)/<alpha-value>)',
          foreground: 'oklch(var(--color-accent-foreground)/<alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--color-destructive)/<alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--color-card)/<alpha-value>)',
          foreground: 'oklch(var(--color-card-foreground)/<alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'oklch(var(--color-sidebar)/<alpha-value>)',
          foreground: 'oklch(var(--color-sidebar-foreground)/<alpha-value>)',
          primary: 'oklch(var(--color-sidebar-primary)/<alpha-value>)',
          'primary-foreground': 'oklch(var(--color-sidebar-primary-foreground)/<alpha-value>)',
          accent: 'oklch(var(--color-sidebar-accent)/<alpha-value>)',
          'accent-foreground': 'oklch(var(--color-sidebar-accent-foreground)/<alpha-value>)',
          border: 'oklch(var(--color-sidebar-border)/<alpha-value>)',
          ring: 'oklch(var(--color-sidebar-ring)/<alpha-value>)',
        },
        brand: {
          DEFAULT: 'oklch(var(--color-brand)/<alpha-value>)',
          foreground: 'oklch(var(--color-brand-foreground)/<alpha-value>)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
}

export default config
