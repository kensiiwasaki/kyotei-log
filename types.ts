export interface DailyRecord {
  date: string; // YYYY-MM-DD
  investment: number;
  returnAmount: number;
  memo: string;
}

export interface MonthlyStats {
  totalInvestment: number;
  totalReturn: number;
  netProfit: number;
  winRate: number; // Percentage 0-100
  recoveryRate: number; // Percentage
  daysPlayed: number;
}

export enum RaceStatus {
  WIN = 'WIN',
  LOSS = 'LOSS',
  DRAW = 'DRAW', // Break even
  NO_PLAY = 'NO_PLAY'
}