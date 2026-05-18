import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';
import type { Client } from '../../my-clients.component';

export interface ClientShift {
  id: number;
  date: string;
  dayName: string;
  timeRange: string;
  type: string;
  status: 'scheduled' | 'completed' | 'pending';
}

/** Gradient palette cycles deterministically per client id */
const GRADIENTS = [
  ['#60a5fa', '#2563eb'], // blue
  ['#34d399', '#059669'], // green
  ['#a78bfa', '#7c3aed'], // purple
  ['#fb923c', '#ea580c'], // orange
  ['#f472b6', '#db2777'], // pink
  ['#38bdf8', '#0284c7'], // sky
  ['#a3e635', '#65a30d'], // lime
  ['#fb7185', '#e11d48'], // rose
];

const MOCK_SHIFTS: ClientShift[] = [
  { id: 1, date: 'Jan 22', dayName: 'Monday',    timeRange: '8:00 AM – 12:00 PM', type: 'Personal Care',  status: 'scheduled' },
  { id: 2, date: 'Jan 24', dayName: 'Wednesday',  timeRange: '2:00 PM – 6:00 PM',  type: 'Companionship',  status: 'scheduled' },
  { id: 3, date: 'Jan 26', dayName: 'Friday',     timeRange: '9:00 AM – 1:00 PM',  type: 'Homemaking',     status: 'pending' },
];

@Component({
  selector: 'app-client-detail-modal',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="client ? client.firstName + ' ' + client.lastName + ' details' : 'Client details'"
    >
      <!-- Scrim -->
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        (click)="close.emit()"
      ></div>

      <!-- Modal card -->
      <div
        class="relative z-10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style="background: var(--cs360-bg-surface); max-height: 90vh;"
      >
        @if (client) {

          <!-- ── SECTION 1: Header ──────────────────────────── -->
          <div class="flex items-center justify-between px-5 py-4 border-b"
            style="border-color: var(--cs360-border-subtle);">
            <h2 class="text-base font-semibold" style="color: var(--cs360-text-primary);">
              Client Details
            </h2>
            <button
              (click)="close.emit()"
              class="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors border-none cursor-pointer"
              style="background: transparent; color: var(--cs360-text-secondary);"
              aria-label="Close"
              (mouseenter)="onCloseHover($event, true)"
              (mouseleave)="onCloseHover($event, false)"
            >
              <cs-icon name="close" [size]="20" />
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="overflow-y-auto flex-1">

            <!-- ── SECTION 2: User Information ─────────────── -->
            <div class="px-5 py-6 border-b" style="border-color: var(--cs360-border-subtle);">

              <!-- Avatar row: left action | avatar | right action -->
              <div class="flex items-center justify-between gap-4">

                <!-- Left action: Call -->
                <button
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl flex-1 transition-colors border cursor-pointer"
                  style="background: var(--cs360-bg-alt); border-color: var(--cs360-border-subtle); color: var(--cs360-action-primary);"
                  (click)="onCall()"
                  title="Call client"
                >
                  <cs-icon name="call" [size]="22" />
                  <span class="text-xs font-medium" style="color: var(--cs360-text-secondary);">Call</span>
                </button>

                <!-- Centered avatar -->
                <div class="flex flex-col items-center gap-2 flex-shrink-0">
                  <div
                    class="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                    [style.background]="'linear-gradient(135deg, ' + gradient[0] + ', ' + gradient[1] + ')'"
                  >
                    {{ initials }}
                  </div>
                  <!-- Status badge -->
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    [style.background]="statusBg"
                    [style.color]="statusColor"
                  >
                    <span class="w-1.5 h-1.5 rounded-full inline-block" [style.background]="statusColor"></span>
                    {{ client.status }}
                  </span>
                </div>

                <!-- Right action: Message -->
                <button
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl flex-1 transition-colors border cursor-pointer"
                  style="background: var(--cs360-bg-alt); border-color: var(--cs360-border-subtle); color: var(--cs360-action-primary);"
                  (click)="onMessage()"
                  title="Send message"
                >
                  <cs-icon name="chat" [size]="22" />
                  <span class="text-xs font-medium" style="color: var(--cs360-text-secondary);">Message</span>
                </button>
              </div>

              <!-- Name & address -->
              <div class="mt-4 text-center">
                <h3 class="text-xl font-bold" style="color: var(--cs360-text-primary);">
                  {{ client.lastName }}, {{ client.firstName }}
                </h3>
                <p class="mt-1 text-sm" style="color: var(--cs360-text-secondary);">
                  <cs-icon name="location_on" [size]="14" class="inline-block align-text-bottom mr-0.5" style="color: var(--cs360-text-tertiary);" />
                  {{ clientAddress }}
                </p>
                <p class="mt-0.5 text-sm" style="color: var(--cs360-text-secondary);">
                  <cs-icon name="call" [size]="14" class="inline-block align-text-bottom mr-0.5" style="color: var(--cs360-text-tertiary);" />
                  {{ client.phoneNumber }}
                </p>
              </div>
            </div>

            <!-- ── SECTION 3: Quick Actions ─────────────────── -->
            <div class="px-5 py-5 border-b" style="border-color: var(--cs360-border-subtle);">
              <p class="text-[10px] font-semibold uppercase tracking-widest mb-3"
                style="color: var(--cs360-text-tertiary);">Quick Actions</p>

              <div class="grid grid-cols-4 gap-2">
                @for (action of quickActions; track action.label) {
                  <button
                    class="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl transition-colors border cursor-pointer"
                    style="background: var(--cs360-bg-alt); border-color: var(--cs360-border-subtle);"
                    [title]="action.label"
                    (click)="onQuickAction(action.label)"
                  >
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg"
                      [style.background]="action.bgColor"
                      [style.color]="action.iconColor">
                      <cs-icon [name]="action.icon" [size]="18" />
                    </span>
                    <span class="text-[10px] font-medium text-center leading-tight"
                      style="color: var(--cs360-text-secondary);">{{ action.label }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- ── SECTION 4: Upcoming Shifts ──────────────── -->
            <div class="px-5 py-5">
              <div class="flex items-center justify-between mb-3">
                <p class="text-[10px] font-semibold uppercase tracking-widest"
                  style="color: var(--cs360-text-tertiary);">Upcoming Shifts</p>
                <button
                  class="text-xs font-medium border-none bg-transparent cursor-pointer"
                  style="color: var(--cs360-action-primary);"
                >View all</button>
              </div>

              @if (upcomingShifts.length === 0) {
                <div class="flex flex-col items-center py-6 gap-2">
                  <cs-icon name="event_busy" [size]="32" style="color: var(--cs360-text-tertiary);" />
                  <p class="text-sm" style="color: var(--cs360-text-tertiary);">No upcoming shifts</p>
                </div>
              }

              <div class="space-y-2">
                @for (shift of upcomingShifts; track shift.id) {
                  <div
                    class="flex items-center gap-3 p-3 rounded-xl"
                    style="background: var(--cs360-bg-alt);"
                  >
                    <!-- Date block -->
                    <div
                      class="flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 text-white"
                      style="background: var(--cs360-action-primary);"
                    >
                      <span class="text-[10px] font-medium uppercase leading-none">
                        {{ shift.date.split(' ')[0] }}
                      </span>
                      <span class="text-lg font-bold leading-none mt-0.5">
                        {{ shift.date.split(' ')[1] }}
                      </span>
                    </div>

                    <!-- Shift info -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold truncate" style="color: var(--cs360-text-primary);">
                        {{ shift.type }}
                      </p>
                      <div class="flex items-center gap-1 mt-0.5">
                        <cs-icon name="schedule" [size]="12" style="color: var(--cs360-text-tertiary);" />
                        <p class="text-xs" style="color: var(--cs360-text-secondary);">{{ shift.timeRange }}</p>
                      </div>
                    </div>

                    <!-- Shift status -->
                    <span
                      class="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      [style.background]="shift.status === 'scheduled' ? 'var(--cs360-feedback-success-bg, #d1fae5)' : 'var(--cs360-feedback-warning-bg, #fef3c7)'"
                      [style.color]="shift.status === 'scheduled' ? 'var(--cs360-feedback-success)' : 'var(--cs360-feedback-warning)'"
                    >
                      {{ shift.status | titlecase }}
                    </span>
                  </div>
                }
              </div>
            </div>

          </div>

        }
      </div>
    </div>
  `,
})
export class ClientDetailModalComponent {
  @Input({ required: true }) client!: Client;
  @Output() close = new EventEmitter<void>();

  readonly upcomingShifts = MOCK_SHIFTS;

  readonly quickActions = [
    { label: 'Care Plan',  icon: 'medical_information', bgColor: 'var(--cs360-feedback-success-bg, #d1fae5)', iconColor: 'var(--cs360-feedback-success)' },
    { label: 'Emergency',  icon: 'emergency',            bgColor: 'var(--cs360-feedback-error-bg, #fee2e2)',   iconColor: 'var(--cs360-feedback-error)' },
    { label: 'Documents',  icon: 'description',          bgColor: 'var(--cs360-feedback-info-bg, #dbeafe)',   iconColor: 'var(--cs360-action-primary)' },
    { label: 'Messages',   icon: 'chat',                 bgColor: 'var(--cs360-feedback-warning-bg, #fef3c7)',iconColor: 'var(--cs360-feedback-warning)' },
  ];

  get initials(): string {
    return `${this.client.firstName[0] ?? ''}${this.client.lastName[0] ?? ''}`.toUpperCase();
  }

  get clientAddress(): string {
    return `${this.client.address}, ${this.client.city}, ${this.client.state}`;
  }

  get gradient(): [string, string] {
    const idx = (this.client.id ?? 0) % GRADIENTS.length;
    return GRADIENTS[idx] as [string, string];
  }

  get statusBg(): string {
    const map: Record<string, string> = {
      Active:   'var(--cs360-feedback-success-bg, #d1fae5)',
      Inactive: 'var(--cs360-bg-alt)',
      Pending:  'var(--cs360-feedback-warning-bg, #fef3c7)',
    };
    return map[this.client.status] ?? 'var(--cs360-bg-alt)';
  }

  get statusColor(): string {
    const map: Record<string, string> = {
      Active:   'var(--cs360-feedback-success)',
      Inactive: 'var(--cs360-text-tertiary)',
      Pending:  'var(--cs360-feedback-warning)',
    };
    return map[this.client.status] ?? 'var(--cs360-text-secondary)';
  }

  setHover(el: HTMLElement, on: boolean): void {
    el.style.background = on ? 'var(--cs360-bg-alt)' : 'transparent';
  }

  onCloseHover(event: MouseEvent, on: boolean): void {
    const el = event.currentTarget as HTMLElement;
    el.style.background = on ? 'var(--cs360-bg-alt)' : 'transparent';
  }

  onCall(): void {
    window.location.href = `tel:${this.client.phoneNumber}`;
  }

  onMessage(): void { /* navigate to messages */ }

  onQuickAction(label: string): void { /* navigate to section */ }
}
