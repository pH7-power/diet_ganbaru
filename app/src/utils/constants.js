// 運動の消費カロリー（kg/時間）
// 目安：体重によって変わるため、78kg での数値を使用
export const EXERCISE_CALORIES = {
  running: { name: 'ランニング', calories_per_hour: 600 },
  walking: { name: 'ウォーキング', calories_per_hour: 300 },
  cycling: { name: 'サイクリング', calories_per_hour: 400 },
  gym_cardio: { name: 'ジム（有酸素）', calories_per_hour: 500 },
  gym_strength: { name: 'ジム（筋トレ）', calories_per_hour: 450 },
  yoga: { name: 'ヨガ', calories_per_hour: 250 },
  swimming: { name: '水泳', calories_per_hour: 550 },
  soccer: { name: 'サッカー', calories_per_hour: 600 },
  basketball: { name: 'バスケットボール', calories_per_hour: 580 },
};

// 食事カロリーの目安
export const MEAL_CALORIES = {
  light: { name: '軽い食事', calories: 500 },
  normal: { name: '通常の食事', calories: 800 },
  heavy: { name: 'しっかり食べた', calories: 1200 },
};

// 目標設定
export const DIET_GOAL = {
  start_weight: 78.0,
  target_weight: 70.0,
  target_date: '2026-10-31',
  height_cm: 173,
};

// 基礎代謝（Mifflin-St Jeor式）
// 男性：(10 × weight) + (6.25 × height) - (5 × age) + 5
export const calculateBMR = (weight, height, age) => {
  return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5);
};

// 1kg 減量に必要なカロリー差分（約7,700 kcal）
export const CALORIES_PER_KG = 7700;
