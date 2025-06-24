import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private api = '/api/tasks';

  constructor(private http: HttpClient) {}

  /** Alle Tasks holen */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }

  /** Komplette Liste speichern */
  updateTasks(tasks: Task[]): Observable<any> {
    return this.http.put(this.api, tasks);
  }

  /** Ein Dokument hochladen */
  uploadDocument(file: File): Observable<{ path: string }> {
    const fd = new FormData();
    fd.append('document', file);
    return this.http.post<{ path: string }>(`${this.api}/uploadDoc`, fd);
  }
}
