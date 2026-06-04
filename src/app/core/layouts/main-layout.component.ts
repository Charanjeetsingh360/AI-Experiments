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
        [mobileOpen]="mobileSidebarOpen"
        (toggleCollapse)="toggleSidebar()"
        (closeSidebar)="closeMobileSidebar()">
      </app-sidebar>
      
      <div class="main-content" [class.sidebar-collapsed]="sidebarCollapsed">
        <app-topbar 
          (toggleSidebar)="openMobileSidebar()"
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
      overflow-x: hidden;
    }

    .main-content {
      flex: 1;
      min-width: 0;
      margin-left: var(--cs360-sidebar-width);
      padding-top: var(--cs360-topbar-height); /* offset for fixed topbar — all viewports */
      display: flex;
      flex-direction: column;
      transition: margin-left var(--cs360-motion-normal);

      &.sidebar-collapsed {
        margin-left: var(--cs360-sidebar-collapsed-width);
      }
    }

    .page-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background-color: var(--cs360-bg-page);
    }

    /* Tablet landscape and below: sidebar is a drawer, content fills full width */
    @media (max-width: 1024px) {
      .main-content,
      .main-content.sidebar-collapsed {
        margin-left: 0;
      }
    }
  `]
})
export class MainLayoutComponent {
  themeService = inject(ThemeService);
  sidebarCollapsed = false;
  mobileSidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openMobileSidebar(): void {
    this.mobileSidebarOpen = true;
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }
}
