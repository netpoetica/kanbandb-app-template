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
      return cards.map(TaskService.toTask) as Task[];
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
      return TaskService.toTask(newCard) as Task;
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
      const card = TaskService.toCard(partialTask) as Card;
      const result = await db.updateCardById(id, card);
      if (result) {
        const updatedCard = (await db.getCardById(id)) as Card;
        if (updatedCard) return TaskService.toTask(updatedCard) as Task;
      }
      return undefined;
    } catch (e) {
      return undefined;
    }
  }

  static toCard(task: Partial<Task>): Partial<Card> {
    return {
      ...(task.id ? { id: task.id } : undefined),
      ...(task.name ? { name: task.name } : undefined),
      ...(task.content ? { description: task.content } : undefined),
      ...(task.status ? { status: task.status } : undefined),
      ...(task.priority || task.priority === 0
        ? { priority: task.priority }
        : undefined),
    };
  }

  static toTask(card: Partial<Card>): Partial<Task> {
    return {
      ...(card.id ? { id: card.id } : undefined),
      ...(card.name ? { name: card.name as Category } : undefined),
      ...(card.description ? { content: card.description } : undefined),
      ...(card.status ? { status: card.status } : undefined),
      ...(card.priority || card.priority === 0
        ? { priority: card.priority }
        : undefined),
    };
  }
}

export default new TaskService();
