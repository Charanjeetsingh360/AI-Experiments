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
          <div class="flex items-center" style="gap: 8px;">
            <div class="flex flex-1 items-center rounded-[8px] px-3"
                 style="height: 40px; border: 1px solid #e0e2e8; gap: 6px;">
              <cs-icon name="search" [size]="16" style="color: #96a6b8; flex-shrink: 0;" />
              <input
                type="text"
                placeholder="Search forms..."
                class="flex-1 border-none outline-none bg-transparent"
                style="font-size: 13px; color: #334a65;"
                [ngModel]="searchText()"
                (ngModelChange)="searchText.set($event)"
              />
            </div>
            <!-- 34×34 calendar icon button -->
            <button type="button"
              class="flex items-center justify-center rounded-[8px] border-none cursor-pointer
                     transition-colors hover:bg-[rgba(51,74,101,0.08)]"
              style="width: 34px; height: 34px; background: #f4f6f8; flex-shrink: 0;"
              aria-label="Pick date range">
              <cs-icon name="calendar_today" [size]="16" style="color: #334a65;" />
            </button>
          </div>

          <!-- Forms list -->
          @for (form of filteredForms(); track form.id) {
            <button
              type="button"
              class="flex items-center rounded-[10px] text-left w-full
                     cursor-pointer transition-colors duration-150 hover:bg-[#f8fbff]"
              style="background: #fff; border: 1px solid #e2e8f0; padding: 14px 16px; gap: 10px;"
              (click)="openFormDetail(form)"
            >
              <div class="flex flex-col flex-1 min-w-0" style="gap: 4px;">
                <span class="truncate block"
                      style="font-size: 16px; font-weight: 600; color: #1a2332; line-height: 1.3;">
                  {{ form.name }}
                </span>
                <span style="font-size: 13px; color: #788899; line-height: 1.4;">
                  Completed by {{ form.modifier }} at {{ form.modifiedOn }}
                </span>
              </div>
              <cs-icon name="chevron_right" [size]="18" class="shrink-0" style="color: #96a6b8;" />
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
