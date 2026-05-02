import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { catchError, EMPTY, map, Observable, Subject, tap } from 'rxjs';
import { ToDoItem, ToDoItemDoc } from '../model/toDoItem';

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  private fireStore = inject(Firestore);
  private tasksCollection = collection(this.fireStore, 'tasks');

  readonly error$ = new Subject<string | null>();

  getTasks(): Observable<ToDoItem[]> {
    const q = query(this.tasksCollection, orderBy('createdDate', 'desc'));
    return (collectionData(q, { idField: 'id' }) as Observable<ToDoItemDoc[]>).pipe(
      map((docs) =>
        docs.map(
          (d) =>
            ({
              ...d,
              createdDate: (d.createdDate as Timestamp)?.toDate(),
              updatedDate: (d.updatedDate as Timestamp)?.toDate(),
            }) as ToDoItem,
        ),
      ),
      tap(() => this.error$.next(null)),
      catchError((err) => {
        this.error$.next('Could not load tasks. Check your connection.');
        console.error('[TodoService]', err);
        return EMPTY; // stream ends gracefully, no crash
      }),
    );
  }

  async addTask(name: string): Promise<void> {
    await addDoc(this.tasksCollection, {
      name,
      isCompleted: false,
      createdDate: serverTimestamp(),
      updatedDate: serverTimestamp(),
    });
  }

  async completeTask(id: string): Promise<void> {
    const ref = doc(this.fireStore, 'tasks', id);
    await updateDoc(ref, { isCompleted: true, updatedDate: serverTimestamp() });
  }

  async removeTask(id: string): Promise<void> {
    await deleteDoc(doc(this.fireStore, 'tasks', id));
  }
}
