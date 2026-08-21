import React, { useState, useEffect } from 'react';

export default function WeightInput({ onSubmit, latestWeight }) {
  const [weight, setWeight] = useState(latestWeight || '');
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  );
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || parseFloat(weight) <= 0) {
      alert('正しい体重を入力してください');
      return;
    }
    onSubmit({
      value: parseFloat(weight),
      time: time,
      note: note,
    });
    setWeight('');
    setNote('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <span className="text-2xl">🏋️</span> <span className="text-white">体重を記録</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">体重（kg）</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="78.0"
            className="input-field text-3xl text-center font-extrabold text-white"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">時刻</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">備考（任意）</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例：朝食後"
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          保存する
        </button>

        {submitted && (
          <div className="text-center p-3 mt-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl animate-pulse">
            ✅ 記録されました
          </div>
        )}
      </form>
    </div>
  );
}
