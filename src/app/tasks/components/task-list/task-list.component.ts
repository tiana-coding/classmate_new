import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model.js';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({ 
  selector: 'app-task-list',
  templateUrl: './task-list.component.html' ,
  imports: [CommonModule, TaskItemComponent]})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  trackById(index: number, item: Task): number {
    return item.id;
  }


}
