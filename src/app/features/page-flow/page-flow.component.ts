import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

interface FlowPage {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly figmaNodeId: string;
  readonly figmaLabel: string;
  readonly status: 'implemented' | 'redirect';
}

interface ExternalFlowLink {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

const FIGMA_FILE_KEY = 'XCvAxa7G7QgiTfk08G2LGg';

@Component({
  selector: 'app-page-flow',
  standalone: true,
  imports: [CommonModule, RouterLink, CSIconComponent, CsPageHeaderComponent],
  templateUrl: './page-flow.component.html',
  styleUrl: './page-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageFlowComponent {
  readonly implementedPages: FlowPage[] = [
    {
      label: 'Home',
      route: '/home',
      icon: 'home',
      figmaNodeId: '2766-112482',
      figmaLabel: 'V3 / home',
      status: 'implemented',
    },
    {
      label: 'Shift Calendar',
      route: '/shift-calendar',
      icon: 'calendar_today',
      figmaNodeId: '183-59750',
      figmaLabel: 'V3 / My Schedule / Assigned',
      status: 'implemented',
    },
    {
      label: 'My Clients',
      route: '/clients',
      icon: 'groups',
      figmaNodeId: '34-10326',
      figmaLabel: 'CG / My Clients > Primary Frame',
      status: 'implemented',
    },
    {
      label: 'Messages',
      route: '/messages',
      icon: 'mail',
      figmaNodeId: '412-220750',
      figmaLabel: 'Chat V3 / Full Screen',
      status: 'implemented',
    },
    {
      label: 'Availability',
      route: '/availability',
      icon: 'event_busy',
      figmaNodeId: '183-59719',
      figmaLabel: 'V2 / Available Shift(s)',
      status: 'implemented',
    },
    {
      label: 'Documents',
      route: '/documents',
      icon: 'description',
      figmaNodeId: '183-59993',
      figmaLabel: 'V1 / Key Documents',
      status: 'implemented',
    },
    {
      label: 'Caregiver Forms',
      route: '/caregiver-forms',
      icon: 'assignment',
      figmaNodeId: '183-127256',
      figmaLabel: 'Caregiver Forms',
      status: 'implemented',
    },
    {
      label: 'Trainings',
      route: '/trainings',
      icon: 'school',
      figmaNodeId: '183-59923',
      figmaLabel: 'Trainings / V3',
      status: 'implemented',
    },
  ];

  readonly redirects: FlowPage[] = [
    {
      label: 'Legacy Dashboard',
      route: '/dashboard',
      icon: 'swap_horiz',
      figmaNodeId: '2766-112482',
      figmaLabel: 'Redirects to Home',
      status: 'redirect',
    },
    {
      label: 'Legacy Schedule',
      route: '/schedule',
      icon: 'swap_horiz',
      figmaNodeId: '183-59750',
      figmaLabel: 'Redirects to Shift Calendar',
      status: 'redirect',
    },
  ];

  readonly externalLinks: ExternalFlowLink[] = [
    {
      label: 'Learn2Care',
      href: 'https://learn2care.com',
      icon: 'menu_book',
    },
    {
      label: 'LMS',
      href: 'https://lms.caresmart.com',
      icon: 'launch',
    },
  ];

  readonly figmaFileUrl = `https://www.figma.com/design/${FIGMA_FILE_KEY}`;

  getFigmaNodeUrl(nodeId: string): string {
    return `${this.figmaFileUrl}?node-id=${nodeId}`;
  }
}
