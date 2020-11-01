import React from "react";

import Tasks from "./features/tasks/Tasks";
import TaskForm from "./features/tasks/TaskForm";

import "./App.scss";

function App(): React.ReactElement {
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
