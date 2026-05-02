import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToDoItem } from './model/toDoItem';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, DatePipe],
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

  taskList = signal<ToDoItem[]>([]);
  filterDate = signal<string>('');
  filteredTaskList = computed(() => {
    const date = this.filterDate();
    if (!date) return this.taskList();
    return this.taskList().filter(
      (task) => task.createdDate.toDateString() === new Date(date).toDateString(),
    );
  });
  showDialog = false;

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
}
