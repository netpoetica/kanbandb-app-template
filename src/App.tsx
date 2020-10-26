import React from "react";
import "./App.scss";
import KanbanDB from "kanbandb/dist/KanbanDB";

function initialize() {
  /**
   *
   * Use KanbanDB like so (but you might want to move it) - types are provided:
   *
   */

  KanbanDB.connect();
}

function App() {
  // Initialize DB communications.
  initialize();

  return (
    <>
      <div role="main" className="App">
        <div>
          <h2>To-do</h2>
          <div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
            <div>test</div>
          </div>
        </div>
        <div>
          <h2>In Progress</h2>
          <div>
            <div>test</div>
            <div>test</div>
          </div>
        </div>
        <div>
          <h2>Done</h2>
          <div>
            <div>test</div>
            <div>test</div>
          </div>
        </div>
      </div>
      <footer>
        <div className="AddForm">
          <div>
            <input
              type="text"
              placeholder="e.g. Bug: TextPoll not dispatching half stars"
            ></input>
            <button>Add new</button>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
