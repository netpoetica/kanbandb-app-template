import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DropResult } from "react-beautiful-dnd";
import { Dispatch } from "@reduxjs/toolkit";

import {
  removeTask,
  moveTaskToAnotherBoard,
  moveTaskToSameBoard,
  selectBoards,
} from "./tasksSlice";
import { Board } from "../../types";
import { TaskBoard, CardList, Card } from "../../components";

export function onDragEnd(result: DropResult, dispatch: Dispatch): void {
  const { source, destination } = result;

  if (!destination) {
    return;
  }

  if (source.droppableId === destination.droppableId) {
    dispatch(
      moveTaskToSameBoard({
        id: source.droppableId as Board["id"],
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
  } else {
    dispatch(
      moveTaskToAnotherBoard({
        source: {
          id: source.droppableId as Board["id"],
          index: source.index,
        },
        destination: {
          id: destination.droppableId as Board["id"],
          index: destination.index,
        },
      })
    );
  }
}

export default function Tasks(): React.ReactElement {
  const boards: Board[] = useSelector(selectBoards);
  const dispatch = useDispatch();

  return (
    <TaskBoard
      boards={boards}
      onDragEnd={(result): void => onDragEnd(result, dispatch)}
    >
      {(id, tasks): React.ReactElement => (
        <CardList id={id} tasks={tasks}>
          {(task, index): React.ReactElement => (
            <Card
              key={task.id}
              id={task.id}
              title={task.name}
              content={task.content}
              index={index}
              onDelete={(): void => {
                dispatch(removeTask(task));
              }}
            />
          )}
        </CardList>
      )}
    </TaskBoard>
  );
}
