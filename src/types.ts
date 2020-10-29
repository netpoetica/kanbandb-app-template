export type TaskStatus = "TODO" | "DOING" | "DONE";
export type Category =
  | "feature"
  | "enhancement"
  | "test"
  | "bug"
  | "refactor"
  | "task";

export type CategoryOption = {
  label: Category;
  color: string;
};

export type Task = {
  id: string;
  content: string;
  status: TaskStatus;
  name: Category;
};

export type Board = {
  id: Task["status"];
  label: string;
  tasks: Task[];
};

// {
//   id: string;
//   name: string;
//   description: string;
//   status: 'TODO' | 'DOING' | 'DONE';
//   created: Date; // UNIX timestamp
//   lastUpdated: Date; // UNIX timestamp
// }
