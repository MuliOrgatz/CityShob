import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TasksService } from '../../services/tasks.service';
import * as TaskActions from './tasks.actions';
import {
  catchError,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { Task } from '../../models/task.model';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../user/user.selectors';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../../components/add-task-dialog/add-task-dialog.component';
import { selectTaskById } from './tasks.selectors';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private tasksService = inject(TasksService);
  private socket = inject(SocketService);
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private openDialogRef: MatDialogRef<AddTaskDialogComponent> | null = null;

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.tasksService.getTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      mergeMap(({ task }) =>
        this.tasksService.addTask(task).pipe(
          map((created) => TaskActions.addTaskSuccess({ task: created })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ task }) => {
        return this.tasksService.updateTask(task).pipe(
          map((updated) => TaskActions.updateTaskSuccess({ task: updated })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        );
      })
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) =>
        this.tasksService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  taskCreatedFromSocket$ = createEffect(() =>
    this.socket
      .listenToEvent<Task>('taskCreated')
      .pipe(map((task) => TaskActions.taskAddedFromSocket({ task })))
  );

  taskUpdatedFromSocket$ = createEffect(() =>
    this.socket
      .listenToEvent<Task>('taskUpdated')
      .pipe(map((task) => TaskActions.taskUpdatedFromSocket({ task })))
  );

  taskDeletedFromSocket$ = createEffect(() =>
    this.socket
      .listenToEvent<string>('taskDeleted')
      .pipe(map((id) => TaskActions.taskDeletedFromSocket({ id })))
  );

  lockTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskActions.lockTask),
        withLatestFrom(this.store.select(selectCurrentUser)),
        tap(([{ id }, user]) => {
          if (user?.username) {
            this.socket.lockTask(id, user.username);
          }
        })
      ),
    { dispatch: false }
  );

  unlockTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskActions.unlockTask),
        map(({ id }) => this.socket.unlockTask(id))
      ),
    { dispatch: false }
  );

  taskLocked$ = createEffect(() =>
    this.socket
      .listenToEvent<{ id: string; lockedBy: string }>('taskLocked')
      .pipe(
        map(({ id, lockedBy }) =>
          TaskActions.taskLockedFromSocket({ id, lockedBy })
        )
      )
  );

  taskUnlocked$ = createEffect(() =>
    this.socket
      .listenToEvent<string>('taskUnlocked')
      .pipe(map((id) => TaskActions.taskUnlockedFromSocket({ id })))
  );

  openDialogAfterLock$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskActions.taskLockedFromSocket),
        withLatestFrom(this.store.select(selectCurrentUser)),
        filter(([{ lockedBy }, user]) => user?.username === lockedBy),
        switchMap(([{ id }]) =>
          this.store.select(selectTaskById(id)).pipe(
            filter((task): task is Task => !!task),
            take(1),
            tap((task) => {
              this.openDialogRef = this.dialog.open(AddTaskDialogComponent, {
                data: task,
                width: '500px',
              });

              this.openDialogRef.afterClosed().subscribe((result) => {
                this.openDialogRef = null;
                this.store.dispatch(TaskActions.unlockTask({ id: task._id! }));

                if (result) {
                  this.store.dispatch(TaskActions.updateTask({ task: result }));
                }
              });
            })
          )
        )
      ),
    { dispatch: false }
  );

  closeDialogOnUnlock$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TaskActions.taskUnlockedFromSocket),
        tap(({ id }) => {
          if (this.openDialogRef?.componentInstance?.taskId === id) {
            this.openDialogRef.close();
            this.openDialogRef = null;
          }
        })
      ),
    { dispatch: false }
  );
}
