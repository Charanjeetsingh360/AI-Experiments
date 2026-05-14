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
    './src/**/*.{html,ts}',
    './styles/**/*.scss',
  ],
  darkMode: 'class', // Use .dark class for dark mode
  theme: {
    extend: {
      // =========================================================================
      // COLOR PALETTE - References CSS custom properties from semantic layer
      // These are the public-facing Tailwind color classes that map to tokens
      // =========================================================================
      colors: {
        // Action colors (buttons, links, interactive)
        primary: {
          default: 'var(--cs360-action-primary-default)',
          hover: 'var(--cs360-action-primary-hover)',
          active: 'var(--cs360-action-primary-active)',
          subtle: 'var(--cs360-action-primary-subtle)',
        },
        secondary: {
          default: 'var(--cs360-action-secondary-default)',
          hover: 'var(--cs360-action-secondary-hover)',
        },
        destructive: {
          default: 'var(--cs360-action-destructive-default)',
          hover: 'var(--cs360-action-destructive-hover)',
          active: 'var(--cs360-action-destructive-active)',
          subtle: 'var(--cs360-action-destructive-subtle)',
        },
        ghost: {
          hover: 'var(--cs360-action-ghost-hover)',
          active: 'var(--cs360-action-ghost-active)',
          border: 'var(--cs360-action-ghost-border)',
        },

        // Status colors
        success: {
          default: 'var(--cs360-status-success-default)',
          subtle: 'var(--cs360-status-success-subtle)',
        },
        warning: {
          default: 'var(--cs360-status-warning-default)',
          subtle: 'var(--cs360-status-warning-subtle)',
        },
        error: {
          default: 'var(--cs360-status-error-default)',
          subtle: 'var(--cs360-status-error-subtle)',
        },
        info: {
          default: 'var(--cs360-status-info-default)',
          subtle: 'var(--cs360-status-info-subtle)',
        },

        // Surface colors
        default: {
          DEFAULT: 'var(--cs360-bg-default)',
        },
        surface: {
          DEFAULT: 'var(--cs360-bg-surface)',
          hover: 'var(--cs360-bg-surface-hover)',
          active: 'var(--cs360-bg-surface-active)',
        },
        muted: {
          DEFAULT: 'var(--cs360-bg-muted)',
        },
        elevated: {
          DEFAULT: 'var(--cs360-bg-elevated)',
        },

        // Text colors
        text: {
          primary: 'var(--cs360-text-primary)',
          secondary: 'var(--cs360-text-secondary)',
          muted: 'var(--cs360-text-muted)',
          inverse: 'var(--cs360-text-inverse)',
          link: 'var(--cs360-text-link)',
        },

        // Border colors
        border: {
          default: 'var(--cs360-border-default)',
          subtle: 'var(--cs360-border-subtle)',
          focus: 'var(--cs360-border-focus)',
        },

        // Overlay
        overlay: {
          DEFAULT: 'var(--cs360-bg-overlay)',
        },

        // Inverse (for use on dark surfaces)
        inverse: {
          bg: 'var(--cs360-bg-inverse)',
          surface: 'var(--cs360-bg-inverse-surface)',
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
