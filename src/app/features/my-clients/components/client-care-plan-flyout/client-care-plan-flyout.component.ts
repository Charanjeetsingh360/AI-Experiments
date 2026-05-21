import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSFlyoutComponent } from '../../../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';

/**
 * ClientCarePlanFlyoutComponent — Displays the client's care plan content.
 * In production this would render sanitized HTML from the API.
 * Currently shows mock care plan data.
 */
@Component({
  selector: 'app-client-care-plan-flyout',
  standalone: true,
  imports: [CommonModule, CSFlyoutComponent, CSIconComponent],
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
          Care Plan
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
      <div flyout-body class="px-2 py-2">
        @if (loading()) {
          <div class="flex items-center justify-center py-8">
            <div class="w-6 h-6 border-2 border-[var(--cs360-text-tertiary)] border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-[var(--cs360-text-secondary)] ml-2">Loading care plan...</span>
          </div>
        } @else if (hasContent()) {
          <div class="care-plan-content prose prose-sm max-w-none space-y-4">
            <!-- Mock care plan content -->
            <div class="p-5 rounded-lg bg-[var(--cs360-bg-alt)] border border-[var(--cs360-border-subtle)]">
              <h3 class="text-base font-semibold text-[var(--cs360-text-primary)] mt-0 mb-4">
                Service Plan Summary
              </h3>
              <table class="w-full text-sm border-collapse">
                <tbody>
                  <tr class="border-b border-[var(--cs360-border-subtle)]">
                    <td class="py-2 font-medium text-[var(--cs360-text-secondary)]">Service Type</td>
                    <td class="py-2 text-[var(--cs360-text-primary)]">Healthcare Services (Authorized)</td>
                  </tr>
                  <tr class="border-b border-[var(--cs360-border-subtle)]">
                    <td class="py-2 font-medium text-[var(--cs360-text-secondary)]">Authorization #</td>
                    <td class="py-2 text-[var(--cs360-text-primary)]">AUTH-2024-123445</td>
                  </tr>
                  <tr class="border-b border-[var(--cs360-border-subtle)]">
                    <td class="py-2 font-medium text-[var(--cs360-text-secondary)]">Start Date</td>
                    <td class="py-2 text-[var(--cs360-text-primary)]">01/01/2024</td>
                  </tr>
                  <tr class="border-b border-[var(--cs360-border-subtle)]">
                    <td class="py-2 font-medium text-[var(--cs360-text-secondary)]">End Date</td>
                    <td class="py-2 text-[var(--cs360-text-primary)]">12/31/2024</td>
                  </tr>
                  <tr class="border-b border-[var(--cs360-border-subtle)]">
                    <td class="py-2 font-medium text-[var(--cs360-text-secondary)]">Total Hours</td>
                    <td class="py-2 text-[var(--cs360-text-primary)]">480 Hours</td>
                  </tr>
                  <tr>
                    <td class="py-2 font-medium text-[var(--cs360-text-secondary)]">Remaining Hours</td>
                    <td class="py-2 text-[var(--cs360-text-primary)]">320 Hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="p-5 rounded-lg bg-[var(--cs360-bg-alt)] border border-[var(--cs360-border-subtle)]">
              <h3 class="text-base font-semibold text-[var(--cs360-text-primary)] mt-0 mb-4">
                Care Instructions
              </h3>
              <ul class="text-sm text-[var(--cs360-text-primary)] space-y-3 pl-5 m-0">
                <li>Assist with daily living activities (bathing, dressing, grooming)</li>
                <li>Medication reminders as per schedule</li>
                <li>Light housekeeping and meal preparation</li>
                <li>Accompany to medical appointments</li>
                <li>Monitor vital signs and report changes</li>
                <li>Provide companionship and social engagement</li>
              </ul>
            </div>

            <div class="p-5 rounded-lg bg-[var(--cs360-bg-alt)] border border-[var(--cs360-border-subtle)]">
              <h3 class="text-base font-semibold text-[var(--cs360-text-primary)] mt-0 mb-4">
                Special Notes
              </h3>
              <p class="text-sm text-[var(--cs360-text-primary)] m-0">
                Client requires assistance with mobility. Use walker when transitioning between rooms.
                Allergic to penicillin. Diabetic — monitor blood sugar levels before meals.
              </p>
            </div>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-8">
            <cs-icon name="assignment" [size]="48" class="text-[var(--cs360-text-tertiary)]" />
            <p class="text-sm text-[var(--cs360-text-secondary)] mt-2">No care plan available.</p>
          </div>
        }
      </div>
    </cs-flyout>
  `,
  styles: [`:host { display: contents; }`],
})
export class ClientCarePlanFlyoutComponent {
  @Input() isOpen = false;
  @Input() clientId = '';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  loading = signal(false);
  hasContent = signal(true); // Mock: always show content

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }
}
