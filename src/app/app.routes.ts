import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './dashboard/dashboard';
import { AgendaComponent } from './agenda/agenda';
import { LeaderboardComponent } from './leaderboard/leaderboard';
import { ForumComponent } from './forum/forum';
import { FeedbackComponent } from './feedback/feedback';
import { TasksComponent } from './tasks/tasks.component';



export const routes: Routes = [
  { path: '',            component: HomeComponent },
  { path: 'agenda',      component: AgendaComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'forum',       component: ForumComponent },
  { path: 'dashboard',   component: DashboardComponent },
  { path: 'feedback',    component: FeedbackComponent },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./tasks/tasks.module').then(m => m.TasksModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth-routing-module').then(m => m.routes)
  },
  { path: '**', redirectTo: '' }
];