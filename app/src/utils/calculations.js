import { EXERCISE_CALORIES, CALORIES_PER_KG } from './constants.js';

/**
 * 消費カロリーを計算
 * @param {string} exerciseType - 運動種別（exercise_calories キーに対応）
 * @param {number} durationMinutes - 運動時間（分）
 * @returns {number} 消費カロリー
 */
export const calculateCaloriesBurned = (exerciseType, durationMinutes) => {
  const exercise = EXERCISE_CALORIES[exerciseType];
  if (!exercise) return 0;
  return Math.round((exercise.calories_per_hour / 60) * durationMinutes);
};

/**
 * 週間の統計情報を計算
 * @param {Array} records - 日別記録の配列
 * @returns {Object} 統計情報
 */
export const calculateWeeklyStats = (records) => {
  let totalCaloriesBurned = 0;
  let totalExerciseMinutes = 0;
  let totalCaloriesConsumed = 0;
  let weightValues = [];

  records.forEach(record => {
    if (record.weight_morning) {
      weightValues.push(record.weight_morning.value);
    }
    if (record.exercise && Array.isArray(record.exercise)) {
      record.exercise.forEach(ex => {
        totalCaloriesBurned += ex.calories_burned || 0;
        totalExerciseMinutes += ex.duration_minutes || 0;
      });
    }
    totalCaloriesConsumed += record.total_calories_consumed || 0;
  });

  const weightStart = weightValues.length > 0 ? weightValues[0] : null;
  const weightEnd = weightValues.length > 0 ? weightValues[weightValues.length - 1] : null;
  const weightDiff = weightStart && weightEnd ? weightEnd - weightStart : 0;

  return {
    totalCaloriesBurned,
    totalExerciseMinutes,
    totalCaloriesConsumed,
    totalExerciseHours: (totalExerciseMinutes / 60).toFixed(1),
    weightStart,
    weightEnd,
    weightDiff: weightDiff.toFixed(1),
    calorieBalance: totalCaloriesBurned - totalCaloriesConsumed,
  };
};

/**
 * 全体の進捗を計算
 * @param {Object} metadata - メタデータ（目標体重等）
 * @param {number} currentWeight - 現在の体重
 * @returns {Object} 進捗情報
 */
export const calculateProgress = (metadata, currentWeight) => {
  const startWeight = metadata.goal_start_weight;
  const targetWeight = metadata.goal_target_weight;
  const totalKgToLose = startWeight - targetWeight;
  const kgLost = startWeight - currentWeight;
  const progressPercent = Math.round((kgLost / totalKgToLose) * 100);

  return {
    startWeight,
    targetWeight,
    currentWeight,
    totalKgToLose: totalKgToLose.toFixed(1),
    kgLost: kgLost.toFixed(1),
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
  };
};

/**
 * 必要な1日のカロリー赤字を計算
 * @param {Object} metadata - メタデータ
 * @param {Array} records - 日別記録
 * @returns {Object} 目標情報
 */
export const calculateDailyTarget = (metadata, records) => {
  if (records.length === 0) {
    return { daysRemaining: 0, calorieDeficitNeeded: 0, dailyTarget: 0 };
  }

  const currentWeight = records[records.length - 1].weight_morning.value;
  const targetWeight = metadata.goal_target_weight;
  const deadline = new Date(metadata.goal_deadline);
  const today = new Date();

  const kgRemaining = currentWeight - targetWeight;
  const caloriesNeeded = kgRemaining * CALORIES_PER_KG;
  const daysRemaining = Math.max(1, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
  const dailyTarget = Math.round(caloriesNeeded / daysRemaining);

  return {
    kgRemaining: kgRemaining.toFixed(1),
    caloriesNeeded: Math.round(caloriesNeeded),
    daysRemaining,
    dailyTarget,
  };
};
