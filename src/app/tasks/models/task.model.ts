export interface Task {
  id: number;
  title: string;
  dueDate: string;       // ISO-Datum, z.B. "2025-07-01"
  completed: boolean;
  documentUrl?: string;  // Pfad zu hochgeladenem Dokument
}