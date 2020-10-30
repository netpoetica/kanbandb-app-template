import { Board, Task } from "./types";
import { Card } from "./services/TaskService";

export const tasks: Task[] = [
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "TODO",
    name: "bug",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "TODO",
    name: "enhancement",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "TODO",
    name: "feature",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DOING",
    name: "refactor",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DOING",
    name: "task",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DOING",
    name: "test",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DONE",
    name: "bug",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DONE",
    name: "enhancement",
    priority: Date.now(),
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DONE",
    name: "feature",
    priority: Date.now(),
  },
];

export const cards: Card[] = tasks.map((task) => ({
  id: task.id,
  status: task.status,
  created: Date.now(),
  description: task.content,
  lastUpdated: Date.now(),
  name: task.name,
  priority: task.priority || Date.now(),
}));

export const todoTasks: Task[] = tasks.filter((x) => x.status === "TODO");
export const inProgressTasks: Task[] = tasks.filter(
  (x) => x.status === "DOING"
);
export const doneTasks: Task[] = tasks.filter((x) => x.status === "DONE");
export const todoBoard: Board = {
  id: "TODO",
  label: "To-do",
  tasks: todoTasks,
};
export const inProgressBoard: Board = {
  id: "DOING",
  label: "In progress",
  tasks: inProgressTasks,
};
export const doneBoard: Board = {
  id: "DONE",
  label: "Done",
  tasks: doneTasks,
};
export const completeBoards: Board[] = [todoBoard, inProgressBoard, doneBoard];
