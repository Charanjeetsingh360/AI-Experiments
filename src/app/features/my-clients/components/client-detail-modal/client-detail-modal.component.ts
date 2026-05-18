import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';
import { CSAvatarComponent } from '../../../../shared/components/cs-avatar/cs-avatar.component';
import type { Client } from '../../my-clients.component';

export interface ClientShift {
  id: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  duration: string;
  serviceType: string;
  totalHrs: string;
  remainingHrs: string;
  payInfo: string;
  isBackToBack: boolean;
}

const MOCK_SHIFT: ClientShift = {
  id: 1,
  startDate: 'MM/DD/YY',
  startTime: '2:00 AM (AST)',
  endDate: 'MM/DD/YY',
  endTime: '2:30 AM (AST)',
  duration: '0h 30m',
  serviceType: 'Healthcare Services (Authorized) - 123445',
  totalHrs: '8.00',
  remainingHrs: '8.00',
  payInfo: 'Pay Rate: $30/15 min, Estimated Earnings: $60',
  isBackToBack: true,
};

@Component({
  selector: 'app-client-detail-modal',
  standalone: true,
  imports: [CommonModule, CSIconComponent, CSAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="client.firstName + ' ' + client.lastName + ' details'"
    >
      <!-- Scrim -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"
           (click)="close.emit()"></div>

      <!-- Modal card: 500px wide, white bg -->
      <div class="relative z-10 flex w-full max-w-[500px] flex-col overflow-hidden
                  rounded-t-2xl sm:rounded-2xl bg-[var(--cs360-bg-surface)] shadow-2xl"
           style="max-height: 92vh;">

        <!-- ── Header ──────────────────────────────── -->
        <div class="relative flex shrink-0 items-center justify-center
                    border-b border-[var(--cs360-border-subtle)]
                    px-4 py-3">
          <h2 class="text-base font-semibold text-[var(--cs360-text-primary)]">
            Client Details
          </h2>
          <button type="button" (click)="close.emit()" aria-label="Close"
            class="absolute right-3 inline-flex h-8 w-8 items-center justify-center
                   rounded-full text-[var(--cs360-text-primary)]
                   transition-colors hover:bg-[var(--cs360-bg-alt)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]">
            <cs-icon name="close" [size]="20" />
          </button>
        </div>

        <!-- ── Scrollable body ─────────────────────── -->
        <div class="flex-1 overflow-y-auto px-[10px] py-[10px]">

          <!-- ── Profile row: 3 items, no gap, flush ─ -->
          <!-- Figma: modal profile info HORIZONTAL, notes(155) + user_face(70) + directions(155) = 380, pad T12 B12 -->
          <div class="flex items-center py-3">

            <!-- Care Plan pill: flex-1, rounded-lg, bg action-primary-subtle, pad T10 R10 B10 L10, gap 6 -->
            <button type="button"
              class="flex flex-1 items-center justify-center gap-1.5
                     rounded-lg bg-[var(--cs360-action-primary-subtle)]
                     px-[10px] py-[10px]
                     text-[var(--cs360-action-primary)]
                     hover:opacity-90 transition-opacity
                     focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]"
              (click)="onAction('care-plan')">
              <span class="whitespace-nowrap text-sm font-medium">Care Plan</span>
              <cs-icon name="assignment" [size]="20" />
            </button>

            <!-- Avatar: 70x70, circle, gap 6 inside, pad T2 R6 B4 L6 -->
            <div class="flex shrink-0 items-center justify-center px-[6px] py-[2px]">
              <cs-avatar [name]="clientName" [src]="client.avatar" [sizePx]="70" />
            </div>

            <!-- Map Directions pill: flex-1, same style as Care Plan -->
            <button type="button"
              class="flex flex-1 items-center justify-center gap-1.5
                     rounded-lg bg-[var(--cs360-action-primary-subtle)]
                     px-[10px] py-[10px]
                     text-[var(--cs360-action-primary)]
                     hover:opacity-90 transition-opacity
                     focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]"
              (click)="onAction('directions')">
              <cs-icon name="assistant_navigation" [size]="20" />
              <span class="whitespace-nowrap text-sm font-medium">Map Directions</span>
            </button>
          </div>

          <!-- ── Address block: center, gap 6, pb 10 ─ -->
          <!-- Figma: address pad(T0,R0,B10,L0) gap=6 VERTICAL, text centered -->
          <div class="flex flex-col items-center pb-[10px]" style="gap:6px;">
            <p class="text-base font-bold text-[var(--cs360-text-primary)]">
              {{ clientName }}
            </p>
            <p class="text-sm text-[var(--cs360-text-primary)]">
              {{ client.phoneNumber }}
            </p>
            <p class="text-sm text-[var(--cs360-text-primary)]">
              {{ clientAddress }}
            </p>
          </div>

          <!-- ── Quick Actions: 2-col grid, pad T12 B12, each pad T8 R16 B8 L16, r8, gap 8 ─ -->
          <!-- Figma: quick actions GRID, py-12 wrapper, each action 184x40 r=8 pad(T8,R16,B8,L16) gap=8 -->
          <div class="grid grid-cols-2 py-3" style="gap:8px;">
            @for (action of quickActions; track action.key) {
              <button type="button"
                class="flex items-center justify-center
                       rounded-lg bg-[var(--cs360-action-primary-subtle)]
                       px-4 py-2
                       text-center text-sm font-medium
                       text-[var(--cs360-action-primary)]
                       hover:opacity-90 transition-opacity
                       focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]"
                style="min-height:40px; gap:8px;"
                (click)="onAction(action.key)">
                {{ action.label }}
              </button>
            }
          </div>

          <!-- ── Upcoming Shift title: pad T12 B12 ─── -->
          <div class="py-3">
            <h3 class="text-base font-bold text-[var(--cs360-text-primary)]">
              Upcoming Shift
            </h3>
          </div>

          <!-- ── Shift Card: bg #EAEEF8, r8, HORIZONTAL ─ -->
          <!-- Figma: Shift Card Types bg=rgb(234,238,248) r=8, bar 6x185 + shif_data pad(T8,R8,B8,L8) gap=16 -->
          <div class="flex overflow-hidden rounded-lg" style="background:#EAEEF8;">

            <!-- Left accent bar: 6px wide, blue -->
            <div class="shrink-0" style="width:6px; background:#4DA6FF;"></div>

            <!-- Shift data: pad 8px all sides, gap 16px vertical -->
            <div class="flex flex-1 flex-col" style="padding:8px; gap:16px;">

              <!-- Timings row: Start | Duration pill | End -->
              <!-- Figma: module-shift-Timings HORIZONTAL, Start(136) + duration(87x28 r=9999) + End(136) -->
              <div class="flex items-center">

                <!-- Start: date bold + time -->
                <div class="flex flex-col" style="gap:4px; flex:1;">
                  <span class="text-sm text-[var(--cs360-text-primary)]">{{ shift.startDate }}</span>
                  <span class="text-sm font-semibold text-[var(--cs360-text-primary)]">{{ shift.startTime }}</span>
                </div>

                <!-- Duration pill: r=9999, pad T4 R8 B4 L8, gap 4, white bg -->
                <!-- dotted lines via flex lines on either side -->
                <div class="flex items-center" style="flex:0 0 auto;">
                  <!-- left dotted line -->
                  <div class="h-px w-6 border-0 border-t border-dotted border-[var(--cs360-text-tertiary)]"></div>
                  <!-- pill -->
                  <div class="flex items-center rounded-full bg-[var(--cs360-bg-surface)]"
                       style="padding: 4px 8px; gap:4px; border: 1px solid var(--cs360-border-subtle);">
                    <cs-icon name="schedule" [size]="14" class="text-[var(--cs360-text-primary)]" />
                    <span class="text-xs text-[var(--cs360-text-primary)]">{{ shift.duration }}</span>
                  </div>
                  <!-- right dotted line -->
                  <div class="h-px w-6 border-0 border-t border-dotted border-[var(--cs360-text-tertiary)]"></div>
                </div>

                <!-- End: date + time, right-aligned -->
                <div class="flex flex-col items-end" style="gap:4px; flex:1;">
                  <span class="text-sm text-[var(--cs360-text-primary)]">{{ shift.endDate }}</span>
                  <span class="text-sm font-semibold text-[var(--cs360-text-primary)]">{{ shift.endTime }}</span>
                </div>
              </div>

              <!-- Back to Back Shift row (centered) -->
              <!-- Figma: state HORIZONTAL r=20 pad(T0,R10,B0,L10) gap=10, chronic icon + text -->
              @if (shift.isBackToBack) {
                <div class="flex items-center justify-center" style="gap:10px;">
                  <cs-icon name="schedule" [size]="16" class="text-[var(--cs360-text-primary)]" />
                  <span class="text-sm text-[var(--cs360-text-primary)]">Back to Back Shift</span>
                </div>
              }

              <!-- Service info: 3 lines centered, pad T4 B4, gap 4 -->
              <!-- Figma: shift other info pad(T4,R0,B4,L0) gap=4 VERTICAL, all text centered -->
              <div class="flex flex-col items-center" style="padding: 4px 0; gap:4px;">
                <p class="text-sm text-[var(--cs360-text-primary)] text-center">
                  {{ shift.serviceType }}
                </p>
                <p class="text-sm text-[var(--cs360-text-primary)] text-center">
                  Total / Remaining Hrs. : {{ shift.totalHrs }} / {{ shift.remainingHrs }} Hrs. Per Day
                </p>
                <p class="text-sm text-[var(--cs360-text-primary)] text-center">
                  {{ shift.payInfo }}
                </p>
              </div>

            </div><!-- end shif_data -->
          </div><!-- end shift card -->

        </div><!-- end scrollable body -->
      </div><!-- end modal card -->
    </div><!-- end backdrop -->
  `,
})
export class ClientDetailModalComponent {
  @Input({ required: true }) client!: Client;
  @Output() close = new EventEmitter<void>();

  readonly shift = MOCK_SHIFT;

  readonly quickActions = [
    { key: 'contacts',          label: 'Contacts' },
    { key: 'client-documents',  label: 'Client Documents' },
    { key: 'create-assessment', label: 'Create Assessment' },
    { key: 'completed-forms',   label: 'Client Completed Forms' },
    { key: 'open-shifts',       label: 'Open Shifts' },
  ];

  get clientName(): string {
    return `${this.client.lastName}, ${this.client.firstName}`;
  }

  get clientAddress(): string {
    return `${this.client.address}, ${this.client.city}, ${this.client.state}`;
  }

  onAction(_key: string): void { /* navigate to section */ }
}
