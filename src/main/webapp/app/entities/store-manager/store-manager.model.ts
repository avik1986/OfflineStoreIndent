export interface IStoreManager {
  id: string;
  name?: string | null;
}

export type NewStoreManager = Omit<IStoreManager, 'id'> & { id: null };
