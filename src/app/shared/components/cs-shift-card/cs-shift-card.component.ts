import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CSIconComponent } from '../cs-icon/cs-icon.component';

export type ShiftCardStatus =
  | 'completed'
  | 'clocked-in'
  | 'upcoming'
  | 'missed'
  | 'open'
  | 'offered'
  | 'applied'
  | 'declined';

export type ShiftCardTone = 'scheduled' | 'approved' | 'open' | 'meeting' | 'in-progress';

export interface ShiftCardData {
  id: string;
  clientName: string;
  clientAddress: string;
  distance?: string;
  avatarUrl?: string;
  date?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  duration: string;
  clockInTime?: string;
  clockOutTime?: string;
  status: ShiftCardStatus;
  serviceType?: string;
  serviceCode?: string;
  notes?: string;
  tone?: ShiftCardTone;
}

@Component({
  selector: 'cs-shift-card',
  standalone: true,
  imports: [CommonModule, CSIconComponent],
  templateUrl: './cs-shift-card.component.html',
  styleUrl: './cs-shift-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses',
    '[attr.data-tone]': 'resolvedTone',
    '[attr.data-status]': 'shift?.status',
    role: 'group',
  },
})
export class CsShiftCardComponent {
  @Input({ required: true }) shift!: ShiftCardData;

  @Output() shiftClick = new EventEmitter<ShiftCardData>();
  @Output() notesClick = new EventEmitter<ShiftCardData>();
  @Output() clockOut = new EventEmitter<ShiftCardData>();
  @Output() clockIn = new EventEmitter<ShiftCardData>();

  protected readonly defaultAvatar =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0M0QTg4MiIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTciIHI9IjkiIGZpbGw9IiNENEE4ODQiLz48ZWxsaXBzZSBjeD0iMjAiIGN5PSIzOCIgcng9IjE0IiByeT0iMTAiIGZpbGw9IiM4QjY5MTQiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxLjgiIGZpbGw9IiMzRDJCMUYiLz48Y2lyY2xlIGN4PSIyNCIgY3k9IjE2IiByPSIxLjgiIGZpbGw9IiMzRDJCMUYiLz48cGF0aCBkPSJNMTYgMjEuNSBRMjAgMjUgMjQgMjEuNSIgc3Ryb2tlPSIjOEI2MzQ4IiBzdHJva2Utd2lkdGg9IjEuMiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==';

  get resolvedTone(): ShiftCardTone {
    if (this.shift?.tone) return this.shift.tone;
    switch (this.shift?.status) {
      case 'completed':
        return 'approved';
      case 'clocked-in':
        return 'in-progress';
      case 'open':
      case 'offered':
      case 'applied':
      case 'declined':
      case 'missed':
        return 'open';
      default:
        return 'scheduled';
    }
  }

  get hostClasses(): string {
    return 'cs-shift-card';
  }

  get isActive(): boolean {
    return this.shift?.status === 'clocked-in';
  }

  get serviceCode(): string {
    if (this.shift?.serviceCode) return this.shift.serviceCode;
    if (this.shift?.serviceType) return this.shift.serviceType.charAt(0).toUpperCase();
    return 'A';
  }

  onCardClick(): void {
    this.shiftClick.emit(this.shift);
  }

  onNotesClick(event: Event): void {
    event.stopPropagation();
    this.notesClick.emit(this.shift);
  }

  onClockOut(event: Event): void {
    event.stopPropagation();
    this.clockOut.emit(this.shift);
  }

  onClockIn(event: Event): void {
    event.stopPropagation();
    this.clockIn.emit(this.shift);
  }
}
