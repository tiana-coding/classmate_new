import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent {
  // List of all events
  events: { title: string; date: string }[] = [];

  // Model for new event
  newEvent = {
    title: '',
    date: ''
  };

  add(): void {
    if (this.newEvent.title && this.newEvent.date) {
      this.events.push({ ...this.newEvent });
      this.newEvent = { title: '', date: '' };
    }
  }

  deleteEvent(index: number): void {
    this.events.splice(index, 1);
  }
}
