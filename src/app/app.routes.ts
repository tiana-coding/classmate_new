import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CalendarComponent } from './calendar/calendar';
import { DashboardComponent } from './dashboard/dashboard';
import { AgendaComponent } from './agenda/agenda';
import { LeaderboardComponent } from './leaderboard/leaderboard';
import { ForumComponent } from './forum/forum';
import { FeedbackComponent } from './feedback/feedback';

import { TasksComponent }      from './tasks/tasks.component';  // standalone!
import { GamificationComponent } from './gamification/gamification';
import { ProfileComponent }      from './profile/profile';
import { EditProfileComponent }  from './edit-profile/edit-profile';

export const routes: Routes = [
  { path: '',          component: HomeComponent },
  { path: 'calendar',  component: CalendarComponent },
  { path: 'agenda',    component: AgendaComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'forum',     component: ForumComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'feedback',  component: FeedbackComponent },

  {
    path: 'tasks',
    loadComponent: () =>
      import('./tasks/tasks.component').then(m => m.TasksComponent)
  },

  { path: 'gamification', component: GamificationComponent },
  { path: 'profile',      component: ProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routing-module').then(m => m.routes)
  },
  { path: '**', redirectTo: '' }
];
