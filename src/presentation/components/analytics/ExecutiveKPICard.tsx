import React from 'react';

interface ExecutiveKPICardProps {
  title: str;
  value: str;
  changeTrend: str;
  isPositive: boolean;
  category: str;
}

export const ExecutiveKPICard: React.FC<ExecutiveKPICardProps> = ({
  title,
  value,
  changeTrend,
  isPositive,
  category
}) => {
  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 shadow-lg hover:border-gray-700 transition">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">{category}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {changeTrend}
        </span>
      </div>

      <h4 className="text-gray-400 text-xs font-medium">{title}</h4>
      <div className="text-2xl font-extrabold text-gray-100 mt-1 tracking-tight">{value}</div>

      {/* Sparkline Visual Placeholder */}
      <div className="mt-3 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} 
          style={{ width: '78%' }}
        />
      </div>
    </div>
  );
};
