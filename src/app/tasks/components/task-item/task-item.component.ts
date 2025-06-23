import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Task } from '../../models/task.model.js';
import { AuthService } from '../../services/auth.service.js';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-item.component.html'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggle = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  constructor(public auth: AuthService) {}

  trackById(index: number, item: Task) {
    return item.id;
  }
}