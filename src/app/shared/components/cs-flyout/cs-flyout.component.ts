import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Overlay,
  OverlayRef,
  OverlayModule,
  GlobalPositionStrategy,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

/**
 * CSFlyoutComponent — Slide-in panel using Angular CDK Overlay.
 * Supports right/left/top/bottom positions with backdrop.
 * Selector: <cs-flyout>
 *
 * Usage:
 * <cs-flyout [(isOpen)]="showFlyout" position="right" width="480px">
 *   <div flyout-header>Title</div>
 *   <div flyout-body>Content</div>
 *   <div flyout-footer>Actions</div>
 * </cs-flyout>
 */
@Component({
  selector: 'cs-flyout',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #flyoutTemplate>
      <div
        class="flex flex-col h-full w-full overflow-hidden bg-[var(--cs360-bg-surface)] shadow-2xl"
        [class.animate-slide-in-right]="position === 'right'"
        [class.animate-slide-in-left]="position === 'left'"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
      >
        <!-- Header -->
        <div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--cs360-border-subtle)]">
          <ng-content select="[flyout-header]"></ng-content>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4">
          <ng-content select="[flyout-body]"></ng-content>
        </div>

        <!-- Footer -->
        <div class="shrink-0 px-4 py-3 border-t border-[var(--cs360-border-subtle)]">
          <ng-content select="[flyout-footer]"></ng-content>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host { display: none; }

    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }
    @keyframes slideInLeft {
      from { transform: translateX(-100%); }
      to   { transform: translateX(0); }
    }
    .animate-slide-in-right { animation: slideInRight 0.25s ease-out forwards; }
    .animate-slide-in-left  { animation: slideInLeft  0.25s ease-out forwards; }
  `],
})
export class CSFlyoutComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'right';
  @Input() width = '480px';
  @Input() height = '100vh';
  @Input() hasBackdrop = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEsc = true;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('flyoutTemplate', { static: true }) flyoutTemplate!: TemplateRef<unknown>;

  private overlayRef: OverlayRef | null = null;
  private portal!: TemplatePortal;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.isOpen ? this.openOverlay() : this.closeOverlay();
    }
    if (this.overlayRef && (changes['width'] || changes['height'])) {
      this.overlayRef.updateSize(this.getSize());
    }
  }

  private openOverlay(): void {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.createPositionStrategy(),
        hasBackdrop: this.hasBackdrop,
        backdropClass: 'cdk-overlay-dark-backdrop',
        scrollStrategy: this.overlay.scrollStrategies.block(),
        ...this.getSize(),
        disposeOnNavigation: true,
      });

      this.overlayRef.backdropClick().subscribe(() => {
        if (this.closeOnBackdropClick) this.closeOverlay();
      });

      this.overlayRef.keydownEvents().subscribe((e) => {
        if (e.key === 'Escape' && this.closeOnEsc) this.closeOverlay();
      });
    }

    if (!this.portal) {
      this.portal = new TemplatePortal(this.flyoutTemplate, this.viewContainerRef);
    }

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
    }
  }

  closeOverlay(): void {
    this.overlayRef?.detach();
    if (this.isOpen) {
      this.isOpen = false;
      this.isOpenChange.emit(false);
    }
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  private createPositionStrategy(): GlobalPositionStrategy {
    const s = this.overlay.position().global();
    switch (this.position) {
      case 'right':  return s.top('0').right('0');
      case 'left':   return s.top('0').left('0');
      case 'top':    return s.top('0').centerHorizontally();
      case 'bottom': return s.bottom('0').centerHorizontally();
    }
  }

  private getSize(): { width?: string; height?: string } {
    return (this.position === 'top' || this.position === 'bottom')
      ? { width: '100vw', height: this.height }
      : { width: this.width, height: this.height };
  }
}
