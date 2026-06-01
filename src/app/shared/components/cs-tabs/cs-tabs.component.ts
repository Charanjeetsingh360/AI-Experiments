import { Component, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
export { CsTabPanelComponent } from './cs-tab-panel.component';

export type TabsVariant = 'line' | 'pill' | 'pills' | 'boxed';
export type TabsSize    = 'sm' | 'md' | 'lg';

export interface CsTabItem {
  label: string;
  value?: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'cs-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cs-tabs.component.html',
  styleUrls: ['./cs-tabs.component.scss']
})
export class CsTabsComponent implements AfterContentInit {
  private _variant: TabsVariant = 'line';
  private _size: TabsSize = 'md';
  private _fullWidth = false;
  private _tabs: CsTabItem[] = [];
  private _activeIndex = 0;
  private _activeTab = '';

  @Input()
  set variant(value: TabsVariant) {
    this._variant = value;
  }
  get variant(): TabsVariant {
    return this._variant;
  }

  @Input()
  set size(value: TabsSize) {
    this._size = value;
  }
  get size(): TabsSize {
    return this._size;
  }

  @Input()
  set fullWidth(value: boolean) {
    this._fullWidth = value != null && `${value}` !== 'false';
  }
  get fullWidth(): boolean {
    return this._fullWidth;
  }

  @Input()
  set tabs(value: CsTabItem[] | null | undefined) {
    this._tabs = value ?? [];
    this.syncSelectionFromInputs();
  }
  get tabs(): CsTabItem[] {
    return this._tabs;
  }

  @Input()
  set activeIndex(value: number) {
    this._activeIndex = Number.isFinite(value) ? value : 0;
    this.syncActiveTabFromIndex();
  }
  get activeIndex(): number {
    return this._activeIndex;
  }

  @Input()
  set activeTab(value: string | number | null | undefined) {
    this._activeTab = value == null ? '' : String(value);
    this.syncActiveIndexFromTab();
  }
  get activeTab(): string {
    return this._activeTab;
  }

  @Output() tabChange = new EventEmitter<number>();
  @Output() activeTabChange = new EventEmitter<string>();

  ngAfterContentInit(): void {
    this.syncSelectionFromInputs();
  }

  select(i: number): void {
    const tab = this.tabs[i];
    if (!tab || tab.disabled) return;
    this._activeIndex = i;
    this._activeTab = tab.value ?? tab.label ?? String(i);
    this.tabChange.emit(i);
    this.activeTabChange.emit(this._activeTab);
  }

  private syncSelectionFromInputs(): void {
    if (!this.tabs.length) {
      this._activeIndex = 0;
      this._activeTab = '';
      return;
    }

    if (this._activeTab) {
      this.syncActiveIndexFromTab();
      return;
    }

    if (this._activeIndex < 0 || this._activeIndex >= this.tabs.length) {
      this._activeIndex = 0;
    }

    this.syncActiveTabFromIndex();
  }

  private syncActiveIndexFromTab(): void {
    if (!this.tabs.length) return;

    const index = this.tabs.findIndex(tab => tab.value === this._activeTab || tab.label === this._activeTab);
    if (index >= 0) {
      this._activeIndex = index;
      return;
    }

    if (this._activeIndex < 0 || this._activeIndex >= this.tabs.length) {
      this._activeIndex = 0;
    }

    if (!this._activeTab && this.tabs[this._activeIndex]) {
      this._activeTab = this.tabs[this._activeIndex].value ?? this.tabs[this._activeIndex].label ?? String(this._activeIndex);
    }
  }

  private syncActiveTabFromIndex(): void {
    if (!this.tabs.length) return;
    const tab = this.tabs[this._activeIndex] ?? this.tabs[0];
    if (tab) {
      this._activeIndex = this.tabs.indexOf(tab);
      this._activeTab = tab.value ?? tab.label ?? String(this._activeIndex);
    }
  }

  get navClasses(): string {
    const variant = this.variant === 'pills' ? 'pill' : this.variant;
    return [
      'cs-tabs__nav',
      'cs-tabs__nav--' + variant,
      'cs-tabs__nav--' + this.size,
      this.fullWidth ? 'cs-tabs__nav--full-width' : '',
    ].filter(Boolean).join(' ');
  }
}
