import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsTabPanelComponent } from './cs-tab-panel.component';

export type TabsVariant = 'line' | 'pill' | 'boxed';
export type TabsSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'cs-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cs-tabs.component.html',
  styleUrls: ['./cs-tabs.component.scss']
})
export class CsTabsComponent implements AfterContentInit {
  @Input() variant: TabsVariant = 'line';
  @Input() size: TabsSize = 'md';
  @Input() activeIndex = 0;
  @Output() tabChange = new EventEmitter<number>();

  @ContentChildren(CsTabPanelComponent) panels!: QueryList<CsTabPanelComponent>;
  tabs: CsTabPanelComponent[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.tabs = this.panels.toArray();
    this.activate(this.activeIndex);
    this.panels.changes.subscribe(() => {
      this.tabs = this.panels.toArray();
      this.activate(this.activeIndex);
    });
  }

  select(i: number): void {
    if (this.tabs[i]?.disabled) return;
    this.activeIndex = i;
    this.activate(i);
    this.tabChange.emit(i);
  }

  private activate(i: number): void {
    this.tabs.forEach((p, idx) => (p.active = idx === i));
    this.cdr.detectChanges();
  }

  get navClasses(): string {
    return ['cs-tabs__nav', 'cs-tabs__nav--' + this.variant, 'cs-tabs__nav--' + this.size].join(' ');
  }
}