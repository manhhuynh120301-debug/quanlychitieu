
import React from 'react';

interface DonutProps {
  percent: number;
  label?: string;
}

export const DonutChart: React.FC<DonutProps> = ({ percent, label }) => {
  const safePercent = isFinite(percent) ? Math.max(0, percent) : 0;
  
  let color = "#f9a8d4"; // Pastel pink
  let glow = "rgba(249, 168, 212, 0.4)";

  if (safePercent >= 100) {
    color = "#f87171"; // Soft red
    glow = "rgba(248, 113, 113, 0.4)";
  } else if (safePercent >= 80) {
    color = "#fbbf24"; // Soft orange
    glow = "rgba(251, 191, 36, 0.4)";
  }

  const gradient = `conic-gradient(${color} ${Math.min(safePercent, 100) * 3.6}deg, #fdf2f8 0deg)`;

  return (
    <div 
      className="progress-ring flex items-center justify-center rounded-full"
      style={{ 
        background: gradient,
        boxShadow: `0 0 15px ${glow}`,
        width: '130px', 
        height: '130px',
        position: 'relative'
      }}
    >
      <div className="absolute w-[106px] h-[106px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
        <span className="text-3xl font-black text-slate-700">{Math.round(safePercent)}%</span>
        {label && <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">{label}</span>}
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{ percent: number }> = ({ percent }) => {
  const safePercent = Math.min(100, Math.max(0, percent));
  let colorClass = "pastel-pink";
  if (safePercent >= 100) colorClass = "pastel-red";
  else if (safePercent >= 80) colorClass = "pastel-orange";

  return (
    <div className="h-2 w-full bg-pink-50 rounded-full overflow-hidden shadow-inner">
      <div 
        className={`h-full transition-all duration-700 ease-out ${colorClass}`} 
        style={{ width: `${safePercent}%` }} 
      />
    </div>
  );
};
