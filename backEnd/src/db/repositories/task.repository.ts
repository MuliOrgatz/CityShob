import Task, { ITask } from '../models/task.model';

export const getAllTasks = async (): Promise<ITask[]> => {
  return Task.find().sort({ createdAt: -1 });
};

export const getTaskById = async (id: string): Promise<ITask | null> => {
  return Task.findById(id);
};

export const createTask = async (data: Partial<ITask>): Promise<ITask> => {
  const task = new Task(data);
  return task.save();
};

export const updateTask = async (
  id: string,
  data: Partial<ITask>
): Promise<ITask | null> => {
  return Task.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTask = async (id: string): Promise<ITask | null> => {
  return Task.findByIdAndDelete(id);
};
