import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ToDoItem } from '../../model/toDoItem';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  toDoItem = input.required<ToDoItem>();
  cancel = output();
  complete = output();
  remove = output();
  action = input.required<'remove' | 'complete'>();
  actionLabel = computed(() => (this.action() === 'complete' ? 'Complete' : 'Remove'));

  confirm(): void {
    this.action() === 'remove' ? this.remove.emit() : this.complete.emit();
  }
}
