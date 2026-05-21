import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

export type AvailabilityCardType = 'availability' | 'unavailability';

export interface AvailabilityCardItem {
  id: string;
  type: AvailabilityCardType;
  title: string;
  repeatInfo?: string;
  healthReason?: string;
  /** Displayed as 2-line clamped text. Availability: fs=13; Unavailability: fs=14. */
  description?: string;
}

/**
 * CSAvailabilityCardComponent — Figma Availability/Unavailability card layout.
 * Structure (Figma): head → healthReason (unavailability only) → repeatInfo → description (2-line clamp)
 * No tag pill — the tag is not shown on the list-view cards.
 */
@Component({
  selector: 'cs-availability-card',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-2">
      <!-- Head: title + chevron -->
      <div class="flex items-center gap-2">
        <p class="flex-1 min-w-0 text-base font-medium leading-6
                  text-[var(--cs360-text-primary)] truncate">
          {{ item.title }}
        </p>
        <cs-icon name="chevron_forward" [size]="20"
          class="shrink-0 text-[var(--cs360-neutral-400)]" />
      </div>

      <!-- Health Reason (Unavailability only) — fs=14 fw=400 lh=20 -->
      @if (item.healthReason) {
        <p class="text-sm font-normal leading-5 text-[var(--cs360-text-primary)]">
          Health Reason : {{ item.healthReason }}
        </p>
      }

      <!-- Repeat info — fs=14 fw=400 lh=20 -->
      @if (item.repeatInfo) {
        <p class="text-sm font-normal leading-5 text-[var(--cs360-text-primary)]">
          {{ item.repeatInfo }}
        </p>
      }

      <!-- Description: Availability fs=13 lh=18.2 / Unavailability fs=14 lh=20 — max 2 lines -->
      @if (item.description) {
        <p [class]="descriptionClasses">{{ item.description }}</p>
      }
    </div>
  `,
  styles: [':host { display: block; }'],
})
export class CsAvailabilityCardComponent {
  @Input({ required: true }) item!: AvailabilityCardItem;

  get descriptionClasses(): string {
    const base = 'font-normal text-[var(--cs360-text-primary)] line-clamp-2';
    return this.item.type === 'availability'
      ? `${base} text-[13px] leading-[18.2px]`
      : `${base} text-sm leading-5`;
  }
}
