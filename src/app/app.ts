import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { sampleTasks, ToDoItem } from './model/toDoItem';
import { ToDoService } from './services/to-do-service';
import { Dialog } from './shared/dialog/dialog';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, DatePipe, Dialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private todoService = inject(ToDoService);
  taskInput = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(4)],
  });
  taskDate = new FormControl('', { nonNullable: true });
  taskList = signal<ToDoItem[]>(sampleTasks);

  filterDate = signal<string>('');
  filteredTaskList = computed(() => {
    const date = this.filterDate();
    if (!date) return this.taskList();
    return this.taskList().filter(
      (task) => task.createdDate.toDateString() === new Date(date).toDateString(),
    );
  });
  showDialog = signal<boolean>(false);
  taskToChange = signal<ToDoItem | null>(null);
  dialogAction = signal<'remove' | 'complete'>('remove');

  addTask(): void {
    if (this.taskInput.invalid) return;
    try {
      this.taskList.update((list) => {
        return [
          {
            id: crypto.randomUUID(),
            name: this.taskInput.value,
            isCompleted: false,
            createdDate: new Date(),
            updatedDate: new Date(),
          },
          ...list,
        ];
      });
      this.taskInput.reset();
    } catch {
      // error$ stream handles display
    }
  }

  filterTasks(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterDate.set(input.value);
    input.blur();
  }

  openTaskDialog(task: ToDoItem, action: 'remove' | 'complete') {
    this.taskToChange.set(task);
    this.dialogAction.set(action);
    this.showDialog.set(true);
  }

  removeTask(): void {
    this.taskList.update((list) => list.filter((t) => t.id !== this.taskToChange()?.id));
    this.showDialog.set(false);
  }

  completeTask(): void {
    this.taskList.update((list) =>
      list.map((task) =>
        task.id === this.taskToChange()?.id
          ? { ...task, isCompleted: true, updatedDate: new Date() }
          : task,
      ),
    );
    this.showDialog.set(false);
  }
}
