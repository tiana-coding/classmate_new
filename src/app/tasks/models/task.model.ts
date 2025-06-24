export interface Task {
  id: number;
  aufgabenname: string; 
  fach: string;          
  dueDate: string;       
  completed: boolean;
  documentUrl?: string;
  externalUrl?: string;
}
