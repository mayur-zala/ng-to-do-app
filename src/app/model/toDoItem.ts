export interface ToDoItem {
  id: string; // UUID
  name: string;
  isCompleted: boolean;
  createdDate: Date;
  updatedDate: Date;
}

export const sampleTasks: ToDoItem[] = [
  {
    id: crypto.randomUUID(),
    name: 'Design the homepage wireframe',
    isCompleted: false,
    createdDate: new Date('2026-05-01'),
    updatedDate: new Date('2026-05-01'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Set up Angular project',
    isCompleted: true,
    createdDate: new Date('2026-04-28'),
    updatedDate: new Date('2026-04-29'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Write unit tests for components',
    isCompleted: false,
    createdDate: new Date('2026-05-02'),
    updatedDate: new Date('2026-05-02'),
  },
  {
    id: crypto.randomUUID(),
    name: 'Review pull requests',
    isCompleted: false,
    createdDate: new Date('2026-05-02'),
    updatedDate: new Date('2026-05-02'),
  },
];
