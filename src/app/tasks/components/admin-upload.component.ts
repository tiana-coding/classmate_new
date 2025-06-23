import { Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service.js';
import { Task } from '../models/task.model.js';
import { AuthService } from '../services/auth.service.js';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-upload',
  standalone: true,
  templateUrl: './admin-upload.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminUploadComponent implements OnInit {
  tasks: Task[] = [];
  editTask: Task|null = null;
  taskForm!: FormGroup;
  classes = ['L1','L2','L3','L4'];

  constructor(private svc: TasksService, public auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      class: ['', Validators.required],
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]],
      documentUrl: [''],
      externalUrl: ['']
    });
  }

  save() {
    if (this.editTask) {
      this.svc.updateTask(this.editTask).subscribe(() => this.refresh());
    }
  }

  create(newTask: Partial<Task>) {
    this.svc.createTask(newTask).subscribe(() => this.refresh());
  }

  delete(id: number) {
    this.svc.removeTask(id).subscribe(() => this.refresh());
  }

  private refresh() {
    this.svc.getTasksByClass(this.editTask?.class || 'L1').subscribe(data => this.tasks = data);
  }
}