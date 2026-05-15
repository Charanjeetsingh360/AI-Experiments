import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.card-elevated]="elevated" [class.card-hoverable]="hoverable">
      <div class="card-header" *ngIf="title || showHeader">
        <div class="card-title-section">
          <h3 class="card-title" *ngIf="title">{{ title }}</h3>
          <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="card-actions">
          <ng-content select="[cardActions]"></ng-content>
        </div>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="showFooter">
        <ng-content select="[cardFooter]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--cs360-bg-surface);
      border: 1px solid var(--cs360-border-subtle);
      border-radius: var(--cs360-radius-lg);
      overflow: hidden;
      transition: all var(--cs360-motion-fast);
    }

    .card-elevated {
      box-shadow: var(--cs360-shadow-md);
      border: none;
    }

    .card-hoverable {
      &:hover {
        box-shadow: var(--cs360-shadow-lg);
        transform: translateY(-2px);
      }
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: var(--cs360-space-4) var(--cs360-space-5);
      border-bottom: 1px solid var(--cs360-border-subtle);
    }

    .card-title-section {
      flex: 1;
    }

    .card-title {
      margin: 0;
      font-size: var(--cs360-font-size-md);
      font-weight: 600;
      color: var(--cs360-text-primary);
    }

    .card-subtitle {
      margin: var(--cs360-space-1) 0 0;
      font-size: var(--cs360-font-size-sm);
      color: var(--cs360-text-secondary);
    }

    .card-actions {
      display: flex;
      align-items: center;
      gap: var(--cs360-space-2);
    }

    .card-body {
      padding: var(--cs360-space-5);
    }

    .card-footer {
      padding: var(--cs360-space-4) var(--cs360-space-5);
      border-top: 1px solid var(--cs360-border-subtle);
      background-color: var(--cs360-bg-surface-hover);
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() elevated = false;
  @Input() hoverable = false;
  @Input() showHeader = false;
  @Input() showFooter = false;
}
