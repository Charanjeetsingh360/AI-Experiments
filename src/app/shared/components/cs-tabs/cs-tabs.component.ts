import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

export interface CSTab {
  label: string;
  value: string;
  disabled?: boolean;
  badge?: number;
}

/**
 * CSTabsComponent — Horizontal tab bar.
 * variant="segments" (default): connected button group, used in flyouts/forms.
 * variant="pills": separate pill buttons with gap, used for page-level filters.
 */
@Component({
  selector: 'cs-tabs',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant === 'pills') {
      <div
        class="inline-flex items-center gap-2"
        role="tablist"
        aria-label="Tabs"
        (keydown)="onKeydown($event)"
      >
        @for (tab of tabs; track tab.value; let i = $index) {
          <button
            type="button"
            role="tab"
            class="inline-flex items-center rounded-lg min-h-[32px] min-w-[34px]
                   text-sm font-medium leading-none tracking-normal
                   border transition-colors duration-150 cursor-pointer outline-none whitespace-nowrap
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-[var(--cs360-action-primary)]"
            [ngClass]="getPillClass(tab)"
            [attr.aria-selected]="tab.value === activeTab"
            [attr.aria-disabled]="tab.disabled || null"
            [attr.tabindex]="i === focusIndex ? 0 : -1"
            (click)="selectTab(tab)"
            (focus)="focusIndex = i"
          >
            @if (tab.value === activeTab) {
              <cs-icon name="check" [size]="18" />
            }
            {{ tab.label }}
            @if (tab.badge) {
              <span class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full"
                [class]="tab.value === activeTab ? 'bg-white/30 text-white' : 'bg-[var(--cs360-action-primary)] text-white'">
                {{ tab.badge }}
              </span>
            }
          </button>
        }
      </div>
    } @else {
      <div
        class="cs-tabs border border-[var(--cs360-border-subtle)]
               rounded-[var(--cs360-radius-md)] overflow-hidden bg-[var(--cs360-bg-surface)]"
        [class.inline-flex]="!fullWidth"
        [class.flex]="fullWidth"
        [class.w-full]="fullWidth"
        role="tablist"
        aria-label="Tabs"
        (keydown)="onKeydown($event)"
      >
        @for (tab of tabs; track tab.value; let i = $index) {
          <button
            type="button"
            role="tab"
            class="inline-flex items-center justify-center gap-[var(--density-space-1)]
              h-[var(--density-control-height-lg)] px-[var(--density-space-2)]
              border-none rounded-none text-[length:var(--density-text-body-muted)]
              font-medium leading-[16.94px] text-center cursor-pointer outline-none transition-colors duration-150 whitespace-nowrap
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--cs360-action-primary)]"
            [class.flex-1]="fullWidth"
            [ngClass]="getTabClass(tab)"
            [attr.aria-selected]="tab.value === activeTab"
            [attr.aria-disabled]="tab.disabled || null"
            [attr.tabindex]="i === focusIndex ? 0 : -1"
            (click)="selectTab(tab)"
            (focus)="focusIndex = i"
          >
            {{ tab.label }}
            @if (tab.badge) {
              <span class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full"
                [class]="tab.value === activeTab ? 'bg-white/30 text-white' : 'bg-[var(--cs360-action-primary)] text-white'">
                {{ tab.badge }}
              </span>
            }
          </button>
        }
      </div>
    }
  `,
  styles: [`:host { display: inline-flex; } :host(.full-width) { display: flex; width: 100%; }`],
})
export class CSTabsComponent implements OnChanges {
  @Input() tabs: CSTab[] = [];
  @Input() activeTab = '';
  @Input() fullWidth = false;
  @Input() variant: 'segments' | 'pills' = 'segments';
  @Output() activeTabChange = new EventEmitter<string>();

  focusIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabs'] || changes['activeTab']) {
      if (!this.activeTab && this.tabs.length) {
        this.activeTab = this.tabs[0].value;
      }
      this.focusIndex = Math.max(0, this.tabs.findIndex(t => t.value === this.activeTab));
    }
  }

  getTabClass(tab: CSTab): Record<string, boolean> {
    return {
      'bg-[var(--cs360-action-primary)] text-white': tab.value === this.activeTab,
      'bg-transparent text-[var(--cs360-text-primary)] hover:bg-[var(--cs360-bg-alt)]': tab.value !== this.activeTab && !tab.disabled,
      'opacity-40 cursor-not-allowed': !!tab.disabled,
    };
  }

  getPillClass(tab: CSTab): Record<string, boolean> {
    const isActive = tab.value === this.activeTab;
    return {
      'bg-[var(--cs360-action-primary)] text-white border-[var(--cs360-action-primary)] px-3 py-2 gap-2 justify-center': isActive,
      'bg-[var(--cs360-bg-surface)] text-[var(--cs360-text-primary)] border-[var(--cs360-border-subtle)] p-2 gap-1 hover:bg-[var(--cs360-bg-alt)]': !isActive && !tab.disabled,
      'opacity-40 cursor-not-allowed': !!tab.disabled,
    };
  }

  selectTab(tab: CSTab): void {
    if (tab.disabled) return;
    this.activeTab = tab.value;
    this.activeTabChange.emit(tab.value);
  }

  onKeydown(event: KeyboardEvent): void {
    let handled = true;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        this.focusIndex = this.nextEnabled(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        this.focusIndex = this.nextEnabled(-1);
        break;
      case 'Home':
        this.focusIndex = this.tabs.findIndex(t => !t.disabled);
        break;
      case 'End':
        for (let i = this.tabs.length - 1; i >= 0; i--) {
          if (!this.tabs[i].disabled) { this.focusIndex = i; break; }
        }
        break;
      case 'Enter':
      case ' ':
        this.selectTab(this.tabs[this.focusIndex]);
        break;
      default:
        handled = false;
    }
    if (handled) event.preventDefault();
  }

  private nextEnabled(direction: 1 | -1): number {
    let idx = this.focusIndex;
    const len = this.tabs.length;
    for (let i = 0; i < len; i++) {
      idx = (idx + direction + len) % len;
      if (!this.tabs[idx].disabled) return idx;
    }
    return this.focusIndex;
  }
}
