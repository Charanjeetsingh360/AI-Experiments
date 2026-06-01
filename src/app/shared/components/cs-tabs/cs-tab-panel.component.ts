import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cs-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="cs-tab-panel" [hidden]="!active" role="tabpanel"><ng-content></ng-content></div>'
})
export class CsTabPanelComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() icon?: string;
  @Input() badge?: string | number;
  @Input() disabled?: boolean;
  @Input() active?: boolean;
}
