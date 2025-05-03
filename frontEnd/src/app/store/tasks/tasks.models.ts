import { Task } from '../../models/task.model';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
