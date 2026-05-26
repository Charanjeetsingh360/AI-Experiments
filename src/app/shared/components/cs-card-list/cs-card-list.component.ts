import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CsCardTemplateDirective } from './cs-card-template.directive';
import { CsSkeletonComponent } from '../cs-skeleton/cs-skeleton.component';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

export interface CsCardPageChangeEvent {
  page: number;
  pageSize: number;
}

/**
 * CsCardListComponent — Generic card-grid container with pagination
 * A reusable listing container that renders any dataset as a responsive grid
 * of clickable cards with a built-in sticky footer (pagination).
 */
@Component({
  selector: 'cs-card-list',
  standalone: true,
  imports: [NgTemplateOutlet, CsSkeletonComponent, CSIconComponent],
  templateUrl: './cs-card-list.component.html',
  styleUrls: ['./cs-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsCardListComponent implements OnChanges {
  @Input() items: unknown[] = [];
  @Input() totalItems = 0;
  @Input() trackByField = 'id';
  @Input() emptyMessage = 'No records found.';
  @Input() columns: 1 | 2 | 3 = 3;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Input() showPagination = true;
  /** Show skeleton grid while data is loading */
  @Input() isLoading = false;
  /** Number of skeleton cards to show while loading */
  @Input() skeletonCount = 6;

  @Output() itemClick = new EventEmitter<unknown>();
  @Output() pageChange = new EventEmitter<CsCardPageChangeEvent>();
  @Output() pageSizeChange = new EventEmitter<CsCardPageChangeEvent>();

  @ContentChild(CsCardTemplateDirective)
  cardTemplate?: CsCardTemplateDirective;

  readonly gridClasses: Record<number, string> = {
    1: 'grid grid-cols-1 gap-3',
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
  };

  get skeletonArray(): number[] {
    return Array.from({ length: this.skeletonCount }, (_, i) => i);
  }

  totalPages = 1;
  pages: (number | '...')[] = [];
  startItem = 0;
  endItem = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['pageSize'] || changes['currentPage']) {
      this.recalculate();
    }
  }

  private recalculate(): void {
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
    this.startItem = this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(this.currentPage * this.pageSize, this.totalItems);
    this.pages = this.buildPages();
  }

  private buildPages(): (number | '...')[] {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | '...')[] = [1];
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  trackItem(index: number, item: unknown): unknown {
    return (item as Record<string, unknown>)[this.trackByField] ?? index;
  }

  onItemClick(item: unknown): void {
    this.itemClick.emit(item);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.recalculate();
    this.pageChange.emit({ page: this.currentPage, pageSize: this.pageSize });
  }

  goFirst(): void { this.goToPage(1); }
  goPrev(): void { this.goToPage(this.currentPage - 1); }
  goNext(): void { this.goToPage(this.currentPage + 1); }
  goLast(): void { this.goToPage(this.totalPages); }

  onPageSizeChange(event: Event): void {
    const newSize = +(event.target as HTMLSelectElement).value;
    this.pageSize = newSize;
    this.currentPage = 1;
    this.recalculate();
    this.pageSizeChange.emit({ page: 1, pageSize: this.pageSize });
  }
}
