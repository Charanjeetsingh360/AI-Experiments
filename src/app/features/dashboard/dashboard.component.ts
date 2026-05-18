import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';
import { CSAvatarComponent } from '../../shared/components/cs-avatar/cs-avatar.component';

interface StatCard {
  key: string;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: string;
}

interface Shift {
  id: string;
  clientName: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  date?: string;
}

interface QuickAction {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TitleCasePipe,
    RouterLink,
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

  get greeting(): string {
    const h = this.today.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  readonly caregiverName = 'John Smith';

  readonly stats: StatCard[] = [
    {
      key: 'shifts-today',
      label: "Today's Shifts",
      value: '2',
      change: '+1 from yesterday',
      changePositive: true,
      icon: 'calendar_today',
    },
    {
      key: 'hours-week',
      label: 'Hours This Week',
      value: '18',
      change: '+4 from last week',
      changePositive: true,
      icon: 'schedule',
    },
    {
      key: 'clients',
      label: 'Active Clients',
      value: '5',
      icon: 'groups',
    },
    {
      key: 'docs',
      label: 'Docs Expiring',
      value: '2',
      change: 'Action required',
      changePositive: false,
      icon: 'description',
    },
  ];

  readonly todayShifts: Shift[] = [
    {
      id: 't1',
      clientName: 'Mary Johnson',
      startTime: '9:00 AM',
      endTime: '1:00 PM',
      serviceType: 'Personal Care',
      status: 'confirmed',
    },
    {
      id: 't2',
      clientName: 'Robert Smith',
      startTime: '3:00 PM',
      endTime: '7:00 PM',
      serviceType: 'Companion Care',
      status: 'confirmed',
    },
  ];

  readonly upcomingShifts: Shift[] = [
    {
      id: 'u1',
      clientName: 'Emily Davis',
      date: 'Tomorrow',
      startTime: '9:00 AM',
      endTime: '1:00 PM',
      serviceType: 'Home Care',
      status: 'confirmed',
    },
    {
      id: 'u2',
      clientName: 'James Wilson',
      date: 'Wed, May 21',
      startTime: '2:00 PM',
      endTime: '6:00 PM',
      serviceType: 'Medical',
      status: 'pending',
    },
    {
      id: 'u3',
      clientName: 'Mary Johnson',
      date: 'Thu, May 22',
      startTime: '8:00 AM',
      endTime: '12:00 PM',
      serviceType: 'Personal Care',
      status: 'confirmed',
    },
    {
      id: 'u4',
      clientName: 'Linda Brown',
      date: 'Fri, May 23',
      startTime: '10:00 AM',
      endTime: '2:00 PM',
      serviceType: 'Companion Care',
      status: 'confirmed',
    },
  ];

  readonly quickActions: QuickAction[] = [
    { label: 'Shift Calendar', route: '/shift-calendar', icon: 'calendar_month' },
    { label: 'My Clients',     route: '/clients',        icon: 'groups' },
    { label: 'Availability',   route: '/availability',   icon: 'event_busy' },
    { label: 'Documents',      route: '/documents',      icon: 'description' },
    { label: 'Messages',       route: '/messages',       icon: 'mail' },
    { label: 'Trainings',      route: '/trainings',      icon: 'school' },
  ];
}
