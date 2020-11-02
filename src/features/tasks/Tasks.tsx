import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DropResult } from "react-beautiful-dnd";

import {
  updateTaskToAnotherBoard,
  updateTaskToSameBoard,
  fetchTasks,
  deleteTask,
  selectBoards,
} from "./tasksSlice";
import { Board, Task } from "../../types";
import { TaskBoard, CardList } from "../../components";
import TaskCard from "./TaskCard";

export type DispatchType = (
  payload:
    | ReturnType<typeof updateTaskToSameBoard>
    | ReturnType<typeof updateTaskToAnotherBoard>
    | ReturnType<typeof deleteTask>
    | ReturnType<typeof fetchTasks>
) => void;

export function renderCardList(
  dispatch: DispatchType,
  renderChild: typeof renderCard,
  deleteFn: typeof onDelete
) {
  return (id: Board["id"], tasks: Task[]): React.ReactElement => {
    return (
      <CardList id={id} tasks={tasks}>
        {renderChild(dispatch, deleteFn)}
      </CardList>
    );
  };
}

export function fetchInitialData(
  dispatch: DispatchType,
  fetchFn: typeof fetchTasks
) {
  return (): void => {
    dispatch(fetchFn());
  };
}

export function renderCard(dispatch: DispatchType, deleteFn: typeof onDelete) {
  return (task: Task, index: number): React.ReactElement => {
    return <TaskCard key={task.id} task={task} index={index} />;
  };
}

export function onDelete(
  task: Task,
  deleteFn: typeof deleteTask,
  dispatch: DispatchType
) {
  return (): void => dispatch(deleteFn(task));
}

export function onDragEnd(dispatch: DispatchType) {
  return (result: DropResult): void => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      if (source.index === destination.index) return;
      dispatch(
        updateTaskToSameBoard({
          id: source.droppableId as Board["id"],
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })
      );
    } else {
      dispatch(
        updateTaskToAnotherBoard({
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
  };
}

export default function Tasks(): React.ReactElement {
  const boards: Board[] = useSelector(selectBoards);
  const dispatch = useDispatch();

  useEffect(fetchInitialData(dispatch, fetchTasks), [dispatch]);

  return (
    <TaskBoard boards={boards} onDragEnd={onDragEnd(dispatch)}>
      {renderCardList(dispatch, renderCard, onDelete)}
    </TaskBoard>
  );
}
