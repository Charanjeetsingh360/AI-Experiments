import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';
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
 * ClientCardComponent — Figma client card layout.
 * Circular avatar · name (LastName, FirstName) · address · chevron
 */
@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule, CSIconComponent, CSAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-[var(--density-space-3)] w-full min-w-0">

      <!-- Circular avatar -->
      <cs-avatar
        [name]="clientName"
        [src]="client.avatar"
        size="lg"
        class="shrink-0"
      />

      <!-- Name + address -->
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-[length:var(--density-text-body)]
                   text-[var(--cs360-text-primary)] truncate leading-snug">
          {{ clientName }}
        </h3>
        <p class="text-[length:var(--density-text-body-muted)]
                  text-[var(--cs360-text-secondary)] truncate mt-0.5">
          {{ clientAddress }}
        </p>
      </div>

      <!-- Chevron -->
      <cs-icon name="chevron_right" [size]="20"
               class="shrink-0 text-[var(--cs360-text-tertiary)]" />
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class ClientCardComponent {
  @Input({ required: true }) client!: ClientInfo;
  @Input() index = 0;

  get clientName(): string {
    return `${this.client.lastName}, ${this.client.firstName}`;
  }

  get clientAddress(): string {
    return `${this.client.address}, ${this.client.city}, ${this.client.state}`;
  }
}

