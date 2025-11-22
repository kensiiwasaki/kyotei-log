import { DailyRecord, MonthlyStats } from './types';

export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const calculateStats = (records: DailyRecord[], year: number, month: number): MonthlyStats => {
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthRecords = records.filter(r => r.date.startsWith(monthPrefix));

  let totalInvestment = 0;
  let totalReturn = 0;
  let winDays = 0;

  monthRecords.forEach(r => {
    totalInvestment += r.investment;
    totalReturn += r.returnAmount;
    if (r.returnAmount > r.investment) {
      winDays++;
    }
  });

  const netProfit = totalReturn - totalInvestment;
  const daysPlayed = monthRecords.length;
  const winRate = daysPlayed > 0 ? (winDays / daysPlayed) * 100 : 0;
  const recoveryRate = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;

  return {
    totalInvestment,
    totalReturn,
    netProfit,
    winRate,
    recoveryRate,
    daysPlayed
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
};