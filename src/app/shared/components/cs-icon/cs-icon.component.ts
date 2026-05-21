import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CS Icon Component
 *
 * Renders Google Material Symbols Rounded icons.
 * Font loaded via: https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded
 *
 * Usage:
 *   <cs-icon name="home" />
 *   <cs-icon name="check_circle" [filled]="true" size="24" />
 *   <cs-icon name="settings" weight="300" />
 *   <cs-icon name="close" [interactive]="true" ariaLabel="Close dialog" />
 *
 * Icon names: https://fonts.google.com/icons?icon.style=Rounded
 * Use snake_case names (e.g. arrow_forward, check_circle, person)
 *
 * Interaction states:
 * - Inside <button>: inherits disabled/active/hover states automatically
 * - Inside <a>: inherits hover/active states automatically
 * - Standalone: use [interactive]="true" + [ariaLabel]="..." for clickable icons
 */
@Component({
  selector: 'cs-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="material-symbols-rounded"
      [style.font-size.px]="size"
      [style.font-variation-settings]="fontVariationSettings"
      [class]="extraClass"
      aria-hidden="true">{{ name }}</span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
                  transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Scale down on button press */
    :host-context(button:active) {
      transform: scale(0.92);
    }

    /* Dim when button is disabled */
    :host-context(button:disabled),
    :host-context(button[disabled]) {
      opacity: 0.4;
    }

    /* Anchor hover/active states */
    :host-context(a:hover) {
      opacity: 0.8;
    }

    :host-context(a:active) {
      opacity: 0.6;
      transform: scale(0.95);
    }

    /* Standalone interactive mode */
    :host(.cs-icon--interactive) {
      cursor: pointer;
      border-radius: 4px;
      outline: none;
    }

    :host(.cs-icon--interactive:hover) {
      opacity: 0.8;
    }

    :host(.cs-icon--interactive:active) {
      opacity: 0.6;
      transform: scale(0.95);
    }

    :host(.cs-icon--interactive:focus-visible) {
      box-shadow: 0 0 0 2px var(--cs360-action-primary, #0077ff);
    }

    .material-symbols-rounded {
      font-family: 'Material Symbols Rounded', sans-serif;
      font-style: normal;
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      color: inherit;
      user-select: none;
    }
  `],
})
export class CSIconComponent {
  /** Icon name in snake_case — from https://fonts.google.com/icons?icon.style=Rounded */
  @Input({ required: true }) name!: string;

  /** Size in px — maps to both font-size and opsz axis. Default: 20px */
  @Input() size: number = 20;

  /** FILL axis: false = outlined (0), true = filled (1). Default: false */
  @Input() filled: boolean = false;

  /** Font weight (wght axis): 100–700. Default: 400 */
  @Input() weight: number = 400;

  /** Grade (GRAD axis): -50 to 200. Default: 0 */
  @Input() grade: number = 0;

  /** Extra CSS class(es) to add to the icon element */
  @Input() extraClass: string = '';

  /**
   * Standalone interactive mode — use when the icon itself is the clickable target.
   * Must be paired with [ariaLabel] for accessibility.
   */
  @Input() interactive: boolean = false;

  /** Accessible label — required when [interactive]="true" */
  @Input() ariaLabel: string = '';

  @HostBinding('class.cs-icon--interactive')
  get isInteractive() { return this.interactive; }

  @HostBinding('attr.role')
  get role() { return this.interactive ? 'img' : null; }

  @HostBinding('attr.tabindex')
  get tabIndex() { return this.interactive ? '0' : null; }

  @HostBinding('attr.aria-label')
  get hostAriaLabel() { return this.interactive && this.ariaLabel ? this.ariaLabel : null; }

  get fontVariationSettings(): string {
    const opsz = Math.min(Math.max(this.size, 20), 48);
    const fill = this.filled ? 1 : 0;
    return `'FILL' ${fill}, 'wght' ${this.weight}, 'GRAD' ${this.grade}, 'opsz' ${opsz}`;
  }
}
