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
      <div flyout-body>
        <div class="flex flex-col gap-3 py-2">

          <!-- Search row: full-width input + separate calendar button -->
          <div class="flex items-center gap-[var(--density-space-2)]">
            <div class="flex h-[40px] flex-1 items-center gap-[6px] rounded-[8px] border
                        border-[var(--cs360-border-subtle)] px-[var(--density-space-3)]">
              <cs-icon name="search" [size]="16" class="shrink-0 text-[var(--cs360-text-tertiary)]" />
              <input
                type="text"
                placeholder="Search forms..."
                class="flex-1 border-none bg-transparent text-[13px] text-[var(--cs360-text-secondary-alt)] outline-none"
                [ngModel]="searchText()"
                (ngModelChange)="searchText.set($event)"
              />
            </div>
            <!-- 34×34 calendar icon button -->
            <button type="button"
              class="flex h-[34px] w-[34px] shrink-0 cursor-pointer items-center justify-center rounded-[8px]
                     border-none bg-[var(--cs360-bg-alt)] transition-colors hover:bg-[var(--cs360-bg-surface-hover)]"
              aria-label="Pick date range">
              <cs-icon name="calendar_today" [size]="16" class="text-[var(--cs360-text-secondary-alt)]" />
            </button>
          </div>

          <!-- Forms list -->
          @for (form of filteredForms(); track form.id) {
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] border
                     border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-surface)]
                     px-[var(--density-space-4)] py-[14px] text-left transition-colors duration-150
                     hover:bg-[var(--cs360-bg-surface-active)]"
              (click)="openFormDetail(form)"
            >
              <div class="flex flex-1 min-w-0 flex-col gap-[var(--density-space-1)]">
                <span class="block truncate text-base font-semibold leading-[1.3] text-[var(--cs360-text-primary)]">
                  {{ form.name }}
                </span>
                <span class="text-[13px] leading-[1.4] text-[var(--cs360-text-helper)]">
                  Completed by {{ form.modifier }} at {{ form.modifiedOn }}
                </span>
              </div>
              <cs-icon name="chevron_right" [size]="18" class="shrink-0 text-[var(--cs360-text-tertiary)]" />
            </button>
          }

          @if (filteredForms().length === 0) {
            <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6 m-0">
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
  showFormDetail = signal(false);
  selectedForm = signal<ClientFormItem | null>(null);

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
