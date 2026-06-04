import { Routes } from '@angular/router';

export const devRoutes: Routes = [
  {
    path: 'page-flow',
    loadComponent: () => import('./features/page-flow/page-flow.component')
      .then(m => m.PageFlowComponent),
    title: 'Dev Only - Page Flow - CareGiver 360',
  },
];
