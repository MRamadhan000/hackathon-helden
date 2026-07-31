import Dexie, { Table } from "dexie";

export interface LocalTodo {
  localId: string;       // ID lokal (UUID)
  serverId?: number;     // ID dari Supabase
  name: string;
  synced: boolean;
}

class AppDatabase extends Dexie {
  todos!: Table<LocalTodo, string>;

  constructor() {
    super("todo-db");

    this.version(1).stores({
      todos: "localId,serverId,synced",
    });
  }
}

export const db = new AppDatabase();