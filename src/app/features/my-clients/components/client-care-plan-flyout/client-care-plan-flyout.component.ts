import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSFlyoutComponent } from '../../../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';

interface CarePlanSection {
  title: string;
  rows: { label: string; value: string }[];
}

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
      <div flyout-body class="max-h-[75vh] overflow-y-auto p-0">
        @if (loading()) {
          <div class="flex items-center justify-center py-8">
            <div class="w-6 h-6 border-2 border-[var(--cs360-text-tertiary)] border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-[var(--cs360-text-secondary)] ml-2">Loading care plan...</span>
          </div>
        } @else {

          <!-- FACESHEET header banner -->
          <div class="flex flex-col items-center justify-center bg-[var(--cs360-text-secondary-alt)] px-[var(--density-space-6)] pb-[14px] pt-[18px]">
            <span class="text-[11px] font-bold uppercase tracking-[2px] text-[var(--cs360-text-inverse)]/60">
              CLIENT CARE PLAN
            </span>
            <span class="mt-[var(--density-space-1)] text-[20px] font-bold leading-[1.3] text-[var(--cs360-text-inverse)]">
              FACESHEET
            </span>
            <span class="mt-[var(--density-space-1)] text-[12px] text-[var(--cs360-text-inverse)]/65">
              Authorization #AUTH-2024-123445 · Effective 01/01/2024 – 12/31/2024
            </span>
          </div>

          <!-- Document body -->
          <div class="flex flex-col pb-[var(--density-space-6)]">

            @for (section of carePlanSections; track section.title) {
              <!-- Section heading -->
              <div class="border-b border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-alt)] px-[var(--density-space-6)] py-[var(--density-space-2)]">
                <span class="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--cs360-text-secondary-alt)]">
                  {{ section.title }}
                </span>
              </div>

              <!-- Section rows -->
              <div class="flex flex-col px-[var(--density-space-6)]">
                @for (row of section.rows; track row.label; let last = $last) {
                  <div [class]="careRowClasses(last)">
                    <span class="min-w-[160px] shrink-0 text-[13px] leading-[1.5] text-[var(--cs360-text-helper)]">
                      {{ row.label }}
                    </span>
                    <span class="flex-1 text-[13px] font-medium leading-[1.5] text-[var(--cs360-text-primary)]">
                      {{ row.value }}
                    </span>
                  </div>
                }
              </div>
            }

            <!-- Tasks section -->
            <div class="border-y border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-alt)] px-[var(--density-space-6)] py-[var(--density-space-2)]">
              <span class="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--cs360-text-secondary-alt)]">
                TASKS &amp; CARE INSTRUCTIONS
              </span>
            </div>
            <div class="px-[var(--density-space-6)] py-[var(--density-space-3)]">
              <ol class="m-0 flex flex-col gap-[var(--density-space-2)] pl-[20px]">
                @for (task of careTasks; track task) {
                  <li class="text-[13px] leading-[1.5] text-[var(--cs360-text-primary)]">{{ task }}</li>
                }
              </ol>
            </div>

            <!-- Medications section -->
            <div class="border-y border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-alt)] px-[var(--density-space-6)] py-[var(--density-space-2)]">
              <span class="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--cs360-text-secondary-alt)]">
                MEDICATIONS
              </span>
            </div>
            <div class="px-[var(--density-space-6)]">
              @for (med of medications; track med.name; let last = $last) {
                <div [class]="careRowClasses(last) + ' items-center'">
                  <span class="flex-1 text-[13px] font-medium leading-[1.5] text-[var(--cs360-text-primary)]">
                    {{ med.name }}
                  </span>
                  <span class="whitespace-nowrap text-[12px] leading-[1.5] text-[var(--cs360-text-helper)]">
                    {{ med.dosage }}
                  </span>
                </div>
              }
            </div>

            <!-- Additional considerations -->
            <div class="border-y border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-alt)] px-[var(--density-space-6)] py-[var(--density-space-2)]">
              <span class="text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--cs360-text-secondary-alt)]">
                ADDITIONAL CONSIDERATIONS
              </span>
            </div>
            <div class="px-[var(--density-space-6)] py-[14px]">
              <p class="m-0 text-[13px] leading-[1.6] text-[var(--cs360-text-primary)]">
                Client requires assistance with mobility. Use walker when transitioning between rooms.
                <strong>Allergic to penicillin.</strong> Diabetic — monitor blood sugar levels before meals.
                Preferred language: English. Emergency contact: James Edison (Son) · (555) 321-0987.
              </p>
            </div>

          </div><!-- /document body -->
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

  readonly carePlanSections: CarePlanSection[] = [
    {
      title: 'General Information',
      rows: [
        { label: 'Client Name', value: 'Edison, Marry' },
        { label: 'Date of Birth', value: '03/14/1948 (Age 76)' },
        { label: 'Client ID', value: 'CLT-2024-004412' },
        { label: 'Service Type', value: 'Healthcare Services (Authorized)' },
        { label: 'Total Hours', value: '480 Hrs. · Remaining: 320 Hrs.' },
      ],
    },
    {
      title: 'Address & Contact',
      rows: [
        { label: 'Home Address', value: '99 Marina Bay Street, New York, NY 10001' },
        { label: 'Phone', value: '(555) 234-5678' },
        { label: 'Email', value: 'marry.edison@email.com' },
        { label: 'Primary Physician', value: 'Dr. Sarah Collins · (555) 987-6543' },
      ],
    },
    {
      title: 'Needs & Requirements',
      rows: [
        { label: 'Mobility', value: 'Requires walker assistance indoors' },
        { label: 'Personal Care', value: 'Assistance with bathing, dressing, grooming' },
        { label: 'Cognitive Status', value: 'Mild memory impairment — reminders needed' },
        { label: 'Diet', value: 'Diabetic diet · No high-sugar foods' },
        { label: 'Allergies', value: 'Penicillin (severe)' },
      ],
    },
  ];

  readonly careTasks = [
    'Assist with daily living activities (bathing, dressing, grooming)',
    'Medication reminders as per schedule',
    'Light housekeeping and meal preparation',
    'Accompany to medical appointments',
    'Monitor vital signs and report any changes to supervisor',
    'Blood sugar check before each meal and document readings',
    'Provide companionship and social engagement',
    'Ensure safe mobility — walker must be used at all times indoors',
  ];

  readonly medications = [
    { name: 'Metformin 500mg', dosage: 'Twice daily with meals' },
    { name: 'Lisinopril 10mg', dosage: 'Once daily — morning' },
    { name: 'Aspirin 81mg', dosage: 'Once daily — morning' },
    { name: 'Atorvastatin 20mg', dosage: 'Once daily — evening' },
  ];

  careRowClasses(isLast: boolean): string {
    const base = 'flex gap-[var(--density-space-4)] py-[10px]';
    return isLast ? base : `${base} border-b border-[var(--cs360-border-subtle)]`;
  }

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }
}
