import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cs-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cs-top-bar.component.html',
  styleUrls: ['./cs-top-bar.component.scss']
})
export class CsTopBarComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() avatarSrc?: string;
  @Input() avatarInitials = '';
  @Input() userName = '';
  @Input() notificationCount = 0;
  @Input() showSearch = true;
  @Input() showNotifications = true;
  @Input() showAvatar = true;
  @Output() searchClick = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();
  @Output() avatarClick = new EventEmitter<void>();
  @Output() menuToggle = new EventEmitter<void>();
  get badgeLabel(): string {
    return this.notificationCount > 99 ? '99+' : String(this.notificationCount);
  }
}