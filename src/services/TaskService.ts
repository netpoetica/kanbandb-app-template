import KanbanDB from "kanbandb/dist/KanbanDB";

export default class TaskService {
  private api: typeof KanbanDB;
  constructor(api: typeof KanbanDB) {
    this.api = api;
  }
}
