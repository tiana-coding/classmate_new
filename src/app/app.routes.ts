import { Routes } from '@angular/router';
<<<<<<< HEAD
import { HomeComponent } from './home/home';
import { AgendaComponent } from './agenda/agenda';
import { LeaderboardComponent } from './leaderboard/leaderboard';
=======
import { Feedback } from './feedback/feedback';
>>>>>>> 79eeae9d45554f5684592b696bd145813256aa0e

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routing-module').then(m => m.routes)
<<<<<<< HEAD
  },
  { path: '**', redirectTo: '' }
=======
},
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
 /* { path: 'feedback', component: Feedback },
  { path: '', redirectTo: 'feedback', pathMatch: 'full' },
  { path: '**', redirectTo: 'feedback' } */ 
>>>>>>> 79eeae9d45554f5684592b696bd145813256aa0e
];
