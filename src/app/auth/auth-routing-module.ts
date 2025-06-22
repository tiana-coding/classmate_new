import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(module => module.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register').then(module => module.RegisterComponent)
  }
];
