export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  bookCount?: number;
}

export interface CollectionBook {
  collectionId: string;
  bookId: string;
  userId: string;
  addedAt: string;
}

export const STARTER_COLLECTIONS = [
  "To Read",
  "Reading",
  "Finished",
  "Reference",
  "Favourites",
] as const;
