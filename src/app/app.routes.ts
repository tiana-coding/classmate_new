import { Routes } from '@angular/router';
import { Feedback } from './feedback/feedback';

export const routes: Routes = [
{
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routing-module').then(m => m.routes)
},
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
 /* { path: 'feedback', component: Feedback },
  { path: '', redirectTo: 'feedback', pathMatch: 'full' },
  { path: '**', redirectTo: 'feedback' } */ 
];
