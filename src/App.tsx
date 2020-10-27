import React, { useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import KanbanDB from "kanbandb/dist/KanbanDB";

import { Task, Board } from "./types";
import { TaskBoard, AddForm } from "./components";

import "./App.scss";

const initial = Array.from({ length: 10 }, (v, k) => k).map((k) => {
  const custom: Task = {
    id: `id-${k}`,
    content: `Task ${k}`,
  };
  return custom;
});

const reorder = (
  list: Task[],
  startIndex: number,
  endIndex: number
): Task[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function initialize(): void {
  /**
   *
   * Use KanbanDB like so (but you might want to move it) - types are provided:
   *
   */

  KanbanDB.connect("test");
}

function App(): React.ReactElement {
  const [state, setState] = useState({ tasks: initial });
  const boards: Board[] = [
    {
      id: "toDo",
      label: "To-Do",
      tasks: state.tasks,
    },
    {
      id: "inProgress",
      label: "In Progress",
      tasks: state.tasks,
    },
    {
      id: "done",
      label: "Done",
      tasks: state.tasks,
    },
    {
      id: "removed",
      label: "Remove",
      tasks: state.tasks,
    },
  ];

  function onDragEnd(result: DropResult): void {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const tasks = reorder(
      state.tasks,
      result.source.index,
      result.destination.index
    );

    setState({ tasks });
  }
  // Initialize DB communications.
  initialize();

  function addNewTask(text: string): void {
    setState({
      ...state,
      tasks: [...state.tasks, { id: "rand", content: text }],
    });
  }

  return (
    <>
      <TaskBoard onDragEnd={onDragEnd} boards={boards} />
      <footer>
        <div>
          <AddForm onSubmit={addNewTask} />
        </div>
      </footer>
    </>
  );
}

export default App;
