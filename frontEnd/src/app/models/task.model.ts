export interface Task {
  _id?: string; // MongoDB ID
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  isEditing?: boolean;
  lockedBy?: string | null;
}
