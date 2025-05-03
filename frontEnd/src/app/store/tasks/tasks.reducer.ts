import { createReducer, on } from '@ngrx/store';
import { TasksState } from './tasks.models';
import * as TaskActions from './tasks.actions';

export const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksReducer = createReducer(
  initialState,

  // Load tasks
  on(TaskActions.loadTasks, (state) => ({ ...state, loading: true })),
  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // add/update/delete
  on(TaskActions.addTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t._id !== id),
  })),

  // socket events
  on(TaskActions.taskAddedFromSocket, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
  })),
  on(TaskActions.taskUpdatedFromSocket, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((t) => (t._id === task._id ? task : t)),
  })),
  on(TaskActions.taskDeletedFromSocket, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter((t) => t._id !== id),
  })),
  on(TaskActions.taskLockedFromSocket, (state, { id, lockedBy }) => ({
    ...state,
    tasks: state.tasks.map((task) =>
      task._id === id ? { ...task, isEditing: true, lockedBy } : task
    ),
  })),
  on(TaskActions.taskUnlockedFromSocket, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map((task) =>
      task._id === id ? { ...task, isEditing: false, lockedBy: null } : task
    ),
  }))
);
