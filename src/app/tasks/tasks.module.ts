import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { TaskStatsComponent } from './components/task-stats.component';
import { AdminUploadComponent } from './components/admin-upload.component';

@NgModule({
  
  declarations: [], 

  
  imports: [
    RouterModule,
    TasksRoutingModule,

    TaskListComponent,
    TaskItemComponent,
    TaskStatsComponent,
    AdminUploadComponent
  ]
})
export class TasksModule {}
