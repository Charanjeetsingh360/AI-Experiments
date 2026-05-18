import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CSTabsComponent, CSTab } from '../../shared/components/cs-tabs/cs-tabs.component';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import { CsCardListComponent } from '../../shared/components/cs-card-list/cs-card-list.component';
import { CsCardTemplateDirective } from '../../shared/components/cs-card-list/cs-card-template.directive';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsBtnComponent } from '../../shared/components/button/button.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

export interface AvailabilityItem {
  id: string;
  date: string;
  timeRange?: string;
  isFullDay: boolean;
  type: 'availability' | 'unavailability';
  healthReason?: string;
  repeatInfo?: string;
  description?: string;
}

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CSTabsComponent,
    CSFlyoutComponent,
    CsCardListComponent,
    CsCardTemplateDirective,
    CSIconComponent,
    CsBtnComponent,
    CsPageHeaderComponent,
  ],
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityComponent {
  private fb = new FormBuilder();

  /* ── Tabs ── */
  tabs: CSTab[] = [
    { label: 'Availability', value: 'availability' },
    { label: 'Unavailability', value: 'unavailability' },
  ];
  activeTab = signal<'availability' | 'unavailability'>('availability');

  /* ── Pagination ── */
  currentPage = signal(1);
  pageSize = signal(9);
  pageSizeOptions = [9, 25, 50];

  /* ── Detail flyout ── */
  showDetailFlyout = signal(false);
  selectedItem = signal<AvailabilityItem | null>(null);

  /* ── Add flyout ── */
  showAddFlyout = signal(false);
  addForm: FormGroup = this.fb.group({
    type: [this.activeTab()],
    date: ['', Validators.required],
    isFullDay: [false],
    startTime: ['09:00'],
    endTime: ['17:00'],
    repeatType: ['none'],
    repeatEndDate: [''],
    healthReason: [''],
    description: [''],
  });

  /* ── Mock data ── */
  private allItems: AvailabilityItem[] = [
    { id: '1',  date: 'Mon, Jan 6 2025',  timeRange: '08:00 – 16:00', isFullDay: false, type: 'availability',   description: 'Regular morning shift', repeatInfo: 'Every Monday' },
    { id: '2',  date: 'Tue, Jan 7 2025',  isFullDay: true,            type: 'availability',   description: 'Full day available' },
    { id: '3',  date: 'Wed, Jan 8 2025',  timeRange: '10:00 – 14:00', isFullDay: false, type: 'availability',   repeatInfo: 'Every Wednesday for 4 weeks' },
    { id: '4',  date: 'Thu, Jan 9 2025',  timeRange: '07:00 – 15:00', isFullDay: false, type: 'availability' },
    { id: '5',  date: 'Fri, Jan 10 2025', timeRange: '12:00 – 20:00', isFullDay: false, type: 'availability',   repeatInfo: 'Every Friday' },
    { id: '6',  date: 'Mon, Jan 13 2025', timeRange: '09:00 – 17:00', isFullDay: false, type: 'availability',   repeatInfo: 'Weekly', description: 'Office hours' },
    { id: '7',  date: 'Tue, Jan 14 2025', timeRange: '06:00 – 12:00', isFullDay: false, type: 'availability' },
    { id: '8',  date: 'Wed, Jan 15 2025', timeRange: '14:00 – 22:00', isFullDay: false, type: 'availability' },
    { id: '9',  date: 'Thu, Jan 16 2025', isFullDay: true,            type: 'availability',   description: 'All day available' },
    { id: '10', date: 'Thu, Jan 9 2025',  timeRange: '13:00 – 17:00', isFullDay: false, type: 'unavailability', healthReason: 'Doctor appointment' },
    { id: '11', date: 'Fri, Jan 10 2025', isFullDay: true,            type: 'unavailability', description: 'Personal day off' },
    { id: '12', date: 'Wed, Jan 15 2025', isFullDay: true,            type: 'unavailability', description: 'Vacation', repeatInfo: 'Jan 15 – Jan 17' },
    { id: '13', date: 'Mon, Jan 20 2025', timeRange: '09:00 – 12:00', isFullDay: false, type: 'unavailability', healthReason: 'Physical therapy' },
    { id: '14', date: 'Fri, Jan 24 2025', isFullDay: true,            type: 'unavailability', description: 'Family event' },
  ];

  /* ── Computed ── */
  filteredItems = computed(() => {
    const tab = this.activeTab();
    const page = this.currentPage();
    const size = this.pageSize();
    const all = this.allItems.filter(i => i.type === tab);
    const start = (page - 1) * size;
    return all.slice(start, start + size);
  });

  totalItems = computed(() =>
    this.allItems.filter(i => i.type === this.activeTab()).length
  );

  get isFullDay(): boolean {
    return !!this.addForm.get('isFullDay')?.value;
  }

  /* ── Tab switch ── */
  onTabChange(tab: string): void {
    this.activeTab.set(tab as 'availability' | 'unavailability');
    this.currentPage.set(1);
    this.addForm.patchValue({ type: tab });
  }

  /* ── Detail flyout ── */
  onItemClick(item: unknown): void {
    this.selectedItem.set(item as AvailabilityItem);
    this.showDetailFlyout.set(true);
  }

  closeDetailFlyout(): void {
    this.showDetailFlyout.set(false);
    this.selectedItem.set(null);
  }

  /* ── Add flyout ── */
  openAddFlyout(): void {
    this.addForm.reset({
      type: this.activeTab(),
      date: '',
      isFullDay: false,
      startTime: '09:00',
      endTime: '17:00',
      repeatType: 'none',
      repeatEndDate: '',
      healthReason: '',
      description: '',
    });
    this.showAddFlyout.set(true);
  }

  closeAddFlyout(): void {
    this.showAddFlyout.set(false);
  }

  submitAdd(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    // In production: call API service here
    const v = this.addForm.value;
    const newItem: AvailabilityItem = {
      id: Date.now().toString(),
      date: new Date(v.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      isFullDay: !!v.isFullDay,
      timeRange: v.isFullDay ? undefined : `${v.startTime} – ${v.endTime}`,
      type: v.type,
      healthReason: v.healthReason || undefined,
      description: v.description || undefined,
      repeatInfo: v.repeatType !== 'none' ? this.buildRepeatInfo(v.repeatType, v.repeatEndDate) : undefined,
    };
    this.allItems.unshift(newItem);
    this.closeAddFlyout();
  }

  private buildRepeatInfo(type: string, endDate: string): string {
    const labels: Record<string, string> = {
      daily: 'Every day',
      weekly: 'Every week',
      biweekly: 'Every 2 weeks',
      monthly: 'Every month',
    };
    const base = labels[type] ?? type;
    return endDate ? `${base} until ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : base;
  }

  /* ── Pagination ── */
  onPageChange(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
  }

  onPageSizeChange(event: { page: number; pageSize: number }): void {
    this.currentPage.set(1);
    this.pageSize.set(event.pageSize);
  }

  /* ── Helpers ── */
  hasError(field: string): boolean {
    const c = this.addForm.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
