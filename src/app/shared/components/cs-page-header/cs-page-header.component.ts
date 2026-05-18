import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CsPageHeaderComponent — Shared page-level heading bar.
 * Transparent background (inherits canvas). Uses density & semantic tokens.
 *
 * Usage:
 *   <cs-page-header title="Clients" description="...">
 *     <div header-actions>
 *       <!-- search, buttons, etc -->
 *     </div>
 *   </cs-page-header>
 */
@Component({
  selector: 'cs-page-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-start justify-between gap-4
             px-[var(--density-space-page)] py-[var(--density-space-block)]
             border-b border-[var(--cs360-border-subtle)]">

      <!-- Left: title + description -->
      <div class="min-w-0">
        <h1 class="text-[length:var(--density-text-heading)] font-semibold
                   leading-tight text-[var(--cs360-text-primary)]">
          {{ title }}
        </h1>
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
}
