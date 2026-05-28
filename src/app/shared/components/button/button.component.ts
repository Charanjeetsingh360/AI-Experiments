import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = 'Primary' | 'secondary' | 'soft' | 'Attention' | 'Warning' | 'destructive' | 'ghost' | 'disabled';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'large' | 'xl';

@Component({
  selector: 'cs-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: ButtonType = 'Primary';
  @Input() size: ButtonSize = 'sm';
  @Input() label: string = 'Button';
  @Input() disabled: boolean = false;

  get classes(): string[] {
    return [
      'cs-btn',
      `cs-btn--${this.type.toLowerCase()}`,
      `cs-btn--${this.size}`,
      this.disabled || this.type === 'disabled' ? 'cs-btn--disabled' : ''
    ].filter(Boolean);
  }
}
