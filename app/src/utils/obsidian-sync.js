/**
 * Obsidian ファイルとの同期・ローカルストレージ管理
 * 開発環境：localStorage を使用
 * 本番環境：Node.js API サーバー経由でファイルを読み書き
 */

const STORAGE_KEY = 'diet_tracker_data';
const API_ENDPOINT = 'http://localhost:3001/api/diet';

/**
 * ローカルストレージからデータを読み込む
 */
export const loadFromLocalStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse localStorage:', e);
      return null;
    }
  }
  return null;
};

/**
 * ローカルストレージにデータを保存
 */
export const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
    return false;
  }
};

/**
 * API サーバー経由で Obsidian ファイルから読み込む
 */
export const loadFromObsidian = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/read`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (e) {
    console.warn('Failed to load from Obsidian API:', e);
    return null;
  }
};

/**
 * API サーバー経由で Obsidian ファイルに保存
 */
export const saveToObsidian = async (data) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error('Failed to save to Obsidian API:', e);
    return false;
  }
};

/**
 * 初期化：Obsidian またはローカルストレージから最新データを読み込む
 */
export const initializeData = async () => {
  // 最初に Obsidian から読み込みを試みる
  let data = await loadFromObsidian();

  // 失敗した場合、ローカルストレージから読み込む
  if (!data) {
    data = loadFromLocalStorage();
  }

  return data;
};

/**
 * データを同期：ローカルストレージ → Obsidian（定期的に呼び出す）
 */
export const syncToObsidian = async (data) => {
  // ローカルストレージに保存（即座に）
  saveToLocalStorage(data);

  // Obsidian に保存（非同期、失敗しても進行を止めない）
  await saveToObsidian(data);
};

/**
 * 毎日の定時実行：データをバックアップ
 */
export const scheduleBackup = () => {
  // 毎晩 23:00 に実行（開発環境では簡易版）
  setInterval(() => {
    const data = loadFromLocalStorage();
    if (data) {
      saveToObsidian(data).catch(err =>
        console.warn('Backup failed:', err)
      );
    }
  }, 60 * 60 * 1000); // 1 時間ごと
};
