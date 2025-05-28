
export interface Task {
  id: string;
  name: string;
  assignedTo: string;
  dueDate: Date | null;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  createdAt: Date;
}

export interface ParsedTask {
  name: string;
  assignedTo: string;
  dueDate: Date | null;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}
