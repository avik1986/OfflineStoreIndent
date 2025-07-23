export interface IStore {
  id: string;
  name?: string | null;
}

export type NewStore = Omit<IStore, 'id'> & { id: null };
