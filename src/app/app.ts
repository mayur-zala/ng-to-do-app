import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { sampleTasks, ToDoItem } from './model/toDoItem';
import { DatePipe } from '@angular/common';
import { Dialog } from './shared/dialog/dialog';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, DatePipe, Dialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
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

    const newTask: ToDoItem = {
      id: crypto.randomUUID(),
      name: this.taskInput.value,
      isCompleted: false,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
    this.taskList.update((list) => [...list, newTask]);
    this.taskInput.reset();
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
