import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AgendaComponent } from './agenda/agenda';
import { LeaderboardComponent } from './leaderboard/leaderboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routing-module').then(m => m.routes)
  },
  { path: '**', redirectTo: '' }
];
