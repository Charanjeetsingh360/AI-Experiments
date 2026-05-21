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
import { CSAvatarComponent } from '../../../../shared/components/cs-avatar/cs-avatar.component';

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
  shifts: OpenShiftItem[];
}

/**
 * ClientOpenShiftsFlyoutComponent — Displays available open shifts for a client.
 * Features: month navigation, horizontal calendar strip, filter tabs, shift cards.
 */
@Component({
  selector: 'app-client-open-shifts-flyout',
  standalone: true,
  imports: [CommonModule, CSFlyoutComponent, CSIconComponent, CSAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-flyout
      [isOpen]="isOpen"
      (isOpenChange)="isOpenChange.emit($event)"
      position="center"
      width="min(640px, 90vw)"
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
      <div flyout-body class="h-full overflow-y-auto" style="margin:-16px; padding:0;">
        <div class="flex flex-col gap-3">

          <!-- Month Navigation -->
          <div class="flex items-center justify-between px-6 pt-4">
            <button type="button" (click)="prevMonth()"
              class="rounded-md p-1 text-[var(--cs360-text-tertiary)] transition-colors
                     hover:bg-[var(--cs360-bg-alt)] border-none bg-transparent cursor-pointer">
              <cs-icon name="chevron_left" [size]="18" />
            </button>
            <span class="text-sm font-medium text-[var(--cs360-text-primary)]">{{ monthLabel() }}</span>
            <button type="button" (click)="nextMonth()"
              class="rounded-md p-1 text-[var(--cs360-text-tertiary)] transition-colors
                     hover:bg-[var(--cs360-bg-alt)] border-none bg-transparent cursor-pointer">
              <cs-icon name="chevron_right" [size]="18" />
            </button>
          </div>

          <!-- Horizontal Calendar Strip -->
          <div #calendarStrip
               class="overflow-x-auto pb-3 border-b border-[var(--cs360-border-subtle)]"
               style="cursor:grab; scrollbar-width:none;">
            <div class="flex gap-0 min-w-max px-6">
              @for (calDate of calendarDates(); track calDate.day) {
                <button
                  type="button"
                  class="flex flex-col items-center justify-center w-[38px] h-[44px]
                         border-none cursor-pointer transition-colors duration-150
                         shrink-0 rounded-md"
                  [class.bg-[var(--cs360-action-primary)]]="calDate.isSelected"
                  [class.text-white]="calDate.isSelected"
                  [class.bg-transparent]="!calDate.isSelected"
                  [class.hover:bg-[var(--cs360-bg-alt)]]="!calDate.isSelected"
                  (click)="selectDate(calDate)"
                >
                  <span class="text-xs font-semibold leading-tight"
                    [class.text-white]="calDate.isSelected"
                    [class.text-[var(--cs360-text-primary)]]="!calDate.isSelected">
                    {{ calDate.day }}
                  </span>
                  <span class="text-[10px] leading-tight"
                    [class.text-white]="calDate.isSelected"
                    [class.text-[var(--cs360-text-tertiary)]]="!calDate.isSelected">
                    {{ calDate.dayName }}
                  </span>
                </button>
              }
            </div>
          </div>

          <!-- Filter Tabs -->
          <div class="flex items-center gap-3 px-6 overflow-x-auto">
            @for (filter of filters; track filter.value) {
              <button type="button"
                class="px-3 py-1.5 text-xs font-medium rounded-full border
                       whitespace-nowrap transition-colors cursor-pointer"
                [class.bg-[var(--cs360-action-primary)]]="activeFilter() === filter.value"
                [class.text-white]="activeFilter() === filter.value"
                [class.border-[var(--cs360-action-primary)]]="activeFilter() === filter.value"
                [class.bg-transparent]="activeFilter() !== filter.value"
                [class.text-[var(--cs360-text-primary)]]="activeFilter() !== filter.value"
                [class.border-[var(--cs360-border-subtle)]]="activeFilter() !== filter.value"
                (click)="activeFilter.set(filter.value)">
                {{ filter.label }}
              </button>
            }
          </div>

          <!-- Shift Cards grouped by date -->
          @for (group of shiftGroups; track group.date) {
            <!-- Date separator -->
            <div class="pt-3 px-6">
              <p class="text-xs font-medium text-[var(--cs360-text-secondary)] m-0">
                {{ group.date }} {{ group.dayName }}
              </p>
            </div>

            @for (shift of group.shifts; track shift.id) {
              <div class="mx-6 p-4 rounded-lg border border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-surface)]">
                <div class="flex items-center gap-3">
                  <cs-avatar [name]="shift.clientName" [src]="shift.avatarUrl" size="sm" class="shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[var(--cs360-text-primary)] m-0 truncate">
                      {{ shift.clientName }}
                    </p>
                    <p class="text-xs text-[var(--cs360-text-secondary)] m-0 truncate">
                      {{ shift.clientAddress }}
                    </p>
                  </div>
                  @if (shift.hasDocument) {
                    <cs-icon name="description" [size]="16" class="text-[var(--cs360-text-tertiary)] shrink-0" />
                  }
                </div>
                <!-- Time row -->
                <div class="flex items-center mt-3 pt-3 border-t border-[var(--cs360-border-subtle)]">
                  <span class="text-xs font-medium text-[var(--cs360-text-primary)]">{{ shift.startTime }}</span>
                  <div class="flex-1 flex items-center justify-center">
                    <div class="h-px flex-1 border-0 border-t border-dotted border-[var(--cs360-text-tertiary)]"></div>
                    <span class="px-2 text-[10px] text-[var(--cs360-text-tertiary)]">{{ shift.duration }}</span>
                    <div class="h-px flex-1 border-0 border-t border-dotted border-[var(--cs360-text-tertiary)]"></div>
                  </div>
                  <span class="text-xs font-medium text-[var(--cs360-text-primary)]">{{ shift.endTime }}</span>
                </div>
              </div>
            }
          }

          @if (shiftGroups.length === 0) {
            <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6">
              No open shifts available
            </p>
          }
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

  // Filter tabs
  readonly filters = [
    { label: 'Open (6)', value: 'open' },
    { label: 'Offered (4)', value: 'offered' },
    { label: 'Applied', value: 'applied' },
    { label: 'Declined', value: 'declined' },
  ];
  activeFilter = signal('open');

  // Calendar state
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

  // Mock shift data
  shiftGroups: ShiftGroup[] = [
    {
      date: '8/3/25',
      dayName: 'Sun',
      shifts: [
        { id: '1', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '2:00 AM (AST)', endTime: '2:30 AM (AST)', duration: '0h 30m', hasDocument: true, date: '8/3/25', dayName: 'Sun' },
        { id: '2', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '3:00 AM (AST)', endTime: '4:00 AM (AST)', duration: '1h 00m', hasDocument: false, date: '8/3/25', dayName: 'Sun' },
      ],
    },
    {
      date: '8/4/25',
      dayName: 'Mon',
      shifts: [
        { id: '3', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '9:00 AM (AST)', endTime: '11:00 AM (AST)', duration: '2h 00m', hasDocument: true, date: '8/4/25', dayName: 'Mon' },
        { id: '4', clientName: 'Marry, Edison', clientAddress: '99 Marina Bay Street, New York', avatarUrl: '', startTime: '1:00 PM (AST)', endTime: '3:00 PM (AST)', duration: '2h 00m', hasDocument: true, date: '8/4/25', dayName: 'Mon' },
      ],
    },
  ];

  // Drag-to-scroll for calendar
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
}
