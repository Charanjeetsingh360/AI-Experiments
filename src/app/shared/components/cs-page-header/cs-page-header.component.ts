import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

/**
 * CsPageHeaderComponent — Shared page-level heading bar.
 * Matches Figma "Page Header/Dashboard": title (fs=20,fw=500) + cached refresh icon (20×20,gap=8)
 * + right-side actions slot. Used on all primary pages.
 *
 * Usage:
 *   <cs-page-header title="Clients" description="..." (refresh)="onRefresh()">
 *     <div header-actions><!-- search, buttons, etc --></div>
 *   </cs-page-header>
 */
@Component({
  selector: 'cs-page-header',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-center justify-between gap-4
             px-[var(--density-space-block)] py-[var(--density-space-block)]">

      <!-- Left: title row (title text + cached/refresh icon) + optional description -->
      <div class="min-w-0">

        <!-- Title + inline refresh icon — gap=8px per Figma Title frame -->
        <div class="flex items-center gap-2">
          <h1 class="text-[length:var(--density-text-heading)] font-medium
                     leading-[24px] text-[var(--cs360-text-primary)]">
            {{ title }}
          </h1>

          <!-- Figma: 'cached' icon 20×20, fill=#1e293b, inline with title -->
          <button
            type="button"
            class="flex items-center justify-center w-5 h-5 rounded
                   text-[var(--cs360-text-primary)] transition-opacity duration-150
                   hover:opacity-60 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-[var(--cs360-action-primary)]"
            [attr.aria-label]="'Refresh ' + title"
            (click)="refresh.emit()"
          >
            <cs-icon name="cached" [size]="20" aria-hidden="true" />
          </button>
        </div>

        @if (description) {
          <p class="mt-1 text-[length:var(--density-text-body-muted)]
                    text-[var(--cs360-text-secondary)] leading-snug">
            {{ description }}
          </p>
        }
      </div>

      <!-- Right: actions slot -->
      <div class="flex shrink-0 items-center gap-[var(--density-space-3)]">
        <ng-content select="[header-actions]" />
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class CsPageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() description = '';
  /** Emitted when the inline refresh (cached) icon is clicked. */
  @Output() refresh = new EventEmitter<void>();
}
