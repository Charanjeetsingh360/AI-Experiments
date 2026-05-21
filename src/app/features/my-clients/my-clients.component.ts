import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsCardListComponent } from '../../shared/components/cs-card-list/cs-card-list.component';
import { CsCardTemplateDirective } from '../../shared/components/cs-card-list/cs-card-template.directive';
import { ClientCardComponent } from './components/client-card/client-card.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';
import { ClientDetailFlyoutComponent, ClientShift } from './components/client-detail-flyout/client-detail-flyout.component';
import { ClientContactsFlyoutComponent, ClientContact } from './components/client-contacts-flyout/client-contacts-flyout.component';
import { ClientDocumentsFlyoutComponent, DocumentItem } from './components/client-documents-flyout/client-documents-flyout.component';
import { ClientCarePlanFlyoutComponent } from './components/client-care-plan-flyout/client-care-plan-flyout.component';
import { ClientCompletedFormsFlyoutComponent } from './components/client-completed-forms-flyout/client-completed-forms-flyout.component';
import { ClientOpenShiftsFlyoutComponent } from './components/client-open-shifts-flyout/client-open-shifts-flyout.component';

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastVisit?: string;
  nextVisit?: string;
}

@Component({
  selector: 'app-my-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CsCardListComponent,
    CsCardTemplateDirective,
    ClientCardComponent,
    CsPageHeaderComponent,
    ClientDetailFlyoutComponent,
    ClientContactsFlyoutComponent,
    ClientDocumentsFlyoutComponent,
    ClientCarePlanFlyoutComponent,
    ClientCompletedFormsFlyoutComponent,
    ClientOpenShiftsFlyoutComponent,
  ],
  templateUrl: './my-clients.component.html',
  styleUrls: ['./my-clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyClientsComponent {
  searchQuery = signal('');
  selectedClient = signal<Client | null>(null);

  /* ── Flyout states ── */
  showDetailFlyout = signal(false);
  showContactsFlyout = signal(false);
  showDocumentsFlyout = signal(false);
  showCarePlanFlyout = signal(false);
  showCompletedFormsFlyout = signal(false);
  showOpenShiftsFlyout = signal(false);
  showMapDirections = signal(false);

  /* ── Data for flyouts ── */
  upcomingShift = signal<ClientShift | null>(null);
  clientContacts = signal<ClientContact[]>([]);
  clientDocuments = signal<DocumentItem[]>([]);

  // Mock client data
  private readonly allClients: Client[] = [
    { id: 1, firstName: 'John', lastName: 'Smith', phoneNumber: '(555) 123-4567', address: '123 Oak Street', city: 'Springfield', state: 'IL', status: 'Active', lastVisit: '2024-01-15', nextVisit: '2024-01-22' },
    { id: 2, firstName: 'Mary', lastName: 'Johnson', phoneNumber: '(555) 234-5678', address: '456 Maple Avenue', city: 'Chicago', state: 'IL', status: 'Active', lastVisit: '2024-01-14', nextVisit: '2024-01-21' },
    { id: 3, firstName: 'Robert', lastName: 'Williams', phoneNumber: '(555) 345-6789', address: '789 Pine Road', city: 'Naperville', state: 'IL', status: 'Inactive', lastVisit: '2024-01-10' },
    { id: 4, firstName: 'Patricia', lastName: 'Brown', phoneNumber: '(555) 456-7890', address: '321 Elm Court', city: 'Evanston', state: 'IL', status: 'Active', lastVisit: '2024-01-16', nextVisit: '2024-01-23' },
    { id: 5, firstName: 'Michael', lastName: 'Davis', phoneNumber: '(555) 567-8901', address: '654 Cedar Lane', city: 'Oak Park', state: 'IL', status: 'Pending' },
    { id: 6, firstName: 'Jennifer', lastName: 'Miller', phoneNumber: '(555) 678-9012', address: '987 Birch Drive', city: 'Skokie', state: 'IL', status: 'Active', lastVisit: '2024-01-13', nextVisit: '2024-01-20' },
    { id: 7, firstName: 'William', lastName: 'Wilson', phoneNumber: '(555) 789-0123', address: '147 Walnut Street', city: 'Wilmette', state: 'IL', status: 'Active', lastVisit: '2024-01-12', nextVisit: '2024-01-19' },
    { id: 8, firstName: 'Elizabeth', lastName: 'Moore', phoneNumber: '(555) 890-1234', address: '258 Chestnut Avenue', city: 'Winnetka', state: 'IL', status: 'Inactive', lastVisit: '2024-01-05' },
    { id: 9, firstName: 'David', lastName: 'Taylor', phoneNumber: '(555) 901-2345', address: '369 Spruce Road', city: 'Highland Park', state: 'IL', status: 'Active', lastVisit: '2024-01-11', nextVisit: '2024-01-18' },
  ];

  filteredClients = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allClients;
    return this.allClients.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(query) ||
      client.phoneNumber.includes(query) ||
      client.address.toLowerCase().includes(query) ||
      client.city.toLowerCase().includes(query)
    );
  });

  totalClients = computed(() => this.filteredClients().length);

  /* ── Client click → open detail flyout ── */
  onClientClick(client: Client): void {
    this.selectedClient.set(client);
    this.showMapDirections.set(false);

    // Mock upcoming shift for selected client
    this.upcomingShift.set({
      id: `shift-${client.id}`,
      startDate: 'MM/DD/YY',
      startTime: '2:00 AM (AST)',
      endDate: 'MM/DD/YY',
      endTime: '2:30 AM (AST)',
      duration: '0h 30m',
      serviceType: 'Healthcare Services (Authorized) - 123445',
      totalHrs: '8.00',
      remainingHrs: '8.00',
      payRate: '$30/15 min',
      estimatedEarnings: '$60',
      isBackToBack: true,
    });

    this.showDetailFlyout.set(true);
  }

  /* ── Close detail flyout ── */
  closeDetailFlyout(): void {
    this.showDetailFlyout.set(false);
    this.showMapDirections.set(false);
    this.selectedClient.set(null);
  }

  /* ── Handle actions from detail flyout ── */
  onClientAction(action: string): void {
    switch (action) {
      case 'care-plan':
        this.showCarePlanFlyout.set(true);
        break;
      case 'map-directions':
        this.showMapDirections.set(!this.showMapDirections());
        break;
      case 'contacts':
        this.loadContacts();
        this.showContactsFlyout.set(true);
        break;
      case 'client-documents':
        this.loadDocuments();
        this.showDocumentsFlyout.set(true);
        break;
      case 'completed-forms':
        this.showCompletedFormsFlyout.set(true);
        break;
      case 'open-shifts':
        this.showOpenShiftsFlyout.set(true);
        break;
      case 'create-assessment':
        // Placeholder — not yet implemented
        break;
    }
  }

  /* ── Close sub-flyouts ── */
  closeContactsFlyout(): void {
    this.showContactsFlyout.set(false);
  }

  closeDocumentsFlyout(): void {
    this.showDocumentsFlyout.set(false);
  }

  closeCarePlanFlyout(): void {
    this.showCarePlanFlyout.set(false);
  }

  closeCompletedFormsFlyout(): void {
    this.showCompletedFormsFlyout.set(false);
  }

  closeOpenShiftsFlyout(): void {
    this.showOpenShiftsFlyout.set(false);
  }

  /* ── Mock data loaders ── */
  private loadContacts(): void {
    this.clientContacts.set([
      { id: '1', name: 'Sarah Smith', relationship: 'Daughter', phone: '(555) 111-2222', email: 'sarah@email.com', address: '123 Oak St, Springfield, IL' },
      { id: '2', name: 'James Smith', relationship: 'Son', phone: '(555) 333-4444', email: 'james@email.com', address: '456 Elm St, Springfield, IL' },
      { id: '3', name: 'Dr. Wilson', relationship: 'Primary Physician', phone: '(555) 555-6666', email: 'dr.wilson@clinic.com', address: '789 Medical Center Dr, Springfield, IL' },
    ]);
  }

  private loadDocuments(): void {
    this.clientDocuments.set([
      { id: '1', name: 'Care Authorization Letter', type: 'DOCUMENT', updatedOn: '01/15/2024', fileFormat: 'pdf' },
      { id: '2', name: 'HIPAA Consent Form', type: 'COMPLIANCE', updatedOn: '01/10/2024', fileFormat: 'pdf' },
      { id: '3', name: 'Emergency Contact Sheet', type: 'DOCUMENT', updatedOn: '12/20/2023', fileFormat: 'docx' },
      { id: '4', name: 'Medication List', type: 'DOCUMENT', updatedOn: '01/12/2024', fileFormat: 'pdf' },
    ]);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}
