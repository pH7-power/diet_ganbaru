import React from 'react';
import { calculateProgress, calculateDailyTarget } from '../utils/calculations.js';

export default function Stats({ data }) {
  if (!data || !data.daily_records || data.daily_records.length === 0) {
    return null;
  }

  const records = data.daily_records;
  const metadata = data.metadata;
  const latestWeight = records[records.length - 1].weight_morning?.value || 0;

  const progress = calculateProgress(metadata, latestWeight);
  const target = calculateDailyTarget(metadata, records);

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🎯</span> <span className="text-white">進捗状況</span>
      </h2>

      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-300">目標達成度</span>
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">{progress.progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-5 shadow-inner border border-slate-700/50 p-0.5">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]"
            style={{ width: `${Math.min(100, Math.max(0, progress.progressPercent))}%` }}
          ></div>
        </div>
      </div>

      {/* 主要メトリクス */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">スタート</p>
          <div className="flex items-baseline justify-center gap-1">
            <p className="text-2xl font-bold text-slate-300">{progress.startWeight}</p>
            <p className="text-xs font-medium text-slate-500">kg</p>
          </div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 text-center shadow-[0_0_15px_rgba(99,102,241,0.1)]">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">現在</p>
          <div className="flex items-baseline justify-center gap-1">
            <p className="text-2xl font-bold text-indigo-400">{progress.currentWeight}</p>
            <p className="text-xs font-medium text-slate-500">kg</p>
          </div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">目標</p>
          <div className="flex items-baseline justify-center gap-1">
            <p className="text-2xl font-bold text-emerald-400">{progress.targetWeight}</p>
            <p className="text-xs font-medium text-slate-500">kg</p>
          </div>
        </div>
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">減量達成</p>
          <div className="flex items-baseline justify-center gap-1">
            <p className="text-2xl font-bold text-orange-400">{progress.kgLost}</p>
            <p className="text-xs font-medium text-slate-500">kg</p>
          </div>
        </div>
      </div>

      {/* 目標ペース */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-2xl border border-indigo-500/20 shadow-lg space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2 mb-2">
          <span>🚀</span> 目標ペース
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
            <span className="text-slate-400 font-medium text-sm">残り期間</span>
            <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-lg shadow-inner">{target.daysRemaining} 日</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
            <span className="text-slate-400 font-medium text-sm">残り体重</span>
            <span className="font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg">{target.kgRemaining} kg</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
            <span className="text-slate-400 font-medium text-sm">必要カロリー赤字</span>
            <span className="font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">{target.caloriesNeeded.toLocaleString()} <span className="text-xs font-normal">kcal</span></span>
          </div>
          
          <div className="mt-4 pt-2">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-indigo-500/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
              <span className="text-slate-300 font-bold mb-1">1日の目標赤字</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                  {target.dailyTarget.toLocaleString()}
                </span>
                <span className="text-sm text-slate-500 font-bold">kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
