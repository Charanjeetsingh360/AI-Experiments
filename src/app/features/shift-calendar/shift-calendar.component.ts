import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import {
  CsShiftCardComponent,
  ShiftCardData,
  ShiftCardStatus,
  ShiftCardTone,
} from '../../shared/components/cs-shift-card/cs-shift-card.component';

export type ShiftStatus = ShiftCardStatus;

interface ShiftGroup {
  date: string;
  dayName: string;
  completedHrs: string;
  shifts: ShiftCardData[];
}

interface CalendarDay {
  day: number;
  inMonth: boolean;
  isToday: boolean;
  inSelectedWeek: boolean;
}

interface TabDef {
  label: string;
  value: string;
  badge?: number;
}

interface MeetingParticipant {
  name: string;
  type: 'Caregiver' | 'Staff';
}

interface MeetingItem {
  id: string;
  date: string;
  dayName: string;
  type: string;
  address: string;
  startTime: string;
  endTime: string;
  timezone: string;
  duration: string;
  notes: string;
  status: 'scheduled' | 'completed';
  participants: MeetingParticipant[];
}

interface MeetingDayGroup {
  date: string;
  dayName: string;
  meetings: MeetingItem[];
}

type ShiftDetailPanel =
  | 'tasks'
  | 'notes'
  | 'expenses'
  | 'signature'
  | 'breaks'
  | 'pay'
  | 'incident'
  | 'family'
  | 'forms'
  | 'goals'
  | 'survey';

type ShiftActionState = 'optional' | 'required' | 'completed';
type ShiftTaskStatus = 'Pending' | 'Completed' | 'Not Completed' | 'Client Refused';

interface ShiftQuickAction {
  id: ShiftDetailPanel;
  label: string;
  icon: string;
  state: ShiftActionState;
  helper: string;
}

interface ShiftTaskItem {
  id: string;
  title: string;
  status: ShiftTaskStatus;
  reason: string;
  saved: boolean;
}

interface ShiftExpenseItem {
  id: string;
  code: string;
  rate: string;
  unit: string;
  source: 'Caregiver' | 'Office';
  readonly: boolean;
}

interface ShiftBreakItem {
  id: string;
  start: string;
  end: string;
  type: string;
}

@Component({
  selector: 'app-shift-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, CSIconComponent, CSFlyoutComponent, CsShiftCardComponent],
  templateUrl: './shift-calendar.component.html',
  styleUrl: './shift-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShiftCalendarComponent {

  readonly tabs: TabDef[] = [
    { label: 'Assigned Shifts', value: 'assigned', badge: 10 },
    { label: 'Adhoc', value: 'adhoc' },
    { label: 'Meetings', value: 'meetings', badge: 1 },
    { label: 'Open Shifts', value: 'open' },
  ];

  readonly activeTab = signal<string>('open');
  readonly selectedShift = signal<ShiftCardData | null>(null);
  readonly selectedMeeting = signal<MeetingItem | null>(null);
  readonly expenseMeeting = signal<MeetingItem | null>(null);
  readonly activeShiftPanel = signal<ShiftDetailPanel>('tasks');
  readonly showMoreActions = signal(false);
  readonly showExpenseFlyout = signal(false);
  readonly expenseSubmitted = signal(false);
  readonly statusMessage = signal('');
  readonly clockOutWarning = signal('');
  readonly selectedCalendarDay = signal(1);

  expenseCode = '';
  expenseRate = '0.00';
  expenseUnit = '0.00';
  expenseNotes = '';
  attachmentSelected = false;

  readonly taskStatusOptions: ShiftTaskStatus[] = ['Pending', 'Completed', 'Not Completed', 'Client Refused'];
  readonly shiftTasks = signal<ShiftTaskItem[]>([
    {
      id: 'meal-prep',
      title: 'Prepare meal and document intake',
      status: 'Pending',
      reason: '',
      saved: false,
    },
    {
      id: 'mobility',
      title: 'Assist with safe mobility',
      status: 'Pending',
      reason: '',
      saved: false,
    },
    {
      id: 'med-reminder',
      title: 'Medication reminder completed',
      status: 'Pending',
      reason: '',
      saved: false,
    },
  ]);
  readonly shiftExpenses = signal<ShiftExpenseItem[]>([
    { id: 'office-mileage', code: 'Mileage', rate: '0.65', unit: '8', source: 'Office', readonly: true },
  ]);
  readonly shiftBreaks = signal<ShiftBreakItem[]>([]);
  readonly caregiverSignatureCaptured = signal(false);
  readonly clientSignatureCaptured = signal(false);
  readonly noInjuryConfirmed = signal(false);
  readonly incidentSaved = signal(false);
  readonly careNotesHistory = signal<string[]>(['Care notes reviewed from last completed shift.']);
  readonly familyNotesHistory = signal<string[]>(['Family note history available for authorized contacts.']);
  readonly formsCompleted = signal(false);
  readonly goalsCompleted = signal(false);
  readonly surveyCompleted = signal(false);

  shiftExpenseCode = 'Mileage';
  shiftExpenseRate = '0.00';
  shiftExpenseUnit = '0.00';
  shiftExpenseNotes = '';
  breakStart = '2:45 PM';
  breakEnd = '3:00 PM';
  breakType = 'Meal break';
  careNoteText = '';
  familyNoteText = '';
  incidentNotes = '';

  onTabChange(value: string): void {
    this.activeTab.set(value);
    this.showMoreActions.set(false);
    this.selectedShift.set(null);
    this.selectedMeeting.set(null);
    if (value === 'meetings') {
      this.viewMode.set('list');
      this.displayMonth.set(new Date(2025, 7, 1));
      this.selectedCalendarDay.set(1);
    }
  }

  readonly viewMode = signal<'list' | 'calendar'>('list');
  readonly calendarMode = signal<'monthly' | 'weekly'>('weekly');

  toggleCalendarMode(): void {
    this.calendarMode.update(m => (m === 'monthly' ? 'weekly' : 'monthly'));
  }

  readonly today = new Date();

  readonly displayMonth = signal(new Date(2025, 7, 1));

  readonly weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  readonly monthLabel = computed(() =>
    this.displayMonth().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
  );

  readonly shiftQuickActions = computed<ShiftQuickAction[]>(() => [
    {
      id: 'tasks',
      label: 'Tasks',
      icon: 'assignment',
      state: this.tasksComplete() ? 'completed' : 'required',
      helper: 'Required before clock-out',
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'clinical_notes',
      state: this.careNotesHistory().length > 1 ? 'completed' : 'optional',
      helper: 'Care notes and history',
    },
    {
      id: 'expenses',
      label: 'Expense',
      icon: 'list_alt_check',
      state: this.shiftExpenses().some(expense => !expense.readonly) ? 'completed' : 'optional',
      helper: 'Mileage or personal expense',
    },
    {
      id: 'signature',
      label: 'Sign',
      icon: 'signature',
      state: this.signaturesComplete() ? 'completed' : 'required',
      helper: 'Caregiver and client signatures',
    },
    {
      id: 'breaks',
      label: 'Breaks',
      icon: 'alarm_pause',
      state: this.shiftBreaks().length ? 'completed' : 'optional',
      helper: 'Add shift breaks',
    },
    {
      id: 'pay',
      label: 'Pay',
      icon: 'paid',
      state: 'optional',
      helper: 'Pay rate and earnings',
    },
    {
      id: 'incident',
      label: 'Injury',
      icon: 'health_and_safety',
      state: this.incidentComplete() ? 'completed' : 'required',
      helper: 'Incident or no-injury confirmation',
    },
    {
      id: 'family',
      label: 'Family',
      icon: 'diversity_4',
      state: this.familyNotesHistory().length > 1 ? 'completed' : 'optional',
      helper: 'Family notes',
    },
    {
      id: 'forms',
      label: 'Forms',
      icon: 'list_alt_check',
      state: this.formsCompleted() ? 'completed' : 'optional',
      helper: 'Client forms',
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: 'flag',
      state: this.goalsCompleted() ? 'completed' : 'optional',
      helper: 'Service goals',
    },
    {
      id: 'survey',
      label: 'Survey',
      icon: 'fact_check',
      state: this.surveyCompleted() ? 'completed' : 'optional',
      helper: 'Agency survey',
    },
  ]);

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const current = this.displayMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const cells: CalendarDay[] = [];

    // Find start of current week (Sunday)
    const today = this.today;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const inWeek = (d: Date) => d >= weekStart && d <= weekEnd;

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      cells.push({
        day,
        inMonth: false,
        isToday: false,
        inSelectedWeek: inWeek(date),
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({
        day: d,
        inMonth: true,
        isToday: this.isSameDay(date, today),
        inSelectedWeek: inWeek(date),
      });
    }
    let next = 1;
    while (cells.length % 7 !== 0) {
      const date = new Date(year, month + 1, next);
      cells.push({
        day: next++,
        inMonth: false,
        isToday: false,
        inSelectedWeek: inWeek(date),
      });
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

  readonly assignedShiftGroups: ShiftGroup[] = [
    {
      date: '8/1/25',
      dayName: 'Sunday',
      completedHrs: '5h 15m',
      shifts: [
        {
          id: 's1',
          clientName: 'Marry, Edison',
          clientAddress: '99 Marina bay Street, New York',
          startTime: '2:00 AM',
          endTime: '2:30 AM',
          timezone: 'AST',
          duration: '0h 30m',
          clockInTime: '2:00 AM',
          clockOutTime: '2:30 AM',
          status: 'completed',
          serviceType: 'Healthcare Services',
          serviceCode: 'A',
          tone: 'approved',
        },
        {
          id: 's1b',
          clientName: 'Marry, Edison',
          clientAddress: '99 Marina bay Street, New York',
          startTime: '2:00 AM',
          endTime: '2:30 AM',
          timezone: 'AST',
          duration: '0h 30m',
          clockInTime: '2:00 AM',
          clockOutTime: '2:30 AM',
          status: 'completed',
          serviceType: 'Healthcare Services',
          serviceCode: 'A',
          tone: 'approved',
        },
        {
          id: 's1c',
          clientName: 'Marry, Edison',
          clientAddress: '99 Marina bay Street, New York',
          startTime: '2:00 AM',
          endTime: '2:30 AM',
          timezone: 'AST',
          duration: '0h 30m',
          clockInTime: '2:00 AM',
          clockOutTime: '2:30 AM',
          status: 'completed',
          serviceType: 'Healthcare Services',
          serviceCode: 'A',
          tone: 'approved',
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
          clientAddress: '99 Marina bay Street, New York',
          distance: '25 miles',
          date: 'MM/DD/YY',
          startTime: '2:00 PM',
          endTime: '10:00 PM',
          timezone: 'AST',
          duration: '8h 00m',
          clockInTime: '2:03 PM',
          status: 'clocked-in',
          serviceType: 'Healthcare Services',
          serviceCode: 'A',
        },
      ],
    },
    {
      date: '8/3/25',
      dayName: 'Tuesday',
      completedHrs: '0',
      shifts: [
        {
          id: 's3',
          clientName: 'Marry, Edison',
          clientAddress: '99 Marina bay Street, New York',
          distance: '25 miles',
          startTime: '9:00 AM',
          endTime: '1:00 PM',
          timezone: 'EST',
          duration: '4h 00m',
          status: 'upcoming',
          serviceType: 'Companion Care',
          serviceCode: 'C',
        },
      ],
    },
  ];

  readonly adhocShiftGroups: ShiftGroup[] = [
    {
      date: '8/3/25',
      dayName: 'Tuesday',
      completedHrs: '0',
      shifts: [
        {
          id: 'adhoc-1',
          clientName: 'Marry, Edison',
          clientAddress: '99 Marina bay Street, New York',
          startTime: '4:00 PM',
          endTime: '6:00 PM',
          timezone: 'AST',
          duration: '2h 00m',
          status: 'upcoming',
          serviceType: 'Adhoc Visit',
          serviceCode: 'A',
        },
      ],
    },
  ];

  readonly meetingShiftGroups: ShiftGroup[] = [
    {
      date: '8/4/25',
      dayName: 'Wednesday',
      completedHrs: '0',
      shifts: [
        {
          id: 'meeting-1',
          clientName: 'Care Team Review',
          clientAddress: 'Virtual Meeting',
          startTime: '11:00 AM',
          endTime: '11:30 AM',
          timezone: 'AST',
          duration: '0h 30m',
          status: 'upcoming',
          tone: 'meeting',
          serviceType: 'Care Plan Meeting',
          serviceCode: 'M',
        },
      ],
    },
  ];

  readonly meetingDays: MeetingDayGroup[] = [
    {
      date: '8/1/25',
      dayName: 'Sunday',
      meetings: [
        {
          id: 'meeting-external-1',
          date: '8/1/25',
          dayName: 'Sunday',
          type: 'External Meeting',
          address: '99 Marina bay Street, New York',
          startTime: '2:00 AM',
          endTime: '2:30 AM',
          timezone: 'AST',
          duration: '0h 30m',
          status: 'scheduled',
          notes: 'Discuss care-plan readiness and upcoming schedule changes.',
          participants: [
            { name: 'Marry, Edison', type: 'Caregiver' },
            { name: 'Angela Brooks', type: 'Staff' },
            { name: 'Vivek Sharma', type: 'Staff' },
          ],
        },
      ],
    },
    { date: '8/2/25', dayName: 'Monday', meetings: [] },
    { date: '8/3/25', dayName: 'Tuesday', meetings: [] },
    { date: '8/4/25', dayName: 'Wednesday', meetings: [] },
    { date: '8/5/25', dayName: 'Thursday', meetings: [] },
    { date: '8/6/25', dayName: 'Friday', meetings: [] },
    { date: '8/7/25', dayName: 'Saturday', meetings: [] },
  ];

  readonly openShiftGroups: ShiftGroup[] = [
    {
      date: '8/6/25',
      dayName: 'Friday',
      completedHrs: '0',
      shifts: [
        {
          id: 'open-1',
          clientName: 'Eleanor, Vasquez',
          clientAddress: '305 Birchwood Dr, San Antonio',
          distance: '18 miles',
          startTime: '8:00 AM',
          endTime: '4:00 PM',
          timezone: 'AST',
          duration: '8h 00m',
          status: 'open',
          serviceType: 'Personal Care',
          serviceCode: 'P',
        },
        {
          id: 'open-2',
          clientName: 'Dorothy, Nguyen',
          clientAddress: '920 Lavender Court, Fort Worth',
          distance: '9 miles',
          startTime: '6:00 PM',
          endTime: '10:00 PM',
          timezone: 'AST',
          duration: '4h 00m',
          status: 'offered',
          serviceType: 'Physical Therapy Support',
          serviceCode: 'PT',
        },
      ],
    },
  ];

  readonly visibleShiftGroups = computed(() => {
    const tab = this.activeTab();
    if (tab === 'adhoc') return this.adhocShiftGroups;
    if (tab === 'meetings') return [];
    if (tab === 'open') return this.openShiftGroups;
    return this.assignedShiftGroups;
  });

  openShiftDetails(shift: ShiftCardData): void {
    this.selectedShift.set(shift);
    this.activeShiftPanel.set(shift.status === 'clocked-in' ? 'tasks' : 'pay');
    this.clockOutWarning.set('');
    this.statusMessage.set('');
  }

  closeShiftDetails(): void {
    this.selectedShift.set(null);
    this.clockOutWarning.set('');
  }

  selectShiftPanel(panel: ShiftDetailPanel): void {
    this.activeShiftPanel.set(panel);
    this.clockOutWarning.set('');
  }

  shiftActionClass(state: ShiftActionState): string {
    return `sc-shift-action--${state}`;
  }

  taskRequiresReason(task: ShiftTaskItem): boolean {
    return task.status !== 'Pending' && task.status !== 'Completed';
  }

  updateTaskStatus(taskId: string, status: string): void {
    if (!this.isShiftTaskStatus(status)) return;
    this.shiftTasks.update(tasks => tasks.map(task =>
      task.id === taskId ? { ...task, status, saved: false } : task,
    ));
  }

  updateTaskReason(taskId: string, reason: string): void {
    this.shiftTasks.update(tasks => tasks.map(task =>
      task.id === taskId ? { ...task, reason, saved: false } : task,
    ));
  }

  saveShiftTasks(): void {
    const tasks = this.shiftTasks();
    const pending = tasks.find(task => task.status === 'Pending');
    if (pending) {
      this.statusMessage.set(`${pending.title} still needs a status.`);
      return;
    }

    const missingReason = tasks.find(task => this.taskRequiresReason(task) && !task.reason.trim());
    if (missingReason) {
      this.statusMessage.set(`Reason is mandatory for ${missingReason.title}.`);
      return;
    }

    this.shiftTasks.update(items => items.map(task => ({ ...task, saved: true })));
    this.statusMessage.set('Tasks saved for shift clock-out.');
    this.advanceClockOutSequence('tasks');
  }

  addShiftExpense(): void {
    if (!this.shiftExpenseCode || !this.shiftExpenseRate || !this.shiftExpenseUnit) {
      this.statusMessage.set('Expense code, rate, and unit are mandatory.');
      return;
    }

    const expense: ShiftExpenseItem = {
      id: `expense-${Date.now()}`,
      code: this.shiftExpenseCode,
      rate: this.shiftExpenseRate,
      unit: this.shiftExpenseUnit,
      source: 'Caregiver',
      readonly: false,
    };

    this.shiftExpenses.update(expenses => [...expenses, expense]);
    this.shiftExpenseCode = 'Mileage';
    this.shiftExpenseRate = '0.00';
    this.shiftExpenseUnit = '0.00';
    this.shiftExpenseNotes = '';
    this.statusMessage.set(`${expense.code} expense added to the shift.`);
  }

  removeShiftExpense(expenseId: string): void {
    const expense = this.shiftExpenses().find(item => item.id === expenseId);
    if (expense?.readonly) {
      this.statusMessage.set('Office-added expenses are view only.');
      return;
    }

    this.shiftExpenses.update(expenses => expenses.filter(item => item.id !== expenseId));
    this.statusMessage.set('Personal expense removed.');
  }

  addShiftBreak(): void {
    if (!this.breakStart || !this.breakEnd) {
      this.statusMessage.set('Break start and end time are required.');
      return;
    }

    this.shiftBreaks.update(breaks => [
      ...breaks,
      {
        id: `break-${Date.now()}`,
        start: this.breakStart,
        end: this.breakEnd,
        type: this.breakType || 'Break',
      },
    ]);
    this.statusMessage.set('Shift break added.');
  }

  removeShiftBreak(breakId: string): void {
    this.shiftBreaks.update(breaks => breaks.filter(item => item.id !== breakId));
    this.statusMessage.set('Shift break removed.');
  }

  addCareNote(): void {
    const note = this.careNoteText.trim();
    if (!note) {
      this.statusMessage.set('Care note is required before saving.');
      return;
    }

    this.careNotesHistory.update(notes => [note, ...notes]);
    this.careNoteText = '';
    this.statusMessage.set('Care note saved.');
  }

  addFamilyNote(): void {
    const note = this.familyNoteText.trim();
    if (!note) {
      this.statusMessage.set('Family note is required before saving.');
      return;
    }

    this.familyNotesHistory.update(notes => [note, ...notes]);
    this.familyNoteText = '';
    this.statusMessage.set('Family note saved.');
  }

  captureCaregiverSignature(): void {
    this.caregiverSignatureCaptured.set(true);
    this.statusMessage.set('Caregiver signature captured.');
  }

  captureClientSignature(): void {
    this.clientSignatureCaptured.set(true);
    this.statusMessage.set('Client signature captured.');
  }

  resetSignatures(): void {
    this.caregiverSignatureCaptured.set(false);
    this.clientSignatureCaptured.set(false);
    this.statusMessage.set('Signatures reset.');
  }

  saveSignatures(): void {
    if (!this.signaturesComplete()) {
      this.statusMessage.set('Caregiver and client signatures are mandatory for clock-out.');
      return;
    }

    this.statusMessage.set('Signatures saved for shift clock-out.');
    this.advanceClockOutSequence('signature');
  }

  confirmNoInjury(): void {
    this.noInjuryConfirmed.set(true);
    this.incidentSaved.set(false);
    this.incidentNotes = '';
    this.statusMessage.set('No injury confirmation saved.');
    this.advanceClockOutSequence('incident');
  }

  saveIncident(): void {
    if (!this.incidentNotes.trim()) {
      this.statusMessage.set('Incident notes are mandatory.');
      return;
    }

    this.incidentSaved.set(true);
    this.noInjuryConfirmed.set(false);
    this.statusMessage.set('Incident saved for this shift.');
    this.advanceClockOutSequence('incident');
  }

  completeForms(): void {
    this.formsCompleted.set(true);
    this.statusMessage.set('Client forms marked complete.');
  }

  completeGoals(): void {
    this.goalsCompleted.set(true);
    this.statusMessage.set('Service goals marked complete.');
  }

  completeSurvey(): void {
    this.surveyCompleted.set(true);
    this.statusMessage.set('Survey responses saved.');
  }

  openClientDirections(shift: ShiftCardData, event?: Event): void {
    event?.stopPropagation();
    this.statusMessage.set(`Map directions opened for ${shift.clientName}.`);
    window.open(`https://maps.google.com/?q=${encodeURIComponent(shift.clientAddress)}`, '_blank', 'noopener');
  }

  openClientProfile(shift: ShiftCardData): void {
    this.statusMessage.set(`Client profile opened for ${shift.clientName}.`);
  }

  openShiftNotes(shift: ShiftCardData): void {
    this.selectedShift.set(shift);
    this.selectShiftPanel('notes');
  }

  attemptClockOutSelectedShift(): void {
    const shift = this.selectedShift();
    if (!shift) return;

    const missing = this.firstMissingClockOutRequirement();
    if (missing) {
      this.activeShiftPanel.set(missing);
      this.clockOutWarning.set('All sections highlighted in Yellow/Red are mandatory for clock-out.');
      this.statusMessage.set('Complete mandatory shift events before clock-out.');
      return;
    }

    this.clockOutWarning.set('');
    this.clockOutShift(shift);
    this.selectedShift.set({ ...shift });
  }

  private advanceClockOutSequence(current: ShiftDetailPanel): void {
    const missing = this.firstMissingClockOutRequirement(current);
    if (missing) {
      this.activeShiftPanel.set(missing);
      this.clockOutWarning.set('');
      return;
    }

    this.clockOutWarning.set('');
  }

  private firstMissingClockOutRequirement(after?: ShiftDetailPanel): ShiftDetailPanel | null {
    const required: ShiftDetailPanel[] = ['tasks', 'signature', 'incident'];
    const start = after ? required.indexOf(after) + 1 : 0;
    const ordered = [...required.slice(start), ...required.slice(0, start)];
    return ordered.find(panel => !this.isClockOutRequirementComplete(panel)) ?? null;
  }

  private isClockOutRequirementComplete(panel: ShiftDetailPanel): boolean {
    if (panel === 'tasks') return this.tasksComplete();
    if (panel === 'signature') return this.signaturesComplete();
    if (panel === 'incident') return this.incidentComplete();
    return true;
  }

  private tasksComplete(): boolean {
    return this.shiftTasks().every(task =>
      task.saved &&
      task.status !== 'Pending' &&
      (!this.taskRequiresReason(task) || !!task.reason.trim()),
    );
  }

  private signaturesComplete(): boolean {
    return this.caregiverSignatureCaptured() && this.clientSignatureCaptured();
  }

  private incidentComplete(): boolean {
    return this.noInjuryConfirmed() || this.incidentSaved();
  }

  private isShiftTaskStatus(status: string): status is ShiftTaskStatus {
    return this.taskStatusOptions.some(option => option === status);
  }

  openMeetingDetails(meeting: MeetingItem): void {
    this.selectedMeeting.set(meeting);
    this.statusMessage.set('');
  }

  closeMeetingDetails(): void {
    this.selectedMeeting.set(null);
  }

  openMeetingExpense(meeting: MeetingItem, event?: Event): void {
    event?.stopPropagation();
    this.expenseMeeting.set(meeting);
    this.expenseCode = '';
    this.expenseRate = '0.00';
    this.expenseUnit = '0.00';
    this.expenseNotes = '';
    this.attachmentSelected = false;
    this.expenseSubmitted.set(false);
    this.showExpenseFlyout.set(true);
  }

  closeMeetingExpense(): void {
    this.showExpenseFlyout.set(false);
    this.expenseMeeting.set(null);
    this.expenseSubmitted.set(false);
  }

  saveMeetingExpense(): void {
    this.expenseSubmitted.set(true);
    const meeting = this.expenseMeeting();
    if (!meeting || !this.expenseCode || !this.expenseRate || !this.expenseUnit) {
      this.statusMessage.set('Expense code, rate, and unit are mandatory.');
      return;
    }

    this.statusMessage.set(`${this.expenseCode} expense saved for ${meeting.type}.`);
    this.closeMeetingExpense();
  }

  selectExpenseAttachment(): void {
    this.attachmentSelected = true;
    this.statusMessage.set('Expense attachment selected.');
  }

  openMeetingDirections(meeting: MeetingItem, event?: Event): void {
    event?.stopPropagation();
    this.statusMessage.set(`Map directions opened for ${meeting.type}.`);
    window.open(`https://maps.google.com/?q=${encodeURIComponent(meeting.address)}`, '_blank', 'noopener');
  }

  selectCalendarDay(day: CalendarDay): void {
    if (!day.inMonth) return;
    this.selectedCalendarDay.set(day.day);
    this.statusMessage.set(`Calendar day ${day.day} selected.`);
  }

  isCalendarDaySelected(day: CalendarDay): boolean {
    return this.activeTab() === 'meetings' && day.inMonth && day.day === this.selectedCalendarDay();
  }

  meetingDayHasMeeting(day: CalendarDay): boolean {
    if (this.activeTab() !== 'meetings' || !day.inMonth) return false;
    const date = `8/${day.day}/25`;
    return this.meetingDays.some(group => group.date === date && group.meetings.length > 0);
  }

  participantSummary(meeting: MeetingItem): string {
    const [first, second, ...rest] = meeting.participants;
    if (!first) return 'No participants';
    const secondary = second ? `, ${second.name}` : '';
    return `${first.name}${secondary}${rest.length ? ` +${rest.length}` : ''}`;
  }

  toggleMoreActions(): void {
    this.showMoreActions.update(open => !open);
  }

  switchToOpenShifts(): void {
    this.activeTab.set('open');
    this.showMoreActions.set(false);
    this.statusMessage.set('Open shifts are visible.');
  }

  exportCalendar(): void {
    this.showMoreActions.set(false);
    this.statusMessage.set('Calendar export prepared.');
  }

  refresh(): void {
    this.statusMessage.set('Shifts refreshed.');
    setTimeout(() => this.statusMessage.set(''), 1500);
  }

  clockOutShift(shift: ShiftCardData): void {
    shift.status = 'completed';
    shift.clockOutTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    this.statusMessage.set(`Clocked out from ${shift.clientName}.`);
  }

  clockInShift(shift: ShiftCardData): void {
    shift.status = 'clocked-in';
    shift.clockInTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    this.statusMessage.set(`Clocked in to ${shift.clientName}.`);
  }

  respondToSelectedShift(): void {
    const shift = this.selectedShift();
    if (!shift) return;

    if (shift.status === 'open' || shift.status === 'offered') {
      shift.status = 'applied';
      this.statusMessage.set(`Applied to ${shift.clientName}.`);
      this.activeTab.set('open');
      this.selectedShift.set({ ...shift });
      return;
    }

    if (shift.status === 'clocked-in') {
      this.attemptClockOutSelectedShift();
      return;
    }

    this.statusMessage.set(`${shift.clientName} acknowledged.`);
  }

  selectedShiftActionLabel(shift: ShiftCardData | null): string {
    if (!shift) return 'Acknowledge';
    if (shift.status === 'open' || shift.status === 'offered') return 'Apply';
    if (shift.status === 'clocked-in') return 'Clock-Out';
    return 'Acknowledge';
  }
}
