import React from "react";
import KanbanDB from "kanbandb/dist/KanbanDB";

import Tasks from "./features/tasks/Tasks";
import TaskForm from "./features/tasks/TaskForm";

import "./App.scss";

function initialize(): void {
  /**
   *
   * Use KanbanDB like so (but you might want to move it) - types are provided:
   *
   */

  KanbanDB.connect("test");
}

function App(): React.ReactElement {
  // Initialize DB communications.
  initialize();

  return (
    <>
      <Tasks />
      <footer>
        <div>
          <TaskForm />
        </div>
      </footer>
    </>
  );
}

export default App;
