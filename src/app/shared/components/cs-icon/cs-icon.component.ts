import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
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
 *
 * Icon names: https://fonts.google.com/icons?icon.style=Rounded
 * Use snake_case names (e.g. arrow_forward, check_circle, person)
 *
 * The FILL axis (0=outlined, 1=filled) is controlled via [filled] input.
 * Weight, opsz, and grade follow the token system defaults.
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
    }

    /* Ensure font is rendered correctly and inherits color */
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

  get fontVariationSettings(): string {
    const opsz = Math.min(Math.max(this.size, 20), 48); // clamp 20–48
    const fill = this.filled ? 1 : 0;
    return `'FILL' ${fill}, 'wght' ${this.weight}, 'GRAD' ${this.grade}, 'opsz' ${opsz}`;
  }
}
