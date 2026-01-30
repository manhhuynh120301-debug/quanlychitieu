import { Transaction } from '../types';

/**
 * DATA SERVICE – PRODUCTION READY
 * --------------------------------
 * - Không dùng localStorage
 * - Toàn bộ dữ liệu đi qua Vercel API
 * - Google Sheet là nguồn dữ liệu duy nhất (source of truth)
 */

export const dataService = {
  /**
   * Lấy toàn bộ giao dịch từ Google Sheet
   */
  async getTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch('/api/get-transactions');

      if (!res.ok) {
        console.error('Failed to fetch transactions');
        return [];
      }

      return await res.json();
    } catch (err) {
      console.error('getTransactions error:', err);
      return [];
    }
  },

  /**
   * Thêm 1 giao dịch mới vào Google Sheet
   */
  async addTransaction(transaction: Transaction): Promise<void> {
    try {
      await fetch('/api/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
    } catch (err) {
      console.error('addTransaction error:', err);
    }
  },

  /**
   * Reset toàn bộ dữ liệu của THÁNG HIỆN TẠI
   */
  async clearCurrentMonth(): Promise<void> {
    try {
      await fetch('/api/reset-month', {
        method: 'POST',
      });
    } catch (err) {
      console.error('clearCurrentMonth error:', err);
    }
  },
};
