/**
 * Tailwind Config Bridge
 * Layer: Integration (Token System <-> Tailwind)
 *
 * This config maps CSS custom property tokens to Tailwind utility classes.
 * The token system is the source of truth. Tailwind utilities reference
 * CSS custom properties via the theme extension.
 *
 * Token Layers:
 *   1. primitives  -> raw design values (layer 1)
 *   2. semantic    -> role-based mappings per theme (layer 2)
 *   3. density     -> spacing/density presets (layer 2b)
 *   4. styles      -> typography, shadows, borders (layer 3)
 *   5. components  -> compiled component SCSS (layer 4)
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
  ],
  darkMode: 'class', // Use .dark class for dark mode
  theme: {
    extend: {
      // =========================================================================
      // FONT FAMILY — Layer 1 primitive token (--cs360-font-sans)
      // Ensures ALL Tailwind font-sans utilities use Inter via the token
      // =========================================================================
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      // =========================================================================
      // COLOR PALETTE — Layer 2 semantic tokens (02-semantic.scss)
      // Keys match actual --cs360-* variable names from semantic layer
      // =========================================================================
      colors: {
        // Action colors (buttons, links, interactive)
        primary: {
          DEFAULT: 'var(--cs360-action-primary)',
          hover:   'var(--cs360-action-primary-hover)',
          text:    'var(--cs360-action-primary-text)',
        },
        secondary: {
          DEFAULT: 'var(--cs360-action-secondary)',
          hover:   'var(--cs360-action-secondary-hover)',
          text:    'var(--cs360-action-secondary-text)',
        },
        ghost: {
          DEFAULT: 'var(--cs360-action-ghost)',
          hover:   'var(--cs360-action-ghost-hover)',
          text:    'var(--cs360-action-ghost-text)',
        },

        // Feedback / Status
        success: {
          DEFAULT: 'var(--cs360-feedback-success)',
          bg:      'var(--cs360-feedback-success-bg)',
          border:  'var(--cs360-feedback-success-border)',
        },
        warning: {
          DEFAULT: 'var(--cs360-feedback-warning)',
          bg:      'var(--cs360-feedback-warning-bg)',
          border:  'var(--cs360-feedback-warning-border)',
        },
        error: {
          DEFAULT: 'var(--cs360-feedback-error)',
          bg:      'var(--cs360-feedback-error-bg)',
          border:  'var(--cs360-feedback-error-border)',
        },
        info: {
          DEFAULT: 'var(--cs360-feedback-info)',
          bg:      'var(--cs360-feedback-info-bg)',
          border:  'var(--cs360-feedback-info-border)',
        },

        // Surface / Background
        surface: {
          DEFAULT: 'var(--cs360-bg-surface)',
          hover:   'var(--cs360-bg-surface-hover)',
          alt:     'var(--cs360-bg-alt)',
          canvas:  'var(--cs360-bg-canvas)',
          raised:  'var(--cs360-bg-raised)',
        },

        // Text colors
        text: {
          primary:   'var(--cs360-text-primary)',
          secondary: 'var(--cs360-text-secondary)',
          tertiary:  'var(--cs360-text-tertiary)',
          inverse:   'var(--cs360-text-inverse)',
          link:      'var(--cs360-text-link)',
        },

        // Border colors
        border: {
          subtle:  'var(--cs360-border-subtle)',
          DEFAULT: 'var(--cs360-border-default)',
          strong:  'var(--cs360-border-strong)',
        },

        // Sidebar
        sidebar: {
          bg:          'var(--cs360-sidebar-bg)',
          hover:       'var(--cs360-sidebar-hover)',
          active:      'var(--cs360-sidebar-active)',
          text:        'var(--cs360-sidebar-text)',
          'text-active': 'var(--cs360-sidebar-text-active)',
          border:      'var(--cs360-sidebar-border)',
        },
      },

      // =========================================================================
      // SPACING - References density layer CSS custom properties
      // =========================================================================
      spacing: {
        '0': 'var(--cs360-space-0)',
        '0-5': 'var(--cs360-space-0-5)',
        '1': 'var(--cs360-space-1)',
        '1-5': 'var(--cs360-space-1-5)',
        '2': 'var(--cs360-space-2)',
        '2-5': 'var(--cs360-space-2-5)',
        '3': 'var(--cs360-space-3)',
        '4': 'var(--cs360-space-4)',
        '5': 'var(--cs360-space-5)',
        '6': 'var(--cs360-space-6)',
        '7': 'var(--cs360-space-7)',
        '8': 'var(--cs360-space-8)',
        '9': 'var(--cs360-space-9)',
        '10': 'var(--cs360-space-10)',
        '12': 'var(--cs360-space-12)',
        '14': 'var(--cs360-space-14)',
        '16': 'var(--cs360-space-16)',
        '20': 'var(--cs360-space-20)',
        '24': 'var(--cs360-space-24)',
        '28': 'var(--cs360-space-28)',
        '32': 'var(--cs360-space-32)',
        '40': 'var(--cs360-space-40)',
        '48': 'var(--cs360-space-48)',
        '56': 'var(--cs360-space-56)',
        '64': 'var(--cs360-space-64)',
        '80': 'var(--cs360-space-80)',
        '96': 'var(--cs360-space-96)',
      },

      // =========================================================================
      // SIZES - Component and input sizes from primitives
      // =========================================================================
      size: {
        'input-sm': 'var(--cs360-size-input-sm)',
        'input-md': 'var(--cs360-size-input-md)',
        'input-lg': 'var(--cs360-size-input-lg)',
        'icon-sm': 'var(--cs360-size-icon-sm)',
        'icon-md': 'var(--cs360-size-icon-md)',
        'icon-lg': 'var(--cs360-size-icon-lg)',
        'avatar-xs': 'var(--cs360-size-avatar-xs)',
        'avatar-sm': 'var(--cs360-size-avatar-sm)',
        'avatar-md': 'var(--cs360-size-avatar-md)',
        'avatar-lg': 'var(--cs360-size-avatar-lg)',
        'form': 'var(--cs360-size-form)',
        'sidebar': 'var(--cs360-size-sidebar)',
      },

      // =========================================================================
      // BORDER RADIUS - References primitives layer
      // =========================================================================
      borderRadius: {
        'none': 'var(--cs360-radius-none)',
        'sm': 'var(--cs360-radius-sm)',
        'md': 'var(--cs360-radius-md)',
        'lg': 'var(--cs360-radius-lg)',
        'xl': 'var(--cs360-radius-xl)',
        'full': 'var(--cs360-radius-full)',
        'none-lg': 'var(--cs360-radius-none-lg)',
      },

      // =========================================================================
      // BOX SHADOW - References styles layer
      // =========================================================================
      boxShadow: {
        'sm': 'var(--cs360-shadow-sm)',
        'md': 'var(--cs360-shadow-md)',
        'lg': 'var(--cs360-shadow-lg)',
        'xl': 'var(--cs360-shadow-xl)',
        'inset-sm': 'var(--cs360-shadow-inset-sm)',
        'inset-md': 'var(--cs360-shadow-inset-md)',
        'focus': '0 0 0 2px var(--cs360-border-focus)',
      },

      // =========================================================================
      // TYPOGRAPHY - Font sizes from primitives
      // =========================================================================
      fontSize: {
        'xs': 'var(--cs360-text-xs)',
        'sm': 'var(--cs360-text-sm)',
        'base': 'var(--cs360-text-base)',
        'lg': 'var(--cs360-text-lg)',
        'xl': 'var(--cs360-text-xl)',
        '2xl': 'var(--cs360-text-2xl)',
        '3xl': 'var(--cs360-text-3xl)',
        '4xl': 'var(--cs360-text-4xl)',
        '5xl': 'var(--cs360-text-5xl)',
        '6xl': 'var(--cs360-text-6xl)',
      },

      // =========================================================================
      // TRANSITION DURATION - References primitives
      // =========================================================================
      transitionDuration: {
        'none': 'var(--cs360-transition-none)',
        'fast': 'var(--cs360-transition-fast)',
        'normal': 'var(--cs360-transition-normal)',
        'slow': 'var(--cs360-transition-slow)',
        'slower': 'var(--cs360-transition-slower)',
      },
      transitionTimingFunction: {
        'default': 'var(--cs360-ease-default)',
        'in': 'var(--cs360-ease-in)',
        'out': 'var(--cs360-ease-out)',
        'in-out': 'var(--cs360-ease-in-out)',
      },

      // =========================================================================
      // SCREENS - App-specific breakpoints (mirrors responsive needs)
      // =========================================================================
      screens: {
        'xs': '320px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'sidebar-collapsed': '64px',
      },

      // =========================================================================
      // SKELETON ANIMATION - Custom animation for loading states
      // =========================================================================
      animation: {
        'cs360-spin': 'cs360-spin 1s linear infinite',
        'cs360-pulse': 'cs360-shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        'cs360-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'cs360-shimmer': {
          '0%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
          '100%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [
    // Custom plugin for component utility classes
    function({ addComponents, theme }) {
      addComponents({
        // Hover states as utilities
        '.hover-surface': {
          '&:hover': { backgroundColor: 'var(--cs360-bg-surface-hover)' },
        },
        // Focus ring utility
        '.focus-ring': {
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.border.focus')}`,
            outlineOffset: '2px',
          },
        },
        // Truncate with ellipsis
        '.truncate-line': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        // Clamp for multi-line truncation
        '.truncate-2': {
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
        '.truncate-3': {
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
      });
    },
  ],
};

// ==========================================================================
// DENSITY MODES
// Apply via attribute on root: [data-density="compact"], [data-density="default"], [data-density="comfortable"]
// Density tokens are defined in tokens/02-density.scss
// ==========================================================================

// Example usage with CSS Custom Properties:
// :root[data-density="compact"] {
//   --cs360-space-4: 0.5rem;
//   --cs360-size-input-md: 32px;
// }
// :root[data-density="comfortable"] {
//   --cs360-space-4: 1.25rem;
//   --cs360-size-input-md: 48px;
// }
//
// Change in Angular:
// this.renderer.setAttribute(document.documentElement, 'data-density', 'compact');
// ==========================================================================
