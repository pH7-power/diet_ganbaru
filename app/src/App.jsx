import React, { useState, useEffect } from 'react';
import WeightInput from './components/WeightInput';
import ExerciseLog from './components/ExerciseLog';
import MealLog from './components/MealLog';
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import { loadFromLocalStorage, saveToLocalStorage, initializeData, syncToObsidian } from './utils/obsidian-sync';
import './index.css';

export default function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('home'); // home, add, stats
  const [loading, setLoading] = useState(true);

  // 初期化：データを読み込む
  useEffect(() => {
    const initialize = async () => {
      const loadedData = await initializeData();
      if (loadedData) {
        setData(loadedData);
      }
      setLoading(false);
    };
    initialize();
  }, []);

  // 体重を記録
  const handleWeightSubmit = (weight) => {
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...data };

    let todayRecord = newData.daily_records.find(r => r.date === today);
    if (!todayRecord) {
      todayRecord = {
        date: today,
        weight_morning: weight,
        exercise: [],
        meals: [],
        total_calories_consumed: 0,
        total_calories_burned: 0,
      };
      newData.daily_records.push(todayRecord);
    } else {
      todayRecord.weight_morning = weight;
    }

    // 計算：総カロリー
    todayRecord.total_calories_consumed = todayRecord.meals?.reduce(
      (sum, meal) => sum + (meal.estimated_calories || 0),
      0
    ) || 0;
    todayRecord.total_calories_burned = todayRecord.exercise?.reduce(
      (sum, ex) => sum + (ex.calories_burned || 0),
      0
    ) || 0;

    newData.metadata.last_updated = new Date().toISOString();
    setData(newData);
    saveToLocalStorage(newData);
    syncToObsidian(newData);
  };

  // 運動を記録
  const handleExerciseSubmit = (exercise) => {
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...data };

    let todayRecord = newData.daily_records.find(r => r.date === today);
    if (!todayRecord) {
      todayRecord = {
        date: today,
        weight_morning: null,
        exercise: [exercise],
        meals: [],
        total_calories_consumed: 0,
        total_calories_burned: exercise.calories_burned,
      };
      newData.daily_records.push(todayRecord);
    } else {
      todayRecord.exercise.push(exercise);
      todayRecord.total_calories_burned += exercise.calories_burned;
    }

    newData.metadata.last_updated = new Date().toISOString();
    setData(newData);
    saveToLocalStorage(newData);
    syncToObsidian(newData);
  };

  // 食事を記録
  const handleMealSubmit = (meal) => {
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...data };

    let todayRecord = newData.daily_records.find(r => r.date === today);
    if (!todayRecord) {
      todayRecord = {
        date: today,
        weight_morning: null,
        exercise: [],
        meals: [meal],
        total_calories_consumed: meal.estimated_calories || 0,
        total_calories_burned: 0,
      };
      newData.daily_records.push(todayRecord);
    } else {
      todayRecord.meals.push(meal);
      todayRecord.total_calories_consumed += meal.estimated_calories || 0;
    }

    newData.metadata.last_updated = new Date().toISOString();
    setData(newData);
    saveToLocalStorage(newData);
    syncToObsidian(newData);
  };

  if (loading) {
    return (
      <div className="container-main flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 font-medium tracking-wider">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container-main flex items-center justify-center min-h-screen bg-slate-900">
        <div className="card text-center border-red-500 border">
          <p className="text-red-400 font-bold">エラー：データを読み込めませんでした</p>
        </div>
      </div>
    );
  }

  const latestWeight = data.daily_records?.length > 0
    ? data.daily_records[data.daily_records.length - 1].weight_morning?.value
    : undefined;

  return (
    <div className="container-main">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-5 pt-10 mb-6 rounded-b-2xl shadow-lg">
        <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
          💪 <span className="text-gradient">Diet Tracker</span>
        </h1>
        <div className="flex justify-between items-center text-xs font-medium text-slate-400">
          <span>Target: 78kg → 70kg</span>
          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
            Oct 31, 2026
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pb-12 animate-fade-in">
        {tab === 'home' && <Dashboard data={data} />}
        
        {tab === 'add' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 pl-2 border-l-4 border-indigo-500">Log Daily Activity</h2>
            <WeightInput onSubmit={handleWeightSubmit} latestWeight={latestWeight} />
            <ExerciseLog onSubmit={handleExerciseSubmit} />
            <MealLog onSubmit={handleMealSubmit} />
          </div>
        )}

        {tab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4 pl-2 border-l-4 border-indigo-500">Progress Details</h2>
            <Stats data={data} />
          </div>
        )}
      </main>

      {/* Footer / Last Updated */}
      <footer className="text-center text-xs text-slate-500 pb-28">
        <p>Last Sync: {new Date(data.metadata.last_updated).toLocaleString('ja-JP')}</p>
      </footer>

      {/* Bottom Tab Navigation (Mobile Optimized) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-30 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex justify-around items-center w-full p-2 h-20">
          <button
            onClick={() => setTab('home')}
            className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${
              tab === 'home' ? 'text-indigo-400 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-2xl mb-1">{tab === 'home' ? '📊' : '📉'}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">Home</span>
          </button>
          
          <button
            onClick={() => setTab('add')}
            className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${
              tab === 'add' ? 'text-indigo-400 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-1 transition-all duration-300 ${
              tab === 'add' ? 'bg-indigo-500/20 border-2 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-transparent'
            }`}>
              <span className="text-2xl">➕</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase">Record</span>
          </button>
          
          <button
            onClick={() => setTab('stats')}
            className={`flex flex-col items-center justify-center w-full h-full rounded-2xl transition-all duration-300 ${
              tab === 'stats' ? 'text-indigo-400 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-2xl mb-1">{tab === 'stats' ? '🎯' : '📍'}</span>
            <span className="text-[10px] font-bold tracking-wider uppercase">Stats</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
