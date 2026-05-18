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

/**
 * CSFlyoutComponent — CSS fixed-position slide-in panel.
 * Uses position:fixed + backdrop so ng-content projection works correctly.
 *
 * Usage:
 * <cs-flyout [isOpen]="show" (isOpenChange)="show = $event" position="right" width="480px">
 *   <div flyout-header>Title</div>
 *   <div flyout-body>Content</div>
 *   <div flyout-footer>Actions</div>
 * </cs-flyout>
 */
@Component({
  selector: 'cs-flyout',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[1px]"
        (click)="onBackdropClick()"
        aria-hidden="true"
      ></div>

      <!-- Panel -->
      <div
        class="fixed z-[1000] flex flex-col overflow-hidden
               bg-[var(--cs360-bg-surface)] shadow-2xl
               transition-transform duration-250 ease-out"
        [class]="panelPositionClass"
        [style.width]="panelWidth"
        [style.height]="panelHeight"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header slot -->
        <div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--cs360-border-subtle)]">
          <ng-content select="[flyout-header]"></ng-content>
        </div>

        <!-- Body slot -->
        <div class="flex-1 overflow-y-auto p-4">
          <ng-content select="[flyout-body]"></ng-content>
        </div>

        <!-- Footer slot -->
        <div class="shrink-0 px-4 py-3 border-t border-[var(--cs360-border-subtle)]">
          <ng-content select="[flyout-footer]"></ng-content>
        </div>
      </div>
    }
  `,
  styles: [`:host { display: contents; }`],
})
export class CSFlyoutComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'right';
  @Input() width = '480px';
  @Input() height = '100vh';
  @Input() hasBackdrop = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEsc = true;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  visible = false;
  private cdr = inject(ChangeDetectorRef);
  private escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.closeOnEsc) this.close();
  };

  get panelPositionClass(): string {
    switch (this.position) {
      case 'right':  return 'top-0 right-0 bottom-0';
      case 'left':   return 'top-0 left-0 bottom-0';
      case 'top':    return 'top-0 left-0 right-0';
      case 'bottom': return 'bottom-0 left-0 right-0';
    }
  }

  get panelWidth(): string {
    return (this.position === 'top' || this.position === 'bottom') ? '100vw' : this.width;
  }

  get panelHeight(): string {
    return (this.position === 'left' || this.position === 'right') ? '100vh' : this.height;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.isOpen ? this.open() : this.close();
    }
  }

  private open(): void {
    this.visible = true;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.escHandler);
    this.cdr.markForCheck();
  }

  close(): void {
    this.visible = false;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.escHandler);
    this.isOpenChange.emit(false);
    this.closed.emit();
    this.cdr.markForCheck();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) this.close();
  }
}

