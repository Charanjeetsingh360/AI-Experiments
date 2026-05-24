/**
 * CS360 token-backed Tailwind theme snippet.
 *
 * Merge this into the project's Tailwind config after confirming the existing
 * Tailwind version and config shape. Values intentionally reference CSS custom
 * properties so theme and density modes can switch at runtime.
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        'background-surface-default': 'var(--color-background-surface-default)',
        'background-surface-subtle': 'var(--color-background-surface-subtle)',
        'background-surface-raised': 'var(--color-background-surface-raised)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-disabled': 'var(--color-text-disabled)',
        'text-on-action': 'var(--color-text-on-action)',
        'border-default': 'var(--color-border-default)',
        'border-strong': 'var(--color-border-strong)',
        'action-primary': 'var(--color-action-primary)',
        'action-primary-hover': 'var(--color-action-primary-hover)',
        'action-primary-active': 'var(--color-action-primary-active)',
        'feedback-error': 'var(--color-feedback-error)',
        'feedback-success': 'var(--color-feedback-success)',
        'feedback-warning': 'var(--color-feedback-warning)',
        'feedback-info': 'var(--color-feedback-info)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--elevation-sm)',
        md: 'var(--elevation-md)',
        lg: 'var(--elevation-lg)',
        focus: 'var(--focus-ring-default)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
      },
    },
  },
};
