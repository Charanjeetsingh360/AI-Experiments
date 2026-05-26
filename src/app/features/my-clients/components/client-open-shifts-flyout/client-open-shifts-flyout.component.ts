import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSFlyoutComponent } from '../../../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';

export interface OpenShiftItem {
  id: string;
  clientName: string;
  clientAddress: string;
  avatarUrl: string;
  startTime: string;
  endTime: string;
  duration: string;
  hasDocument: boolean;
  date: string;
  dayName: string;
  month?: string;
  day?: number;
}

interface CalendarDate {
  date: Date;
  day: number;
  dayName: string;
  isSelected: boolean;
  isToday: boolean;
}

interface ShiftGroup {
  date: string;
  dayName: string;
  month: string;
  day: number;
  shifts: OpenShiftItem[];
}

@Component({
  selector: 'app-client-open-shifts-flyout',
  standalone: true,
  imports: [CommonModule, CSFlyoutComponent, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-flyout
      [isOpen]="isOpen"
      (isOpenChange)="isOpenChange.emit($event)"
      position="right"
      width="600px"
      [zIndex]="1009"
    >
      <!-- Header -->
      <div flyout-header class="flex items-center w-full">
        <h2 class="flex-1 text-base font-medium text-[var(--cs360-text-primary)] m-0 leading-[19px]">
          Open Shifts
        </h2>
        <button
          type="button"
          class="flex h-6 w-6 items-center justify-center rounded-full
                 text-[var(--cs360-text-primary)] transition-colors
                 hover:bg-[var(--cs360-bg-alt)] border-none bg-transparent cursor-pointer"
          aria-label="Close"
          (click)="onClose()"
        >
          <cs-icon name="close" [size]="18" />
        </button>
      </div>

      <!-- Body -->
      <div flyout-body class="-m-[var(--density-space-4)] h-full overflow-y-auto p-0">
        <div class="flex flex-col">

          <!-- Month Navigation -->
          <div class="flex items-center justify-between px-6 pt-4 pb-2">
            <button type="button" (click)="prevMonth()"
              class="rounded-md p-1 transition-colors
                     hover:bg-[var(--cs360-bg-alt)] border-none bg-transparent cursor-pointer
                     text-[var(--cs360-text-tertiary)]">
              <cs-icon name="chevron_left" [size]="18" />
            </button>
            <span class="text-sm font-semibold text-[var(--cs360-text-secondary-alt)]">{{ monthLabel() }}</span>
            <button type="button" (click)="nextMonth()"
              class="rounded-md p-1 transition-colors
                     hover:bg-[var(--cs360-bg-alt)] border-none bg-transparent cursor-pointer
                     text-[var(--cs360-text-tertiary)]">
              <cs-icon name="chevron_right" [size]="18" />
            </button>
          </div>

          <!-- Horizontal Calendar Strip -->
          <div #calendarStrip
               class="overflow-x-auto border-b border-[var(--cs360-border-subtle)] pb-[var(--density-space-3)] cursor-grab [scrollbar-width:none]">
            <div class="flex gap-0 min-w-max px-4">
              @for (calDate of calendarDates(); track calDate.day) {
                <button
                  type="button"
                  [class]="calendarDateClasses(calDate)"
                  (click)="selectDate(calDate)"
                >
                  <span [class]="calendarDayNameClasses(calDate)">
                    {{ calDate.dayName }}
                  </span>
                  <span [class]="calendarDayNumberClasses(calDate)">
                    {{ calDate.day }}
                  </span>
                </button>
              }
            </div>
          </div>

          <!-- Filter Tabs — 4 tabs: Open / Offered / Applied / Declined -->
          <div class="flex items-center gap-[6px] px-4 pt-3 pb-3">
            @for (filter of filters; track filter.value) {
              <button type="button"
                [class]="filterClasses(filter.value)"
                (click)="activeFilter.set(filter.value)">
                @if (activeFilter() === filter.value) {
                  <cs-icon name="check" [size]="13" class="mr-[var(--density-space-1)]" />
                }
                {{ filter.label }}
              </button>
            }
          </div>

          <!-- Shift Cards grouped by date -->
          @for (group of shiftGroups; track group.date) {

            <!-- Date separator label -->
            <div class="px-6 pt-1 pb-2">
              <p class="text-[11px] font-semibold tracking-[0.5px] uppercase m-0"
                 class="text-[var(--cs360-text-helper)]">
                {{ group.date }} · {{ group.dayName }}
              </p>
            </div>

            @for (shift of group.shifts; track shift.id) {
              <div class="mx-4 mb-3 flex overflow-hidden rounded-[10px] border
                          border-[var(--cs360-feedback-error-border)]
                          bg-[var(--cs360-feedback-error-bg)]">
                <!-- Left red accent bar -->
                <div class="w-[5px] shrink-0 bg-[var(--cs360-feedback-error)]"></div>

                <!-- Card content -->
                <div class="flex flex-1 flex-col gap-[10px] px-[14px] py-[var(--density-space-3)]">

                  <!-- Avatar + client info row -->
                  <div class="flex items-center gap-[10px]">
                    <!-- Avatar -->
                    <div class="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full
                                bg-[var(--cs360-action-primary-subtle)]
                                text-sm font-semibold text-[var(--cs360-action-primary)]">
                      {{ getInitials(shift.clientName) }}
                    </div>

                    <!-- Name + address -->
                    <div class="flex flex-1 min-w-0 flex-col gap-[2px]">
                      <span class="truncate text-[15px] font-semibold leading-[1.3] text-[var(--cs360-text-primary)]">
                        {{ shift.clientName }}
                      </span>
                      <span class="truncate text-[12px] leading-[1.3] text-[var(--cs360-text-helper)]">
                        {{ shift.clientAddress }}
                      </span>
                    </div>
                  </div>

                  <!-- Time row with dotted lines -->
                  <div class="flex items-center gap-[6px]">
                    <span class="whitespace-nowrap text-sm font-bold text-[var(--cs360-text-secondary-alt)]">
                      {{ shift.startTime }}
                    </span>
                    <div class="flex-1 border-0 border-t border-dotted border-[var(--cs360-border-default)]"></div>
                    <!-- Duration pill -->
                    <div class="flex shrink-0 items-center gap-[var(--density-space-1)] rounded-[20px]
                                border border-dashed border-[var(--cs360-text-tertiary)]
                                bg-[var(--cs360-bg-surface)]/70 px-[var(--density-space-2)] py-[3px]">
                      <cs-icon name="schedule" [size]="14" class="text-[var(--cs360-text-secondary-alt)]" />
                      <span class="whitespace-nowrap text-[11px] text-[var(--cs360-text-secondary-alt)]">
                        {{ shift.duration }}
                      </span>
                    </div>
                    <div class="flex-1 border-0 border-t border-dotted border-[var(--cs360-border-default)]"></div>
                    <span class="whitespace-nowrap text-sm font-bold text-[var(--cs360-text-secondary-alt)]">
                      {{ shift.endTime }}
                    </span>
                  </div>
                </div>
              </div>
            }
          }

          @if (shiftGroups.length === 0) {
            <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6 px-6 m-0">
              No open shifts available
            </p>
          }

          <div class="h-[20px]"></div>
        </div>
      </div>
    </cs-flyout>
  `,
  styles: [`:host { display: contents; }`],
})
export class ClientOpenShiftsFlyoutComponent implements AfterViewInit, OnDestroy {
  @Input() isOpen = false;
  @Input() clientId = '';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('calendarStrip') calendarStripRef!: ElementRef<HTMLElement>;

  readonly filters = [
    { label: 'Open (6)', value: 'open' },
    { label: 'Offered (4)', value: 'offered' },
    { label: 'Applied', value: 'applied' },
    { label: 'Declined', value: 'declined' },
  ];
  activeFilter = signal('open');

  currentMonth = signal(new Date());
  selectedDate = signal<Date>(new Date());

  readonly monthLabel = computed(() => {
    const d = this.currentMonth();
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  readonly calendarDates = computed<CalendarDate[]>(() => {
    const current = this.currentMonth();
    const year = current.getFullYear();
    const month = current.getMonth();
    const today = new Date();
    const selected = this.selectedDate();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates: CalendarDate[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push({
        date,
        day,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        isSelected: date.toDateString() === selected.toDateString(),
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    return dates;
  });

  calendarDateClasses(calDate: CalendarDate): string {
    const base = 'flex h-[52px] w-[40px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-[8px] border-none transition-colors duration-150';
    return calDate.isSelected
      ? `${base} bg-[var(--cs360-action-primary)]`
      : `${base} bg-transparent`;
  }

  calendarDayNameClasses(calDate: CalendarDate): string {
    const base = 'text-[11px] font-medium leading-tight';
    return calDate.isSelected
      ? `${base} text-[var(--cs360-action-primary-text)]/80`
      : `${base} text-[var(--cs360-text-tertiary)]`;
  }

  calendarDayNumberClasses(calDate: CalendarDate): string {
    const base = 'mt-1 text-sm font-bold leading-tight';
    return calDate.isSelected
      ? `${base} text-[var(--cs360-action-primary-text)]`
      : `${base} text-[var(--cs360-text-secondary-alt)]`;
  }

  filterClasses(value: string): string {
    const base = 'flex h-[32px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[20px] border-none px-[14px] text-xs font-medium transition-colors';
    return this.activeFilter() === value
      ? `${base} bg-[var(--cs360-action-primary)] text-[var(--cs360-action-primary-text)]`
      : `${base} bg-[var(--cs360-bg-alt)] text-[var(--cs360-text-helper)]`;
  }

  shiftGroups: ShiftGroup[] = [
    {
      date: '8/3/25',
      dayName: 'Sun',
      month: 'Aug',
      day: 3,
      shifts: [
        { id: '1', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '2:00 AM (AST)', endTime: '2:30 AM (AST)', duration: '0h 30m', hasDocument: true, date: '8/3/25', dayName: 'Sun' },
        { id: '2', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '3:00 AM (AST)', endTime: '4:00 AM (AST)', duration: '1h 00m', hasDocument: false, date: '8/3/25', dayName: 'Sun' },
      ],
    },
    {
      date: '8/4/25',
      dayName: 'Mon',
      month: 'Aug',
      day: 4,
      shifts: [
        { id: '3', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '9:00 AM (AST)', endTime: '11:00 AM (AST)', duration: '2h 00m', hasDocument: true, date: '8/4/25', dayName: 'Mon' },
        { id: '4', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '1:00 PM (AST)', endTime: '3:00 PM (AST)', duration: '2h 00m', hasDocument: true, date: '8/4/25', dayName: 'Mon' },
      ],
    },
  ];

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  private onMouseDown = (e: MouseEvent) => {
    const el = this.calendarStripRef?.nativeElement;
    if (!el) return;
    this.isDragging = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
    el.style.cursor = 'grabbing';
  };
  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    e.preventDefault();
    const el = this.calendarStripRef?.nativeElement;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = this.scrollLeft - (x - this.startX);
  };
  private onMouseUp = () => {
    this.isDragging = false;
    const el = this.calendarStripRef?.nativeElement;
    if (el) el.style.cursor = 'grab';
  };

  ngAfterViewInit(): void {
    const el = this.calendarStripRef?.nativeElement;
    if (el) {
      el.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  selectDate(calDate: CalendarDate): void {
    this.selectedDate.set(calDate.date);
  }

  prevMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  getInitials(name: string): string {
    return name.split(/[,\s]+/).map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }
}
