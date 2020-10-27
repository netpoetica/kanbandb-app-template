export type Task = {
  id: string;
  content: string;
};

export type Board = {
  id: string;
  label: string;
  tasks: Task[];
};
