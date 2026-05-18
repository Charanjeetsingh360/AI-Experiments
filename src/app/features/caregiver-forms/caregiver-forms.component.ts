import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

@Component({
  selector: 'app-caregiver-forms',
  standalone: true,
  imports: [CSIconComponent, CsPageHeaderComponent],
  templateUrl: './caregiver-forms.component.html',
  styleUrl: './caregiver-forms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaregiverFormsComponent {}
