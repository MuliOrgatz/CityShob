import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Task } from '../../models/task.model';
import * as TaskActions from '../../store/tasks/tasks.actions';
import * as TaskSelectors from '../../store/tasks/tasks.selectors';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-list',
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormatDatePipe,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  readonly store = inject(Store);
  readonly dialog = inject(MatDialog);

  readonly tasks = toSignal(
    this.store.select(TaskSelectors.selectAllTasks).pipe(
      map((tasks) =>
        [...tasks].sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        })
      )
    ),
    { initialValue: [] }
  );

  readonly loading = toSignal(
    this.store.select(TaskSelectors.selectTasksLoading),
    { initialValue: false }
  );

  displayedColumns: string[] = [
    'title',
    'description',
    'completed',
    'dueDate',
    'priority',
    'actions',
  ];

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
  }

  markComplete(task: Task): void {
    const updated = { ...task, completed: !task.completed };
    this.store.dispatch(TaskActions.updateTask({ task: updated }));
  }

  deleteTask(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Task',
        message: 'Are you sure you want to delete this task?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.store.dispatch(TaskActions.deleteTask({ id }));
      }
    });
  }

  editTask(task: Task): void {
    this.store.dispatch(TaskActions.lockTask({ id: task._id! }));
  }
}
