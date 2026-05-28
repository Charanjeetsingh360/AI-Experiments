import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'outlined' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'cs-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cs-card.component.html',
  styleUrls: ['./cs-card.component.scss']
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padding: CardPadding = 'md';
  @Input() clickable = false;
  @Input() disabled = false;

  get hostClasses(): string {
    return [
      'cs-card',
      `cs-card--${this.variant}`,
      `cs-card--pad-${this.padding}`,
      this.clickable ? 'cs-card--clickable' : '',
      this.disabled ? 'cs-card--disabled' : ''
    ].filter(Boolean).join(' ');
  }
}
