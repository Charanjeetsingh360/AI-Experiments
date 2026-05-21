import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CsSkeletonComponent — Animated placeholder for loading states.
 *
 * Usage — single block:
 *   <cs-skeleton height="h-4" width="w-3/4" />
 *
 * Usage — card skeleton (pre-built variant):
 *   <cs-skeleton variant="card" />
 *
 * Usage — list of rows:
 *   <cs-skeleton variant="list" [rows]="3" />
 *
 * Usage — avatar + text (client card style):
 *   <cs-skeleton variant="client-card" />
 */
@Component({
  selector: 'cs-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (variant) {

      @case ('card') {
        <!-- Client card skeleton: avatar + two text lines + chevron -->
        <div class="flex items-start gap-3 p-[var(--density-space-component)]
                    rounded-md bg-[var(--cs360-bg-surface)]
                    border border-[var(--cs360-border-subtle)]">
          <!-- Avatar circle -->
          <div class="shrink-0 w-10 h-10 rounded-full bg-[var(--cs360-border-subtle)] animate-pulse"></div>
          <!-- Text lines -->
          <div class="flex flex-col gap-2 flex-1 min-w-0 py-1">
            <div class="h-[14px] rounded bg-[var(--cs360-border-subtle)] animate-pulse w-2/3"></div>
            <div class="h-[12px] rounded bg-[var(--cs360-border-subtle)] animate-pulse w-full"></div>
            <div class="h-[12px] rounded bg-[var(--cs360-border-subtle)] animate-pulse w-4/5"></div>
          </div>
          <!-- Chevron stub -->
          <div class="shrink-0 w-5 h-5 rounded bg-[var(--cs360-border-subtle)] animate-pulse"></div>
        </div>
      }

      @case ('list') {
        <!-- List of simple text row skeletons -->
        <div class="flex flex-col gap-3">
          @for (_ of rowArray; track $index) {
            <div class="flex flex-col gap-2 p-4 rounded-md
                        bg-[var(--cs360-bg-surface)] border border-[var(--cs360-border-subtle)]">
              <div class="h-[14px] rounded bg-[var(--cs360-border-subtle)] animate-pulse w-1/2"></div>
              <div class="h-[12px] rounded bg-[var(--cs360-border-subtle)] animate-pulse w-3/4"></div>
            </div>
          }
        </div>
      }

      @case ('flyout-body') {
        <!-- Flyout body skeleton: profile row + address + actions + shift card -->
        <div class="flex flex-col gap-4">
          <!-- Profile row skeleton -->
          <div class="flex items-center gap-3 py-6">
            <div class="flex-1 h-12 rounded-md bg-[var(--cs360-border-subtle)] animate-pulse"></div>
            <div class="shrink-0 w-[70px] h-[70px] rounded-full bg-[var(--cs360-border-subtle)] animate-pulse mx-3"></div>
            <div class="flex-1 h-12 rounded-md bg-[var(--cs360-border-subtle)] animate-pulse"></div>
          </div>
          <!-- Address block skeleton -->
          <div class="flex flex-col items-center gap-2 py-3">
            <div class="h-4 rounded bg-[var(--cs360-border-subtle)] animate-pulse w-36"></div>
            <div class="h-3 rounded bg-[var(--cs360-border-subtle)] animate-pulse w-28"></div>
            <div class="h-3 rounded bg-[var(--cs360-border-subtle)] animate-pulse w-48"></div>
          </div>
          <!-- Quick actions 2-col grid skeleton -->
          <div class="grid grid-cols-2 gap-3 py-3">
            @for (_ of [1,2,3,4,5]; track $index) {
              <div class="h-10 rounded-md bg-[var(--cs360-border-subtle)] animate-pulse"></div>
            }
            <!-- odd last item spans full width -->
            <div class="h-10 rounded-md bg-[var(--cs360-border-subtle)] animate-pulse"></div>
          </div>
          <!-- Section title skeleton -->
          <div class="h-5 rounded bg-[var(--cs360-border-subtle)] animate-pulse w-32 my-1"></div>
          <!-- Shift card skeleton -->
          <div class="h-40 rounded-md bg-[var(--cs360-border-subtle)] animate-pulse"></div>
        </div>
      }

      @default {
        <!-- Single generic block -->
        <div
          class="rounded animate-pulse bg-[var(--cs360-border-subtle)]"
          [class]="height + ' ' + width + ' ' + extraClass"
          [style.border-radius]="rounded"
          aria-hidden="true"
        ></div>
      }
    }
  `,
  styles: [`:host { display: block; }`],
})
export class CsSkeletonComponent {
  /** Pre-built composite variants */
  @Input() variant: 'default' | 'card' | 'list' | 'flyout-body' = 'default';

  /** Single-block sizing (variant='default') */
  @Input() height = 'h-4';
  @Input() width  = 'w-full';
  @Input() rounded = '';
  @Input() extraClass = '';

  /** Number of rows for variant='list' */
  @Input() rows = 3;

  get rowArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}
