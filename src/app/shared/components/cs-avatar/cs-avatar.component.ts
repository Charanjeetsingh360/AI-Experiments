import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

/**
 * CSAvatarComponent — Circular avatar with image or initials fallback
 * Renders a circular avatar image when `src` is provided; otherwise displays
 * the name initials on a deterministic background colour derived from the name.
 */
@Component({
  selector: 'cs-avatar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="cs-avatar"
      [style.width.px]="resolvedSize"
      [style.height.px]="resolvedSize"
      [style.border-radius.px]="resolvedSize"
      [attr.aria-label]="alt || name || 'Avatar'"
      role="img"
    >
      @if (src && !imgFailed) {
        <img
          [src]="src"
          [alt]="alt || name"
          class="cs-avatar__img"
          (error)="onImgError()"
        />
      } @else {
        <span
          class="cs-avatar__initials"
          [style.font-size.px]="resolvedSize * 0.38"
          [style.background]="avatarBg"
        >
          {{ initials }}
        </span>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }

    .cs-avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      border: 2px solid var(--cs360-border-subtle);
    }

    .cs-avatar__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      display: block;
    }

    .cs-avatar__initials {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #ffffff;
      font-weight: 600;
      font-family: var(--cs360-font-family);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      user-select: none;
      border-radius: 50%;
    }
  `],
})
export class CSAvatarComponent implements OnChanges {
  @Input() src?: string;
  @Input() name = '';
  @Input() alt?: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() sizePx?: number;

  private readonly SIZE_MAP: Record<string, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  };

  private readonly COLOR_PALETTE = [
    '#5B21B6', // violet
    '#1D4ED8', // blue
    '#0D9488', // teal
    '#047857', // emerald
    '#D97706', // amber
    '#DC2626', // red
    '#DB2777', // pink
    '#0EA5E9', // sky
    '#7C3AED', // purple
    '#0369A1', // dark sky
    '#065F46', // dark emerald
    '#92400E', // dark amber
  ];

  resolvedSize = 40;
  initials = '?';
  avatarBg = '#1D4ED8';
  imgFailed = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sizePx'] || changes['size']) {
      this.resolvedSize = this.sizePx ?? this.SIZE_MAP[this.size] ?? 40;
    }
    if (changes['name']) {
      this.initials = this.buildInitials(this.name);
      this.avatarBg = this.pickColor(this.name);
    }
    if (changes['src']) {
      this.imgFailed = false;
    }
  }

  onImgError(): void {
    this.imgFailed = true;
  }

  private buildInitials(name: string): string {
    if (!name?.trim()) return '?';
    const parts = name.trim().split(/[\s,]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
  }

  private pickColor(name: string): string {
    if (!name) return this.COLOR_PALETTE[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }
    return this.COLOR_PALETTE[Math.abs(hash) % this.COLOR_PALETTE.length];
  }
}
