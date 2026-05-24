import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../../../../shared/components/cs-icon/cs-icon.component';
import { CSAvatarComponent } from '../../../../shared/components/cs-avatar/cs-avatar.component';
import type { IClient } from '../../models/client.model';

export type { IClient as ClientInfo };

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
    <!--
      Figma: "Client card" — HORIZONTAL layout
        primaryAxisSizingMode = FIXED (fills parent width)
        counterAxisSizingMode = HUG  (height hugs content)
        counterAxisAlignItems = MIN  → items-start (top-aligned)
        itemSpacing = 8px            → gap-[var(--cs360-space-2)]
        padding = 12px all sides     → handled by card wrapper in cs-card-list
    -->
    <div class="flex items-start gap-[var(--cs360-space-2)] w-full">

      <!-- [Figma layer: "Avatar"] FIXED 40×40, circular -->
      <cs-avatar
        [name]="clientName"
        [src]="client.avatar_url"
        size="md"
        class="shrink-0"
      />

      <!-- [Figma layer: "info"] VERTICAL layout, sizH=FILL, sizV=HUG, gap=8px -->
      <div class="flex-1 min-w-0 flex flex-col gap-[var(--cs360-space-2)]">
        <!-- Name: fs=16, fw=500, lh=24, color=#0f172a → text-primary, sizH=HUG -->
        <span class="font-medium text-[length:var(--density-text-body)]
                     text-[var(--cs360-text-primary)] leading-[24px] truncate">
          {{ clientName }}
        </span>
        <!-- Address: fs=14, fw=400, lh=20, color=#0f172a → text-primary, sizH=FILL, 2 lines -->
        <span class="text-[length:var(--density-text-body-muted)] font-normal leading-[20px]
                     text-[var(--cs360-text-primary)] line-clamp-2">
          {{ clientAddress }}
        </span>
      </div>

      <!-- [Figma layer: "Header Icons"] FIXED 20×20, chevron_forward, color=#94a3b8 → text-tertiary -->
      <cs-icon name="chevron_forward" [size]="20"
               class="shrink-0 text-[var(--cs360-text-tertiary)]" />
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class ClientCardComponent {
  @Input({ required: true }) client!: IClient;
  @Input() index = 0;

  get clientName(): string {
    return this.client.full_name;
  }

  get clientAddress(): string {
    const { street, city, state } = this.client.address;
    return `${street}, ${city}, ${state}`;
  }
}

