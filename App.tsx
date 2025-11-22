import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Ship, Calendar as CalendarIcon } from 'lucide-react';
import { DailyRecord, MonthlyStats } from './types';
import { formatDateKey, getDaysInMonth, calculateStats, formatCurrency } from './utils';
import RecordModal from './components/RecordModal';
import StatsDisplay from './components/StatsDisplay';
import Charts from './components/Charts';

const App: React.FC = () => {
  // State
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedRecords = localStorage.getItem('kyotei-records');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('kyotei-records', JSON.stringify(records));
    }
  }, [records]);

  // Handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveRecord = (newRecord: DailyRecord) => {
    setRecords(prev => {
      const filtered = prev.filter(r => r.date !== newRecord.date);
      if (newRecord.investment === 0 && newRecord.returnAmount === 0 && !newRecord.memo) {
          return filtered;
      }
      return [...filtered, newRecord];
    });
  };

  const handleDeleteRecord = (dateStr: string) => {
    setRecords(prev => prev.filter(r => r.date !== dateStr));
  };

  // Derived State for UI
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const stats: MonthlyStats = calculateStats(records, currentDate.getFullYear(), currentDate.getMonth());

  // Determine padding for calendar grid (start day of week)
  const firstDayOfWeek = days[0].getDay(); // 0 = Sunday
  const paddingArray = Array(firstDayOfWeek).fill(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  return (
    <div className="min-h-screen pb-20 bg-[#eff6ff]">
      
      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="bg-blue-100 p-2 rounded-xl">
                <Ship className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-800 font-mono">Kyotei Log</h1>
          </div>
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-full transition-all text-gray-600 shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-gray-700 min-w-[140px] text-center">
              {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
            </span>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-full transition-all text-gray-600 shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Dashboard Section */}
        <StatsDisplay stats={stats} />

        {/* Charts Section */}
        <div className="mb-8">
            <Charts records={records} currentYear={currentYear} currentMonth={currentMonth} />
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-gray-700">カレンダー</h2>
            </div>
            
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                <div key={day} className={`py-3 text-center text-xs font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'}`}>
                    {day}
                </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {paddingArray.map((_, i) => (
                    <div key={`pad-${i}`} className="h-24 sm:h-32 bg-gray-50/50 border-b border-r border-gray-100"></div>
                ))}
                
                {days.map((day) => {
                    const dateKey = formatDateKey(day);
                    const record = records.find(r => r.date === dateKey);
                    const profit = record ? record.returnAmount - record.investment : 0;
                    const isProfit = profit > 0;
                    const isLoss = profit < 0;
                    const isToday = dateKey === formatDateKey(new Date());

                    return (
                        <div 
                            key={dateKey}
                            onClick={() => handleDateClick(day)}
                            className={`h-24 sm:h-32 border-b border-r border-gray-100 p-2 relative cursor-pointer transition-all hover:bg-blue-50 group
                                ${isToday ? 'bg-yellow-50/50' : ''}
                            `}
                        >
                            <span className={`
                                inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold
                                ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-500'}
                            `}>
                                {day.getDate()}
                            </span>

                            {record && (
                                <div className="mt-2 flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                                    <div className={`text-xs sm:text-sm font-black ${isProfit ? 'text-teal-600' : isLoss ? 'text-rose-500' : 'text-gray-400'}`}>
                                        {isProfit ? '+' : ''}{profit.toLocaleString()}
                                    </div>
                                    {record.investment > 0 && (
                                         <div className="hidden sm:block text-[10px] text-gray-400 mt-1 font-medium bg-white/50 px-2 py-0.5 rounded-full">
                                         投: {record.investment.toLocaleString()}
                                        </div>
                                    )}
                                    <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isProfit ? 'bg-teal-400' : isLoss ? 'bg-rose-400' : 'bg-gray-300'}`}></div>
                                </div>
                            )}

                            {/* Hover Plus Icon */}
                            {!record && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                        <div className="w-4 h-4 relative">
                                            <div className="absolute inset-0 m-auto w-full h-0.5 bg-current"></div>
                                            <div className="absolute inset-0 m-auto h-full w-0.5 bg-current"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </main>

      {selectedDate && (
        <RecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          existingRecord={records.find(r => r.date === formatDateKey(selectedDate))}
          onSave={handleSaveRecord}
          onDelete={handleDeleteRecord}
        />
      )}
    </div>
  );
};

export default App;