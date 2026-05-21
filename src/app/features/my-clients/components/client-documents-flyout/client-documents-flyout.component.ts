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

export interface DocumentItem {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'COMPLIANCE';
  updatedOn: string;
  fileName?: string;
  notes?: string;
  fileFormat?: string;
}

/**
 * ClientDocumentsFlyoutComponent — Lists client documents as clickable cards.
 * Each card shows document name, type badge, and updated date.
 */
@Component({
  selector: 'app-client-documents-flyout',
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
          Client Documents
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
          @for (doc of documents; track doc.id) {
            <button
              type="button"
              class="flex items-center gap-3 p-4 rounded-lg border border-[var(--cs360-border-subtle)]
                     bg-[var(--cs360-bg-surface)] cursor-pointer text-left w-full
                     transition-colors duration-150 hover:bg-[var(--cs360-bg-alt)]"
              (click)="openDocument(doc)"
            >
              <div class="flex flex-col gap-2 flex-1 min-w-0">
                <span class="font-medium text-[var(--cs360-text-primary)] text-sm truncate w-full">
                  {{ doc.name }}
                </span>
                <span class="inline-block w-fit py-[2px] px-2 text-xs font-medium rounded
                             bg-[var(--cs360-bg-alt)] text-[var(--cs360-text-primary)]
                             border border-[var(--cs360-border-subtle)] uppercase tracking-wider">
                  {{ doc.type }}
                </span>
                <span class="text-xs text-[var(--cs360-text-secondary)]">
                  Updated on {{ doc.updatedOn || '--' }}
                </span>
              </div>
              <!-- Chevron -->
              <cs-icon name="chevron_right" [size]="16" class="shrink-0 text-[var(--cs360-text-tertiary)]" />
            </button>
          }

          @if (documents.length === 0) {
            <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6">
              No documents available
            </p>
          }
        </div>
      </div>
    </cs-flyout>

    <!-- Document Viewer Sub-Flyout -->
    @if (showViewer()) {
      <cs-flyout
        [isOpen]="showViewer()"
        (isOpenChange)="closeViewer()"
        position="right"
        width="500px"
        [zIndex]="1019"
      >
        <div flyout-header class="flex items-center justify-center w-full">
          <h2 class="flex-1 text-center text-base font-semibold text-[var(--cs360-text-primary)]">
            {{ selectedDoc()?.name || 'Document' }}
          </h2>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full
                   text-[var(--cs360-text-tertiary)] transition-colors
                   hover:bg-[var(--cs360-bg-alt)] border-none bg-transparent cursor-pointer"
            aria-label="Close"
            (click)="closeViewer()"
          >
            <cs-icon name="close" [size]="20" />
          </button>
        </div>
        <div flyout-body class="h-full flex items-center justify-center">
          <div class="text-center">
            <cs-icon name="description" [size]="48" class="text-[var(--cs360-text-tertiary)]" />
            <p class="text-sm text-[var(--cs360-text-secondary)] mt-2">
              Document preview for "{{ selectedDoc()?.name }}"
            </p>
            <p class="text-xs text-[var(--cs360-text-tertiary)]">
              Format: {{ selectedDoc()?.fileFormat || 'Unknown' }}
            </p>
          </div>
        </div>
        <div flyout-footer class="flex items-center justify-end gap-2">
          <button type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg
                   border border-[var(--cs360-border-subtle)] bg-transparent
                   text-[var(--cs360-text-primary)] cursor-pointer
                   hover:bg-[var(--cs360-bg-alt)] transition-colors"
            (click)="closeViewer()">
            Cancel
          </button>
          <button type="button"
            class="px-4 py-2 text-sm font-medium rounded-lg border-none
                   bg-[var(--cs360-action-primary)] text-white cursor-pointer
                   hover:opacity-90 transition-opacity">
            Download
          </button>
        </div>
      </cs-flyout>
    }
  `,
  styles: [`:host { display: contents; }`],
})
export class ClientDocumentsFlyoutComponent {
  @Input() isOpen = false;
  @Input() documents: DocumentItem[] = [];

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  showViewer = signal(false);
  selectedDoc = signal<DocumentItem | null>(null);

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  openDocument(doc: DocumentItem): void {
    this.selectedDoc.set(doc);
    this.showViewer.set(true);
  }

  closeViewer(): void {
    this.showViewer.set(false);
    this.selectedDoc.set(null);
  }
}
