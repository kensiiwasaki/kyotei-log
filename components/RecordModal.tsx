import React, { useState, useEffect } from 'react';
import { X, Calculator, Save, Trash2 } from 'lucide-react';
import { DailyRecord } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  existingRecord?: DailyRecord;
  onSave: (record: DailyRecord) => void;
  onDelete: (date: string) => void;
}

const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, date, existingRecord, onSave, onDelete }) => {
  const [investment, setInvestment] = useState('');
  const [returnAmount, setReturnAmount] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInvestment(existingRecord ? existingRecord.investment.toString() : '');
      setReturnAmount(existingRecord ? existingRecord.returnAmount.toString() : '');
      setMemo(existingRecord?.memo || '');
    }
  }, [isOpen, existingRecord]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: date.toISOString().split('T')[0],
      investment: Number(investment) || 0,
      returnAmount: Number(returnAmount) || 0,
      memo
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(date.toISOString().split('T')[0]);
    onClose();
  };

  const profit = (Number(returnAmount) || 0) - (Number(investment) || 0);
  const isWin = profit > 0;
  const isLoss = profit < 0 && (Number(investment) > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-4 border-blue-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              収支入力
            </h2>
            <p className="text-blue-100 font-medium">
              {date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">投資 (円)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-xl font-bold text-gray-700"
                  placeholder="0"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">回収 (円)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={returnAmount}
                  onChange={(e) => setReturnAmount(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none text-xl font-bold text-teal-700"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Live Calculation Display */}
          <div className={`p-4 rounded-2xl flex justify-between items-center border-2 ${isWin ? 'bg-teal-50 border-teal-200' : isLoss ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-100'}`}>
            <span className="text-gray-500 font-bold">本日の収支</span>
            <span className={`text-2xl font-black ${isWin ? 'text-teal-600' : isLoss ? 'text-rose-500' : 'text-gray-400'}`}>
              {profit > 0 ? '+' : ''}{profit.toLocaleString()}円
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">メモ / レース名</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={2}
              className="w-full p-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
              placeholder="例：SG住之江 優勝戦"
            />
          </div>

          <div className="pt-2 flex gap-3">
            {existingRecord && (
               <button
               type="button"
               onClick={handleDelete}
               className="flex-1 py-3 px-4 bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
             >
               <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
               削除
             </button>
            )}
            <button
              type="submit"
              className="flex-[2] py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Save className="w-5 h-5" />
              保存する
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RecordModal;