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
  newTitle = '';
  newDueDate = '';
  selectedFile?: File;
  today = new Date().toISOString().split('T')[0];

  constructor(private svc: TasksService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.svc.getTasks().subscribe(all => {
      const incomplete = all
        .filter(t => !t.completed)
        // aufsteigend: ältestes Datum zuerst
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

      const complete = all
        .filter(t => t.completed)
        // absteigend: neuestes Datum zuerst
        .sort((a, b) => b.dueDate.localeCompare(a.dueDate));

      this.tasks = [...incomplete, ...complete];
    });
  }

  toggle(t: Task): void {
    if (t.completed && t.dueDate < this.today) return;
    t.completed = !t.completed;
    this.svc.updateTasks(this.tasks).subscribe(() => this.load());
  }

  onFileChange(ev: Event): void {
    const inp = ev.target as HTMLInputElement;
    if (inp.files?.length) this.selectedFile = inp.files[0];
  }

  addTask(): void {
    const title = this.newTitle.trim();
    const due   = this.newDueDate;
    if (!title || !due) return;

    const nextId = this.tasks.length
      ? Math.max(...this.tasks.map(x => x.id)) + 1
      : 1;

    const create = (path?: string) => {
      const newTask: Task = {
        id: nextId,
        title,
        dueDate: due,
        completed: false,
        documentUrl: path || ''
      };
      this.tasks.push(newTask);
      this.svc.updateTasks(this.tasks).subscribe(() => this.load());
    };

    if (this.selectedFile) {
      this.svc.uploadDocument(this.selectedFile).subscribe(res => create(res.path));
    } else {
      create();
    }

    this.newTitle = '';
    this.newDueDate = '';
    this.selectedFile = undefined;
  }
}
