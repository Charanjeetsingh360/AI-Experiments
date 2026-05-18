import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CSTabsComponent, CSTab } from '../../shared/components/cs-tabs/cs-tabs.component';

export type ShiftStatus = 'completed' | 'clocked-in' | 'upcoming' | 'missed';

interface Shift {
  id: string;
  clientName: string;
  clientAddress: string;
  distance?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  duration: string;
  clockInTime?: string;
  clockOutTime?: string;
  status: ShiftStatus;
  serviceType?: string;
  totalHrs?: string;
}

interface ShiftGroup {
  date: string;
  dayName: string;
  completedHrs: string;
  shifts: Shift[];
}

interface CalendarDay {
  day: number;
  inMonth: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-shift-calendar',
  standalone: true,
  imports: [CommonModule, CSIconComponent, CSTabsComponent],
  templateUrl: './shift-calendar.component.html',
  styleUrl: './shift-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftCalendarComponent {

  readonly tabs: CSTab[] = [
    { label: 'Assigned Shifts', value: 'assigned', badge: 10 },
    { label: 'Adhoc', value: 'adhoc' },
    { label: 'Meetings', value: 'meetings', badge: 1 },
    { label: 'Open Shifts', value: 'open' },
  ];

  readonly activeTab = signal<string>('assigned');

  onTabChange(value: string): void {
    this.activeTab.set(value);
  }

  readonly viewMode = signal<'list' | 'calendar'>('calendar');

  readonly calendarMode = signal<'monthly' | 'weekly'>('weekly');

  readonly today = new Date();

  readonly displayMonth = signal(
    new Date(this.today.getFullYear(), this.today.getMonth(), 1),
  );

  readonly weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  readonly monthLabel = computed(() =>
    this.displayMonth().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  );

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const current = this.displayMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const cells: CalendarDay[] = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, inMonth: false, isToday: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ day: d, inMonth: true, isToday: this.isSameDay(date, this.today) });
    }
    let next = 1;
    while (cells.length % 7 !== 0) {
      cells.push({ day: next++, inMonth: false, isToday: false });
    }
    return cells;
  });

  prevMonth(): void {
    const c = this.displayMonth();
    this.displayMonth.set(new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const c = this.displayMonth();
    this.displayMonth.set(new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  readonly statusClass: Record<ShiftStatus, string> = {
    completed:  'bg-[var(--cs360-feedback-success-bg)] text-[var(--cs360-feedback-success)]',
    'clocked-in': 'bg-[var(--cs360-feedback-info-bg)] text-[var(--cs360-feedback-info)]',
    upcoming:   'bg-[var(--cs360-feedback-warning-bg)] text-[var(--cs360-feedback-warning)]',
    missed:     'bg-[var(--cs360-feedback-error-bg)] text-[var(--cs360-feedback-error)]',
  };

  readonly shiftGroups: ShiftGroup[] = [
    {
      date: '8/1/25',
      dayName: 'Sunday',
      completedHrs: '5h 15m',
      shifts: [
        {
          id: 's1',
          clientName: 'Marry, Edison',
          clientAddress: '99 Marina Bay Street, New York',
          startTime: '2:00 AM',
          endTime: '2:30 AM',
          timezone: 'AST',
          duration: '0h 30m',
          clockInTime: '2:00 AM',
          clockOutTime: '2:30 AM',
          status: 'completed',
        },
      ],
    },
    {
      date: '8/2/25',
      dayName: 'Monday',
      completedHrs: '0',
      shifts: [
        {
          id: 's2',
          clientName: 'Marry, Edison',
          clientAddress: '99 Marina Bay Street, New York',
          distance: '25 miles',
          startTime: '2:00 PM',
          endTime: '10:00 PM',
          timezone: 'AST',
          duration: '8h 00m',
          clockInTime: '2:03 PM',
          status: 'clocked-in',
          serviceType: 'Healthcare Services',
          totalHrs: '8.00',
        },
      ],
    },
    {
      date: '8/5/25',
      dayName: 'Thursday',
      completedHrs: '0',
      shifts: [
        {
          id: 's3',
          clientName: 'James, Wilson',
          clientAddress: '120 Park Avenue, Boston',
          distance: '10 miles',
          startTime: '9:00 AM',
          endTime: '1:00 PM',
          timezone: 'EST',
          duration: '4h 00m',
          status: 'upcoming',
          serviceType: 'Companion Care',
        },
      ],
    },
  ];
}
