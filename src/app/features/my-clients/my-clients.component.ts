import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsPageHeaderComponent } from '../../shared/components/cs-page-header/cs-page-header.component';
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
		CsPageHeaderComponent,
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
		{
			id: 'CLT-001', full_name: 'Margaret Holloway', preferred_name: 'Maggie', age: 78,
			dob: '1946-03-12', gender: 'Female', avatar_url: 'https://i.pravatar.cc/150?img=47',
			address: { street: '142 Maple Grove Lane', city: 'Austin', state: 'TX', zip: '78701' },
			phone: '+1 (512) 334-7821', email: 'm.holloway@email.com', status: 'Active',
			care_type: 'Personal Care', payer_type: 'Medicaid',
			diagnosis: ['Mild Dementia', 'Type 2 Diabetes', 'Hypertension'],
			authorized_hours_per_week: 28, caregiver_assigned: 'Rosa Martinez',
			next_visit: '2026-05-23T09:00:00', care_plan_status: 'Approved',
			emergency_contact: { name: 'David Holloway', relation: 'Son', phone: '+1 (512) 887-4421' },
			notes: 'Prefers morning visits. Requires assistance with bathing and medication reminders.',
		},
		{
			id: 'CLT-002', full_name: 'Robert Chen', preferred_name: 'Bob', age: 83,
			dob: '1942-11-05', gender: 'Male', avatar_url: 'https://i.pravatar.cc/150?img=67',
			address: { street: '88 Sunset Blvd', city: 'Houston', state: 'TX', zip: '77002' },
			phone: '+1 (713) 445-9023', email: 'robertchen42@gmail.com', status: 'Active',
			care_type: 'Skilled Nursing', payer_type: 'VA Benefits',
			diagnosis: ['COPD', 'Post-Stroke', 'Arthritis'],
			authorized_hours_per_week: 35, caregiver_assigned: 'James Okafor',
			next_visit: '2026-05-23T11:30:00', care_plan_status: 'Pending Review',
			emergency_contact: { name: 'Linda Chen', relation: 'Daughter', phone: '+1 (713) 667-3310' },
			notes: 'Veteran. Speaks Mandarin and English. Wheelchair user. Needs help with wound care.',
		},
		{
			id: 'CLT-003', full_name: 'Eleanor Vasquez', preferred_name: 'Ellie', age: 71,
			dob: '1954-07-22', gender: 'Female', avatar_url: 'https://i.pravatar.cc/150?img=44',
			address: { street: '305 Birchwood Dr', city: 'San Antonio', state: 'TX', zip: '78205' },
			phone: '+1 (210) 556-7401', email: 'evasquez71@outlook.com', status: 'Active',
			care_type: 'Companion Care', payer_type: 'Private Pay',
			diagnosis: ["Parkinson's Disease", 'Depression'],
			authorized_hours_per_week: 20, caregiver_assigned: 'Angela Brooks',
			next_visit: '2026-05-24T14:00:00', care_plan_status: 'Approved',
			emergency_contact: { name: 'Carlos Vasquez', relation: 'Husband', phone: '+1 (210) 998-3411' },
			notes: 'Lives with husband. Enjoys reading and TV. Benefits from social engagement.',
		},
		{
			id: 'CLT-004', full_name: 'Harold Simmons', preferred_name: 'Harry', age: 89,
			dob: '1936-09-01', gender: 'Male', avatar_url: 'https://i.pravatar.cc/150?img=70',
			address: { street: '17 Oak Hill Road', city: 'Dallas', state: 'TX', zip: '75201' },
			phone: '+1 (214) 773-6650', email: 'hsimmons1936@yahoo.com', status: 'On Hold',
			care_type: 'Personal Care + Homemaking', payer_type: 'Long Term Care Insurance',
			diagnosis: ['Congestive Heart Failure', 'Hearing Loss', 'Mild Cognitive Impairment'],
			authorized_hours_per_week: 42, caregiver_assigned: 'Maria Patel',
			next_visit: '2026-05-27T08:00:00', care_plan_status: 'Expiring Soon',
			emergency_contact: { name: 'Susan Simmons-Clark', relation: 'Daughter', phone: '+1 (214) 882-4100' },
			notes: 'On hold due to hospitalization. Hearing aids needed for all visits. Likes routine.',
		},
		{
			id: 'CLT-005', full_name: 'Dorothy Nguyen', preferred_name: 'Dot', age: 75,
			dob: '1950-02-18', gender: 'Female', avatar_url: 'https://i.pravatar.cc/150?img=56',
			address: { street: '920 Lavender Court', city: 'Fort Worth', state: 'TX', zip: '76102' },
			phone: '+1 (817) 662-5540', email: 'dot.nguyen50@gmail.com', status: 'Active',
			care_type: 'Skilled Nursing + Physical Therapy', payer_type: 'Medicare',
			diagnosis: ['Hip Replacement Recovery', 'Osteoporosis', 'Hypertension'],
			authorized_hours_per_week: 30, caregiver_assigned: 'Kevin Walsh',
			next_visit: '2026-05-22T10:00:00', care_plan_status: 'Approved',
			emergency_contact: { name: 'Tran Nguyen', relation: 'Son', phone: '+1 (817) 445-7788' },
			notes: 'Post-surgery recovery. Requires PT twice weekly. Vietnamese-speaking family.',
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
}
