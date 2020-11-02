import KanbanDB from "kanbandb/dist/KanbanDB";
import { Task, Category } from "../types";

export type Card = {
  id: string;
  name: string;
  description: string;
  status: "TODO" | "DOING" | "DONE";
  created: number;
  lastUpdated: number;
  priority: number;
};

export class TaskService {
  entityName: string;
  private db?: typeof KanbanDB;
  constructor(entityName = "tasks") {
    this.entityName = entityName;
  }
  async fetchDb(): Promise<typeof KanbanDB> {
    if (this.db) return this.db;
    const db = (await KanbanDB.connect(this.entityName)) as typeof KanbanDB;
    this.db = db;
    return db;
  }
  async fetchAll(): Promise<Task[]> {
    const db = await this.fetchDb();
    try {
      const cards = (await db.getCards()) as Card[];
      return cards.map((x) => ({
        id: x.id,
        content: x.description,
        name: x.name as Category,
        status: x.status,
        priority: x.priority,
      }));
    } catch (e) {
      return [];
    }
  }
  async add(task: Pick<Task, "content" | "name">): Promise<Task | undefined> {
    const db = await this.fetchDb();
    try {
      const id = await db.addCard({
        description: task.content,
        name: task.name,
        status: "TODO",
      });
      const newCard = (await db.getCardById(id)) as Card;
      return {
        content: newCard.description,
        id: newCard.id,
        name: newCard.name as Category,
        status: newCard.status,
      };
    } catch (e) {
      return undefined;
    }
  }

  async remove(id: Task["id"]): Promise<boolean> {
    const db = await this.fetchDb();
    try {
      const result = await db.deleteCardById(id);
      return result;
    } catch (e) {
      return false;
    }
  }

  async update(
    id: Task["id"],
    partialTask: Partial<Omit<Task, "id">>
  ): Promise<Task | undefined> {
    const db = await this.fetchDb();
    try {
      console.log(partialTask);
      const result = await db.updateCardById(id, {
        ...(partialTask.name ? { name: partialTask.name } : undefined),
        ...(partialTask.content
          ? { description: partialTask.content }
          : undefined),
        ...(partialTask.status ? { status: partialTask.status } : undefined),
        ...(partialTask.priority
          ? { priority: partialTask.priority }
          : undefined),
      });
      if (result) {
        const card = await db.getCardById(id);
        if (card)
          return {
            id: card.id,
            content: card.description,
            name: card.name,
            status: card.status,
            priority: card.priority,
          };
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }
}

export default new TaskService();
