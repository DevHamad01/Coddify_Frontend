import { Routes } from '@angular/router';

import { PublicLayout } from './layouts/public-layout/public-layout';

const comingSoon = () => import('./features/coming-soon/coming-soon').then((m) => m.ComingSoon);

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Coddify | Learn to code, one small win a day',
        loadComponent: () => import('./features/landing/landing/landing').then((m) => m.Landing),
      },
      { path: 'about', title: 'About | Coddify', data: { title: 'About Coddify' }, loadComponent: comingSoon },
      { path: 'contact', title: 'Contact | Coddify', data: { title: 'Contact us' }, loadComponent: comingSoon },
      { path: 'privacy', title: 'Privacy | Coddify', data: { title: 'Privacy policy' }, loadComponent: comingSoon },
      { path: 'terms', title: 'Terms | Coddify', data: { title: 'Terms of use' }, loadComponent: comingSoon },
    ],
  },
  { path: '**', redirectTo: '' },
];
