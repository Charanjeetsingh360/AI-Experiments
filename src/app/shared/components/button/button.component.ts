import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * CareGiver 360 Button Component
 *
 * Rules:
 * - Tailwind utilities are the base layout/structure pattern
 * - Colors come ONLY from semantic token layer (02-semantic.scss)
 * - Sizes/padding/font-size come from density token layer (02-density.scss)
 *   so all 3 density modes (compact/default/comfortable) work correctly
 * - Never hardcode hex colors or fixed px sizes on interactive elements
 */
@Component({
  selector: 'cs-btn',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [ngClass]="hostClasses"
      [disabled]="disabled || loading"
      [type]="type"
    >
      <cs-icon *ngIf="loading" name="progress_activity" [size]="16"
        class="animate-spin shrink-0" aria-hidden="true" />
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host { display: inline-flex; }

    /* Spin animation for loading state */
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 0.8s linear infinite; }
  `]
})
export class CsBtnComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Tailwind provides: layout, flex, transition, focus-visible ring, cursor, whitespace
   * Semantic tokens provide: background, text color, border color, hover color
   * Density tokens provide: height, padding, font-size
   */
  get hostClasses(): string {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-medium whitespace-nowrap cursor-pointer',
      'rounded-[var(--cs360-radius-md)]',
      'border transition-all duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      this.fullWidth ? 'w-full' : '',
    ];

    const variants: Record<ButtonVariant, string> = {
      primary: [
        'bg-[var(--cs360-action-primary)] text-[var(--cs360-action-primary-text)]',
        'border-transparent',
        'hover:bg-[var(--cs360-action-primary-hover)]',
        'focus-visible:ring-[var(--cs360-action-primary)]',
      ].join(' '),

      secondary: [
        'bg-[var(--cs360-action-secondary)] text-[var(--cs360-action-secondary-text)]',
        'border-[var(--cs360-border-subtle)]',
        'hover:bg-[var(--cs360-action-secondary-hover)]',
        'focus-visible:ring-[var(--cs360-action-primary)]',
      ].join(' '),

      ghost: [
        'bg-transparent text-[var(--cs360-text-primary)]',
        'border-transparent',
        'hover:bg-[var(--cs360-bg-alt)]',
        'focus-visible:ring-[var(--cs360-action-primary)]',
      ].join(' '),

      destructive: [
        'bg-[var(--cs360-feedback-error)] text-white',
        'border-transparent',
        'hover:bg-[var(--cs360-feedback-error-hover,var(--cs360-red-700))]',
        'focus-visible:ring-[var(--cs360-feedback-error)]',
      ].join(' '),
    };

    // Sizes use density tokens so compact/default/comfortable all work
    const sizes: Record<ButtonSize, string> = {
      sm: 'h-[var(--density-control-height-sm,28px)] px-[var(--density-space-3)] text-[length:var(--density-text-sm)]',
      md: 'h-[var(--density-control-height,40px)] px-[var(--density-space-4)] text-[length:var(--density-text-body)]',
      lg: 'h-[var(--density-control-height-lg,44px)] px-[var(--density-space-6)] text-[length:var(--density-text-body)]',
    };

    return [...base, variants[this.variant], sizes[this.size]].filter(Boolean).join(' ');
  }
}
