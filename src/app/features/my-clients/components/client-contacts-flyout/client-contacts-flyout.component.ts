import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSFlyoutComponent } from '../../../../shared/components/cs-flyout/cs-flyout.component';
import { CSAvatarComponent } from '../../../../shared/components/cs-avatar/cs-avatar.component';
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

/**
 * ClientContactsFlyoutComponent — Displays client emergency/regular contacts.
 * Card-based layout with avatar, name, relationship, and contact info.
 */
@Component({
  selector: 'app-client-contacts-flyout',
  standalone: true,
  imports: [CommonModule, CSFlyoutComponent, CSAvatarComponent, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <cs-flyout
      [isOpen]="isOpen"
      (isOpenChange)="isOpenChange.emit($event)"
      position="center"
      width="min(640px, 90vw)"
      [zIndex]="1009"
    >
      <!-- Header: title left-aligned + close right per Figma Popover Header 2025 -->
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
      <div flyout-body class="h-full overflow-y-auto">
        <div class="flex flex-col gap-4 px-2 py-2">
          @for (contact of contacts; track contact.id) {
            <div class="flex flex-col gap-3 p-4 rounded-lg border border-[var(--cs360-border-subtle)] bg-[var(--cs360-bg-surface)]">
              <!-- Contact header: avatar + name + relationship -->
              <div class="flex items-center gap-3">
                <cs-avatar
                  [src]="contact.avatarUrl || ''"
                  [name]="contact.name"
                  size="md"
                />
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-[var(--cs360-text-primary)]">{{ contact.name }}</span>
                  <span class="text-xs text-[var(--cs360-text-secondary)]">{{ contact.relationship }}</span>
                </div>
              </div>

              <!-- Contact details -->
              <div class="flex flex-col gap-2 pl-[52px]">
                @if (contact.phone) {
                  <a class="text-sm text-[var(--cs360-action-primary)] no-underline hover:underline"
                     [href]="'tel:' + contact.phone">
                    {{ contact.phone }}
                  </a>
                }
                @if (contact.email) {
                  <a class="text-sm text-[var(--cs360-action-primary)] no-underline hover:underline"
                     [href]="'mailto:' + contact.email">
                    {{ contact.email }}
                  </a>
                }
                @if (contact.address) {
                  <span class="text-sm text-[var(--cs360-text-secondary)]">{{ contact.address }}</span>
                }
              </div>
            </div>
          }

          @if (contacts.length === 0) {
            <p class="text-sm text-[var(--cs360-text-secondary)] text-center py-6">
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
}
