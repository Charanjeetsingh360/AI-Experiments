import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';

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

/** Gradient palette cycles deterministically per card index */
const GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-orange-400 to-orange-600',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
  'from-pink-400 to-pink-600',
];

/**
 * ClientCardComponent — matches the HTML prototype exactly.
 * Square gradient avatar · name · address · chevron
 */
@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between gap-2 w-full">
      <!-- Square gradient avatar -->
      <div class="flex items-start gap-2 min-w-0">
        <div
          class="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-sm font-medium"
          [ngClass]="gradient"
        >
          {{ initials }}
        </div>

        <!-- Name + address -->
        <div class="min-w-0">
          <h3 class="text-base font-medium text-[var(--cs360-text-primary)] leading-6 tracking-tight truncate">
            {{ clientName }}
          </h3>
          <p class="text-sm text-[var(--cs360-text-secondary)] leading-5 truncate">
            {{ clientAddress }}
          </p>
        </div>
      </div>

      <!-- Chevron -->
      <cs-icon name="chevron_right" [size]="20" class="shrink-0 text-[var(--cs360-text-tertiary)]" />
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class ClientCardComponent {
  @Input({ required: true }) client!: ClientInfo;
  @Input() index = 0;

  get initials(): string {
    return `${this.client.firstName[0] ?? ''}${this.client.lastName[0] ?? ''}`.toUpperCase();
  }

  get clientName(): string {
    return `${this.client.lastName}, ${this.client.firstName}`;
  }

  get clientAddress(): string {
    return `${this.client.address}, ${this.client.city}, ${this.client.state}`;
  }

  get gradient(): string {
    return GRADIENTS[this.index % GRADIENTS.length];
  }
}

