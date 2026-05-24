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
      <div flyout-body style="padding: 0; overflow-y: auto; max-height: 75vh;">
        @if (loading()) {
          <div class="flex items-center justify-center py-8">
            <div class="w-6 h-6 border-2 border-[var(--cs360-text-tertiary)] border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-[var(--cs360-text-secondary)] ml-2">Loading care plan...</span>
          </div>
        } @else {

          <!-- FACESHEET header banner -->
          <div class="flex flex-col items-center justify-center"
               style="background: #334a65; padding: 18px 24px 14px;">
            <span style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: rgba(255,255,255,0.6); text-transform: uppercase;">
              CLIENT CARE PLAN
            </span>
            <span style="font-size: 20px; font-weight: 700; color: #fff; line-height: 1.3; margin-top: 4px;">
              FACESHEET
            </span>
            <span style="font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 4px;">
              Authorization #AUTH-2024-123445 · Effective 01/01/2024 – 12/31/2024
            </span>
          </div>

          <!-- Document body -->
          <div class="flex flex-col" style="padding: 0 0 24px;">

            @for (section of carePlanSections; track section.title) {
              <!-- Section heading -->
              <div style="background: #f0f4f8; padding: 8px 24px; border-bottom: 1px solid #e2e8f0;">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #334a65; text-transform: uppercase;">
                  {{ section.title }}
                </span>
              </div>

              <!-- Section rows -->
              <div class="flex flex-col" style="padding: 0 24px;">
                @for (row of section.rows; track row.label; let last = $last) {
                  <div class="flex"
                       [style.border-bottom]="last ? 'none' : '1px solid #e8ecf0'"
                       style="padding: 10px 0; gap: 16px;">
                    <span style="font-size: 13px; color: #788899; min-width: 160px; flex-shrink: 0; line-height: 1.5;">
                      {{ row.label }}
                    </span>
                    <span style="font-size: 13px; color: #1a2332; font-weight: 500; line-height: 1.5; flex: 1;">
                      {{ row.value }}
                    </span>
                  </div>
                }
              </div>
            }

            <!-- Tasks section -->
            <div style="background: #f0f4f8; padding: 8px 24px; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0;">
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #334a65; text-transform: uppercase;">
                TASKS &amp; CARE INSTRUCTIONS
              </span>
            </div>
            <div style="padding: 12px 24px;">
              <ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
                @for (task of careTasks; track task) {
                  <li style="font-size: 13px; color: #1a2332; line-height: 1.5;">{{ task }}</li>
                }
              </ol>
            </div>

            <!-- Medications section -->
            <div style="background: #f0f4f8; padding: 8px 24px; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0;">
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #334a65; text-transform: uppercase;">
                MEDICATIONS
              </span>
            </div>
            <div style="padding: 0 24px;">
              @for (med of medications; track med.name; let last = $last) {
                <div class="flex items-center"
                     [style.border-bottom]="last ? 'none' : '1px solid #e8ecf0'"
                     style="padding: 10px 0; gap: 16px;">
                  <span style="font-size: 13px; color: #1a2332; font-weight: 500; flex: 1; line-height: 1.5;">
                    {{ med.name }}
                  </span>
                  <span style="font-size: 12px; color: #788899; white-space: nowrap; line-height: 1.5;">
                    {{ med.dosage }}
                  </span>
                </div>
              }
            </div>

            <!-- Additional considerations -->
            <div style="background: #f0f4f8; padding: 8px 24px; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0;">
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #334a65; text-transform: uppercase;">
                ADDITIONAL CONSIDERATIONS
              </span>
            </div>
            <div style="padding: 14px 24px;">
              <p style="font-size: 13px; color: #1a2332; margin: 0; line-height: 1.6;">
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

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }
}
