import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css']
})
export class CalendarComponent implements OnInit {
  // Eingabemodell für neues Event
  newEvent = {
    title: '',
    date: ''
  };

  // Terminliste im Format von FullCalendar
  events: { title: string; start: string }[] = [];

  // Aktuelles Datum
  today: Date = new Date();

  // Aktuelle Kalenderansicht (Standard: Monat)
  viewMode: string = 'dayGridMonth';

  // Kalenderoptionen
  
    calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: false, // falls du keine Navigation willst
    height: 'auto',       // passt sich dem Inhalt an
    contentHeight: 'auto',
    aspectRatio: 1.25,    // Verhältnis Breite:Höhe → 1.25 = 1:0.8
    events: this.events,
    dateClick: this.handleDateClick.bind(this),
  };

  // Zugriff auf FullCalendar-Komponente
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;

  // Initialisierung der Optionen in ngOnInit
  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: this.viewMode,
      editable: true,
      selectable: true,
      events: this.events,
      dateClick: this.handleDateClick.bind(this)
    };
  }

  // Formatierte Anzeige des heutigen Datums
  get formattedToday(): string {
    return this.today.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // Klick auf Datum im Kalender
  handleDateClick(arg: any): void {
    this.newEvent.date = arg.dateStr;
  }

  // Ansicht wechseln
  setView(mode: string): void {
    this.viewMode = mode;
    const calendarApi = this.calendarComponent?.getApi();
    if (calendarApi) {
      calendarApi.changeView(mode);
    }
  }

  // Termin hinzufügen
  add(): void {
    if (this.newEvent.title && this.newEvent.date) {
      const newEntry = {
        title: this.newEvent.title,
        start: this.newEvent.date
      };
      this.events = [...this.events, newEntry];
      this.calendarOptions.events = [...this.events];
      this.newEvent = { title: '', date: '' };
    }
  }

  // Termin löschen
  deleteEvent(index: number): void {
    this.events.splice(index, 1);
    this.calendarOptions.events = [...this.events];
  }
}
