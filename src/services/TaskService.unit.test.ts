import KanbanDB from "kanbandb/dist/KanbanDB";

import service, { TaskService } from "./TaskService";
import { cards, tasks, cardToCompare, taskToCompare } from "../testData";
import { Category } from "../types";

jest.mock("kanbandb/dist/KanbanDB");
const mockedDb = KanbanDB as jest.Mocked<typeof KanbanDB>;

describe("TaskService", () => {
  it("should fetch db", async () => {
    mockedDb.connect.mockResolvedValue(Promise.resolve(KanbanDB));
    const db = await service.fetchDb();
    expect(db).toEqual(KanbanDB);
  });
  it("should fetch all tasks", async () => {
    mockedDb.getCards.mockResolvedValue(Promise.resolve(cards));
    const testTasks = await service.fetchAll();
    expect(testTasks.length).toBe(cards.length);
    testTasks.forEach((task, index) => {
      expect(task).toEqual({
        id: cards[index].id,
        content: cards[index].description,
        status: cards[index].status,
        name: cards[index].name,
        priority: cards[index].priority,
      });
    });
    mockedDb.getCards.mockResolvedValue(Promise.reject("error"));
    const emptyTasks = await service.fetchAll();
    expect(emptyTasks).toEqual([]);
  });
  it("should add a task", async () => {
    const testCard = cards[0];
    mockedDb.addCard.mockResolvedValue(Promise.resolve(testCard.id));
    mockedDb.getCardById.mockResolvedValue(Promise.resolve(testCard));
    const task = await service.add({
      content: testCard.description,
      name: testCard.name as Category,
    });
    expect(task).toBeDefined();
    expect(task?.content).toBe(testCard.description);
    expect(task?.name).toBe(testCard.name);
    mockedDb.addCard.mockResolvedValue(Promise.reject("error"));
    const errorTask = await service.add({
      content: testCard.description,
      name: testCard.name as Category,
    });
    expect(errorTask).not.toBeDefined();
    mockedDb.addCard.mockResolvedValue(Promise.resolve(testCard.id));
    mockedDb.getCardById.mockResolvedValue(Promise.reject("error"));
    const errorTask1 = await service.add({
      content: testCard.description,
      name: testCard.name as Category,
    });
    expect(errorTask1).not.toBeDefined();
  });
  it("should remove a task", async () => {
    mockedDb.deleteCardById.mockResolvedValue(Promise.resolve(true));
    const result = await service.remove("id");
    expect(result).toBe(true);
    mockedDb.deleteCardById.mockResolvedValue(Promise.resolve(false));
    const falseResult = await service.remove("id");
    expect(falseResult).toBe(false);
    mockedDb.deleteCardById.mockResolvedValue(Promise.reject("error"));
    const rejectedResult = await service.remove("id");
    expect(rejectedResult).toBe(false);
  });
  it("should update a task", async () => {
    const testTask = tasks[0];
    const param = {
      content: testTask.content,
      name: testTask.name,
      status: testTask.status,
      priority: testTask.priority,
    };
    mockedDb.updateCardById.mockResolvedValue(Promise.resolve(true));
    mockedDb.getCardById.mockResolvedValue(
      Promise.resolve({
        id: "id",
        name: testTask.name,
        description: testTask.content,
        status: testTask.status,
        priority: testTask.priority,
      })
    );
    const result = await service.update("id", param);
    expect(result).toEqual({
      ...param,
      id: "id",
    });
    mockedDb.updateCardById.mockResolvedValue(Promise.resolve(false));
    const falseResult = await service.update("id", param);
    expect(falseResult).toBe(undefined);
    mockedDb.updateCardById.mockResolvedValue(Promise.reject("error"));
    const rejectedResult = await service.update("id", param);
    expect(rejectedResult).toBe(undefined);
  });

  it("should translate task to card", () => {
    const card = TaskService.toCard(taskToCompare);
    expect(card).toEqual(cardToCompare);
  });

  it("should translate card to task", () => {
    const task = TaskService.toTask(cardToCompare);
    expect(task).toEqual(taskToCompare);
  });
});
