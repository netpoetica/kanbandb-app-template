import React, { useState } from "react";
import "./App.scss";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Task } from "./types";
import KanbanDB from "kanbandb/dist/KanbanDB";

const initial = Array.from({ length: 10 }, (v, k) => k).map((k) => {
  const custom: Task = {
    id: `id-${k}`,
    content: `Task ${k}`,
  };
  return custom;
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function Card({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  );
}

const CardList = React.memo(function CardList({ tasks }) {
  return tasks.map((task: Task, index: number) => (
    <Card task={task} index={index} key={task.id} />
  ));
});

function initialize() {
  /**
   *
   * Use KanbanDB like so (but you might want to move it) - types are provided:
   *
   */

  KanbanDB.connect();
}

function App(): React.ReactElement {
  const [state, setState] = useState({ tasks: initial });

  function onDragEnd(result) {
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

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div role="main" className="App">
          <div>
            <h2>To-do</h2>
            <Droppable droppableId="todo">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <CardList tasks={state.tasks} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
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
      </DragDropContext>
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
