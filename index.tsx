
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useAppState } from './hooks/useAppState';
import { DonutChart, ProgressBar } from './components/Charts';
import { formatVND, parseAmount } from './utils/parsing';
import { CategoryId } from './types';

const App = () => {
  const { 
    transactions, 
    categories, 
    dailyTotal, 
    monthlyTotals, 
    addTransaction, 
    resetMonth, 
    loading 
  } = useAppState();

  const [amountInput, setAmountInput] = useState("");
  const [selectedCat, setSelectedCat] = useState<CategoryId>("Tiền ăn");
  const [toast, setToast] = useState<string | null>(null);

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const foodCat = categories.find(c => c.id === "Tiền ăn")!;
  const dailyFoodBudget = foodCat.budget / daysInMonth;
  const foodSpentToday = transactions
    .filter(t => t.categoryId === "Tiền ăn" && t.date.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, t) => sum + t.amount, 0);

  const dailyPercent = dailyFoodBudget > 0 ? (foodSpentToday / dailyFoodBudget) * 100 : 0;
  const dailyRemaining = Math.max(0, dailyFoodBudget - foodSpentToday);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseAmount(amountInput);
    if (!val || val <= 0) {
      showToast("Số tiền không đúng kìa 🥺");
      return;
    }

    await addTransaction(selectedCat, val);
    setAmountInput("");
    showToast("Đã ghi lại rồi nhen! ✨");
  };

  const handleReset = async () => {
    if (window.confirm("Xóa hết chi tiêu tháng này? Không quay lại được đâu à nha! 🥺")) {
      await resetMonth();
      showToast("Đã dọn dẹp sạch sẽ! 🧹");
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  if (loading) return null;

  return (
    <div className="p-4 flex flex-col gap-6 max-w-[420px] mx-auto min-h-screen bg-[#fdf2f8]">
      <header className="text-center pt-4">
        <h1 className="text-2xl font-black text-pink-500 tracking-tight">QUẢN LÝ CHI TIÊU</h1>
        <p className="text-pink-300 text-sm font-bold">Tháng {new Date().getMonth() + 1} • {new Date().getFullYear()}</p>
      </header>

      {/* DAILY STATUS */}
      <section className="cute-card p-6 flex flex-col items-center gap-6 relative overflow-hidden neon-pink bg-white">
        <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest self-start">🍱 Tiền ăn hôm nay</h2>
        <DonutChart percent={dailyPercent} label="Đã dùng" />
        <div className="text-center">
          <p className="text-[10px] uppercase font-black text-slate-400">Còn lại hôm nay</p>
          <p className="text-xl font-black text-slate-700">{formatVND(dailyRemaining)}</p>
        </div>
      </section>

      {/* MONTHLY GRID */}
      <section className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-pink-500 font-bold text-sm uppercase tracking-wider">📊 Tổng quát tháng</h3>
          <button 
            onClick={handleReset}
            className="text-[10px] font-bold text-pink-300 hover:text-pink-500 bg-pink-50 px-3 py-1.5 rounded-full transition-colors"
          >
            🧹 Reset tháng
          </button>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {categories.map(cat => {
            const spent = monthlyTotals[cat.id] || 0;
            const pct = cat.budget > 0 ? (spent / cat.budget) * 100 : 0;
            return (
              <div key={cat.id} className="cute-card min-w-[140px] p-4 flex flex-col gap-3 bg-white hover:neon-pink transition-all">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700 truncate uppercase">{cat.id}</span>
                </div>
                <ProgressBar percent={pct} />
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-pink-400">{Math.round(pct)}%</span>
                  <span className="text-slate-300">{formatVND(spent)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INPUT FORM */}
      <section className="mt-auto pb-6">
        <form onSubmit={handleAdd} className="cute-card p-5 flex flex-col gap-4 border-pink-100 bg-white/80 shadow-lg neon-pink">
          <div className="flex gap-2">
            <select 
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as CategoryId)}
              className="bg-pink-50 border-none rounded-2xl px-3 py-3 text-xs font-bold text-pink-600 focus:ring-2 focus:ring-pink-200 outline-none w-1/3 appearance-none shadow-sm"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.id}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="40k, 1.5tr..." 
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="flex-1 bg-pink-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-pink-600 focus:ring-2 focus:ring-pink-200 outline-none placeholder:text-pink-200 shadow-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-neon bg-pink-400 hover:bg-pink-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-pink-200/50 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            💖 Ghi lại chi tiêu 💖
          </button>
        </form>
      </section>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-white border-2 border-pink-100 px-8 py-3 rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-2 neon-pink">
          <span className="text-pink-500 text-lg">✨</span>
          <p className="text-pink-500 font-bold text-sm whitespace-nowrap">{toast}</p>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
