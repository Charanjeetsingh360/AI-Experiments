import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CSFlyoutComponent } from '../../shared/components/cs-flyout/cs-flyout.component';
import { CSIconComponent } from '../../shared/components/cs-icon/cs-icon.component';
import { ClientCardComponent } from './components/client-card/client-card.component';
import { ClientCarePlanFlyoutComponent } from './components/client-care-plan-flyout/client-care-plan-flyout.component';
import { ClientCompletedFormsFlyoutComponent } from './components/client-completed-forms-flyout/client-completed-forms-flyout.component';
import { ClientContactsFlyoutComponent, ClientContact } from './components/client-contacts-flyout/client-contacts-flyout.component';
import { ClientDetailFlyoutComponent, ClientShift } from './components/client-detail-flyout/client-detail-flyout.component';
import { ClientDocumentsFlyoutComponent, DocumentItem } from './components/client-documents-flyout/client-documents-flyout.component';
import { ClientOpenShiftsFlyoutComponent } from './components/client-open-shifts-flyout/client-open-shifts-flyout.component';
import type { IClient } from './models/client.model';

export type { IClient as Client };

@Component({
	selector: 'app-my-clients',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		CSFlyoutComponent,
		CSIconComponent,
		ClientCardComponent,
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
	readonly statusMessage = signal('');
	readonly searchQuery = signal('');
	readonly selectedClient = signal<IClient | null>(null);

	readonly showDetailFlyout = signal(false);
	readonly showContactsFlyout = signal(false);
	readonly showDocumentsFlyout = signal(false);
	readonly showCarePlanFlyout = signal(false);
	readonly showCompletedFormsFlyout = signal(false);
	readonly showOpenShiftsFlyout = signal(false);
	readonly showAssessmentFlyout = signal(false);
	readonly showMapDirections = signal(false);
	readonly assessmentSubmitted = signal(false);

	readonly upcomingShift = signal<ClientShift | null>(null);
	readonly clientContacts = signal<ClientContact[]>([]);
	readonly clientDocuments = signal<DocumentItem[]>([]);

	assessmentName = '';
	assessmentType = '';
	assessmentNotes = '';

	private readonly allClients: IClient[] = [
		this.createMarryEdisonClient('CLT-001'),
		this.createMarryEdisonClient('CLT-002'),
		this.createMarryEdisonClient('CLT-003'),
		this.createMarryEdisonClient('CLT-004'),
		{
			id: 'FAC-001',
			full_name: 'Caresmartz Healthcare',
			preferred_name: 'Caresmartz',
			age: 0,
			dob: '',
			gender: 'Facility',
			avatar_url: '',
			initials: 'CN',
			address: {
				street: '533 Hansen Junction Apt. 021',
				city: 'Lindmouth',
				state: 'Altaville, California',
				zip: '95221',
			},
			phone: '(123) 456-0987',
			email: 'facility@caresmartz360.com',
			status: 'Active',
			care_type: 'Facility Care',
			payer_type: 'Private Pay',
			diagnosis: [],
			authorized_hours_per_week: 0,
			caregiver_assigned: '',
			next_visit: '2026-05-23T02:00:00',
			care_plan_status: 'Approved',
			emergency_contact: { name: 'Facility Coordinator', relation: 'Coordinator', phone: '(123) 456-0987' },
			notes: 'Facility client displayed with initials fallback per Figma.',
		},
	];

	readonly filteredClients = computed(() => {
		const query = this.searchQuery().toLowerCase().trim();
		if (!query) {
			return this.allClients;
		}

		return this.allClients.filter(client =>
			client.full_name.toLowerCase().includes(query) ||
			client.phone.includes(query) ||
			client.address.street.toLowerCase().includes(query) ||
			client.address.city.toLowerCase().includes(query)
		);
	});

	refreshClients(): void {
		this.statusMessage.set('Clients refreshed.');
		setTimeout(() => this.statusMessage.set(''), 1500);
	}

	onClientClick(client: IClient): void {
		this.selectedClient.set(client);
		this.showMapDirections.set(false);
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

	closeDetailFlyout(): void {
		this.showDetailFlyout.set(false);
		this.showMapDirections.set(false);
		this.selectedClient.set(null);
	}

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
				this.assessmentSubmitted.set(false);
				this.showAssessmentFlyout.set(true);
				break;
		}
	}

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

	closeAssessmentFlyout(): void {
		this.showAssessmentFlyout.set(false);
		this.assessmentSubmitted.set(false);
	}

	saveAssessment(): void {
		this.assessmentSubmitted.set(true);
		if (!this.assessmentName.trim() || !this.assessmentType) {
			return;
		}

		const clientName = this.selectedClient()?.full_name ?? 'Client';
		this.statusMessage.set(`Assessment created for ${clientName}.`);
		this.assessmentName = '';
		this.assessmentType = '';
		this.assessmentNotes = '';
		this.closeAssessmentFlyout();
		setTimeout(() => this.statusMessage.set(''), 2000);
	}

	onSearch(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.searchQuery.set(value);
	}

	private loadContacts(): void {
		this.clientContacts.set([
			{ id: '1', name: 'John William', relationship: 'Son', phone: '(123) 456-0987', email: 'john.william@email.com', address: '99 Marina bay Street, New York' },
			{ id: '2', name: 'Sarah Edison', relationship: 'Daughter', phone: '(123) 456-0988', email: 'sarah.edison@email.com', address: '99 Marina bay Street, New York' },
		]);
	}

	private loadDocuments(): void {
		this.clientDocuments.set([
			{ id: '1', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
			{ id: '2', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
			{ id: '3', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
			{ id: '4', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
			{ id: '5', name: 'Self attested document', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
		]);
	}

	private createMarryEdisonClient(id: string): IClient {
		return {
			id,
			full_name: 'Marry, Edison',
			preferred_name: 'Marry',
			age: 76,
			dob: '1948-03-14',
			gender: 'Female',
			avatar_url: 'https://i.pravatar.cc/150?img=47',
			address: { street: '99 Marina bay Street', city: 'New York', state: '', zip: '' },
			phone: '(123) 456-0987',
			email: 'marry.edison@email.com',
			status: 'Active',
			care_type: 'Healthcare Services (Authorized)',
			payer_type: 'Private Pay',
			diagnosis: ['Healthcare Services'],
			authorized_hours_per_week: 8,
			caregiver_assigned: 'John William',
			next_visit: '2026-05-23T02:00:00',
			care_plan_status: 'Approved',
			emergency_contact: { name: 'John William', relation: 'Son', phone: '(123) 456-0987' },
			notes: 'Figma reference client for the My Clients card layout and detail flow.',
		};
	}
}
