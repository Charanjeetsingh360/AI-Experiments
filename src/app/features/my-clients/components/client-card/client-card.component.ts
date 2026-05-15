import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSAvatarComponent } from '../../../../shared/components/cs-avatar/cs-avatar.component';

export interface ClientInfo {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastVisit?: string;
  nextVisit?: string;
}

/**
 * ClientCardComponent — Reusable client card following Figma design
 * This component displays client information in a card format
 * Used within the cs-card-list for the My Clients page
 */
@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule, CSAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="client-card-content flex items-center gap-3">
      <!-- Avatar -->
      <cs-avatar
        [name]="clientName"
        [src]="client.avatar"
        size="lg"
      ></cs-avatar>

      <!-- Client Info -->
      <div class="flex-1 min-w-0">
        <!-- Name and Status -->
        <div class="flex items-center gap-2 mb-1">
          <h3 class="text-sm font-semibold text-[var(--cs360-text-primary)] truncate">
            {{ clientName }}
          </h3>
          <span 
            class="status-badge shrink-0 px-2 py-0.5 text-xs font-medium rounded-full"
            [class]="statusClasses"
          >
            {{ client.status }}
          </span>
        </div>

        <!-- Phone -->
        <div class="flex items-center gap-1.5 text-xs text-[var(--cs360-text-secondary)] mb-1">
          <svg class="w-3.5 h-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clip-rule="evenodd"/>
          </svg>
          <span class="truncate">{{ client.phoneNumber }}</span>
        </div>

        <!-- Address -->
        <div class="flex items-center gap-1.5 text-xs text-[var(--cs360-text-tertiary)]">
          <svg class="w-3.5 h-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/>
          </svg>
          <span class="truncate">{{ clientAddress }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .client-card-content {
      width: 100%;
    }
  `],
})
export class ClientCardComponent {
  @Input({ required: true }) client!: ClientInfo;

  get clientName(): string {
    return `${this.client.firstName} ${this.client.lastName}`;
  }

  get clientAddress(): string {
    return `${this.client.address}, ${this.client.city}, ${this.client.state}`;
  }

  get statusClasses(): string {
    switch (this.client.status) {
      case 'Active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactive':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
