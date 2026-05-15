import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ThemeService } from '../../core/services/theme.service';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface UpcomingShift {
  client: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  template: `
    <div class="dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Welcome back, John! 👋</h1>
          <p class="page-subtitle">Here's what's happening with your schedule today.</p>
        </div>
        <app-button variant="primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 010-2h4V3a1 1 0 011-1z"/>
          </svg>
          New Shift
        </app-button>
      </div>

      <!-- Promo Banner -->
      <div class="promo-banner">
        <div class="promo-content">
          <h3>🎉 Complete your profile to unlock premium features!</h3>
          <p>Add your certifications and availability to get matched with more clients.</p>
        </div>
        <app-button variant="secondary" size="sm">Complete Profile</app-button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div *ngFor="let stat of stats" class="stat-card">
          <div class="stat-icon" [innerHTML]="stat.icon"></div>
          <div class="stat-info">
            <span class="stat-title">{{ stat.title }}</span>
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-change" [class]="stat.changeType">{{ stat.change }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Upcoming Shifts -->
        <app-card title="Upcoming Shifts" [showHeader]="true">
          <div cardActions>
            <app-button variant="ghost" size="sm">View All</app-button>
          </div>
          
          <div class="shifts-list">
            <div *ngFor="let shift of upcomingShifts" class="shift-item">
              <div class="shift-avatar">
                <img [src]="'https://ui-avatars.com/api/?name=' + shift.client + '&background=random'" [alt]="shift.client" />
              </div>
              <div class="shift-details">
                <span class="shift-client">{{ shift.client }}</span>
                <span class="shift-time">{{ shift.time }}</span>
              </div>
              <div class="shift-meta">
                <span class="shift-type">{{ shift.type }}</span>
                <span class="shift-status" [class]="shift.status">{{ shift.status }}</span>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Quick Actions -->
        <app-card title="Quick Actions" [showHeader]="true">
          <div class="quick-actions">
            <button class="quick-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>My Schedule</span>
            </button>
            <button class="quick-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Documents</span>
            </button>
            <button class="quick-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Availability</span>
            </button>
            <button class="quick-action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9 5 9-5-9 5z"/>
              </svg>
              <span>Trainings</span>
            </button>
          </div>
        </app-card>
      </div>

      <!-- Recent Activity -->
      <app-card title="Recent Activity" [showHeader]="true" [elevated]="true">
        <table class="activity-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Details</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Shift Completed</td>
              <td>Home care visit - Mary Johnson</td>
              <td>Today, 2:30 PM</td>
              <td><span class="status-badge success">Completed</span></td>
            </tr>
            <tr>
              <td>Document Uploaded</td>
              <td>CPR Certification</td>
              <td>Yesterday</td>
              <td><span class="status-badge info">Pending Review</span></td>
            </tr>
            <tr>
              <td>Training Completed</td>
              <td>COVID-19 Safety Protocol</td>
              <td>May 12, 2026</td>
              <td><span class="status-badge success">Verified</span></td>
            </tr>
          </tbody>
        </table>
      </app-card>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: var(--cs360-space-6);
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .page-title {
      font-size: var(--cs360-font-size-2xl);
      font-weight: 700;
      color: var(--cs360-text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--cs360-font-size-base);
      color: var(--cs360-text-secondary);
      margin: var(--cs360-space-1) 0 0;
    }

    .promo-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--cs360-space-4) var(--cs360-space-5);
      background: linear-gradient(135deg, var(--cs360-promo-bg-start), var(--cs360-promo-bg-end));
      border-radius: var(--cs360-radius-lg);
    }

    .promo-content {
      h3 {
        margin: 0;
        font-size: var(--cs360-font-size-md);
        color: var(--cs360-promo-text);
      }
      p {
        margin: var(--cs360-space-1) 0 0;
        font-size: var(--cs360-font-size-sm);
        color: var(--cs360-promo-text);
        opacity: 0.8;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--cs360-space-4);
    }

    .stat-card {
      display: flex;
      align-items: flex-start;
      gap: var(--cs360-space-4);
      padding: var(--cs360-space-5);
      background-color: var(--cs360-bg-surface);
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-lg);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--cs360-blue-0);
      color: var(--cs360-action-primary);
      border-radius: var(--cs360-radius-md);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-title {
      font-size: var(--cs360-font-size-sm);
      color: var(--cs360-text-secondary);
    }

    .stat-value {
      font-size: var(--cs360-font-size-xl);
      font-weight: 700;
      color: var(--cs360-text-primary);
    }

    .stat-change {
      font-size: var(--cs360-font-size-xs);
      &.positive { color: var(--cs360-feedback-success); }
      &.negative { color: var(--cs360-feedback-error); }
      &.neutral { color: var(--cs360-text-secondary); }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--cs360-space-6);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .shifts-list {
      display: flex;
      flex-direction: column;
      gap: var(--cs360-space-3);
    }

    .shift-item {
      display: flex;
      align-items: center;
      gap: var(--cs360-space-3);
      padding: var(--cs360-space-3);
      border-radius: var(--cs360-radius-md);
      transition: background-color var(--cs360-motion-fast);

      &:hover {
        background-color: var(--cs360-bg-surface-hover);
      }
    }

    .shift-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--cs360-radius-full);
      overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .shift-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .shift-client {
      font-weight: 500;
      color: var(--cs360-text-primary);
    }

    .shift-time {
      font-size: var(--cs360-font-size-sm);
      color: var(--cs360-text-secondary);
    }

    .shift-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--cs360-space-1);
    }

    .shift-type {
      font-size: var(--cs360-font-size-xs);
      color: var(--cs360-text-secondary);
    }

    .shift-status {
      font-size: var(--cs360-font-size-xs);
      padding: 2px 8px;
      border-radius: var(--cs360-radius-full);
      
      &.confirmed {
        background-color: var(--cs360-feedback-success-bg);
        color: var(--cs360-feedback-success);
      }
      &.pending {
        background-color: var(--cs360-feedback-warning-bg);
        color: var(--cs360-feedback-warning);
      }
      &.cancelled {
        background-color: var(--cs360-feedback-error-bg);
        color: var(--cs360-feedback-error);
      }
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--cs360-space-3);
    }

    .quick-action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--cs360-space-2);
      padding: var(--cs360-space-4);
      background-color: var(--cs360-bg-surface-hover);
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-md);
      cursor: pointer;
      transition: all var(--cs360-motion-fast);
      color: var(--cs360-text-primary);

      &:hover {
        background-color: var(--cs360-action-primary);
        color: white;
        border-color: var(--cs360-action-primary);
      }

      span {
        font-size: var(--cs360-font-size-sm);
      }
    }

    .activity-table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: var(--cs360-space-3) var(--cs360-space-4);
        text-align: left;
        border-bottom: 1px solid var(--cs360-border-subtle);
      }

      th {
        font-size: var(--cs360-font-size-xs);
        font-weight: 600;
        color: var(--cs360-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      td {
        font-size: var(--cs360-font-size-sm);
        color: var(--cs360-text-primary);
      }

      tbody tr:hover {
        background-color: var(--cs360-bg-surface-hover);
      }
    }

    .status-badge {
      display: inline-flex;
      padding: 2px 8px;
      font-size: var(--cs360-font-size-xs);
      border-radius: var(--cs360-radius-full);

      &.success {
        background-color: var(--cs360-feedback-success-bg);
        color: var(--cs360-feedback-success);
      }
      &.info {
        background-color: var(--cs360-feedback-info-bg);
        color: var(--cs360-feedback-info);
      }
      &.warning {
        background-color: var(--cs360-feedback-warning-bg);
        color: var(--cs360-feedback-warning);
      }
    }
  `]
})
export class DashboardComponent {
  themeService = inject(ThemeService);

  stats: StatCard[] = [
    {
      title: 'Total Shifts',
      value: '24',
      change: '+12% from last month',
      changeType: 'positive',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
    },
    {
      title: 'Hours Worked',
      value: '186',
      change: '+8% from last month',
      changeType: 'positive',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    },
    {
      title: 'Active Clients',
      value: '7',
      change: 'Same as last month',
      changeType: 'neutral',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m12-3.807a4 4 0 11-5.464-5.464"/></svg>'
    },
    {
      title: 'Earnings',
      value: '$4,280',
      change: '+15% from last month',
      changeType: 'positive',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
    }
  ];

  upcomingShifts: UpcomingShift[] = [
    { client: 'Mary Johnson', time: 'Today, 3:00 PM - 7:00 PM', type: 'Home Care', status: 'confirmed' },
    { client: 'Robert Smith', time: 'Tomorrow, 9:00 AM - 1:00 PM', type: 'Medical', status: 'pending' },
    { client: 'Emily Davis', time: 'May 17, 2:00 PM - 6:00 PM', type: 'Companion', status: 'confirmed' },
    { client: 'James Wilson', time: 'May 18, 10:00 AM - 2:00 PM', type: 'Home Care', status: 'confirmed' }
  ];
}
