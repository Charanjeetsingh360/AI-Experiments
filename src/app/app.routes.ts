import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard - CareGiver 360'
      },
      {
        path: 'schedule',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'My Schedule - CareGiver 360'
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/my-clients/my-clients.component')
          .then(m => m.MyClientsComponent),
        title: 'My Clients - CareGiver 360'
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Documents - CareGiver 360'
      },
      {
        path: 'trainings',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Trainings - CareGiver 360'
      },
      {
        path: 'availability',
        loadComponent: () => import('./features/availability/availability.component')
          .then(m => m.AvailabilityComponent),
        title: 'Availability - CareGiver 360'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

