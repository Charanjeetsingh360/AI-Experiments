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
            <div class="flex flex-col rounded-[10px] overflow-hidden"
                 style="background: #fff; border: 1px solid #d6d6d6;">

              <!-- Avatar + Name + Relationship row -->
              <div class="flex items-center" style="padding: 14px 14px 12px; gap: 12px;">
                <!-- Avatar circle -->
                <div class="flex items-center justify-center rounded-full shrink-0"
                     style="width: 44px; height: 44px; background: #e8f0fe; font-size: 16px; font-weight: 600; color: #0077ff;">
                  {{ getInitials(contact.name) }}
                </div>
                <div class="flex flex-col" style="gap: 2px;">
                  <span style="font-size: 16px; font-weight: 600; color: #1a2332; line-height: 1.3;">
                    {{ contact.name }}
                  </span>
                  <span style="font-size: 13px; color: #788899; line-height: 1.4;">
                    {{ contact.relationship }}
                  </span>
                </div>
              </div>

              <!-- Divider -->
              <hr style="margin: 0; border: none; border-top: 1px solid #d6d6d6;" />

              <!-- Contact rows with dividers -->
              @if (contact.phone) {
                <div class="flex items-center" style="padding: 11px 14px; gap: 12px;">
                  <cs-icon name="call" [size]="18" style="color: #788899; flex-shrink: 0;" />
                  <span style="font-size: 14px; color: #0077ff; line-height: 1.4;">{{ contact.phone }}</span>
                </div>
                @if (contact.email || contact.address) {
                  <hr style="margin: 0; border: none; border-top: 1px solid #d6d6d6;" />
                }
              }

              @if (contact.email) {
                <div class="flex items-center" style="padding: 11px 14px; gap: 12px;">
                  <cs-icon name="alternate_email" [size]="18" style="color: #788899; flex-shrink: 0;" />
                  <span style="font-size: 14px; color: #0077ff; line-height: 1.4; word-break: break-all;">{{ contact.email }}</span>
                </div>
                @if (contact.address) {
                  <hr style="margin: 0; border: none; border-top: 1px solid #d6d6d6;" />
                }
              }

              @if (contact.address) {
                <div class="flex items-center" style="padding: 11px 14px; gap: 12px;">
                  <cs-icon name="home" [size]="18" style="color: #788899; flex-shrink: 0;" />
                  <span style="font-size: 14px; color: #0077ff; line-height: 1.4;">{{ contact.address }}</span>
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
