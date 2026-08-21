import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { calculateWeeklyStats, calculateProgress } from '../utils/calculations.js';

export default function Dashboard({ data }) {
  if (!data || !data.daily_records || data.daily_records.length === 0) {
    return (
      <div className="card text-center py-10">
        <p className="text-slate-400 font-medium">データがまだ記録されていません</p>
      </div>
    );
  }

  const records = data.daily_records;
  const metadata = data.metadata;

  // 最新の体重を取得
  const latestWeight = records[records.length - 1].weight_morning?.value || 0;

  // 進捗を計算
  const progress = calculateProgress(metadata, latestWeight);

  // グラフ用のデータを準備
  const chartData = records.map(record => ({
    date: record.date.slice(-2), // MM-DD から DD のみ取得
    weight: record.weight_morning?.value || null,
    exerciseMinutes: record.exercise?.reduce((sum, ex) => sum + ex.duration_minutes, 0) || 0,
    caloriesBurned: record.exercise?.reduce((sum, ex) => sum + ex.calories_burned, 0) || 0,
    caloriesConsumed: record.total_calories_consumed || 0,
  }));

  const weeklyStats = calculateWeeklyStats(records);

  // Recharts カスタムテーマ
  const chartTheme = {
    grid: '#334155',
    text: '#94a3b8',
    tooltipBg: '#1e293b',
    tooltipBorder: '#475569',
  };

  return (
    <div className="space-y-5">
      {/* サマリーカード */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center p-4">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">現在の体重</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{latestWeight}</span>
            <span className="text-xs font-bold text-slate-500">kg</span>
          </div>
        </div>
        <div className="card text-center p-4">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">達成度</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">{progress.progressPercent}</span>
            <span className="text-xs font-bold text-slate-500">%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center p-4">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">減量</p>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">{progress.kgLost}</span>
            <span className="text-[10px] font-bold text-slate-500">/ {progress.totalKgToLose} kg</span>
          </div>
        </div>
        <div className="card text-center p-4">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">週間運動</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">{weeklyStats.totalExerciseHours}</span>
            <span className="text-[10px] font-bold text-slate-500">時間</span>
          </div>
        </div>
      </div>

      {/* 体重推移グラフ */}
      <div className="card px-2 py-5">
        <h3 className="text-lg font-bold mb-4 pl-4 text-white flex items-center gap-2">
          <span>📉</span> 体重推移
        </h3>
        <div className="pr-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="date" stroke={chartTheme.text} tick={{ fill: chartTheme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke={chartTheme.text} tick={{ fill: chartTheme.text, fontSize: 12 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip 
                contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '0.5rem', color: '#fff' }}
                itemStyle={{ color: '#818cf8' }}
                formatter={(value) => value.toFixed(1)} 
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#1e293b', stroke: '#6366f1', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
                connectNulls
                name="体重 (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 運動記録グラフ */}
      <div className="card px-2 py-5">
        <h3 className="text-lg font-bold mb-4 pl-4 text-white flex items-center gap-2">
          <span>🔥</span> 消費カロリー
        </h3>
        <div className="pr-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="date" stroke={chartTheme.text} tick={{ fill: chartTheme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis stroke={chartTheme.text} tick={{ fill: chartTheme.text, fontSize: 12 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip 
                contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, borderRadius: '0.5rem', color: '#fff' }}
                itemStyle={{ color: '#10b981' }}
                cursor={{ fill: '#334155', opacity: 0.4 }}
              />
              <Bar 
                dataKey="caloriesBurned" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                name="消費カロリー" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 詳細統計 */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4 text-white">📊 詳細統計</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
            <span className="text-slate-400 font-medium">週間運動時間</span>
            <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-lg">{weeklyStats.totalExerciseHours} 時間</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
            <span className="text-slate-400 font-medium">推定消費カロリー</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">+{weeklyStats.totalCaloriesBurned}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
            <span className="text-slate-400 font-medium">推定摂取カロリー</span>
            <span className="font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg">{weeklyStats.totalCaloriesConsumed}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-300 font-bold">カロリー収支</span>
            <span className={`font-extrabold text-xl ${
              weeklyStats.calorieBalance > 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {weeklyStats.calorieBalance > 0 ? '+' : ''}{weeklyStats.calorieBalance} <span className="text-xs text-slate-500 font-normal">kcal</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
