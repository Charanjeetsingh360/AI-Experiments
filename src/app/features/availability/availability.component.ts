import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

type OpenShiftStatus = 'open' | 'offered' | 'applied' | 'declined';
type AvailabilityType = 'availability' | 'unavailability';
type RecurrencePattern = 'Once' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

interface AvailableShift {
  id: string;
  status: OpenShiftStatus;
  clientName: string;
  address: string;
  date: string;
  dayName: string;
  startTime: string;
  endTime: string;
  duration: string;
  serviceType: string;
  distance: string;
  payRate: string;
  estimatedEarnings: string;
  notes: string;
}

interface AvailabilityRecord {
  id: string;
  type: AvailabilityType;
  reason: string;
  startDate: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  recurrence: RecurrencePattern;
  recurrenceSummary: string;
  notes: string;
}

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, FormsModule, CSFlyoutComponent, CSIconComponent, CsPageHeaderComponent],
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityComponent {
  readonly statusTabs: Array<{ label: string; value: OpenShiftStatus }> = [
    { label: 'Open', value: 'open' },
    { label: 'Offered', value: 'offered' },
    { label: 'Applied', value: 'applied' },
    { label: 'Declined', value: 'declined' },
  ];

  readonly activeStatus = signal<OpenShiftStatus>('open');
  readonly searchQuery = signal('');
  readonly showFilters = signal(false);
  readonly showMoreActions = signal(false);
  readonly selectedShift = signal<AvailableShift | null>(null);
  readonly showAvailabilityManager = signal(false);
  readonly availabilityMode = signal<AvailabilityType | null>(null);
  readonly editingAvailabilityId = signal<string | null>(null);
  readonly formSubmitted = signal(false);
  readonly selectedCalendarDay = signal(26);
  readonly statusMessage = signal('');
  readonly canManageAvailability = signal(true);

  readonly availabilityRecords = signal<AvailabilityRecord[]>([
    {
      id: 'availability-1',
      type: 'availability',
      reason: '',
      startDate: '2025-11-26',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      allDay: false,
      recurrence: 'Weekly',
      recurrenceSummary: 'Every 1 week on Mon, Wed, Fri until 4 weeks',
      notes: 'Preferred weekday availability.',
    },
    {
      id: 'unavailability-1',
      type: 'unavailability',
      reason: 'Personal Appointment',
      startDate: '2025-11-28',
      startTime: '12:00 AM',
      endTime: '11:59 PM',
      allDay: true,
      recurrence: 'Once',
      recurrenceSummary: 'Once on start date',
      notes: 'Unavailable all day.',
    },
  ]);

  readonly recurrenceOptions: RecurrencePattern[] = ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  readonly reasons = ['Personal Appointment', 'Vacation', 'Sick', 'Training', 'Other'];

  availabilityReason = '';
  availabilityStartDate = '2025-11-26';
  availabilityStartTime = '9:00 AM';
  availabilityEndTime = '5:00 PM';
  availabilityAllDay = false;
  availabilityNotes = '';
  availabilityRecurrence: RecurrencePattern = 'Once';
  repeatEvery = 1;
  repeatUntil = 1;
  endByDate = '2025-12-31';
  weeklyDays = new Set(['Mon']);
  monthlyMode: 'ordinal' | 'specific' = 'ordinal';
  monthlyOrdinal = 'First';
  monthlyWeekday = 'Monday';
  monthlyDay = 1;
  yearlyMode: 'fixed' | 'floating' = 'fixed';
  yearlyMonth = 'January';
  yearlyDate = 1;

  private readonly shifts = signal<AvailableShift[]>([
    {
      id: 'os-1',
      status: 'open',
      clientName: 'Marry Edison',
      address: '99 Marina Bay Street, New York',
      date: '11/26/2025',
      dayName: 'Wednesday',
      startTime: '2:00 PM',
      endTime: '10:00 PM',
      duration: '8h 00m',
      serviceType: 'Healthcare Services (Authorized) - 123445',
      distance: '25 miles',
      payRate: '$30 / 15 min',
      estimatedEarnings: '$960',
      notes: 'Open shift requires meal prep, medication reminders and transfer assistance.',
    },
    {
      id: 'os-2',
      status: 'open',
      clientName: 'John Williams',
      address: '145 Beacon Street, Boston',
      date: '11/27/2025',
      dayName: 'Thursday',
      startTime: '9:00 AM',
      endTime: '1:00 PM',
      duration: '4h 00m',
      serviceType: 'Companion Care - 445012',
      distance: '12 miles',
      payRate: '$24 / 15 min',
      estimatedEarnings: '$384',
      notes: 'Client prefers morning visits and light housekeeping support.',
    },
    {
      id: 'os-3',
      status: 'offered',
      clientName: 'Eleanor Vasquez',
      address: '305 Birchwood Dr, San Antonio',
      date: '11/28/2025',
      dayName: 'Friday',
      startTime: '8:00 AM',
      endTime: '4:00 PM',
      duration: '8h 00m',
      serviceType: 'Personal Care - 772901',
      distance: '18 miles',
      payRate: '$28 / 15 min',
      estimatedEarnings: '$896',
      notes: 'Offer expires today at 5:00 PM AST.',
    },
    {
      id: 'os-4',
      status: 'applied',
      clientName: 'Dorothy Nguyen',
      address: '920 Lavender Court, Fort Worth',
      date: '11/29/2025',
      dayName: 'Saturday',
      startTime: '6:00 PM',
      endTime: '10:00 PM',
      duration: '4h 00m',
      serviceType: 'Physical Therapy Support - 800221',
      distance: '9 miles',
      payRate: '$26 / 15 min',
      estimatedEarnings: '$416',
      notes: 'Application pending coordinator approval.',
    },
    {
      id: 'os-5',
      status: 'declined',
      clientName: 'Harold Simmons',
      address: '17 Oak Hill Road, Dallas',
      date: '11/30/2025',
      dayName: 'Sunday',
      startTime: '10:00 AM',
      endTime: '2:00 PM',
      duration: '4h 00m',
      serviceType: 'Homemaking - 671240',
      distance: '31 miles',
      payRate: '$22 / 15 min',
      estimatedEarnings: '$352',
      notes: 'Declined due to schedule conflict.',
    },
  ]);

  readonly filteredShifts = computed(() => {
    const status = this.activeStatus();
    const query = this.searchQuery().trim().toLowerCase();
    return this.shifts().filter(shift => {
      const matchesStatus = shift.status === status;
      const matchesQuery = !query ||
        shift.clientName.toLowerCase().includes(query) ||
        shift.address.toLowerCase().includes(query) ||
        shift.serviceType.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  });

  readonly statusCounts = computed(() => {
    return this.statusTabs.reduce<Record<OpenShiftStatus, number>>((counts, tab) => {
      counts[tab.value] = this.shifts().filter(shift => shift.status === tab.value).length;
      return counts;
    }, { open: 0, offered: 0, applied: 0, declined: 0 });
  });

  readonly selectedDateGroups = computed(() => {
    const groups = new Map<string, AvailableShift[]>();
    for (const shift of this.filteredShifts()) {
      const key = `${shift.date}|${shift.dayName}`;
      groups.set(key, [...(groups.get(key) ?? []), shift]);
    }
    return Array.from(groups.entries()).map(([key, shifts]) => {
      const [date, dayName] = key.split('|');
      return { date, dayName, shifts };
    });
  });

  setStatus(status: OpenShiftStatus): void {
    this.activeStatus.set(status);
    this.showMoreActions.set(false);
  }

  openShift(shift: AvailableShift): void {
    this.selectedShift.set(shift);
    this.statusMessage.set('');
  }

  openCurrentShiftDetails(): void {
    const current = this.selectedShift() ?? this.filteredShifts()[0] ?? null;
    if (current) {
      this.openShift(current);
    } else {
      this.statusMessage.set('No shifts are available for the current filters.');
    }
  }

  closeShift(): void {
    this.selectedShift.set(null);
  }

  toggleMoreActions(): void {
    this.showMoreActions.update(open => !open);
  }

  openAvailabilityManager(): void {
    this.showMoreActions.set(false);
    this.showAvailabilityManager.set(true);
    this.availabilityMode.set(null);
    this.editingAvailabilityId.set(null);
    this.formSubmitted.set(false);
    this.resetAvailabilityForm();
  }

  closeAvailabilityManager(): void {
    this.showAvailabilityManager.set(false);
    this.availabilityMode.set(null);
    this.editingAvailabilityId.set(null);
    this.formSubmitted.set(false);
  }

  chooseAvailabilityMode(type: AvailabilityType): void {
    this.availabilityMode.set(type);
    this.editingAvailabilityId.set(null);
    this.formSubmitted.set(false);
    this.resetAvailabilityForm();
    if (type === 'unavailability') {
      this.availabilityReason = '';
    }
  }

  editAvailabilityRecord(record: AvailabilityRecord): void {
    this.availabilityMode.set(record.type);
    this.editingAvailabilityId.set(record.id);
    this.formSubmitted.set(false);
    this.availabilityReason = record.reason;
    this.availabilityStartDate = record.startDate;
    this.availabilityStartTime = record.startTime;
    this.availabilityEndTime = record.endTime;
    this.availabilityAllDay = record.allDay;
    this.availabilityNotes = record.notes;
    this.availabilityRecurrence = record.recurrence;
  }

  setAllDay(value: boolean): void {
    this.availabilityAllDay = value;
    if (value) {
      this.availabilityStartTime = '12:00 AM';
      this.availabilityEndTime = '11:59 PM';
    }
  }

  updateWeeklyDay(day: string, selected: boolean): void {
    const next = new Set(this.weeklyDays);
    if (selected) {
      next.add(day);
    } else {
      next.delete(day);
    }
    this.weeklyDays = next;
  }

  saveAvailabilityRecord(): void {
    this.formSubmitted.set(true);
    const type = this.availabilityMode();
    if (!type) {
      this.statusMessage.set('Select Add Availability or Add Unavailability first.');
      return;
    }

    if (!this.canManageAvailability()) {
      this.statusMessage.set('Availability records are read-only for this role.');
      return;
    }

    if (type === 'unavailability' && !this.availabilityReason) {
      this.statusMessage.set('Reason is mandatory for unavailability.');
      return;
    }

    if (!this.availabilityStartDate) {
      this.statusMessage.set('Start date is mandatory.');
      return;
    }

    this.availabilityStartTime = this.normalizeTime(this.availabilityStartTime);
    this.availabilityEndTime = this.normalizeTime(this.availabilityEndTime);
    const startMinutes = this.timeToMinutes(this.availabilityStartTime);
    const endMinutes = this.timeToMinutes(this.availabilityEndTime);
    if (!this.availabilityAllDay && endMinutes <= startMinutes) {
      this.statusMessage.set('End time must be after start time.');
      return;
    }

    if (!this.availabilityAllDay && endMinutes - startMinutes > 1440) {
      this.statusMessage.set('Total duration cannot exceed 24 hours.');
      return;
    }

    if (this.availabilityRecurrence === 'Weekly' && this.weeklyDays.size === 0) {
      this.statusMessage.set('Select at least one weekly recurrence day.');
      return;
    }

    const record: AvailabilityRecord = {
      id: this.editingAvailabilityId() ?? `${type}-${Date.now()}`,
      type,
      reason: type === 'unavailability' ? this.availabilityReason : '',
      startDate: this.availabilityStartDate,
      startTime: this.availabilityStartTime,
      endTime: this.availabilityEndTime,
      allDay: this.availabilityAllDay,
      recurrence: this.availabilityRecurrence,
      recurrenceSummary: this.recurrenceSummary(),
      notes: this.availabilityNotes.slice(0, 500),
    };

    if (this.hasAvailabilityConflict(record)) {
      this.statusMessage.set('This entry overlaps an existing availability/unavailability record.');
      return;
    }

    this.availabilityRecords.update(records => {
      const existing = records.some(item => item.id === record.id);
      return existing ? records.map(item => item.id === record.id ? record : item) : [record, ...records];
    });
    this.statusMessage.set(`${this.availabilityTitleVerb()} ${type === 'availability' ? 'availability' : 'unavailability'} saved.`);
    this.closeAvailabilityManager();
  }

  selectCalendarDay(day: number): void {
    this.selectedCalendarDay.set(day);
    this.statusMessage.set(`Calendar day ${day} selected.`);
  }

  prepareExport(): void {
    this.showMoreActions.set(false);
    this.statusMessage.set('Available shifts export prepared.');
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.showFilters.set(false);
    this.showMoreActions.set(false);
    this.statusMessage.set('Filters cleared.');
  }

  availabilityTitle(): string {
    const mode = this.availabilityMode();
    const editing = !!this.editingAvailabilityId();
    if (!mode) return 'Add Availability / Unavailability';
    if (mode === 'availability') return editing ? 'Update Availability' : 'Add Availability';
    return editing ? 'Update Unavailability' : 'Add Unavailability';
  }

  availabilityTypeLabel(type: AvailabilityType): string {
    return type === 'availability' ? 'Availability' : 'Unavailability';
  }

  weeklyDaySelected(day: string): boolean {
    return this.weeklyDays.has(day);
  }

  applyToSelectedShift(): void {
    const current = this.selectedShift();
    if (!current) return;
    this.shifts.update(shifts =>
      shifts.map(shift => shift.id === current.id ? { ...shift, status: 'applied' } : shift)
    );
    this.selectedShift.set({ ...current, status: 'applied' });
    this.activeStatus.set('applied');
    this.statusMessage.set(`Applied to ${current.clientName}.`);
  }

  declineSelectedShift(): void {
    const current = this.selectedShift();
    if (!current) return;
    this.shifts.update(shifts =>
      shifts.map(shift => shift.id === current.id ? { ...shift, status: 'declined' } : shift)
    );
    this.selectedShift.set({ ...current, status: 'declined' });
    this.activeStatus.set('declined');
    this.statusMessage.set(`Declined ${current.clientName}.`);
  }

  primaryActionLabel(shift: AvailableShift | null): string {
    if (!shift) return 'Apply';
    if (shift.status === 'offered') return 'Accept Offer';
    if (shift.status === 'applied') return 'Applied';
    if (shift.status === 'declined') return 'Re-Apply';
    return 'Apply';
  }

  statusLabel(status: OpenShiftStatus): string {
    const labels: Record<OpenShiftStatus, string> = {
      open: 'Open',
      offered: 'Offered',
      applied: 'Applied',
      declined: 'Declined',
    };
    return labels[status];
  }

  private resetAvailabilityForm(): void {
    this.availabilityReason = '';
    this.availabilityStartDate = '2025-11-26';
    this.availabilityStartTime = '9:00 AM';
    this.availabilityEndTime = '5:00 PM';
    this.availabilityAllDay = false;
    this.availabilityNotes = '';
    this.availabilityRecurrence = 'Once';
    this.repeatEvery = 1;
    this.repeatUntil = 1;
    this.endByDate = '2025-12-31';
    this.weeklyDays = new Set(['Mon']);
    this.monthlyMode = 'ordinal';
    this.monthlyOrdinal = 'First';
    this.monthlyWeekday = 'Monday';
    this.monthlyDay = 1;
    this.yearlyMode = 'fixed';
    this.yearlyMonth = 'January';
    this.yearlyDate = 1;
  }

  private recurrenceSummary(): string {
    switch (this.availabilityRecurrence) {
      case 'Daily':
        return `Every ${this.repeatEvery} day(s) until ${this.repeatUntil} day(s)`;
      case 'Weekly':
        return `Every ${this.repeatEvery} week(s) on ${Array.from(this.weeklyDays).join(', ')} until ${this.repeatUntil} week(s)`;
      case 'Monthly':
        return this.monthlyMode === 'ordinal'
          ? `The ${this.monthlyOrdinal} ${this.monthlyWeekday} every ${this.repeatEvery} month(s)`
          : `Day ${this.monthlyDay} every ${this.repeatEvery} month(s)`;
      case 'Yearly':
        return this.yearlyMode === 'fixed'
          ? `Every ${this.repeatEvery} year(s) on ${this.yearlyMonth} ${this.yearlyDate}`
          : `On the ${this.monthlyOrdinal} ${this.monthlyWeekday} of ${this.yearlyMonth}`;
      default:
        return 'Once on start date';
    }
  }

  private normalizeTime(value: string): string {
    const trimmed = value.trim().toUpperCase();
    const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/);
    if (!match) return value;
    const hour = Math.max(1, Math.min(Number(match[1]), 12));
    const minute = Math.max(0, Math.min(Number(match[2] ?? 0), 59));
    const meridiem = match[3] ?? 'AM';
    return `${hour}:${minute.toString().padStart(2, '0')} ${meridiem}`;
  }

  private timeToMinutes(value: string): number {
    const match = this.normalizeTime(value).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (!match) return 0;
    const rawHour = Number(match[1]);
    const hour = match[3] === 'PM' ? (rawHour % 12) + 12 : rawHour % 12;
    return hour * 60 + Number(match[2]);
  }

  private hasAvailabilityConflict(next: AvailabilityRecord): boolean {
    const nextStart = this.timeToMinutes(next.startTime);
    const nextEnd = this.timeToMinutes(next.endTime);
    return this.availabilityRecords().some(record => {
      if (record.id === next.id || record.startDate !== next.startDate) return false;
      const start = this.timeToMinutes(record.startTime);
      const end = this.timeToMinutes(record.endTime);
      return nextStart < end && nextEnd > start;
    });
  }

  private availabilityTitleVerb(): string {
    return this.editingAvailabilityId() ? 'Updated' : 'Added';
  }
}
