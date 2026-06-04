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
  readonly searchQuery = signal('');

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
  readonly formSubmitted = signal(false);
  readonly statusMessage = signal('');

  docFileName = '';
  docNotes = '';
  complianceType = '';
  complianceLicense = '';
  complianceOriginDate = '';
  complianceExpirationDate = '';
  complianceNotes = '';
  attachmentUploaded = false;

  currentPage = 1;
  pageSize = 9;
  readonly pageSizeOptions = [9, 18, 36];

  private readonly allDocs: Document[] = [
    { id: '1', name: 'Self-signed degree', type: 'DOCUMENT', updatedOn: '2025-11-24' },
    { id: '2', name: 'Employment Authorization', type: 'COMPLIANCE', updatedOn: '2025-11-24', status: 'Active' },
    { id: '3', name: 'CPR Certification', type: 'COMPLIANCE', updatedOn: '2025-01-15', status: 'Active' },
    { id: '4', name: 'Orientation Manual', type: 'DOCUMENT', updatedOn: '2024-12-01' },
    { id: '5', name: 'HIPAA Agreement', type: 'COMPLIANCE', updatedOn: '2024-11-20', status: 'Active' },
    { id: '6', name: 'Background Check', type: 'DOCUMENT', updatedOn: '2024-10-05' },
    { id: '7', name: 'First Aid Certificate', type: 'COMPLIANCE', updatedOn: '2025-02-10', status: 'Expiring' },
    { id: '8', name: 'Client Care Plan', type: 'DOCUMENT', updatedOn: '2025-03-22' },
    { id: '9', name: 'Medication Log', type: 'DOCUMENT', updatedOn: '2025-05-07' },
  ];

  get filteredDocs(): Document[] {
    const f = this.activeFilter();
    const query = this.searchQuery().trim().toLowerCase();
    return this.allDocs.filter(doc => {
      const matchesFilter = f === 'all' || doc.type === f;
      const matchesQuery = !query || doc.name.toLowerCase().includes(query) || doc.type.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage = 1;
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
    this.complianceType = '';
    this.complianceLicense = '';
    this.complianceOriginDate = '';
    this.complianceExpirationDate = '';
    this.complianceNotes = '';
    this.attachmentUploaded = false;
    this.formSubmitted.set(false);
    this.statusMessage.set('');
    this.addDocActiveTab.set('document');
    this.showAddFlyout = true;
  }

  closeAddFlyout(): void {
    this.showAddFlyout = false;
    this.formSubmitted.set(false);
  }

  openViewFlyout(doc: Document): void {
    this.selectedDoc = doc;
    this.showViewFlyout = true;
  }

  closeViewFlyout(): void {
    this.showViewFlyout = false;
    this.selectedDoc = null;
  }

  markAttachmentUploaded(): void {
    this.attachmentUploaded = true;
    this.statusMessage.set('Attachment ready to save.');
  }

  saveDocument(): void {
    this.formSubmitted.set(true);
    const isCompliance = this.addDocActiveTab() === 'compliance';

    if (!isCompliance && !this.docFileName.trim()) {
      this.statusMessage.set('Enter a file name before saving.');
      return;
    }

    if (isCompliance && (!this.complianceType || !this.complianceOriginDate || !this.complianceExpirationDate)) {
      this.statusMessage.set('Select compliance type, origin date and expiration date before saving.');
      return;
    }

    const today = this.isoToday();
    const nextDocument: Document = isCompliance
      ? {
          id: `compliance-${Date.now()}`,
          name: this.complianceType,
          type: 'COMPLIANCE',
          status: 'Active',
          updatedOn: today,
          notes: this.complianceNotes || this.complianceLicense || 'Compliance record added from caregiver portal.',
        }
      : {
          id: `document-${Date.now()}`,
          name: this.docFileName.trim(),
          type: 'DOCUMENT',
          updatedOn: today,
          notes: this.docNotes || 'Document added from caregiver portal.',
        };

    this.allDocs.unshift(nextDocument);
    this.currentPage = 1;
    this.activeFilter.set('all');
    this.searchQuery.set('');
    this.statusMessage.set(`${nextDocument.name} saved.`);
    this.closeAddFlyout();
  }

  updateSelectedDoc(): void {
    if (!this.selectedDoc) return;
    const updatedDoc = { ...this.selectedDoc, updatedOn: this.isoToday(), notes: this.selectedDoc.notes ?? 'Reviewed in caregiver portal.' };
    const index = this.allDocs.findIndex(doc => doc.id === updatedDoc.id);
    if (index >= 0) {
      this.allDocs[index] = updatedDoc;
      this.selectedDoc = updatedDoc;
      this.statusMessage.set(`${updatedDoc.name} updated.`);
    }
  }

  downloadSelectedDoc(): void {
    if (!this.selectedDoc) return;
    this.statusMessage.set(`${this.selectedDoc.name} download prepared.`);
  }

  typeBadgeClass(type: string): string {
    return 'bg-[var(--cs360-bg-alt)] text-[var(--cs360-text-secondary)] border border-[var(--cs360-border-subtle)] uppercase';
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
  }

  private isoToday(): string {
    return new Date().toISOString().slice(0, 10);
  }

  statusBadgeClass(status?: string): string {
    if (!status) return '';
    if (status === 'Active') return 'bg-[var(--cs360-feedback-success-bg)] text-[var(--cs360-feedback-success)]';
    if (status === 'Expiring') return 'bg-[var(--cs360-feedback-warning-bg)] text-[var(--cs360-feedback-warning)]';
    return 'bg-[var(--cs360-feedback-error-bg)] text-[var(--cs360-feedback-error)]';
  }
}
