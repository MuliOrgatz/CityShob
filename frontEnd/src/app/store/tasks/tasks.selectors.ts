import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState } from './tasks.models';

export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
  selectTasksState,
  (state) => state.tasks
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.loading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state) => state.error
);

export const selectTaskById = (taskId: string) =>
  createSelector(selectTasksState, (state) =>
    state.tasks.find((t) => t._id === taskId)
  );
