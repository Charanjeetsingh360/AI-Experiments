import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { AvatarComponent } from '../../shared/components/cs-avatar/cs-avatar.component'; // kept for potential future use
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';

type AlertCategory = 'Alerts' | 'SMS Logs' | 'Expense Review' | 'Client Forms Review' | 'Pending Confirmation';

interface AlertItem {
  id: string;
  category: AlertCategory;
  title: string;
  body: string;
  timestamp: string;
  iconName: string;
  read: boolean;
}

interface Banner {
  title: string;
  subtitle: string;
  highlight: string;
  mark: string;
  variant: 'weekend' | 'night';
}

interface Shift {
  id: string;
  clientName: string;
  address: string;
  distance: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  clockedInTime?: string;
  backToBack?: boolean;
  detailsExpanded?: boolean;
  serviceInfo?: string;
  remainingHrs?: string;
  payRate?: string;
}

interface ChartBar {
  readonly label: string;
  readonly value: string;
  readonly heightClass: string;
}

interface ComparisonBar {
  readonly label: string;
  readonly scheduledValue: string;
  readonly approvedValue: string;
  readonly scheduledHeightClass: string;
  readonly approvedHeightClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CSIconComponent,
    CSFlyoutComponent,
    // AvatarComponent, // not used in template currently
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly banners = signal<Banner[]>([
    {
      highlight: '25%',
      title: 'Extra on this weekend',
      subtitle: 'You will get 25% extra payment on every open shift',
      mark: '#',
      variant: 'weekend',
    },
    {
      highlight: '$5',
      title: 'Night Shift Differential',
      subtitle: 'Earn more on night shifts',
      mark: 'moon',
      variant: 'night',
    }
  ]);
  readonly currentBannerIndex = signal<number>(0);
  readonly selectedShiftDetail = signal<Shift | null>(null);
  readonly selectedAlert = signal<AlertItem | null>(null);
  readonly showAdhocFlyout = signal(false);
  readonly statusMessage = signal('');
  adhocClientName = 'Marry, Edison';
  adhocStartTime = '14:00';
  adhocEndTime = '16:00';

  // Tabs layout
  readonly alertTabs: AlertCategory[] = [
    'Alerts',
    'SMS Logs',
    'Expense Review',
    'Client Forms Review',
    'Pending Confirmation'
  ];
  readonly activeAlertTab = signal<AlertCategory>('Alerts');
  readonly selectedMobileAlertTab = signal<AlertCategory | null>(null);

  // Shifts state
  readonly ongoingShift = signal<Shift | null>({
    id: 'o1',
    clientName: 'Marry, Edison',
    address: '99 Marina bay Street, New York',
    distance: '25 miles',
    date: 'MM/DD/YY',
    startTime: '2:00 AM',
    endTime: '2:30 AM',
    duration: '0h 30m',
    clockedInTime: '2:03 PM',
    backToBack: false
  });

  readonly upcomingShifts = signal<Shift[]>([
    {
      id: 'u1',
      clientName: 'Marry, Edison',
      address: '99 Marina bay Street, New York',
      distance: '25 miles',
      date: 'MM/DD/YY',
      startTime: '2:00 AM',
      endTime: '2:30 AM',
      duration: '0h 30m',
      backToBack: true
    }
  ]);

  readonly alerts = signal<AlertItem[]>([
    {
      id: '1',
      category: 'Alerts',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
      timestamp: '10m ago',
      iconName: 'warning',
      read: false
    },
    {
      id: '2',
      category: 'Alerts',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
      timestamp: '2h ago',
      iconName: 'warning',
      read: false
    },
    {
      id: '3',
      category: 'Alerts',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
      timestamp: '3h ago',
      iconName: 'warning',
      read: false
    },
    {
      id: '4',
      category: 'Alerts',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
      timestamp: '4h ago',
      iconName: 'warning',
      read: false
    },
    {
      id: '5',
      category: 'Alerts',
      title: 'Missed Clock-Out',
      body: 'Missed Clock-Out For Client John William On 11/18/2025 at 5:30 PM AST',
      timestamp: '5h ago',
      iconName: 'warning',
      read: false
    },
    {
      id: '6',
      category: 'SMS Logs',
      title: 'SMS Sent to Client',
      body: '"Hello Marry, I will be arriving 10 minutes early today." - Sent successfully.',
      timestamp: '1h ago',
      iconName: 'sms',
      read: true
    },
    {
      id: '7',
      category: 'Expense Review',
      title: 'Travel Mileage Submitted',
      body: 'Mileage claim for 25 miles on 11/18/2025 is pending supervisor approval.',
      timestamp: 'Yesterday',
      iconName: 'monetization_on',
      read: false
    },
    {
      id: '8',
      category: 'Client Forms Review',
      title: 'Signature Required',
      body: 'Daily log signature is missing for client Marry Edison for shift on 11/17/2025.',
      timestamp: '3d ago',
      iconName: 'edit_document',
      read: false
    },
    {
      id: '9',
      category: 'Pending Confirmation',
      title: 'Shift Offer: Mary Edison',
      body: 'New weekend shift offer on Saturday 11/22/2025. Please accept or decline.',
      timestamp: '4h ago',
      iconName: 'calendar_today',
      read: false
    }
  ]);

  readonly servicedBars: ChartBar[] = [
    { label: 'M', value: '8.5 hrs', heightClass: 'chart-bar--85' },
    { label: 'T', value: '6.0 hrs', heightClass: 'chart-bar--60' },
    { label: 'W', value: '7.5 hrs', heightClass: 'chart-bar--75' },
    { label: 'T', value: '9.5 hrs', heightClass: 'chart-bar--95' },
    { label: 'F', value: '4.0 hrs', heightClass: 'chart-bar--40' },
    { label: 'S', value: '1.5 hrs', heightClass: 'chart-bar--15' },
    { label: 'S', value: '2.0 hrs', heightClass: 'chart-bar--20' },
  ];

  readonly comparisonBars: ComparisonBar[] = [
    { label: 'M', scheduledValue: '8.0 Sch', approvedValue: '8.0 App', scheduledHeightClass: 'chart-bar--80', approvedHeightClass: 'chart-bar--80' },
    { label: 'T', scheduledValue: '6.0 Sch', approvedValue: '5.0 App', scheduledHeightClass: 'chart-bar--60', approvedHeightClass: 'chart-bar--50' },
    { label: 'W', scheduledValue: '8.0 Sch', approvedValue: '8.0 App', scheduledHeightClass: 'chart-bar--80', approvedHeightClass: 'chart-bar--80' },
    { label: 'T', scheduledValue: '9.0 Sch', approvedValue: '7.5 App', scheduledHeightClass: 'chart-bar--90', approvedHeightClass: 'chart-bar--75' },
    { label: 'F', scheduledValue: '4.0 Sch', approvedValue: '4.0 App', scheduledHeightClass: 'chart-bar--40', approvedHeightClass: 'chart-bar--40' },
    { label: 'S', scheduledValue: '2.0 Sch', approvedValue: '1.5 App', scheduledHeightClass: 'chart-bar--20', approvedHeightClass: 'chart-bar--15' },
    { label: 'S', scheduledValue: '2.0 Sch', approvedValue: '1.5 App', scheduledHeightClass: 'chart-bar--20', approvedHeightClass: 'chart-bar--15' },
  ];

  readonly filteredAlerts = computed(() => {
    return this.alerts().filter(alert => alert.category === this.activeAlertTab());
  });

  readonly currentBanner = computed(() => this.banners()[this.currentBannerIndex()]);

  tabId(tab: AlertCategory): string {
    return tab.toLowerCase().split(' ').join('-');
  }

  alertCountFor(tab: AlertCategory): number {
    return this.alerts().filter(alert => alert.category === tab).length;
  }

  openMobileAlertPanel(tab: AlertCategory): void {
    this.activeAlertTab.set(tab);
    this.selectedMobileAlertTab.set(tab);
  }

  closeMobileAlertPanel(): void {
    this.selectedMobileAlertTab.set(null);
  }

  nextBanner(): void {
    const nextIdx = (this.currentBannerIndex() + 1) % this.banners().length;
    this.currentBannerIndex.set(nextIdx);
  }

  prevBanner(): void {
    const prevIdx = (this.currentBannerIndex() - 1 + this.banners().length) % this.banners().length;
    this.currentBannerIndex.set(prevIdx);
  }

  clockOut(): void {
    this.ongoingShift.set(null);
    this.statusMessage.set('Current shift clocked out.');
  }

  clockIn(shift: Shift): void {
    const now = new Date();
    const clockedInTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.ongoingShift.set({
      ...shift,
      clockedInTime: clockedInTimeString
    });

    this.upcomingShifts.update(shifts => shifts.filter(s => s.id !== shift.id));
    this.statusMessage.set(`Clocked in for ${shift.clientName}.`);
  }

  openAdhocShift(): void {
    this.adhocClientName = 'Marry, Edison';
    this.adhocStartTime = '14:00';
    this.adhocEndTime = '16:00';
    this.showAdhocFlyout.set(true);
  }

  closeAdhocShift(): void {
    this.showAdhocFlyout.set(false);
  }

  saveAdhocShift(): void {
    this.upcomingShifts.update(shifts => [
      {
        id: `adhoc-${Date.now()}`,
        clientName: this.adhocClientName.trim() || 'Adhoc Client',
        address: '99 Marina bay Street, New York',
        distance: '25 miles',
        date: 'Today',
        startTime: this.formatTimeInput(this.adhocStartTime),
        endTime: this.formatTimeInput(this.adhocEndTime),
        duration: '2h 00m',
        backToBack: false,
      },
      ...shifts,
    ]);
    this.showAdhocFlyout.set(false);
    this.statusMessage.set('Adhoc shift created.');
  }

  openShiftDetail(shift: Shift): void {
    this.selectedShiftDetail.set(shift);
  }

  closeShiftDetail(): void {
    this.selectedShiftDetail.set(null);
  }

  toggleShiftDetails(shift: Shift): void {
    shift.detailsExpanded = !shift.detailsExpanded;
  }

  /* Shift control placeholder actions */
  openTasks(_shift: Shift): void { /* TODO: navigate to tasks */ }
  openCareNotes(_shift: Shift): void { /* TODO: navigate to care notes */ }
  openFamilyNotes(_shift: Shift): void { /* TODO: navigate to family notes */ }
  openClientSign(_shift: Shift): void { /* TODO: navigate to client signature */ }
  openCaregiverSign(_shift: Shift): void { /* TODO: navigate to caregiver signature */ }
  openLogBreak(_shift: Shift): void { /* TODO: navigate to log break */ }
  openSurvey(_shift: Shift): void { /* TODO: navigate to survey */ }
  openInjury(_shift: Shift): void { /* TODO: navigate to injury/incident */ }
  openExpense(_shift: Shift): void { /* TODO: navigate to expense */ }
  openGoals(_shift: Shift): void { /* TODO: navigate to goals */ }
  openClientForms(_shift: Shift): void { /* TODO: navigate to client forms */ }
  openTimesheetMap(_shift: Shift): void { /* TODO: navigate to timesheet map */ }

  markAllAsRead(): void {
    const activeTab = this.activeAlertTab();
    this.alerts.update(items =>
      items.map(item => (item.category === activeTab ? { ...item, read: true } : item))
    );
  }

  markAsRead(alertId: string): void {
    this.alerts.update(items =>
      items.map(item => (item.id === alertId ? { ...item, read: true } : item))
    );
  }

  openAlert(alert: AlertItem): void {
    this.markAsRead(alert.id);
    this.selectedAlert.set(alert);
  }

  closeAlert(): void {
    this.selectedAlert.set(null);
  }

  onRefresh(): void {
    console.log('Refreshing dashboard data...');
  }

  private formatTimeInput(value: string): string {
    const [hourRaw, minute = '00'] = value.split(':');
    const hour = Number(hourRaw);
    if (Number.isNaN(hour)) return value;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const normalized = hour % 12 || 12;
    return `${normalized}:${minute} ${suffix}`;
  }
}
