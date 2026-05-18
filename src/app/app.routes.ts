import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Home - CareGiver 360'
      },
      {
        path: 'shift-calendar',
        loadComponent: () => import('./features/shift-calendar/shift-calendar.component')
          .then(m => m.ShiftCalendarComponent),
        title: 'Shift Calendar - CareGiver 360'
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/my-clients/my-clients.component')
          .then(m => m.MyClientsComponent),
        title: 'My Clients - CareGiver 360'
      },
      {
        path: 'availability',
        loadComponent: () => import('./features/availability/availability.component')
          .then(m => m.AvailabilityComponent),
        title: 'Availability - CareGiver 360'
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/documents.component')
          .then(m => m.DocumentsComponent),
        title: 'Documents - CareGiver 360'
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/messages/messages.component')
          .then(m => m.MessagesComponent),
        title: 'Messages - CareGiver 360'
      },
      {
        path: 'caregiver-forms',
        loadComponent: () => import('./features/caregiver-forms/caregiver-forms.component')
          .then(m => m.CaregiverFormsComponent),
        title: 'Caregiver Forms - CareGiver 360'
      },
      {
        path: 'trainings',
        loadComponent: () => import('./features/trainings/trainings.component')
          .then(m => m.TrainingsComponent),
        title: 'Trainings - CareGiver 360'
      },
      // Legacy redirects
      { path: 'dashboard', redirectTo: 'home', pathMatch: 'full' },
      { path: 'schedule',  redirectTo: 'shift-calendar', pathMatch: 'full' },
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

