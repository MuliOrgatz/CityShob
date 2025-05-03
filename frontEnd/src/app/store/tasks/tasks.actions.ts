import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';

export const loadTasks = createAction('[Tasks] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);

export const addTask = createAction(
  '[Tasks] Add Task',
  props<{ task: Task }>()
);
export const addTaskSuccess = createAction(
  '[Tasks] Add Task Success',
  props<{ task: Task }>()
);

export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ task: Task }>()
);
export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: string }>()
);
export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: string }>()
);

// socket events
export const taskAddedFromSocket = createAction(
  '[Socket] Task Added',
  props<{ task: Task }>()
);
export const taskUpdatedFromSocket = createAction(
  '[Socket] Task Updated',
  props<{ task: Task }>()
);
export const taskDeletedFromSocket = createAction(
  '[Socket] Task Deleted',
  props<{ id: string }>()
);
export const lockTask = createAction(
  '[Tasks] Lock Task',
  props<{ id: string }>()
);
export const unlockTask = createAction(
  '[Tasks] Unlock Task',
  props<{ id: string }>()
);

export const taskLockedFromSocket = createAction(
  '[Socket] Task Locked',
  props<{ id: string; lockedBy: string }>()
);
export const taskUnlockedFromSocket = createAction(
  '[Socket] Task Unlocked',
  props<{ id: string }>()
);
