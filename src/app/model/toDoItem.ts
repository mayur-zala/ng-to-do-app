import { Timestamp } from '@angular/fire/firestore';

export interface ToDoItem {
  id: string; // UUID
  name: string;
  isCompleted: boolean;
  createdDate: Date;
  updatedDate: Date;
}

export interface ToDoItemDoc {
  name: string;
  isCompleted: boolean;
  createdDate: Timestamp;
  updatedDate: Timestamp;
}
