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
    <aside class="sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileOpen">
      <!-- Logo — Figma colorful Care360 mark -->
      <div class="sidebar-logo">
        <svg class="logo-svg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="CareGiver 360 logo">
          <!-- Left person (pink/red) -->
          <circle cx="15" cy="13" r="5" fill="#E84B7B"/>
          <path d="M8 30c0-3.866 3.134-7 7-7s7 3.134 7 7v4H8v-4z" fill="#E84B7B"/>
          <!-- Right person (blue) -->
          <circle cx="33" cy="13" r="5" fill="#1F63DA"/>
          <path d="M26 30c0-3.866 3.134-7 7-7s7 3.134 7 7v4H26v-4z" fill="#1F63DA"/>
          <!-- Top person (green) -->
          <circle cx="24" cy="8" r="4.5" fill="#22C55E"/>
          <path d="M17.5 24c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5v3h-13v-3z" fill="#22C55E"/>
        </svg>

        <button type="button" class="mobile-close" (click)="closeSidebar.emit()" aria-label="Close navigation">
          <cs-icon name="close" [size]="24" aria-hidden="true" />
        </button>
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
             [title]="collapsed && !mobileOpen ? item.label : ''"
             (click)="closeSidebar.emit()">
             <cs-icon [name]="item.icon" [size]="24" class="nav-icon" />
             <span class="nav-label" *ngIf="showExpandedLabels">{{ item.label }}</span>
             <span class="nav-badge" *ngIf="item.badge && showExpandedLabels">{{ item.badge > 99 ? '99+' : item.badge }}</span>
             <span class="nav-badge-dot" *ngIf="item.badge && !showExpandedLabels"></span>
           </a>

          <!-- External link -->
          <a *ngIf="item.isExternal"
             [href]="item.href"
             target="_blank"
             rel="noopener noreferrer"
             class="nav-item"
             [title]="collapsed && !mobileOpen ? item.label : ''"
             (click)="closeSidebar.emit()">
             <cs-icon [name]="item.icon" [size]="24" class="nav-icon" />
             <span class="nav-label" *ngIf="showExpandedLabels">{{ item.label }}</span>
             <cs-icon *ngIf="showExpandedLabels" name="open_in_new" [size]="14" class="external-icon" />
           </a>

        </ng-container>
      </nav>

      <!-- Copyright -->
      <div class="sidebar-copyright" *ngIf="showExpandedLabels">
        <p class="copyright-text">&copy; {{ currentYear }} Caresmartz, Inc. All Rights Reserved.</p>
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
      background-color: var(--cs360-sidebar-primary-bg);
      display: flex;
      flex-direction: column;
      transition: width var(--cs360-transition-base);
      z-index: 100;
      overflow: hidden;

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
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--cs360-space-4) var(--cs360-space-3);
      min-height: 102px;
      background-color: var(--color-white);
      border-bottom: 1px solid var(--cs360-sidebar-border);
    }

    .logo-svg {
      flex-shrink: 0;
    }

    .mobile-close {
      display: none;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-full);
      background: var(--cs360-bg-surface);
      color: var(--cs360-text-primary);
      cursor: pointer;
      transition: background-color var(--cs360-transition-fast), border-color var(--cs360-transition-fast);

      &:hover {
        background: var(--cs360-bg-surface-hover);
        border-color: var(--cs360-border-default);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--cs360-sidebar-ring);
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--cs360-space-4) 0 0 0;
      overflow-y: auto;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--cs360-space-2-5);
      padding: var(--cs360-space-2) var(--cs360-space-3);
      border-radius: 0;
      color: var(--cs360-sidebar-text);
      text-decoration: none;
      transition: all var(--cs360-transition-fast);
      min-width: 0;

      &:hover {
        background-color: var(--cs360-sidebar-secondary-bg);
        color: var(--cs360-sidebar-secondary-fg);

        .nav-icon {
          color: var(--cs360-sidebar-secondary-fg);
        }
      }

      &.active {
        background-color: var(--cs360-sidebar-active);
        color: var(--cs360-sidebar-text-active);
        border-radius: 0;

        .nav-icon {
          color: var(--cs360-sidebar-icon-active);
        }
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--cs360-sidebar-ring);
      }
    }

    .nav-icon {
      flex-shrink: 0;
      color: var(--cs360-sidebar-icon);
      transition: color var(--cs360-transition-fast);
    }

    .nav-label {
      flex: 1;
      font-size: var(--cs360-text-sm);
      font-weight: 500;
      line-height: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }

    .external-icon {
      flex-shrink: 0;
      opacity: 0.5;
      margin-left: auto;
    }

    .nav-badge {
      flex-shrink: 0;
      background-color: var(--cs360-feedback-error);
      color: var(--cs360-neutral-0);
      font-size: var(--cs360-text-xs);
      font-weight: 600;
      padding: 2px 6px;
      border-radius: var(--cs360-radius-full);
      line-height: 1.4;
      margin-left: auto;
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
      color: var(--cs360-sidebar-text);
      cursor: pointer;
      transition: color var(--cs360-transition-fast);

      &:hover {
        color: var(--cs360-sidebar-text-active);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--cs360-sidebar-ring);
      }
    }

    /* Tablet landscape + mobile: sidebar becomes a drawer overlay */
    @media (max-width: 1024px) {
      .sidebar {
        width: var(--cs360-sidebar-width);
        transform: translateX(-100%);
        visibility: hidden;
        pointer-events: none;
        transition: transform var(--cs360-transition-base), visibility var(--cs360-transition-base);
        z-index: 1000;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
        visibility: visible;
        pointer-events: auto;
      }

      .sidebar.collapsed {
        width: var(--cs360-sidebar-width);

        .sidebar-logo {
          justify-content: center;
          padding: var(--cs360-space-4) var(--cs360-space-3);
        }

        .nav-item {
          justify-content: flex-start;
          padding: var(--cs360-space-3);
        }
      }

      .sidebar-logo {
        justify-content: center;
        min-height: 72px;
        padding: var(--cs360-space-4) var(--cs360-space-3);
      }

      .mobile-close {
        position: absolute;
        right: var(--cs360-space-4);
        display: inline-flex;
      }

      .sidebar-nav {
        padding: var(--cs360-space-4) var(--cs360-space-3);
      }

      .nav-item {
        justify-content: flex-start;
        padding: var(--cs360-space-3);
        border-radius: var(--cs360-radius-md);
      }

      .collapse-toggle {
        display: none;
      }
    }

    /* Mobile phones: sidebar takes full width when open */
    @media (max-width: 480px) {
      .sidebar,
      .sidebar.collapsed {
        width: 100dvw;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() closeSidebar = new EventEmitter<void>();

  readonly currentYear = new Date().getFullYear();

  get showExpandedLabels(): boolean {
    return !this.collapsed || this.mobileOpen;
  }

  // Icon names from https://fonts.google.com/icons?icon.style=Rounded
  // Navigation matches Figma: Caregiver Web Portal node 183-126608
  navItems: NavItem[] = [
    { label: 'Home',            icon: 'home',           route: '/home' },
    { label: 'Shift Calendar',  icon: 'calendar_today', route: '/shift-calendar' },
    { label: 'My Clients',      icon: 'groups',         route: '/clients' },
    { label: 'Messages',        icon: 'mail',           route: '/messages' },
    { label: 'Availability',    icon: 'event_busy',     route: '/availability' },
    { label: 'Documents',       icon: 'description',    route: '/documents' },
    { label: 'Caregiver Forms', icon: 'assignment',     route: '/caregiver-forms' },
    { label: 'Trainings',       icon: 'school',         route: '/trainings' },
    { label: 'Learn2Care',      icon: 'menu_book',      href: 'https://learn2care.com', isExternal: true },
    { label: 'LMS',             icon: 'launch',         href: 'https://lms.caresmart.com', isExternal: true },
  ];
}
