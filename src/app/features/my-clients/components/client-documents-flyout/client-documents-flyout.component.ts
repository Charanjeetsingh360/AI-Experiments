import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSFlyoutComponent } from '../../../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';

export interface DocumentItem {
  id: string;
  name: string;
  description?: string;
  type?: 'DOCUMENT' | 'COMPLIANCE';
  updatedOn?: string;
  fileFormat?: string;
}

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
      width="500px"
      [zIndex]="1009"
      headerPaddingClass="px-3 pt-3 pb-4"
      bodyPadding="none"
    >
      <div flyout-header class="flex items-center justify-between w-full">
        <h2 class="text-[20px] font-medium leading-[24px] tracking-[-0.24px] text-[var(--cs360-text-primary)] m-0">
          Client Document
        </h2>
        <button
          type="button"
          class="flex items-center justify-end h-[28px] w-[44px] p-[10px] rounded-[8px]
                 border-none bg-transparent cursor-pointer text-[var(--cs360-text-primary)]
                 hover:bg-[var(--cs360-bg-alt)] transition-colors"
          aria-label="Close"
          (click)="onClose()"
        >
          <cs-icon name="close" [size]="10" />
        </button>
      </div>

      <div flyout-body class="flex flex-col gap-[8px] p-[12px]">
        @for (doc of documents; track doc.id) {
          <button
            type="button"
             class="flex flex-col gap-[8px] items-start p-[12px] rounded-[8px] w-full
                    bg-[var(--cs360-bg-surface)] border border-[var(--cs360-border-subtle)] cursor-pointer text-left
                    hover:bg-[var(--cs360-bg-alt)] transition-colors"
          >
            <div class="flex gap-[10px] items-start w-full min-h-[20px]">
              <span class="flex-1 min-w-0 break-words text-[16px] font-medium leading-[1.2] tracking-[-0.24px] text-[var(--cs360-text-primary)]">
                {{ doc.name }}
              </span>
              <cs-icon name="chevron_forward" [size]="24" class="shrink-0 text-[var(--cs360-text-primary)]" />
            </div>
            @if (doc.description) {
              <p class="m-0 w-full text-[12px] font-normal leading-[1.4] text-[var(--cs360-text-secondary)]">
                {{ doc.description }}
              </p>
            }
          </button>
        } @empty {
          <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6">No documents found.</p>
        }
      </div>
    </cs-flyout>
  `,
  styles: [`:host { display: contents; }`],
})
export class ClientDocumentsFlyoutComponent {
  @Input() isOpen = false;
  @Input() documents: DocumentItem[] = [
    { id: '1', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '2', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '3', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '4', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: '5', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
  ];

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }
}
