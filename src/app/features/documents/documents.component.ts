import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsTabsComponent, CsTabPanelComponent } from '../../shared/components/cs-tabs/cs-tabs.component';
import { CsCardListComponent } from '../../shared/components/cs-card-list/cs-card-list.component';
import { CsCardTemplateDirective } from '../../shared/components/cs-card-list/cs-card-template.directive';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

export interface Document {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'COMPLIANCE';
  updatedOn: string;
  status?: string;
  notes?: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CSIconComponent,
    CsTabsComponent,
    CsCardListComponent,
    CsCardTemplateDirective,
    CSFlyoutComponent,
    CsPageHeaderComponent,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {
  readonly filterTabs: CsTabPanelComponent[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Document', value: 'DOCUMENT' },
    { label: 'Compliance', value: 'COMPLIANCE' },
  ];

  readonly activeFilter = signal<string>('all');

  onFilterChange(value: string): void {
    this.activeFilter.set(value);
    this.currentPage = 1;
  }

  readonly addDocTabs: CsTabPanelComponent[] = [
    { label: 'Document', value: 'document' },
    { label: 'Compliance', value: 'compliance' },
  ];

  readonly addDocActiveTab = signal<string>('document');

  showAddFlyout = false;
  showViewFlyout = false;
  selectedDoc: Document | null = null;

  docFileName = '';
  docNotes = '';

  currentPage = 1;
  pageSize = 9;
  readonly pageSizeOptions = [9, 18, 36];

  private readonly allDocs: Document[] = [
    { id: '1', name: 'CPR Certification', type: 'COMPLIANCE', updatedOn: '2025-01-15', status: 'Active' },
    { id: '2', name: 'Orientation Manual', type: 'DOCUMENT', updatedOn: '2024-12-01' },
    { id: '3', name: 'HIPAA Agreement', type: 'COMPLIANCE', updatedOn: '2024-11-20', status: 'Active' },
    { id: '4', name: 'Background Check', type: 'DOCUMENT', updatedOn: '2024-10-05' },
    { id: '5', name: 'First Aid Certificate', type: 'COMPLIANCE', updatedOn: '2025-02-10', status: 'Expiring' },
    { id: '6', name: 'Client Care Plan', type: 'DOCUMENT', updatedOn: '2025-03-22' },
    { id: '7', name: 'TB Test Results', type: 'COMPLIANCE', updatedOn: '2025-04-01', status: 'Active' },
    { id: '8', name: 'Emergency Contacts', type: 'DOCUMENT', updatedOn: '2024-09-18' },
    { id: '9', name: 'Medication Log', type: 'DOCUMENT', updatedOn: '2025-05-07' },
  ];

  get filteredDocs(): Document[] {
    const f = this.activeFilter();
    return f === 'all' ? this.allDocs : this.allDocs.filter(d => d.type === f);
  }

  get totalItems(): number {
    return this.filteredDocs.length;
  }

  get pagedDocs(): Document[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDocs.slice(start, start + this.pageSize);
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
  }

  openAddFlyout(): void {
    this.docFileName = '';
    this.docNotes = '';
    this.addDocActiveTab.set('document');
    this.showAddFlyout = true;
  }

  closeAddFlyout(): void {
    this.showAddFlyout = false;
  }

  openViewFlyout(doc: Document): void {
    this.selectedDoc = doc;
    this.showViewFlyout = true;
  }

  closeViewFlyout(): void {
    this.showViewFlyout = false;
    this.selectedDoc = null;
  }

  typeBadgeClass(type: string): string {
    return 'bg-[var(--cs360-bg-alt)] text-[var(--cs360-text-secondary)] border border-[var(--cs360-border-subtle)] uppercase';
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
  }

  statusBadgeClass(status?: string): string {    if (!status) return '';
    if (status === 'Active') return 'bg-[var(--cs360-feedback-success-bg)] text-[var(--cs360-feedback-success)]';
    if (status === 'Expiring') return 'bg-[var(--cs360-feedback-warning-bg)] text-[var(--cs360-feedback-warning)]';
    return 'bg-[var(--cs360-feedback-error-bg)] text-[var(--cs360-feedback-error)]';
  }
}
