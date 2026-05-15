import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="currentColor"/>
            <path d="M16 8C11.582 8 8 11.582 8 16s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" fill="var(--cs360-sidebar-bg)"/>
          </svg>
        </div>
        <span class="logo-text" *ngIf="!collapsed">CareGiver 360</span>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           class="nav-item"
           [title]="collapsed ? item.label : ''">
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
          <span class="nav-badge" *ngIf="item.badge && !collapsed">{{ item.badge }}</span>
        </a>
      </nav>

      <!-- Collapse Toggle -->
      <button class="collapse-toggle" (click)="toggleCollapse.emit()">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path *ngIf="!collapsed" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
          <path *ngIf="collapsed" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
        </svg>
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
      transition: width var(--cs360-motion-normal);
      z-index: 100;

      &.collapsed {
        width: var(--cs360-sidebar-collapsed-width);

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
      font-size: var(--cs360-font-size-lg);
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
      display: flex;
      align-items: center;
      gap: var(--cs360-space-3);
      padding: var(--cs360-space-3) var(--cs360-space-4);
      border-radius: var(--cs360-radius-md);
      color: var(--cs360-sidebar-text);
      text-decoration: none;
      transition: all var(--cs360-motion-fast);
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
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
    }

    .nav-badge {
      background-color: var(--cs360-feedback-error);
      color: white;
      font-size: var(--cs360-font-size-xs);
      padding: 2px 6px;
      border-radius: var(--cs360-radius-full);
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
      transition: color var(--cs360-motion-fast);

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

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>',
      route: '/dashboard'
    },
    {
      label: 'My Schedule',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>',
      route: '/schedule',
      badge: 3
    },
    {
      label: 'My Clients',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>',
      route: '/clients'
    },
    {
      label: 'Documents',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>',
      route: '/documents'
    },
    {
      label: 'Trainings',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/></svg>',
      route: '/trainings'
    },
    {
      label: 'Availability',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>',
      route: '/availability'
    }
  ];
}
