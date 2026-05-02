import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { ToDoItem } from './model/toDoItem';
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

  private tasks$ = this.todoService.getTasks();

  taskList = toSignal(this.tasks$, { initialValue: [] as ToDoItem[] });
  isLoading = toSignal(
    this.tasks$.pipe(
      map(() => false),
      startWith(true),
    ),
    { initialValue: true },
  );
  errorMessage = toSignal(this.todoService.error$, { initialValue: null });

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

  async addTask(): Promise<void> {
    if (this.taskInput.invalid) return;
    try {
      await this.todoService.addTask(this.taskInput.value);
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

  async removeTask(): Promise<void> {
    const id = this.taskToChange()?.id;
    if (id) await this.todoService.removeTask(id);
    this.showDialog.set(false);
  }

  async completeTask(): Promise<void> {
    const id = this.taskToChange()?.id;
    if (id) await this.todoService.completeTask(id);
    this.showDialog.set(false);
  }
}
