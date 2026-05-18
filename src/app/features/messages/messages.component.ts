import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CSIconComponent, CsPageHeaderComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {}
