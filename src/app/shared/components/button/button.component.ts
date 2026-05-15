import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button, button[appButton]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [type]="type">
      <span class="btn-spinner" *ngIf="loading">
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"/>
        </svg>
      </span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--cs360-space-2);
      font-family: inherit;
      font-weight: 500;
      border: none;
      border-radius: var(--cs360-radius-md);
      cursor: pointer;
      transition: all var(--cs360-motion-fast);
      white-space: nowrap;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:focus-visible {
        box-shadow: var(--cs360-focus-ring);
      }
    }

    /* Variants */
    .btn-primary {
      background-color: var(--cs360-action-primary);
      color: var(--cs360-action-primary-text);

      &:hover:not(:disabled) {
        background-color: var(--cs360-action-primary-hover);
      }
    }

    .btn-secondary {
      background-color: var(--cs360-action-secondary);
      color: var(--cs360-action-secondary-text);

      &:hover:not(:disabled) {
        background-color: var(--cs360-action-secondary-hover);
      }
    }

    .btn-ghost {
      background-color: var(--cs360-action-ghost);
      color: var(--cs360-action-ghost-text);

      &:hover:not(:disabled) {
        background-color: var(--cs360-action-ghost-hover);
      }
    }

    .btn-destructive {
      background-color: var(--cs360-feedback-error);
      color: white;

      &:hover:not(:disabled) {
        background-color: var(--cs360-red-700);
      }
    }

    /* Sizes */
    .btn-sm {
      height: var(--cs360-input-height-sm);
      padding: 0 var(--cs360-space-3);
      font-size: var(--cs360-font-size-sm);
    }

    .btn-md {
      height: var(--cs360-input-height-md);
      padding: 0 var(--cs360-space-4);
      font-size: var(--cs360-font-size-base);
    }

    .btn-lg {
      height: var(--cs360-input-height-lg);
      padding: 0 var(--cs360-space-6);
      font-size: var(--cs360-font-size-md);
    }

    /* Loading spinner */
    .btn-spinner {
      display: inline-flex;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  get buttonClasses(): string {
    return `btn-${this.variant} btn-${this.size}`;
  }
}
