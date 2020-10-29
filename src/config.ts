import { CategoryOption } from "./types";

export type Category =
  | "feature"
  | "enhancement"
  | "test"
  | "bug"
  | "refactor"
  | "task";

export const defaultCategoryColors: CategoryOption[] = [
  {
    label: "task",
    color: "gray",
  },
  {
    label: "test",
    color: "goldenrod",
  },
  {
    label: "bug",
    color: "red",
  },
  {
    label: "refactor",
    color: "blue",
  },
  {
    label: "enhancement",
    color: "green",
  },
  {
    label: "feature",
    color: "orange",
  },
];
