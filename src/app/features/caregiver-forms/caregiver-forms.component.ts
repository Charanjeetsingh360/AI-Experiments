import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

type FormStatus = 'IN PROGRESS' | 'AWAITING APPROVAL' | 'COMPLETED';

interface CaregiverForm {
  id: string;
  title: string;
  category: string;
  status: FormStatus;
  modifiedOn: string;
  modifiedBy: string;
  dueDate: string;
  sections: number;
  completedSections: number;
}

@Component({
  selector: 'app-caregiver-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, CSFlyoutComponent, CSIconComponent, CsPageHeaderComponent],
  templateUrl: './caregiver-forms.component.html',
  styleUrl: './caregiver-forms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaregiverFormsComponent {
  readonly statuses: Array<FormStatus | 'All'> = ['All', 'IN PROGRESS', 'AWAITING APPROVAL', 'COMPLETED'];
  readonly searchQuery = signal('');
  readonly selectedStatus = signal<FormStatus | 'All'>('All');
  readonly appliedSearch = signal('');
  readonly appliedStatus = signal<FormStatus | 'All'>('All');
  readonly showAddFlyout = signal(false);
  readonly showReviewFlyout = signal(false);
  readonly selectedForm = signal<CaregiverForm | null>(null);

  readonly newFormTitle = signal('');
  readonly newFormCategory = signal('Daily Visit Note');

  private readonly forms = signal<CaregiverForm[]>([
    {
      id: 'form-1',
      title: 'Daily Visit Note',
      category: 'Care Documentation',
      status: 'IN PROGRESS',
      modifiedOn: '11/24/2025 10:30 PM AST',
      modifiedBy: 'John',
      dueDate: '11/26/2025',
      sections: 5,
      completedSections: 3,
    },
    {
      id: 'form-2',
      title: 'Client Signature Form',
      category: 'Shift Completion',
      status: 'AWAITING APPROVAL',
      modifiedOn: '11/23/2025 08:15 PM AST',
      modifiedBy: 'Rosa',
      dueDate: '11/27/2025',
      sections: 4,
      completedSections: 4,
    },
    {
      id: 'form-3',
      title: 'Medication Reminder Log',
      category: 'Clinical Tasks',
      status: 'COMPLETED',
      modifiedOn: '11/22/2025 09:45 AM AST',
      modifiedBy: 'John',
      dueDate: '11/22/2025',
      sections: 6,
      completedSections: 6,
    },
    {
      id: 'form-4',
      title: 'Incident Report',
      category: 'Safety',
      status: 'IN PROGRESS',
      modifiedOn: '11/20/2025 02:12 PM AST',
      modifiedBy: 'Angela',
      dueDate: '11/28/2025',
      sections: 7,
      completedSections: 2,
    },
    {
      id: 'form-5',
      title: 'Care Plan Acknowledgement',
      category: 'Care Plan',
      status: 'AWAITING APPROVAL',
      modifiedOn: '11/19/2025 04:40 PM AST',
      modifiedBy: 'Vivek',
      dueDate: '11/29/2025',
      sections: 3,
      completedSections: 3,
    },
    {
      id: 'form-6',
      title: 'Weekly Care Summary',
      category: 'Care Documentation',
      status: 'COMPLETED',
      modifiedOn: '11/18/2025 06:05 PM AST',
      modifiedBy: 'John',
      dueDate: '11/18/2025',
      sections: 5,
      completedSections: 5,
    },
  ]);

  readonly filteredForms = computed(() => {
    const query = this.appliedSearch().trim().toLowerCase();
    const status = this.appliedStatus();
    return this.forms().filter(form => {
      const matchesStatus = status === 'All' || form.status === status;
      const matchesQuery = !query ||
        form.title.toLowerCase().includes(query) ||
        form.category.toLowerCase().includes(query) ||
        form.modifiedBy.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  });

  readonly totalForms = computed(() => this.filteredForms().length);

  applyFilters(): void {
    this.appliedSearch.set(this.searchQuery());
    this.appliedStatus.set(this.selectedStatus());
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedStatus.set('All');
    this.appliedSearch.set('');
    this.appliedStatus.set('All');
  }

  openAddForm(): void {
    this.newFormTitle.set('');
    this.newFormCategory.set('Daily Visit Note');
    this.showAddFlyout.set(true);
  }

  closeAddForm(): void {
    this.showAddFlyout.set(false);
  }

  createForm(): void {
    const title = this.newFormTitle().trim() || this.newFormCategory();
    this.forms.update(forms => [
      {
        id: `form-${Date.now()}`,
        title,
        category: this.newFormCategory(),
        status: 'IN PROGRESS',
        modifiedOn: 'Now',
        modifiedBy: 'Current caregiver',
        dueDate: '11/30/2025',
        sections: 5,
        completedSections: 1,
      },
      ...forms,
    ]);
    this.closeAddForm();
  }

  openForm(form: CaregiverForm): void {
    this.selectedForm.set(form);
    this.showReviewFlyout.set(true);
  }

  closeReview(): void {
    this.showReviewFlyout.set(false);
    this.selectedForm.set(null);
  }

  submitSelectedForm(): void {
    const current = this.selectedForm();
    if (!current) return;
    this.forms.update(forms =>
      forms.map(form => form.id === current.id
        ? { ...form, status: 'AWAITING APPROVAL', completedSections: form.sections, modifiedOn: 'Now' }
        : form)
    );
    this.selectedForm.set({ ...current, status: 'AWAITING APPROVAL', completedSections: current.sections, modifiedOn: 'Now' });
  }

  statusClass(status: FormStatus): string {
    const classes: Record<FormStatus, string> = {
      'IN PROGRESS': 'caregiver-forms__status--progress',
      'AWAITING APPROVAL': 'caregiver-forms__status--approval',
      COMPLETED: 'caregiver-forms__status--completed',
    };
    return classes[status];
  }

  progressText(form: CaregiverForm): string {
    return `${form.completedSections}/${form.sections} sections`;
  }
}
