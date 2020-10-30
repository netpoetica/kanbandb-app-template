import { Card } from "./services/TaskService";

export type TaskStatus = Card["status"];
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
  priority?: number;
};

export type Board = {
  id: Task["status"];
  label: string;
  tasks: Task[];
};
