/**
 * Obsidian ファイルシステム統合サーバー
 * Web アプリから Obsidian の diet_log.json ファイルを読み書きするためのAPI
 *
 * 実行方法: node server.js
 * ポート: 3001
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Obsidian vault の パス（環境変数で指定可能）
const OBSIDIAN_VAULT = process.env.OBSIDIAN_VAULT || path.resolve(__dirname, '../../data');
const DIET_LOG_PATH = path.join(OBSIDIAN_VAULT, 'diet_log.json');

// ミドルウェア
app.use(cors());
app.use(express.json());

// ログ用ミドルウェア
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// HealthCheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', vault: OBSIDIAN_VAULT });
});

/**
 * GET /api/diet/read
 * Obsidian の diet_log.json を読む
 */
app.get('/api/diet/read', (req, res) => {
  try {
    if (!fs.existsSync(DIET_LOG_PATH)) {
      return res.status(404).json({ error: 'diet_log.json not found' });
    }

    const data = fs.readFileSync(DIET_LOG_PATH, 'utf-8');
    const parsed = JSON.parse(data);

    res.json(parsed);
  } catch (err) {
    console.error('Error reading diet_log.json:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/diet/write
 * Obsidian の diet_log.json に書き込む
 */
app.post('/api/diet/write', (req, res) => {
  try {
    const data = req.body;

    // バリデーション
    if (!data.metadata || !data.daily_records) {
      return res.status(400).json({ error: 'Invalid data structure' });
    }

    // ディレクトリが存在しない場合は作成
    if (!fs.existsSync(OBSIDIAN_VAULT)) {
      fs.mkdirSync(OBSIDIAN_VAULT, { recursive: true });
    }

    // バックアップを作成（上書き前）
    if (fs.existsSync(DIET_LOG_PATH)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = DIET_LOG_PATH.replace('.json', `_backup_${timestamp}.json`);
      fs.copyFileSync(DIET_LOG_PATH, backupPath);
    }

    // ファイルに書き込み（整形して保存）
    fs.writeFileSync(
      DIET_LOG_PATH,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    res.json({ success: true, path: DIET_LOG_PATH });
  } catch (err) {
    console.error('Error writing diet_log.json:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/diet/backup
 * バックアップファイル一覧を取得
 */
app.get('/api/diet/backup', (req, res) => {
  try {
    if (!fs.existsSync(OBSIDIAN_VAULT)) {
      return res.json({ backups: [] });
    }

    const files = fs.readdirSync(OBSIDIAN_VAULT)
      .filter(f => f.startsWith('diet_log_backup_'))
      .sort()
      .reverse();

    res.json({ backups: files });
  } catch (err) {
    console.error('Error listing backups:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Diet Tracker API Server running on http://localhost:${PORT}`);
  console.log(`📁 Obsidian Vault: ${OBSIDIAN_VAULT}`);
  console.log(`📄 Diet Log: ${DIET_LOG_PATH}`);
});
