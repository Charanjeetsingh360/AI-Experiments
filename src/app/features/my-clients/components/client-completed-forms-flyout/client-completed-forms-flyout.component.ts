import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CSFlyoutComponent } from '../../../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';

export interface ClientFormItem {
  id: number;
  name: string;
  formStatus: string;
  modifiedOn: string;
  modifier: string;
}

/**
 * ClientCompletedFormsFlyoutComponent — Lists completed client forms
 * with search and date range filtering.
 */
@Component({
  selector: 'app-client-completed-forms-flyout',
  standalone: true,
  imports: [CommonModule, FormsModule, CSFlyoutComponent, CSIconComponent],
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
          Client Completed Forms
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
      <div flyout-body class="h-full overflow-y-auto">
        <div class="flex flex-col gap-3 px-2 py-2">

          <!-- Search bar -->
          <div class="flex items-center gap-3 p-3 rounded-lg border border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-surface)]">
            <cs-icon name="search" [size]="18" class="text-[var(--cs360-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search forms..."
              class="flex-1 border-none outline-none bg-transparent text-sm text-[var(--cs360-text-primary)]
                     placeholder:text-[var(--cs360-text-tertiary)]"
              [ngModel]="searchText()"
              (ngModelChange)="searchText.set($event)"
            />
          </div>

          <!-- Date range -->
          <div class="flex items-center gap-3">
            <input
              type="date"
              class="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--cs360-border-subtle)]
                     bg-[var(--cs360-bg-surface)] text-[var(--cs360-text-primary)]"
              [ngModel]="startDate()"
              (ngModelChange)="startDate.set($event)"
            />
            <span class="text-xs text-[var(--cs360-text-tertiary)]">to</span>
            <input
              type="date"
              class="flex-1 px-3 py-2 text-sm rounded-lg border border-[var(--cs360-border-subtle)]
                     bg-[var(--cs360-bg-surface)] text-[var(--cs360-text-primary)]"
              [ngModel]="endDate()"
              (ngModelChange)="endDate.set($event)"
            />
          </div>

          <!-- Forms list -->
          @for (form of filteredForms(); track form.id) {
            <button
              type="button"
              class="flex items-center gap-3 p-4 rounded-lg border border-[var(--cs360-border-subtle)]
                     bg-[var(--cs360-bg-surface)] cursor-pointer text-left w-full
                     transition-colors duration-150 hover:bg-[var(--cs360-bg-alt)]"
              (click)="openFormDetail(form)"
            >
              <div class="flex flex-col gap-2 flex-1 min-w-0">
                <span class="font-medium text-[var(--cs360-text-primary)] text-sm truncate w-full">
                  {{ form.name }}
                </span>
                <span class="text-xs text-[var(--cs360-text-secondary)]">
                  Completed by {{ form.modifier }} on {{ form.modifiedOn }}
                </span>
              </div>
              <cs-icon name="chevron_right" [size]="16" class="shrink-0 text-[var(--cs360-text-tertiary)]" />
            </button>
          }

          @if (filteredForms().length === 0) {
            <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6">
              No completed forms found
            </p>
          }
        </div>
      </div>
    </cs-flyout>

    <!-- Form Detail Sub-Flyout -->
    @if (showFormDetail()) {
      <cs-flyout
        [isOpen]="showFormDetail()"
        (isOpenChange)="closeFormDetail()"
        position="right"
        width="500px"
        [zIndex]="1019"
      >
        <div flyout-header class="flex items-center justify-center w-full">
          <h2 class="flex-1 text-center text-base font-semibold text-[var(--cs360-text-primary)]">
            {{ selectedForm()?.name || 'Form Detail' }}
          </h2>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full
                   text-[var(--cs360-text-tertiary)] transition-colors
                   hover:bg-[var(--cs360-bg-alt)] border-none bg-transparent cursor-pointer"
            aria-label="Close"
            (click)="closeFormDetail()"
          >
            <cs-icon name="close" [size]="20" />
          </button>
        </div>
        <div flyout-body class="h-full flex items-center justify-center">
          <div class="text-center">
            <cs-icon name="assignment_turned_in" [size]="48" class="text-[var(--cs360-text-tertiary)]" />
            <p class="text-sm text-[var(--cs360-text-secondary)] mt-2">
              Form details — Under development
            </p>
          </div>
        </div>
      </cs-flyout>
    }
  `,
  styles: [`:host { display: contents; }`],
})
export class ClientCompletedFormsFlyoutComponent {
  @Input() isOpen = false;
  @Input() clientId = '';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  searchText = signal('');
  startDate = signal('');
  endDate = signal('');
  showFormDetail = signal(false);
  selectedForm = signal<ClientFormItem | null>(null);

  // Mock forms data
  private readonly allForms: ClientFormItem[] = [
    { id: 1, name: 'Daily Activity Report', formStatus: 'Completed', modifiedOn: '01/15/2024', modifier: 'Jane Doe' },
    { id: 2, name: 'Medication Administration Record', formStatus: 'Completed', modifiedOn: '01/14/2024', modifier: 'Jane Doe' },
    { id: 3, name: 'Incident Report', formStatus: 'Completed', modifiedOn: '01/10/2024', modifier: 'John Smith' },
    { id: 4, name: 'Client Progress Notes', formStatus: 'Completed', modifiedOn: '01/08/2024', modifier: 'Jane Doe' },
    { id: 5, name: 'Vital Signs Log', formStatus: 'Completed', modifiedOn: '01/05/2024', modifier: 'Mary Johnson' },
  ];

  filteredForms = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    if (!query) return this.allForms;
    return this.allForms.filter(f =>
      f.name.toLowerCase().includes(query) || f.modifier.toLowerCase().includes(query)
    );
  });

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  openFormDetail(form: ClientFormItem): void {
    this.selectedForm.set(form);
    this.showFormDetail.set(true);
  }

  closeFormDetail(): void {
    this.showFormDetail.set(false);
    this.selectedForm.set(null);
  }
}
