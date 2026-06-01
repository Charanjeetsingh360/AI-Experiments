import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

export type AvatarSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape  = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';

@Component({
  selector: 'cs-avatar',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  templateUrl: './cs-avatar.component.html',
  styleUrls: ['./cs-avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  private _name = '';
  private _alt = '';
  private _sizePx?: number;

  @Input() src?: string;
  @Input()
  set name(value: string) {
    this._name = value ?? '';
    if (!this._alt) {
      this._alt = this._name;
    }
  }
  get name(): string {
    return this._name;
  }

  @Input()
  set alt(value: string) {
    this._alt = value ?? '';
  }
  get alt(): string {
    return this._alt;
  }

  @Input() initials?: string;
  @Input() size: AvatarSize = 'md';
  @Input() shape: AvatarShape = 'circle';
  @Input() status: AvatarStatus = 'none';
  @Input() color?: string;
  @Input()
  set sizePx(value: number | string | null | undefined) {
    const parsed = value == null || value === '' ? undefined : Number(value);
    this._sizePx = Number.isFinite(parsed) ? parsed : undefined;
  }
  get sizePx(): number | undefined {
    return this._sizePx;
  }
  imageError = false;

  get hostClasses(): string {
    return ['cs-avatar', 'cs-avatar--' + this.size, 'cs-avatar--' + this.shape].join(' ');
  }

  @HostBinding('style.width.px')
  get hostWidth(): number | null {
    return this.sizePx ?? this.sizeMap[this.size];
  }

  @HostBinding('style.height.px')
  get hostHeight(): number | null {
    return this.sizePx ?? this.sizeMap[this.size];
  }

  @HostBinding('style.font-size.px')
  get hostFontSize(): number | null {
    return Math.round((this.sizePx ?? this.sizeMap[this.size]) * 0.35);
  }

  get iconSize(): number {
    return Math.max(16, Math.round((this.sizePx ?? this.sizeMap[this.size]) * 0.45));
  }

  get computedInitials(): string {
    if (this.initials) return this.initials.substring(0, 2).toUpperCase();
    if (this.alt) {
      const parts = this.alt.trim().split(' ');
      return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    return '';
  }

  get showImage(): boolean { return !!this.src && !this.imageError; }
  ngOnInit(): void {}
  onImageError(): void { this.imageError = true; }

  private readonly sizeMap: Record<AvatarSize, number> = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };
}
