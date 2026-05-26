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

export interface ClientContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-client-contacts-flyout',
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
          Client Contacts
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
        <div class="flex flex-col gap-4 py-2">

          @for (contact of contacts; track contact.id) {
            <div class="flex flex-col overflow-hidden rounded-[10px]
                        bg-[var(--cs360-bg-surface)] border border-[var(--cs360-border-subtle)]">

              <!-- Avatar + Name + Relationship row -->
              <div class="flex items-center gap-[var(--density-space-3)] px-[14px] pt-[14px] pb-[var(--density-space-3)]">
                <!-- Avatar circle -->
                <div class="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full
                            bg-[var(--cs360-action-primary-subtle)]
                            text-base font-semibold text-[var(--cs360-action-primary)]">
                  {{ getInitials(contact.name) }}
                </div>
                <div class="flex flex-col gap-[2px]">
                  <span class="text-base font-semibold leading-[1.3] text-[var(--cs360-text-primary)]">
                    {{ contact.name }}
                  </span>
                  <span class="text-[13px] leading-[1.4] text-[var(--cs360-text-helper)]">
                    {{ contact.relationship }}
                  </span>
                </div>
              </div>

              <!-- Divider -->
              <hr class="m-0 border-0 border-t border-[var(--cs360-border-subtle)]" />

              <!-- Contact rows with dividers -->
              @if (contact.phone) {
                <div class="flex items-center gap-[var(--density-space-3)] px-[14px] py-[11px]">
                  <cs-icon name="call" [size]="18" class="shrink-0 text-[var(--cs360-text-helper)]" />
                  <span class="text-sm leading-[1.4] text-[var(--cs360-text-link)]">{{ contact.phone }}</span>
                </div>
                @if (contact.email || contact.address) {
                  <hr class="m-0 border-0 border-t border-[var(--cs360-border-subtle)]" />
                }
              }

              @if (contact.email) {
                <div class="flex items-center gap-[var(--density-space-3)] px-[14px] py-[11px]">
                  <cs-icon name="alternate_email" [size]="18" class="shrink-0 text-[var(--cs360-text-helper)]" />
                  <span class="break-all text-sm leading-[1.4] text-[var(--cs360-text-link)]">{{ contact.email }}</span>
                </div>
                @if (contact.address) {
                  <hr class="m-0 border-0 border-t border-[var(--cs360-border-subtle)]" />
                }
              }

              @if (contact.address) {
                <div class="flex items-center gap-[var(--density-space-3)] px-[14px] py-[11px]">
                  <cs-icon name="home" [size]="18" class="shrink-0 text-[var(--cs360-text-helper)]" />
                  <span class="text-sm leading-[1.4] text-[var(--cs360-text-link)]">{{ contact.address }}</span>
                </div>
              }
            </div>
          }

          @if (contacts.length === 0) {
            <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6 m-0">
              No contacts available
            </p>
          }
        </div>
      </div>
    </cs-flyout>
  `,
  styles: [`:host { display: contents; }`],
})
export class ClientContactsFlyoutComponent {
  @Input() isOpen = false;
  @Input() contacts: ClientContact[] = [];

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.isOpenChange.emit(false);
    this.closed.emit();
  }

  getInitials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }
}
