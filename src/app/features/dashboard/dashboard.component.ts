import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';
import { CSAvatarComponent } from '../../shared/components/cs-avatar/cs-avatar.component';

interface Alert {
  id: string;
  title: string;
  body: string;
}

interface UpcomingShift {
  id: string;
  clientName: string;
  address: string;
  distance?: string;
  startTime: string;
  endTime: string;
  duration: string;
  backToBack?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CSIconComponent,
    CsPageHeaderComponent,
    CSAvatarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly today = new Date();

  readonly alertTabs = ['Alerts', 'SMS Logs', 'Expense Review', 'Client Forms Review', 'Pending Confirmation'];
  activeAlertTab = 'Alerts';

  readonly alerts: Alert[] = [
    {
      id: '1',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
    },
    {
      id: '2',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
    },
    {
      id: '3',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
    },
    {
      id: '4',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
    },
    {
      id: '5',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
    },
  ];

  readonly upcomingShifts: UpcomingShift[] = [
    {
      id: 'u1',
      clientName: 'Marry Edison',
      address: '99 Marina bay Street, New York',
      distance: '25 miles',
      startTime: '2:00 AM',
      endTime: '2:30 AM',
      duration: '0h 30m',
      backToBack: true,
    },
  ];
}
