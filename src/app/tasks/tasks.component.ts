import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { TasksService }      from './services/tasks.service';
import { Task }              from './models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];

  newAufgabenname = '';
  newDueDate      = '';
  selectedFile?: File;
  today = new Date().toISOString().split('T')[0];

  constructor(private svc: TasksService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.svc.getTasks().subscribe(all => {
      // Offen nach Datum aufsteigend, dann Erledigte nach Datum aufsteigend
      const open = all
        .filter(t => !t.completed)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      const done = all
        .filter(t => t.completed)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      this.tasks = [...open, ...done];
    });
  }

  toggle(task: Task): void {
    if (task.completed && task.dueDate < this.today) return;
    task.completed = !task.completed;
    this.svc.updateTasks(this.tasks).subscribe(() => this.load());
  }

  onFileChange(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  addTask(): void {
    const name = this.newAufgabenname.trim();
    const due  = this.newDueDate;
    if (!name || !due) return;

    const nextId = this.tasks.length
      ? Math.max(...this.tasks.map(t => t.id)) + 1
      : 1;

    const create = (path?: string) => {
      const newTask: Task = {
        id: nextId,
        aufgabenname: name,
        fach: '',            // aktuell leer, kann später erweitert werden
        dueDate: due,
        completed: false,
        documentUrl: path || ''
      };
      this.tasks.push(newTask);
      this.svc.updateTasks(this.tasks).subscribe(() => this.load());
    };

    if (this.selectedFile) {
      this.svc.uploadDocument(this.selectedFile)
        .subscribe(res => create(res.path));
    } else {
      create();
    }

    this.newAufgabenname = '';
    this.newDueDate      = '';
    this.selectedFile    = undefined;
  }
}
