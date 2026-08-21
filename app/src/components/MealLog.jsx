import React, { useState } from 'react';

export default function MealLog({ onSubmit }) {
  const [mealTime, setMealTime] = useState(
    new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  );
  const [mealDescription, setMealDescription] = useState('');
  const [estimatedCalories, setEstimatedCalories] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mealDescription.trim()) {
      alert('食事の内容を入力してください');
      return;
    }

    onSubmit({
      time: mealTime,
      description: mealDescription,
      estimated_calories: estimatedCalories ? parseInt(estimatedCalories) : 0,
    });

    setMealDescription('');
    setEstimatedCalories('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <span className="text-2xl">🍽️</span> <span className="text-white">食事を記録</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">時刻</label>
          <input
            type="time"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">食事内容</label>
          <input
            type="text"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
            placeholder="例：弁当（普通盛）"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">推定カロリー（任意）</label>
          <div className="relative">
            <input
              type="number"
              step="50"
              min="0"
              value={estimatedCalories}
              onChange={(e) => setEstimatedCalories(e.target.value)}
              placeholder="800"
              className="input-field pr-12"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 mb-4">
              <span className="text-slate-500 font-bold">kcal</span>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          記録する
        </button>

        {submitted && (
          <div className="text-center p-3 mt-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl animate-pulse">
            ✅ 食事を記録しました
          </div>
        )}
      </form>
    </div>
  );
}
