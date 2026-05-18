import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CSTabsComponent, CSTab } from '../../shared/components/cs-tabs/cs-tabs.component';
import { CsCardListComponent } from '../../shared/components/cs-card-list/cs-card-list.component';
import { CsCardTemplateDirective } from '../../shared/components/cs-card-list/cs-card-template.directive';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

interface TrainingItem {
  id: string;
  courseName: string;
  completedOn?: string;
  validTill?: string;
  progress: number;
}

interface TrainingReportItem {
  id: string;
  courseName: string;
  courseType: 'CERTIFICATION' | 'COURSE';
  status: 'ACTIVE' | 'INACTIVE';
}

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [
    CommonModule,
    CSIconComponent,
    CSTabsComponent,
    CsCardListComponent,
    CsCardTemplateDirective,
    CSFlyoutComponent,
    CsPageHeaderComponent,
  ],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingsComponent {

  readonly tabs: CSTab[] = [
    { label: 'Trainings', value: 'trainings' },
    { label: 'Training Report', value: 'report' },
  ];

  readonly activeTab = signal<string>('trainings');

  onTabChange(value: string): void {
    this.activeTab.set(value);
  }

  showDetailFlyout = false;
  selectedTraining: TrainingItem | null = null;
  selectedReport: TrainingReportItem | null = null;

  trainingsPage = 1;
  trainingsPageSize = 9;
  reportPage = 1;
  reportPageSize = 9;
  readonly pageSizeOptions = [9, 18, 36];

  readonly trainings: TrainingItem[] = [
    { id: '1', courseName: 'Basic Life Support (BLS)', completedOn: '2024-11-15', validTill: '2025-11-15', progress: 100 },
    { id: '2', courseName: 'Medication Administration', completedOn: '2024-10-01', validTill: '2025-10-01', progress: 100 },
    { id: '3', courseName: 'Infection Control & Prevention', validTill: '2025-06-30', progress: 65 },
    { id: '4', courseName: 'Fall Prevention Training', validTill: '2025-09-01', progress: 40 },
    { id: '5', courseName: 'HIPAA Compliance', completedOn: '2024-12-01', validTill: '2025-12-01', progress: 100 },
    { id: '6', courseName: 'Dementia Care Essentials', validTill: '2025-08-15', progress: 20 },
    { id: '7', courseName: 'CPR Recertification', validTill: '2025-04-30', progress: 80 },
  ];

  readonly reportItems: TrainingReportItem[] = [
    { id: '1', courseName: 'Basic Life Support (BLS)', courseType: 'CERTIFICATION', status: 'ACTIVE' },
    { id: '2', courseName: 'Medication Administration', courseType: 'COURSE', status: 'ACTIVE' },
    { id: '3', courseName: 'Infection Control & Prevention', courseType: 'COURSE', status: 'ACTIVE' },
    { id: '4', courseName: 'Advanced Wound Care', courseType: 'CERTIFICATION', status: 'INACTIVE' },
    { id: '5', courseName: 'Patient Rights & Ethics', courseType: 'COURSE', status: 'ACTIVE' },
    { id: '6', courseName: 'Fire Safety Procedures', courseType: 'COURSE', status: 'INACTIVE' },
  ];

  get pagedTrainings(): TrainingItem[] {
    const s = (this.trainingsPage - 1) * this.trainingsPageSize;
    return this.trainings.slice(s, s + this.trainingsPageSize);
  }

  get pagedReport(): TrainingReportItem[] {
    const s = (this.reportPage - 1) * this.reportPageSize;
    return this.reportItems.slice(s, s + this.reportPageSize);
  }

  onItemClick(item: unknown): void {
    if (this.activeTab() === 'trainings') {
      this.selectedTraining = item as TrainingItem;
      this.selectedReport = null;
    } else {
      this.selectedReport = item as TrainingReportItem;
      this.selectedTraining = null;
    }
    this.showDetailFlyout = true;
  }

  closeDetailFlyout(): void {
    this.showDetailFlyout = false;
    this.selectedTraining = null;
    this.selectedReport = null;
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    if (this.activeTab() === 'trainings') {
      this.trainingsPage = event.page;
      this.trainingsPageSize = event.pageSize;
    } else {
      this.reportPage = event.page;
      this.reportPageSize = event.pageSize;
    }
  }

  progressCircumference(size: number, stroke: number): number {
    return 2 * Math.PI * ((size - stroke) / 2);
  }

  progressOffset(value: number, size: number, stroke: number): number {
    const c = this.progressCircumference(size, stroke);
    return c - (value / 100) * c;
  }

  statusBadgeClass(status: string): string {
    return status === 'ACTIVE'
      ? 'bg-[var(--cs360-feedback-success-bg)] text-[var(--cs360-feedback-success)]'
      : 'bg-[var(--cs360-feedback-error-bg)] text-[var(--cs360-feedback-error)]';
  }

  typeBadgeClass(): string {
    return 'bg-[var(--cs360-bg-alt)] text-[var(--cs360-text-secondary)]';
  }
}
