
import { useState, useEffect, useMemo } from 'react';
import { Transaction, Category, CategoryId } from '../types';
import { dataService } from '../services/dataService';
import { getTodayISO } from '../utils/parsing';

const DEFAULT_CATEGORIES: Category[] = [
  { id: "Tiền ăn", emoji: "🍱", budget: 4500000 },
  { id: "Hụi", emoji: "💰", budget: 2000000 },
  { id: "Trọ", emoji: "🏠", budget: 3500000 },
  { id: "Shopee", emoji: "🛍️", budget: 1500000 },
  { id: "Mỹ phẩm", emoji: "💄", budget: 800000 },
  { id: "Đám", emoji: "🧧", budget: 1000000 },
  { id: "Xăng", emoji: "🛵", budget: 600000 },
  { id: "Lì xì", emoji: "🎁", budget: 1000000 },
  { id: "Du lịch", emoji: "✈️", budget: 3000000 },
];

export const useAppState = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    const data = await dataService.getTransactions();
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const dailyTotal = useMemo(() => {
    const today = getTodayISO();
    return transactions
      .filter(t => t.date.startsWith(today))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const monthlyTotals = useMemo(() => {
    const now = new Date();
    const m = now.getMonth();
    const y = now.getFullYear();

    const totals: Record<string, number> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getMonth() === m && d.getFullYear() === y) {
        totals[t.categoryId] = (totals[t.categoryId] || 0) + t.amount;
      }
    });
    return totals;
  }, [transactions]);

  const addTransaction = async (categoryId: CategoryId, amount: number) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      categoryId,
      amount,
      date: new Date().toISOString()
    };
    await dataService.addTransaction(newTx);
    await refreshData();
  };

  const resetMonth = async () => {
    await dataService.clearCurrentMonth();
    await refreshData();
  };

  return {
    transactions,
    categories,
    dailyTotal,
    monthlyTotals,
    addTransaction,
    resetMonth,
    loading
  };
};
