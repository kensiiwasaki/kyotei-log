import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award } from 'lucide-react';
import { MonthlyStats } from '../types';
import { formatCurrency } from '../utils';

interface StatsDisplayProps {
  stats: MonthlyStats;
}

const StatCard: React.FC<{ label: string; value: string; subValue?: string; icon: React.ReactNode; colorClass: string }> = ({ label, value, subValue, icon, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-xl ${colorClass} text-white shadow-sm`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-black text-gray-800">{value}</p>
      {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
    </div>
  </div>
);

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  const isProfitable = stats.netProfit >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="純利益"
        value={formatCurrency(stats.netProfit)}
        subValue={`${isProfitable ? '+' : ''}${(stats.totalInvestment > 0 ? (stats.netProfit / stats.totalInvestment * 100) : 0).toFixed(1)}% 利益率`}
        icon={isProfitable ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        colorClass={isProfitable ? 'bg-gradient-to-br from-teal-400 to-teal-600' : 'bg-gradient-to-br from-rose-400 to-rose-600'}
      />
      
      <StatCard
        label="総投資額"
        value={formatCurrency(stats.totalInvestment)}
        icon={<DollarSign size={20} />}
        colorClass="bg-gradient-to-br from-blue-400 to-blue-600"
      />

      <StatCard
        label="回収率"
        value={`${stats.recoveryRate.toFixed(1)}%`}
        icon={<Target size={20} />}
        colorClass={`bg-gradient-to-br ${stats.recoveryRate >= 100 ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-600'}`}
      />

      <StatCard
        label="勝率"
        value={`${stats.winRate.toFixed(0)}%`}
        subValue={`${stats.daysPlayed}日稼働`}
        icon={<Award size={20} />}
        colorClass="bg-gradient-to-br from-indigo-400 to-indigo-600"
      />
      
      {/* Progress Bar for Recovery Rate Visual */}
      <div className="col-span-2 lg:col-span-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mt-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-500">回収率ターゲット (100%)</span>
          <span className="text-sm font-bold text-blue-600">{stats.recoveryRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative">
            {/* Threshold Marker */}
            <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-gray-300 z-10" title="100% Break-even"></div>
             {/* Bar */}
            <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${stats.recoveryRate >= 100 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`}
                style={{ width: `${Math.min(stats.recoveryRate, 100)}%` }}
            ></div>
        </div>
      </div>

    </div>
  );
};

export default StatsDisplay;