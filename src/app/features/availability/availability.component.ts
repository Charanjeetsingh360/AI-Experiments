import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CsTabsComponent, CsTabPanelComponent } from '../../shared/components/cs-tabs/cs-tabs.component';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import { CsCardListComponent } from '../../shared/components/cs-card-list/cs-card-list.component';
import { CsCardTemplateDirective } from '../../shared/components/cs-card-list/cs-card-template.directive';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';
import { CsAvailabilityCardComponent, AvailabilityCardType } from '../../shared/components/cs-availability-card/cs-availability-card.component';

export type RepeatType = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface AvailabilityItem {
  id: string;
  type: AvailabilityCardType;
  title: string;
  isFullDay: boolean;
  dateValue?: string;
  startTime?: string;
  endTime?: string;
  repeatType?: RepeatType;
  repeatInfo?: string;
  healthReason?: string;
  description?: string;
  notes?: string;
}

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CsTabsComponent,
    CSFlyoutComponent,
    CsCardListComponent,
    CsCardTemplateDirective,
    CsAvailabilityCardComponent,
    CSIconComponent,
    ButtonComponent,
    CsPageHeaderComponent,
  ],
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityComponent {
  private fb = new FormBuilder();

  /* ── Tabs ── */
  tabs: CsTabPanelComponent[] = [
    { label: 'Availability', value: 'availability' },
    { label: 'Unavailability', value: 'unavailability' },
  ];
  activeTab = signal<'availability' | 'unavailability'>('availability');

  repeatTabs: CsTabPanelComponent[] = [
    { label: 'Once', value: 'once' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  /* ── Modals ── */
  showAddModal = signal(false);
  showEditModal = signal(false);
  selectedItem = signal<AvailabilityItem | null>(null);
  readonly notesLimit = 240;

  /* ── Page header refresh handler ── */
  onRefresh() {
    // TODO: Implement refresh logic (e.g., reload data)
  }

  addForm: FormGroup = this.fb.group({
    type: [this.activeTab()],
    date: ['', Validators.required],
    isFullDay: [false],
    startTime: ['10:00'],
    endTime: ['11:30'],
    repeatType: ['once' as RepeatType],
    healthReason: [''],
    notes: ['', [Validators.maxLength(this.notesLimit)]],
  });

  editForm: FormGroup = this.fb.group({
    type: ['availability' as AvailabilityCardType],
    date: ['', Validators.required],
    isFullDay: [false],
    startTime: ['10:00'],
    endTime: ['11:30'],
    repeatType: ['once' as RepeatType],
    healthReason: [''],
    notes: ['', [Validators.maxLength(this.notesLimit)]],
  });

  /* ── Mock data (Figma sample content) ── */
  private readonly availabilitySample: AvailabilityItem = {
    id: 'a-1',
    type: 'availability',
    title: '11/26/25 (Full day)',
    isFullDay: true,
    dateValue: '2025-11-26',
    repeatType: 'daily',
    repeatInfo: 'Repeat Daily Effective from 11/26/2025 until 11/26/2025',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  };

  private readonly unavailabilitySample: AvailabilityItem = {
    id: 'u-1',
    type: 'unavailability',
    title: '11/26/25 10:00 AM - 11:30 PM AST (1h 30m)',
    isFullDay: false,
    dateValue: '2025-11-26',
    startTime: '10:00',
    endTime: '11:30',
    repeatType: 'daily',
    repeatInfo: 'Repeat Every day until 11/26/2025.',
    healthReason: 'Sick Day',
    description: 'Lorem Ipsum is simply dummy text industry. Lorem Ipsum is simply dummy text industry.',
  };

  private items = signal<AvailabilityItem[]>([
    ...Array.from({ length: 6 }, (_, i) => ({
      ...this.availabilitySample,
      id: `a-${i + 1}`,
    })),
    { ...this.unavailabilitySample, id: 'u-1' },
    { ...this.unavailabilitySample, id: 'u-2' },
  ]);

  /* ── Computed ── */
  filteredItems = computed(() =>
    this.items().filter(i => i.type === this.activeTab())
  );

  totalItems = computed(() =>
    this.items().filter(i => i.type === this.activeTab()).length
  );

  /* ── Tab switch ── */
  onTabChange(tab: string): void {
    this.activeTab.set(tab as 'availability' | 'unavailability');
    this.addForm.patchValue({ type: tab });
  }

  /* ── Add modal ── */
  openAddModal(): void {
    this.addForm.reset({
      type: this.activeTab(),
      date: '',
      isFullDay: false,
      startTime: '10:00',
      endTime: '11:30',
      repeatType: 'once',
      healthReason: '',
      notes: '',
    });
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  submitAdd(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }
    const newItem = this.buildItemFromForm(this.addForm);
    this.items.update(items => [newItem, ...items]);
    this.closeAddModal();
  }

  /* ── Edit modal ── */
  onItemClick(item: unknown): void {
    this.openEditModal(item as AvailabilityItem);
  }

  openEditModal(item: AvailabilityItem): void {
    this.selectedItem.set(item);
    this.editForm.reset({
      type: item.type,
      date: item.dateValue ?? '',
      isFullDay: item.isFullDay,
      startTime: item.startTime ?? '10:00',
      endTime: item.endTime ?? '11:30',
      repeatType: item.repeatType ?? 'once',
      healthReason: item.healthReason ?? '',
      notes: item.notes ?? item.description ?? '',
    });
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedItem.set(null);
  }

  submitEdit(): void {
    if (this.editForm.invalid || !this.selectedItem()) {
      this.editForm.markAllAsTouched();
      return;
    }
    const updated = this.buildItemFromForm(this.editForm, this.selectedItem()!.id);
    this.items.update(items =>
      items.map(item => (item.id === updated.id ? updated : item))
    );
    this.closeEditModal();
  }

  deleteSelected(): void {
    const current = this.selectedItem();
    if (!current) return;
    this.items.update(items => items.filter(item => item.id !== current.id));
    this.closeEditModal();
  }

  /* ── Helpers ── */
  hasError(form: FormGroup, field: string): boolean {
    const c = form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  notesRemaining(form: FormGroup): number {
    const value = (form.get('notes')?.value ?? '') as string;
    return Math.max(0, this.notesLimit - value.length);
  }

  durationLabel(form: FormGroup): string {
    const isFullDay = !!form.get('isFullDay')?.value;
    if (isFullDay) return 'Full day';
    const start = form.get('startTime')?.value as string;
    const end = form.get('endTime')?.value as string;
    return this.calculateDuration(start, end) ?? '--';
  }

  private buildItemFromForm(form: FormGroup, id?: string): AvailabilityItem {
    const v = form.value as {
      type: AvailabilityCardType;
      date: string;
      isFullDay: boolean;
      startTime: string;
      endTime: string;
      repeatType: RepeatType;
      healthReason: string;
      notes: string;
    };
    const dateLabelShort = v.date ? this.formatShortDate(v.date) : '';
    const dateLabelLong = v.date ? this.formatLongDate(v.date) : '';
    const duration = this.calculateDuration(v.startTime, v.endTime);
    const title = this.buildTitle(v.type, dateLabelShort, v.isFullDay, v.startTime, v.endTime, duration);
    const repeatInfo = this.buildRepeatInfo(v.type, v.repeatType, dateLabelLong);
    const baseNotes = v.notes?.trim() || undefined;

    return {
      id: id ?? Date.now().toString(),
      type: v.type,
      title,
      isFullDay: !!v.isFullDay,
      dateValue: v.date || undefined,
      startTime: v.startTime || undefined,
      endTime: v.endTime || undefined,
      repeatType: v.repeatType,
      repeatInfo,
      healthReason: v.type === 'unavailability' ? (v.healthReason || undefined) : undefined,
      description: baseNotes,
      notes: baseNotes,
    };
  }

  private buildRepeatInfo(type: AvailabilityCardType, repeatType: RepeatType, dateLabel: string): string | undefined {
    if (repeatType === 'once') return undefined;
    const labelMap: Record<RepeatType, string> = {
      once: 'Once',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly',
    };
    const label = labelMap[repeatType];
    if (!dateLabel) return `Repeat ${label}`;
    return type === 'availability'
      ? `Repeat ${label} Effective from ${dateLabel} until ${dateLabel}`
      : `Repeat Every ${label.toLowerCase()} until ${dateLabel}.`;
  }

  private buildTitle(
    type: AvailabilityCardType,
    dateLabelShort: string,
    isFullDay: boolean,
    startTime: string,
    endTime: string,
    duration: string | null
  ): string {
    if (!dateLabelShort) return isFullDay ? 'Full day' : `${startTime} - ${endTime}`;
    if (type === 'availability' && isFullDay) return `${dateLabelShort} (Full day)`;
    const start = this.formatTime(startTime);
    const end = this.formatTime(endTime);
    const durationLabel = duration ? ` (${duration})` : '';
    return `${dateLabelShort} ${start} - ${end} AST${durationLabel}`;
  }

  private formatShortDate(dateValue: string): string {
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  }

  private formatLongDate(dateValue: string): string {
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US');
  }

  private formatTime(timeValue: string): string {
    const [hour, minute] = timeValue.split(':').map(Number);
    const date = new Date();
    date.setHours(hour || 0, minute || 0, 0, 0);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  private calculateDuration(start: string, end: string): string | null {
    if (!start || !end) return null;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    if (Number.isNaN(sh) || Number.isNaN(sm) || Number.isNaN(eh) || Number.isNaN(em)) return null;
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    const diff = Math.max(0, endMinutes - startMinutes);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    if (!diff) return '0h 0m';
    return `${hours}h ${minutes}m`;
  }
}
