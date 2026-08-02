import Dexie, { Table } from "dexie";
import type { MutasiSubmitPayload } from "@/types/mutasi";

export type OfflineMutasiStatus = "pending" | "syncing" | "synced" | "failed";

export interface OfflineMutasiItem {
  localId: string;           // UUID lokal
  payload: MutasiSubmitPayload;
  createdBy: string;
  status: OfflineMutasiStatus;
  errorMsg?: string;
  createdAt: string;         // ISO string
  updatedAt: string;         // ISO string
}

class MutasiOfflineDatabase extends Dexie {
  offlineMutasi!: Table<OfflineMutasiItem, string>;

  constructor() {
    super("mutasi-offline-db");
    this.version(1).stores({
      offlineMutasi: "localId,status,createdAt",
    });
  }
}

export const mutasiOfflineDB = new MutasiOfflineDatabase();
