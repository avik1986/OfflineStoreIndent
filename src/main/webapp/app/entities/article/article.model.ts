export interface IArticle {
  id: string;
  price?: number | null;
}

export type NewArticle = Omit<IArticle, 'id'> & { id: null };
