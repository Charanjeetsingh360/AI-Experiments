import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsSkeletonComponent } from '../cs-skeleton/cs-skeleton.component';

/**
 * CSFlyoutComponent — CSS fixed-position slide-in panel or center modal.
 *
 * Positions:
 * - position="right"  → slides in from right (400ms, cubic ease-out)
 * - position="left"   → slides in from left  (400ms, cubic ease-out)
 * - position="center" → fades in from bottom to top (400ms), centered on screen
 * - closing           → reverses out (400ms)
 * - [isLoading]       → shows flyout-body skeleton while data loads
 *
 * Z-Index stacking:
 * - Default side flyouts:    backdrop z-[999], panel z-[1000]
 * - Quick-action center modals: backdrop z-[1009], panel z-[1010]  (pass [zIndex]="1009")
 * - Nested detail flyouts:   backdrop z-[1019], panel z-[1020]   (pass [zIndex]="1019")
 *
 * Usage:
 * <cs-flyout [isOpen]="show" (isOpenChange)="show = $event" position="right" width="500px">
 *   <div flyout-header>Title</div>
 *   <div flyout-body>Content</div>
 * </cs-flyout>
 *
 * <cs-flyout [isOpen]="show" position="center" width="min(640px, 90vw)" [zIndex]="1009">
 *   <div flyout-header>Title</div>
 *   <div flyout-body>Content</div>
 * </cs-flyout>
 */
@Component({
  selector: 'cs-flyout',
  standalone: true,
  imports: [CommonModule, CsSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
        [class.cs360-backdrop-in]="!closing"
        [class.cs360-backdrop-out]="closing"
        [style.z-index]="zIndex"
        (click)="onBackdropClick()"
        aria-hidden="true"
      ></div>

      <!-- Panel -->
      <div
        class="fixed flex flex-col overflow-hidden
               bg-[var(--cs360-bg-surface)] shadow-2xl"
        [class]="panelPositionClass"
        [class.cs360-slide-in-right]="!closing && position === 'right'"
        [class.cs360-slide-in-left]="!closing && position === 'left'"
        [class.cs360-slide-out-right]="closing && position === 'right'"
        [class.cs360-slide-out-left]="closing && position === 'left'"
        [class.cs360-fade-in-up]="!closing && position === 'center'"
        [class.cs360-fade-out-down]="closing && position === 'center'"
        [style.z-index]="zIndex + 1"
        [style.width]="panelWidth"
        [style.height]="panelHeight"
        [style.max-height]="panelMaxHeight"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="ariaLabel || null"
      >
        <!-- Header slot -->
        <div
          class="shrink-0 flex items-start"
          [class]="resolvedHeaderPaddingClass"
          [class.border-b]="showHeaderBorder"
          [class.border-[var(--cs360-border-subtle)]]="showHeaderBorder"
        >
          <ng-content select="[flyout-header]"></ng-content>
        </div>

        <!-- Body slot — shows skeleton while isLoading -->
        <div class="flex-1 overflow-y-auto" [class]="bodyPaddingClass">
          @if (isLoading) {
            <cs-skeleton variant="flyout-body" />
          } @else {
            <ng-content select="[flyout-body]"></ng-content>
          }
        </div>

        <!-- Footer slot (hidden when loading) -->
        @if (!isLoading) {
          <div
            class="shrink-0 border-t border-[var(--cs360-border-subtle)]"
            [class]="footerPaddingClass"
          >
            <ng-content select="[flyout-footer]"></ng-content>
          </div>
        }
      </div>
    }
  `,
  styles: [`:host { display: contents; }`],
})
export class CSFlyoutComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() position: 'left' | 'right' | 'top' | 'bottom' | 'center' = 'right';
  @Input() width = '480px';
  @Input() height = '100vh';
  /** Base z-index for backdrop. Panel = zIndex + 1. Default 999. Use 1009 for center modals above side flyouts. */
  @Input() zIndex = 999;
  @Input() hasBackdrop = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEsc = true;
  @Input() showHeaderBorder = true;
  @Input() headerPadding: 'default' | 'compact' | 'none' = 'default';
  @Input() headerPaddingClass = '';
  @Input() bodyPadding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() footerPadding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() isLoading = false;
  @Input() ariaLabel = '';

  /** True while the closing animation is playing (400ms) */
  closing = false;

  get computedHeaderPaddingClass(): string {
    if (this.headerPadding === 'compact') return 'px-3 py-1';
    if (this.headerPadding === 'none') return 'px-3 py-0.5';
    return 'px-4 py-3';
  }

  get resolvedHeaderPaddingClass(): string {
    return this.headerPaddingClass || this.computedHeaderPaddingClass;
  }

  get bodyPaddingClass(): string {
    const map: Record<string, string> = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' };
    return map[this.bodyPadding] ?? 'p-4';
  }

  get footerPaddingClass(): string {
    const map: Record<string, string> = {
      none: '',
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };
    return map[this.footerPadding] ?? 'px-4 py-3';
  }

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  visible = false;
  private cdr = inject(ChangeDetectorRef);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.closeOnEsc) this.close();
  };

  get panelPositionClass(): string {
    switch (this.position) {
      case 'right':  return 'top-0 right-0 bottom-0';
      case 'left':   return 'top-0 left-0 bottom-0';
      case 'top':    return 'top-0 left-0 right-0';
      case 'bottom': return 'bottom-0 left-0 right-0';
      case 'center': return 'inset-0 m-auto rounded-xl';
    }
  }

  get panelWidth(): string {
    if (this.position === 'top' || this.position === 'bottom') return '100vw';
    return this.width;
  }

  get panelHeight(): string {
    if (this.position === 'center') return 'fit-content';
    if (this.position === 'left' || this.position === 'right') return '100vh';
    return this.height;
  }

  get panelMaxHeight(): string | null {
    return this.position === 'center' ? '90vh' : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.isOpen ? this.open() : this.close();
    }
  }

  private open(): void {
    if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; }
    this.closing = false;
    this.visible = true;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.escHandler);
    this.cdr.markForCheck();
  }

  close(): void {
    if (!this.visible) return;
    this.closing = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.escHandler);
    this.isOpenChange.emit(false);
    this.cdr.markForCheck();
    // Wait for close animation (400ms) before removing from DOM
    this.closeTimer = setTimeout(() => {
      this.closing = false;
      this.visible = false;
      this.closed.emit();
      this.cdr.markForCheck();
    }, 400);
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) this.close();
  }
}
