import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { DailyRecord } from '../types';

interface ChartsProps {
  records: DailyRecord[];
  currentYear: number;
  currentMonth: number;
}

const Charts: React.FC<ChartsProps> = ({ records, currentYear, currentMonth }) => {
  // Prepare data: Accumulate profit over the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const data = [];
  let cumulativeProfit = 0;

  for (let i = 1; i <= daysInMonth; i++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const record = records.find(r => r.date === dateKey);
    
    const dailyProfit = record ? record.returnAmount - record.investment : 0;
    cumulativeProfit += dailyProfit;

    data.push({
      day: i,
      daily: dailyProfit,
      cumulative: cumulativeProfit,
    });
  }

  // Skip rendering if no data to avoid ugly empty charts
  const hasData = records.some(r => r.date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));

  if (!hasData) {
      return (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center text-gray-400 h-64 flex items-center justify-center flex-col gap-2">
              <p className="font-bold text-lg">データがありません</p>
              <p className="text-sm">カレンダーの日付をタップして収支を入力してください</p>
          </div>
      )
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-80 w-full relative overflow-hidden">
      <h3 className="text-lg font-bold text-gray-700 mb-4 ml-2 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-500 rounded-full block"></span>
        月間収支推移
      </h3>
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="day" 
                tick={{fontSize: 12, fill: '#94a3b8'}} 
                axisLine={false} 
                tickLine={false}
                interval={Math.floor(daysInMonth / 5)}
            />
            <YAxis 
                tick={{fontSize: 12, fill: '#94a3b8'}} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(val) => `${val/1000}k`}
            />
            <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()}円`, '収支']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
            <Area 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fill="url(#colorProfit)" 
                animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;