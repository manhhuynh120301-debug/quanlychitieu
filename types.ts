
export type CategoryId = "Tiền ăn" | "Hụi" | "Trọ" | "Shopee" | "Mỹ phẩm" | "Đám" | "Xăng" | "Lì xì" | "Du lịch";

export interface Category {
  id: CategoryId;
  emoji: string;
  budget: number;
}

export interface Transaction {
  id: string;
  categoryId: CategoryId;
  amount: number;
  date: string; // ISO String
}

export interface AppState {
  transactions: Transaction[];
  categories: Category[];
}
