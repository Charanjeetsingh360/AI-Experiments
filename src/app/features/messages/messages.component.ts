import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CSIconComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {}
