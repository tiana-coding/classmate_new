import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  imports: [CommonModule, TaskItemComponent]
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
}
