import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSFlyoutComponent } from '../../../../shared/components/cs-flyout/cs-flyout.component';
import { CSAvatarComponent } from '../../../../shared/components/cs-avatar/cs-avatar.component';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';
import type { Client } from '../../my-clients.component';

export interface ClientShift {
  id: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  duration: string;
  serviceType: string;
  totalHrs: string;
  remainingHrs: string;
  payRate: string;
  estimatedEarnings: string;
  isBackToBack: boolean;
}

export interface ClientAction {
  key: string;
  label: string;
  icon?: string;
}

/**
 * ClientDetailFlyoutComponent — Right-side flyout with client details.
 * Figma layout: Avatar center with Care Plan + Directions pills,
 * name/phone/address block, 2-col quick actions grid, upcoming shift card.
 */
@Component({
  selector: 'app-client-detail-flyout',
  standalone: true,
  imports: [CommonModule, CSFlyoutComponent, CSAvatarComponent, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-flyout
      [isOpen]="isOpen"
      (isOpenChange)="isOpenChange.emit($event)"
      position="right"
      [width]="flyoutWidth"
      [showHeaderBorder]="true"
      headerPadding="default"
      bodyPadding="sm"
    >
      <!-- Header: title centered + close right — exactly per Figma (no back button) -->
      <div flyout-header class="flex w-full items-center">
        <h2 class="flex-1 text-center text-base font-medium
                   text-[var(--cs360-text-primary)] m-0 leading-[19px]">
          Client Details
        </h2>
        <button
          type="button"
          class="flex shrink-0 items-center justify-center rounded-full w-8 h-8
                 text-[var(--cs360-text-secondary)] hover:bg-[var(--cs360-bg-alt)]
                 bg-transparent border-none cursor-pointer transition-colors"
          aria-label="Close"
          (click)="onClose()"
        >
          <cs-icon name="close" [size]="24" />
        </button>
      </div>

      <!-- Body -->
      <div flyout-body>
        @if (client) {
          <!-- Two-panel layout: client detail + optional map directions -->
          <div class="flex h-full">

            <!-- Left panel: client detail (always visible, width adapts) -->
            <div class="flex flex-col overflow-y-auto"
                 [style.width]="showMapDirections ? '500px' : '100%'"
                 [style.min-width]="showMapDirections ? '500px' : '0'">

            <!-- Profile row: Care Plan pill + Avatar (with ring) + Directions pill -->
            <div class="flex items-center" style="padding: 24px 0; gap: 6px;">

              <!-- Care Plan pill: FILL, 10px padding, gap=6, r=8, bg=action-primary-subtle -->
              <button type="button"
                class="flex flex-1 items-center justify-center rounded-md
                       bg-[var(--cs360-action-primary-subtle)]
                       text-[var(--cs360-action-primary)]
                       hover:opacity-90 transition-opacity
                       focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]
                       border-0 cursor-pointer"
                style="padding: 10px; gap: 6px;"
                (click)="onAction('care-plan')"
                aria-label="View care plan">
                <cs-icon name="assignment" [size]="24" />
                <span class="whitespace-nowrap text-base font-medium leading-[19px]">Care Plan</span>
              </button>

              <!-- Avatar: 70×70 with 13px ring in action-primary-subtle -->
              <div class="shrink-0 flex items-center justify-center" style="padding: 0 6px;">
                <div class="rounded-full overflow-hidden"
                     style="box-shadow: 0 0 0 13px var(--cs360-action-primary-subtle);">
                  <cs-avatar [name]="clientName" [src]="client.avatar" [sizePx]="70" />
                </div>
              </div>

              <!-- Directions pill: same as Care Plan -->
              <button type="button"
                class="flex flex-1 items-center justify-center rounded-md
                       bg-[var(--cs360-action-primary-subtle)]
                       text-[var(--cs360-action-primary)]
                       hover:opacity-90 transition-opacity
                       focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]
                       border-0 cursor-pointer"
                style="padding: 10px; gap: 6px;"
                (click)="onAction('map-directions')"
                aria-label="Get directions">
                <cs-icon name="assistant_navigation" [size]="24" />
                <span class="whitespace-nowrap text-base font-medium leading-[19px]">Directions</span>
              </button>
            </div>

            <!-- Address block: VERTICAL, items-center, gap=6, py=12 -->
            <div class="flex flex-col items-center" style="padding: 12px 0; gap: 6px;">
              <span class="text-base font-medium text-[var(--cs360-text-primary)] leading-[19px]">
                {{ clientName }}
              </span>
              <span class="text-[var(--cs360-text-primary)] leading-[16px]" style="font-size: 13px;">
                {{ client.phoneNumber }}
              </span>
              <span class="text-sm text-[var(--cs360-text-primary)] leading-6 text-center">
                {{ clientAddress }}
              </span>
            </div>

            <!-- Quick Actions: 2-col grid, gap=12px, py=12 -->
            <div class="grid grid-cols-2 py-3" style="gap: 12px;">
              @for (action of quickActions; track action.key) {
                <button type="button"
                  class="flex items-center justify-center rounded-md
                         bg-[var(--cs360-action-primary-subtle)]
                         border border-[var(--cs360-border-subtle)]
                         text-sm font-medium text-[var(--cs360-action-primary)]
                         hover:opacity-90 transition-opacity
                         focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]
                         cursor-pointer"
                  style="padding: 8px 16px; gap: 8px; min-height: 40px;"
                  (click)="onAction(action.key)">
                  @if (action.icon) {
                    <cs-icon [name]="action.icon" [size]="20" />
                  }
                  <span>{{ action.label }}</span>
                </button>
              }
            </div>

            <!-- Section title: "Upcoming Shift" — plain heading, no View All (per Figma) -->
            <div class="flex items-center" style="padding: 12px 0;">
              <span class="text-base font-semibold text-[var(--cs360-text-primary)] leading-6">
                Upcoming Shift
              </span>
            </div>

            <!-- Shift Card: r=8, bg=shift-card-bg, 6px left accent -->
            @if (upcomingShift) {
              <div class="flex overflow-hidden rounded-md"
                   style="background: var(--cs360-shift-card-bg);">
                <!-- Left accent bar: 6px, shift-accent blue -->
                <div class="shrink-0" style="width: 6px; background: var(--cs360-shift-accent);"></div>

                <!-- Shift content -->
                <div class="flex flex-1 flex-col" style="padding: 8px; gap: 16px;">
                  <!-- Timings row: start | duration pill | end -->
                  <div class="flex items-center">
                    <div class="flex flex-col flex-1" style="gap: 4px;">
                      <span class="text-sm text-[var(--cs360-text-primary)]">{{ upcomingShift.startDate }}</span>
                      <span class="text-sm font-semibold text-[var(--cs360-text-primary)]">{{ upcomingShift.startTime }}</span>
                    </div>
                    <div class="flex items-center shrink-0">
                      <div class="h-px w-6 border-0 border-t border-dotted border-[var(--cs360-text-tertiary)]"></div>
                      <div class="flex items-center rounded-full bg-[var(--cs360-bg-surface)]"
                           style="padding: 4px 8px; gap: 4px; border: 1px solid var(--cs360-border-subtle);">
                        <cs-icon name="schedule" [size]="14" class="text-[var(--cs360-text-primary)]" />
                        <span class="text-xs text-[var(--cs360-text-primary)]">{{ upcomingShift.duration }}</span>
                      </div>
                      <div class="h-px w-6 border-0 border-t border-dotted border-[var(--cs360-text-tertiary)]"></div>
                    </div>
                    <div class="flex flex-col items-end flex-1" style="gap: 4px;">
                      <span class="text-sm text-[var(--cs360-text-primary)]">{{ upcomingShift.endDate }}</span>
                      <span class="text-sm font-semibold text-[var(--cs360-text-primary)]">{{ upcomingShift.endTime }}</span>
                    </div>
                  </div>

                  @if (upcomingShift.isBackToBack) {
                    <div class="flex items-center justify-center" style="gap: 10px;">
                      <cs-icon name="schedule" [size]="16" class="text-[var(--cs360-text-primary)]" />
                      <span class="text-sm text-[var(--cs360-text-primary)]">Back to Back Shift</span>
                    </div>
                  }

                  <!-- Service info -->
                  <div class="flex flex-col items-center" style="padding: 4px 0; gap: 4px;">
                    <p class="text-sm text-[var(--cs360-text-primary)] text-center m-0">
                      {{ upcomingShift.serviceType }}
                    </p>
                    <p class="text-sm text-[var(--cs360-text-primary)] text-center m-0">
                      Total / Remaining Hrs. : {{ upcomingShift.totalHrs }} / {{ upcomingShift.remainingHrs }} Hrs. Per Day
                    </p>
                    <p class="text-sm text-[var(--cs360-text-primary)] text-center m-0">
                      Pay Rate: {{ upcomingShift.payRate }}, Estimated Earnings: {{ upcomingShift.estimatedEarnings }}
                    </p>
                  </div>
                </div>
              </div>
            } @else {
              <div class="flex items-center justify-center py-4">
                <span class="text-sm text-[var(--cs360-text-secondary)]">No upcoming shifts</span>
              </div>
            }

            </div><!-- /left panel -->

            <!-- Right panel: Map Directions skeleton (shown when toggled) -->
            @if (showMapDirections) {
              <div class="flex-1 min-w-0 flex flex-col border-l border-[var(--cs360-border-subtle)]
                          bg-[var(--cs360-bg-alt)]">
                <!-- Map header -->
                <div class="flex items-center justify-between px-4 py-3
                            border-b border-[var(--cs360-border-subtle)]">
                  <span class="text-sm font-medium text-[var(--cs360-text-primary)]">Directions</span>
                  <button type="button"
                    class="flex items-center justify-center w-7 h-7 rounded-full
                           bg-transparent border-none cursor-pointer
                           hover:bg-[var(--cs360-bg-surface)] text-[var(--cs360-text-tertiary)]
                           transition-colors"
                    aria-label="Close map"
                    (click)="onAction('map-directions')">
                    <cs-icon name="close" [size]="20" />
                  </button>
                </div>
                <!-- Map placeholder skeleton -->
                <div class="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                  <div class="w-full flex-1 rounded-lg bg-[var(--cs360-border-subtle)]
                              animate-pulse min-h-[300px]"></div>
                  <div class="flex items-center gap-2 text-sm text-[var(--cs360-text-tertiary)]">
                    <cs-icon name="map" [size]="20" />
                    <span>Google Maps integration required</span>
                  </div>
                </div>
              </div>
            }

          </div><!-- /two-panel flex -->
        }
      </div>
    </cs-flyout>
  `,
  styles: [`:host { display: contents; }`],
})
export class ClientDetailFlyoutComponent {
  @Input() isOpen = false;
  @Input() client: Client | null = null;
  @Input() upcomingShift: ClientShift | null = null;
  @Input() showMapDirections = false;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<string>();

  readonly quickActions: ClientAction[] = [
    { key: 'contacts', label: 'Contacts' },
    { key: 'client-documents', label: 'Client Documents' },
    { key: 'create-assessment', label: 'Create Assessment' },
    { key: 'completed-forms', label: 'Client Completed Forms' },
    { key: 'open-shifts', label: 'Open Shifts' },
  ];

  get flyoutWidth(): string {
    return this.showMapDirections ? 'min(900px, 90vw)' : '500px';
  }

  get clientName(): string {
    if (!this.client) return '';
    return `${this.client.lastName}, ${this.client.firstName}`;
  }

  get clientAddress(): string {
    if (!this.client) return '';
    return `${this.client.address}, ${this.client.city}, ${this.client.state}`;
  }

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  onAction(key: string): void {
    this.actionClicked.emit(key);
  }
}
