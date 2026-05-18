import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsCardListComponent } from '../../shared/components/cs-card-list/cs-card-list.component';
import { CsCardTemplateDirective } from '../../shared/components/cs-card-list/cs-card-template.directive';
import { ClientCardComponent } from './components/client-card/client-card.component';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { ClientDetailModalComponent } from './components/client-detail-modal/client-detail-modal.component';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';

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
    CSIconComponent,
    ClientDetailModalComponent,
    CsPageHeaderComponent,
  ],
  templateUrl: './my-clients.component.html',
  styleUrls: ['./my-clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyClientsComponent {
  searchQuery = signal('');
  selectedClient = signal<Client | null>(null);
  showFlyout = signal(false);
  
  // Mock client data
  private readonly allClients: Client[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      phoneNumber: '(555) 123-4567',
      address: '123 Oak Street',
      city: 'Springfield',
      state: 'IL',
      status: 'Active',
      lastVisit: '2024-01-15',
      nextVisit: '2024-01-22',
    },
    {
      id: 2,
      firstName: 'Mary',
      lastName: 'Johnson',
      phoneNumber: '(555) 234-5678',
      address: '456 Maple Avenue',
      city: 'Chicago',
      state: 'IL',
      status: 'Active',
      lastVisit: '2024-01-14',
      nextVisit: '2024-01-21',
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Williams',
      phoneNumber: '(555) 345-6789',
      address: '789 Pine Road',
      city: 'Naperville',
      state: 'IL',
      status: 'Inactive',
      lastVisit: '2024-01-10',
    },
    {
      id: 4,
      firstName: 'Patricia',
      lastName: 'Brown',
      phoneNumber: '(555) 456-7890',
      address: '321 Elm Court',
      city: 'Evanston',
      state: 'IL',
      status: 'Active',
      lastVisit: '2024-01-16',
      nextVisit: '2024-01-23',
    },
    {
      id: 5,
      firstName: 'Michael',
      lastName: 'Davis',
      phoneNumber: '(555) 567-8901',
      address: '654 Cedar Lane',
      city: 'Oak Park',
      state: 'IL',
      status: 'Pending',
    },
    {
      id: 6,
      firstName: 'Jennifer',
      lastName: 'Miller',
      phoneNumber: '(555) 678-9012',
      address: '987 Birch Drive',
      city: 'Skokie',
      state: 'IL',
      status: 'Active',
      lastVisit: '2024-01-13',
      nextVisit: '2024-01-20',
    },
    {
      id: 7,
      firstName: 'William',
      lastName: 'Wilson',
      phoneNumber: '(555) 789-0123',
      address: '147 Walnut Street',
      city: 'Wilmette',
      state: 'IL',
      status: 'Active',
      lastVisit: '2024-01-12',
      nextVisit: '2024-01-19',
    },
    {
      id: 8,
      firstName: 'Elizabeth',
      lastName: 'Moore',
      phoneNumber: '(555) 890-1234',
      address: '258 Chestnut Avenue',
      city: 'Winnetka',
      state: 'IL',
      status: 'Inactive',
      lastVisit: '2024-01-05',
    },
    {
      id: 9,
      firstName: 'David',
      lastName: 'Taylor',
      phoneNumber: '(555) 901-2345',
      address: '369 Spruce Road',
      city: 'Highland Park',
      state: 'IL',
      status: 'Active',
      lastVisit: '2024-01-11',
      nextVisit: '2024-01-18',
    },
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

  onClientClick(client: Client): void {
    this.selectedClient.set(client);
    this.showFlyout.set(true);
  }

  closeFlyout(): void {
    this.showFlyout.set(false);
  }

  getClientName(client: Client): string {
    return `${client.firstName} ${client.lastName}`;
  }

  getClientAddress(client: Client): string {
    return `${client.address}, ${client.city}, ${client.state}`;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }
}
