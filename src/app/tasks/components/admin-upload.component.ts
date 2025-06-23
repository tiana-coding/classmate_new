import { Component, OnInit } from '@angular/core';
import { TasksService } from '../services/tasks.service.js';
import { Task } from '../models/task.model.js';
import { AuthService } from '../services/auth.service.js';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-upload',
  standalone: true,
  templateUrl: './admin-upload.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminUploadComponent implements OnInit {
  tasks: Task[] = [];
  editTask: Task | null = null;
  taskForm!: FormGroup;
  classes = ['L1', 'L2', 'L3', 'L4'];

  constructor(
    private svc: TasksService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.taskForm = this.fb.group({
      class: ['', Validators.required],
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]],
      documentUrl: [''],
      externalUrl: ['']
    });

    this.refresh(); // initiales Laden
  }

  save() {
    if (this.editTask) {
      const updatedTask = { ...this.editTask, ...this.taskForm.value };
      this.svc.updateTask(updatedTask).subscribe(() => {
        this.editTask = null;
        this.taskForm.reset();
        this.refresh();
      });
    } else {
      const newTask: Partial<Task> = this.taskForm.value;
      this.create(newTask);
    }
  }

  edit(task: Task) {
    this.editTask = { ...task };
    this.taskForm.patchValue(task);
  }

  cancel() {
    this.editTask = null;
    this.taskForm.reset();
  }

  create(newTask: Partial<Task>) {
    this.svc.createTask(newTask).subscribe(() => {
      this.taskForm.reset();
      this.refresh();
    });
  }

  deleteTask(id: number) {
    this.delete(id);
  }

  delete(id: number) {
    this.svc.removeTask(id).subscribe(() => this.refresh());
  }

  private refresh() {
    const selectedClass = this.editTask?.class || 'L1';
    this.svc.getTasksByClass(selectedClass).subscribe(data => this.tasks = data);
  }
}
