export interface IClientAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IClientEmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface IClient {
  id: string;
  full_name: string;
  preferred_name: string;
  age: number;
  dob: string;
  gender: 'Male' | 'Female' | string;
  avatar_url: string;
  initials?: string;
  address: IClientAddress;
  phone: string;
  email: string;
  status: 'Active' | 'On Hold' | 'Inactive';
  care_type: string;
  payer_type: string;
  diagnosis: string[];
  authorized_hours_per_week: number;
  caregiver_assigned: string;
  next_visit: string;
  care_plan_status: 'Approved' | 'Pending Review' | 'Expiring Soon';
  emergency_contact: IClientEmergencyContact;
  notes: string;
}
