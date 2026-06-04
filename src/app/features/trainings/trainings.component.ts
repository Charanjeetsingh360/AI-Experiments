import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsTabsComponent, CsTabPanelComponent } from '../../shared/components/cs-tabs/cs-tabs.component';
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
    CsTabsComponent,
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

  readonly tabs: CsTabPanelComponent[] = [
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
  readonly statusMessage = signal('');

  trainingsPage = 1;
  trainingsPageSize = 9;
  reportPage = 1;
  reportPageSize = 9;
  readonly pageSizeOptions = [9, 18, 36];

  readonly trainings: TrainingItem[] = [
    { id: '1', courseName: 'Professional Caregiver Training Course', completedOn: '2024-06-24', validTill: '2026-06-24', progress: 93 },
    { id: '2', courseName: 'Basic Life Support (BLS)', completedOn: '2024-11-15', validTill: '2025-11-15', progress: 100 },
    { id: '3', courseName: 'Medication Administration', completedOn: '2024-10-01', validTill: '2025-10-01', progress: 100 },
    { id: '4', courseName: 'Infection Control & Prevention', validTill: '2025-06-30', progress: 65 },
    { id: '5', courseName: 'Fall Prevention Training', validTill: '2025-09-01', progress: 40 },
    { id: '6', courseName: 'HIPAA Compliance', completedOn: '2024-12-01', validTill: '2025-12-01', progress: 100 },
    { id: '7', courseName: 'Dementia Care Essentials', validTill: '2025-08-15', progress: 20 },
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
    this.statusMessage.set('');
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
    this.statusMessage.set('');
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

  trainingActionLabel(training: TrainingItem): string {
    if (training.progress >= 100) return 'Review Certificate';
    return training.progress > 0 ? 'Resume Training' : 'Start Training';
  }

  runTrainingAction(): void {
    if (!this.selectedTraining) return;

    if (this.selectedTraining.progress >= 100) {
      this.statusMessage.set('Certificate preview is ready for review.');
      return;
    }

    const completed = {
      ...this.selectedTraining,
      progress: 100,
      completedOn: this.todayLabel(),
      validTill: this.nextYearLabel(),
    };
    const index = this.trainings.findIndex(training => training.id === completed.id);
    if (index >= 0) {
      this.trainings[index] = completed;
      this.selectedTraining = completed;
      this.statusMessage.set(`${completed.courseName} completed.`);
    }
  }

  exportReport(): void {
    if (!this.selectedReport) return;
    this.statusMessage.set(`${this.selectedReport.courseName} report export prepared.`);
  }

  toggleReportStatus(): void {
    if (!this.selectedReport) return;
    const nextStatus: TrainingReportItem['status'] = this.selectedReport.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = { ...this.selectedReport, status: nextStatus };
    const index = this.reportItems.findIndex(report => report.id === updated.id);
    if (index >= 0) {
      this.reportItems[index] = updated;
      this.selectedReport = updated;
      this.statusMessage.set(`Report status changed to ${nextStatus}.`);
    }
  }

  private todayLabel(): string {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  private nextYearLabel(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}
