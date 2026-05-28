import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize   = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape  = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';

@Component({
  selector: 'cs-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cs-avatar.component.html',
  styleUrls: ['./cs-avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() src?: string;
  @Input() alt = '';
  @Input() initials?: string;
  @Input() size: AvatarSize = 'md';
  @Input() shape: AvatarShape = 'circle';
  @Input() status: AvatarStatus = 'none';
  @Input() color?: string;
  imageError = false;

  get hostClasses(): string {
    return ['cs-avatar', 'cs-avatar--' + this.size, 'cs-avatar--' + this.shape].join(' ');
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
}