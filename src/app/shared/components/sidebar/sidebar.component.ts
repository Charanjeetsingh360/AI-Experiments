import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

interface NavItem {
  label: string;
  icon: string;  // Material Symbols Rounded icon name
  route?: string;
  href?: string;
  isExternal?: boolean;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CSIconComponent],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <cs-icon name="favorite" [size]="28" [filled]="true" />
        </div>
        <span class="logo-text" *ngIf="!collapsed">CareGiver 360</span>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <ng-container *ngFor="let item of navItems">

          <!-- Internal link -->
          <a *ngIf="!item.isExternal"
             [routerLink]="item.route"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: item.route === '/home' }"
             class="nav-item"
             [title]="collapsed ? item.label : ''">
            <cs-icon [name]="item.icon" [size]="20" class="nav-icon" />
            <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
            <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge > 99 ? '99+' : item.badge }}</span>
            <span class="nav-badge-dot" *ngIf="item.badge && collapsed"></span>
          </a>

          <!-- External link -->
          <a *ngIf="item.isExternal"
             [href]="item.href"
             target="_blank"
             rel="noopener noreferrer"
             class="nav-item"
             [title]="collapsed ? item.label : ''">
            <cs-icon [name]="item.icon" [size]="20" class="nav-icon" />
            <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
            <cs-icon *ngIf="!collapsed" name="open_in_new" [size]="14" class="external-icon" />
          </a>

        </ng-container>
      </nav>

      <!-- Copyright -->
      <div class="sidebar-copyright" *ngIf="!collapsed">
        <p class="copyright-text">&copy; {{ currentYear }} CareSmart, Inc.</p>
        <p class="copyright-text">All rights reserved.</p>
      </div>

      <!-- Collapse Toggle -->
      <button class="collapse-toggle" (click)="toggleCollapse.emit()">
        <cs-icon [name]="collapsed ? 'chevron_right' : 'chevron_left'" [size]="20" />
      </button>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--cs360-sidebar-width);
      background-color: var(--cs360-sidebar-bg);
      display: flex;
      flex-direction: column;
      transition: width var(--cs360-transition-base);
      z-index: 100;

      &.collapsed {
        width: var(--cs360-sidebar-collapsed-width, 64px);

        .sidebar-logo {
          justify-content: center;
          padding: var(--cs360-space-4);
        }

        .nav-item {
          justify-content: center;
          padding: var(--cs360-space-3);
        }
      }
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: var(--cs360-space-3);
      padding: var(--cs360-space-5);
      border-bottom: 1px solid var(--cs360-sidebar-border);
    }

    .logo-icon {
      color: var(--cs360-sidebar-text-active);
      flex-shrink: 0;
    }

    .logo-text {
      font-size: var(--cs360-text-lg);
      font-weight: 600;
      color: var(--cs360-sidebar-text-active);
      white-space: nowrap;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--cs360-space-4);
      overflow-y: auto;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--cs360-space-3);
      padding: var(--cs360-space-3) var(--cs360-space-4);
      border-radius: var(--cs360-radius-md);
      color: var(--cs360-sidebar-text);
      text-decoration: none;
      transition: all var(--cs360-transition-fast);
      margin-bottom: var(--cs360-space-1);

      &:hover {
        background-color: var(--cs360-sidebar-hover);
        color: var(--cs360-sidebar-text-active);
      }

      &.active {
        background-color: var(--cs360-sidebar-active);
        color: var(--cs360-sidebar-text-active);
      }
    }

    .nav-icon {
      flex-shrink: 0;
      color: inherit;
    }

    .nav-label {
      flex: 1;
      font-size: var(--cs360-text-sm);
      font-weight: 500;
      white-space: nowrap;
    }

    .external-icon {
      flex-shrink: 0;
      opacity: 0.5;
    }

    .nav-badge {
      background-color: var(--cs360-feedback-error);
      color: white;
      font-size: var(--cs360-text-xs);
      font-weight: 600;
      padding: 2px 6px;
      border-radius: var(--cs360-radius-full);
      line-height: 1.4;
    }

    .nav-badge-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--cs360-feedback-error);
    }

    .sidebar-copyright {
      padding: var(--cs360-space-4) var(--cs360-space-5);
      border-top: 1px solid var(--cs360-sidebar-border);
    }

    .copyright-text {
      font-size: var(--cs360-text-xs);
      color: var(--cs360-sidebar-text);
      opacity: 0.6;
      line-height: 1.5;
      white-space: nowrap;
    }

    .collapse-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--cs360-space-4);
      background: none;
      border: none;
      border-top: 1px solid var(--cs360-sidebar-border);
      color: var(--cs360-sidebar-text);
      cursor: pointer;
      transition: color var(--cs360-transition-fast);

      &:hover {
        color: var(--cs360-sidebar-text-active);
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);

        &.open {
          transform: translateX(0);
        }
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  readonly currentYear = new Date().getFullYear();

  // Icon names from https://fonts.google.com/icons?icon.style=Rounded
  // Navigation matches Figma: Caregiver Web Portal node 183-126608
  navItems: NavItem[] = [
    { label: 'Home',            icon: 'home',           route: '/home' },
    { label: 'Shift Calendar',  icon: 'calendar_today', route: '/shift-calendar' },
    { label: 'My Clients',      icon: 'groups',         route: '/clients' },
    { label: 'Messages',        icon: 'mail',           route: '/messages', badge: 3 },
    { label: 'Availability',    icon: 'event_busy',     route: '/availability' },
    { label: 'Documents',       icon: 'description',    route: '/documents' },
    { label: 'Caregiver Forms', icon: 'assignment',     route: '/caregiver-forms' },
    { label: 'Trainings',       icon: 'school',         route: '/trainings' },
    { label: 'Learn2Care',      icon: 'menu_book',      href: 'https://learn2care.com', isExternal: true },
    { label: 'LMS',             icon: 'launch',         href: 'https://lms.caresmart.com', isExternal: true },
  ];
}
