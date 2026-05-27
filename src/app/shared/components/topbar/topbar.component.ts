import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme, Density } from '../../../core/services/theme.service';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  template: `
    <header class="topbar">
      <!-- Left: Menu Toggle & Search -->
      <div class="topbar-left">
        <button class="menu-toggle" (click)="toggleSidebar.emit()" aria-label="Toggle sidebar">
          <cs-icon name="menu" [size]="24" />
        </button>

        <div class="search-box">
          <cs-icon name="search" [size]="20" class="search-icon" />
          <input type="text" placeholder="Search..." class="search-input" />
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="topbar-right">
                <!-- Caregiver Status Block — Figma topbar right section -->
          <div style="display:flex;align-items:center;gap:8px;padding:0 12px;border-right:1px solid var(--cs360-border-subtle)">
            <!-- Avatar -->
            <div style="width:32px;height:32px;border-radius:50%;background:#e8e0f0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:#6b48a0;overflow:hidden;border:2px solid var(--cs360-border-subtle)">
              ME
            </div>
            <!-- Name + Clock-in -->
            <div style="display:flex;flex-direction:column;gap:1px">
              <span style="font-size:13px;font-weight:600;color:var(--cs360-text-primary);line-height:1.2">Marry, Edison</span>
              <span style="font-size:11px;color:var(--cs360-text-secondary);line-height:1.2">Clock-In at 2:05 PM</span>
            </div>
            <!-- Clock-Out button -->
            <button type="button"
              style="display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:6px;border:none;background:#dc2626;color:#fff;font-size:12px;font-weight:500;cursor:pointer">
              Clock-Out
            </button>
            <!-- Adhoc Shift button -->
            <button type="button"
              style="display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:6px;border:1px solid var(--cs360-border-subtle);background:var(--cs360-bg-surface);color:var(--cs360-text-primary);font-size:12px;font-weight:500;cursor:pointer">
              + Adhoc Shift
            </button>
          </div>
        <!-- Theme Switcher — light_mode / dark_mode / contrast -->
        <div class="theme-switcher">
          <button
            *ngFor="let t of themes"
            class="theme-btn"
            [class.active]="themeService.theme() === t"
            (click)="themeService.setTheme(t)"
            [title]="t + ' theme'">
            <cs-icon [name]="t === 'light' ? 'light_mode' : t === 'dark' ? 'dark_mode' : 'contrast'" [size]="16" />
          </button>
        </div>

        <!-- Density Switcher — density_small / density_medium / density_large -->
        <div class="density-switcher">
          <button
            *ngFor="let d of densities"
            class="density-btn"
            [class.active]="themeService.density() === d"
            (click)="themeService.setDensity(d)"
            [title]="d + ' density'">
            <cs-icon [name]="d === 'compact' ? 'density_small' : d === 'default' ? 'density_medium' : 'density_large'" [size]="16" />
          </button>
        </div>

        <!-- Notifications -->
        <button class="icon-btn" aria-label="Notifications">
          <cs-icon name="notifications" [size]="20" />
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
      transition: all var(--cs360-transition-fast);

      &:hover {
        background-color: var(--cs360-bg-surface-hover);
        color: var(--cs360-text-primary);
      }
    }

    .search-box {
      position: relative;
      width: 300px;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: var(--cs360-space-3);
      color: var(--cs360-text-tertiary);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: var(--cs360-space-2) var(--cs360-space-3) var(--cs360-space-2) calc(var(--cs360-space-3) + 28px);
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-md);
      background-color: var(--cs360-bg-surface);
      color: var(--cs360-text-primary);
      font-size: var(--cs360-text-sm);
      transition: all var(--cs360-transition-fast);
      font-family: inherit;

      &::placeholder { color: var(--cs360-text-tertiary); }
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      border-radius: var(--cs360-radius-sm);
      color: var(--cs360-text-secondary);
      cursor: pointer;
      transition: all var(--cs360-transition-fast);

      &.active {
        background-color: var(--cs360-bg-surface);
        color: var(--cs360-text-primary);
        box-shadow: var(--cs360-shadow-sm);
      }

      &:hover:not(.active) {
        color: var(--cs360-text-primary);
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
      transition: all var(--cs360-transition-fast);

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
      transition: border-color var(--cs360-transition-fast);

      &:hover { border-color: var(--cs360-action-primary); }

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    @media (max-width: 768px) {
      .search-box { display: none; }
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
