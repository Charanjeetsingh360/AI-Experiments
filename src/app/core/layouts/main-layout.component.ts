import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../../shared/components/topbar/topbar.component';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar 
        [collapsed]="sidebarCollapsed" 
        (toggleCollapse)="toggleSidebar()">
      </app-sidebar>
      
      <div class="main-content" [class.sidebar-collapsed]="sidebarCollapsed">
        <app-topbar 
          (toggleSidebar)="toggleSidebar()"
          (toggleTheme)="themeService.toggleTheme()"
          (toggleDensity)="themeService.cycleDensity()">
        </app-topbar>
        
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--cs360-bg);
    }

    .main-content {
      flex: 1;
      margin-left: var(--cs360-sidebar-width);
      display: flex;
      flex-direction: column;
      transition: margin-left var(--cs360-motion-normal);

      &.sidebar-collapsed {
        margin-left: var(--cs360-sidebar-collapsed-width);
      }
    }

    .page-content {
      flex: 1;
      padding: var(--cs360-space-6);
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
    }
  `]
})
export class MainLayoutComponent {
  themeService = inject(ThemeService);
  sidebarCollapsed = false;

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
