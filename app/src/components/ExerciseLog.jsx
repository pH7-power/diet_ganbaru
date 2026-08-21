import React, { useState } from 'react';
import { EXERCISE_CALORIES, calculateCaloriesBurned } from '../utils/constants.js';

export default function ExerciseLog({ onSubmit }) {
  const [exerciseType, setExerciseType] = useState('running');
  const [duration, setDuration] = useState('30');
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  );
  const [submitted, setSubmitted] = useState(false);

  const caloriesBurned = calculateCaloriesBurned(exerciseType, parseInt(duration));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!duration || parseInt(duration) <= 0) {
      alert('正しい時間を入力してください');
      return;
    }
    onSubmit({
      type: exerciseType,
      duration_minutes: parseInt(duration),
      time: time,
      calories_burned: caloriesBurned,
    });
    setDuration('30');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <span className="text-2xl">🏃</span> <span className="text-white">運動を記録</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">運動種別</label>
          <div className="relative">
            <select
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              className="input-field appearance-none pr-10"
            >
              {Object.entries(EXERCISE_CALORIES).map(([key, value]) => (
                <option key={key} value={key} className="bg-slate-800 text-white">
                  {value.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">時間（分）</label>
            <input
              type="number"
              step="5"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">時刻</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-xl text-center shadow-inner mt-2">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">推定消費カロリー</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              {caloriesBurned}
            </span>
            <span className="text-sm font-bold text-slate-500">kcal</span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          記録する
        </button>

        {submitted && (
          <div className="text-center p-3 mt-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl animate-pulse">
            ✅ 運動を記録しました
          </div>
        )}
      </form>
    </div>
  );
}
