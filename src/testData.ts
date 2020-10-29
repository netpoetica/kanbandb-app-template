import { Board, Task } from "./types";

export const tasks: Task[] = [
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "TODO",
    name: "bug",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "TODO",
    name: "enhancement",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "TODO",
    name: "feature",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DOING",
    name: "refactor",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DOING",
    name: "task",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DOING",
    name: "test",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DONE",
    name: "bug",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DONE",
    name: "enhancement",
  },
  {
    id: `${Math.random()}`,
    content: `test content ${Math.random()}`,
    status: "DONE",
    name: "feature",
  },
];

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
