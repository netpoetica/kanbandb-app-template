import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DropResult } from "react-beautiful-dnd";

import {
  TaskMoveToAnotherBoardPayload,
  TaskMoveToSameBoardPayload,
  updateTaskToAnotherBoard,
  updateTaskToSameBoard,
  fetchTasks,
  deleteTask,
  selectBoards,
} from "./tasksSlice";
import { Board } from "../../types";
import { TaskBoard, CardList, Card } from "../../components";

export type UpdateSameBoardFn = (payload: TaskMoveToSameBoardPayload) => void;
export type UpdateMoveBoardFn = (
  payload: TaskMoveToAnotherBoardPayload
) => void;

export function onDragEnd(
  result: DropResult,
  updateSameBoard: UpdateSameBoardFn,
  updateAnotherBoard: UpdateMoveBoardFn
): void {
  const { source, destination } = result;

  if (!destination) {
    return;
  }

  if (source.droppableId === destination.droppableId) {
    if (source.index === destination.index) return;
    updateSameBoard({
      id: source.droppableId as Board["id"],
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  } else {
    updateAnotherBoard({
      source: {
        id: source.droppableId as Board["id"],
        index: source.index,
      },
      destination: {
        id: destination.droppableId as Board["id"],
        index: destination.index,
      },
    });
  }
}

export default function Tasks(): React.ReactElement {
  const boards: Board[] = useSelector(selectBoards);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const updateSameBoard: UpdateSameBoardFn = (
    payload: TaskMoveToSameBoardPayload
  ): void => {
    dispatch(updateTaskToSameBoard(payload));
  };
  const updateAnotherBoard: UpdateMoveBoardFn = (
    payload: TaskMoveToAnotherBoardPayload
  ): void => {
    dispatch(updateTaskToAnotherBoard(payload));
  };

  return (
    <TaskBoard
      boards={boards}
      onDragEnd={(result): void =>
        onDragEnd(result, updateSameBoard, updateAnotherBoard)
      }
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
                dispatch(deleteTask(task));
              }}
            />
          )}
        </CardList>
      )}
    </TaskBoard>
  );
}
