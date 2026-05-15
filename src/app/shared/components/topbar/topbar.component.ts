import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme, Density } from '../../../core/services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <!-- Left: Menu Toggle & Search -->
      <div class="topbar-left">
        <button class="menu-toggle" (click)="toggleSidebar.emit()" aria-label="Toggle sidebar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <input type="text" placeholder="Search..." class="search-input" />
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="topbar-right">
        <!-- Theme Switcher -->
        <div class="theme-switcher">
          <button 
            *ngFor="let t of themes" 
            class="theme-btn" 
            [class.active]="themeService.theme() === t"
            (click)="themeService.setTheme(t)"
            [title]="t + ' theme'">
            <span *ngIf="t === 'light'">☀️</span>
            <span *ngIf="t === 'dark'">🌙</span>
            <span *ngIf="t === 'high-contrast'">◐</span>
          </button>
        </div>

        <!-- Density Switcher -->
        <div class="density-switcher">
          <button 
            *ngFor="let d of densities" 
            class="density-btn" 
            [class.active]="themeService.density() === d"
            (click)="themeService.setDensity(d)"
            [title]="d + ' density'">
            {{ d === 'compact' ? '▪' : d === 'default' ? '■' : '▪▪' }}
          </button>
        </div>

        <!-- Notifications -->
        <button class="icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>

        <!-- User Avatar -->
        <button class="user-avatar" aria-label="User menu">
          <img src="https://ui-avatars.com/api/?name=John+Doe&background=1F63DA&color=fff" alt="User" />
        </button>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--cs360-topbar-height);
      padding: 0 var(--cs360-space-6);
      background-color: var(--cs360-topbar-bg);
      border-bottom: 1px solid var(--cs360-topbar-border);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: var(--cs360-space-4);
    }

    .menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      border-radius: var(--cs360-radius-md);
      color: var(--cs360-text-secondary);
      cursor: pointer;
      transition: all var(--cs360-motion-fast);

      &:hover {
        background-color: var(--cs360-bg-surface-hover);
        color: var(--cs360-text-primary);
      }
    }

    .search-box {
      position: relative;
      width: 300px;
    }

    .search-icon {
      position: absolute;
      left: var(--cs360-space-3);
      top: 50%;
      transform: translateY(-50%);
      color: var(--cs360-text-tertiary);
    }

    .search-input {
      width: 100%;
      padding: var(--cs360-space-2) var(--cs360-space-3) var(--cs360-space-2) var(--cs360-space-10);
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-md);
      background-color: var(--cs360-bg-surface);
      color: var(--cs360-text-primary);
      font-size: var(--cs360-font-size-sm);
      transition: all var(--cs360-motion-fast);

      &::placeholder {
        color: var(--cs360-text-tertiary);
      }

      &:focus {
        outline: none;
        border-color: var(--cs360-action-primary);
        box-shadow: var(--cs360-focus-ring);
      }
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: var(--cs360-space-4);
    }

    .theme-switcher, .density-switcher {
      display: flex;
      background-color: var(--cs360-bg-surface-hover);
      border-radius: var(--cs360-radius-md);
      padding: 2px;
    }

    .theme-btn, .density-btn {
      padding: var(--cs360-space-1) var(--cs360-space-2);
      border: none;
      background: none;
      border-radius: var(--cs360-radius-sm);
      cursor: pointer;
      font-size: var(--cs360-font-size-sm);
      transition: all var(--cs360-motion-fast);

      &.active {
        background-color: var(--cs360-bg-surface);
        box-shadow: var(--cs360-shadow-sm);
      }
    }

    .icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      border-radius: var(--cs360-radius-md);
      color: var(--cs360-text-secondary);
      cursor: pointer;
      transition: all var(--cs360-motion-fast);

      &:hover {
        background-color: var(--cs360-bg-surface-hover);
        color: var(--cs360-text-primary);
      }
    }

    .notification-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      background-color: var(--cs360-feedback-error);
      color: white;
      font-size: 10px;
      font-weight: 600;
      border-radius: var(--cs360-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--cs360-radius-full);
      overflow: hidden;
      border: 2px solid var(--cs360-border-subtle);
      padding: 0;
      cursor: pointer;
      transition: border-color var(--cs360-motion-fast);

      &:hover {
        border-color: var(--cs360-action-primary);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    @media (max-width: 768px) {
      .search-box {
        display: none;
      }
    }
  `]
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleDensity = new EventEmitter<void>();

  themeService = inject(ThemeService);

  themes: Theme[] = ['light', 'dark', 'high-contrast'];
  densities: Density[] = ['compact', 'default', 'comfortable'];
}
