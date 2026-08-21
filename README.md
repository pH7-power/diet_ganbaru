# 💪 ダイエット トラッカー

スマートフォン最適化された、シンプルな入力で毎日の体重・運動・食事を記録するアプリケーション。

**目標**：2026年10月31日までに78kg → 70kg に減量  
**戦略**：食べる量制限ではなく、運動量増加でカロリー消費

---

## 機能

- ✅ 体重の毎日記録（朝の計測）
- ✅ 運動ログ（種別・時間・消費カロリー自動計算）
- ✅ 食事記録（軽く大まかに）
- ✅ 体重推移グラフ（リアルタイム更新）
- ✅ 運動記録グラフ
- ✅ 進捗ダッシュボード
- ✅ Obsidian ファイルとの同期

---

## セットアップ

### 前提条件

- Node.js 16.0 以上
- npm or yarn

### インストール

```bash
cd 個人事業主/ダイエット/app
npm install
```

### 開発環境での実行

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開く（または同一WiFi内の別デバイスからアクセス）

### ビルド（本番用）

```bash
npm run build
npm run preview
```

---

## 使い方

### 朝（体重記録）

1. アプリを起動
2. 「記録」タブ → 「体重を記録」
3. 体重を入力（例：78.2）
4. 時刻と備考は自動入力（任意で変更可）
5. 「保存」をクリック

### 日中・夜（運動記録）

1. アプリを起動
2. 「記録」タブ → 「運動を記録」
3. 運動種別を選択（ランニング、ジム等）
4. 時間を入力（分単位）
5. 消費カロリーが自動計算される
6. 「記録する」をクリック

### 食事記録

1. アプリを起動
2. 「記録」タブ → 「食事を記録」
3. 食事内容と推定カロリーを入力
4. 「記録する」をクリック

### 振り返り

1. 「ホーム」タブで体重推移グラフと運動記録を確認
2. 「進捗」タブで目標達成度をチェック

---

## ファイル構成

```
app/
├── src/
│   ├── components/          # React コンポーネント
│   │   ├── Dashboard.jsx    # ダッシュボード（グラフ表示）
│   │   ├── WeightInput.jsx  # 体重入力フォーム
│   │   ├── ExerciseLog.jsx  # 運動記録
│   │   ├── MealLog.jsx      # 食事記録
│   │   └── Stats.jsx        # 統計表示
│   ├── utils/               # ユーティリティ関数
│   │   ├── calculations.js  # カロリー計算など
│   │   ├── constants.js     # 定数（運動の消費カロリー）
│   │   └── obsidian-sync.js # Obsidian 同期
│   ├── App.jsx              # メインアプリコンポーネント
│   ├── main.jsx             # エントリーポイント
│   └── index.css            # グローバルスタイル
├── index.html               # HTML テンプレート
├── package.json
├── vite.config.js           # Vite 設定
├── tailwind.config.js       # Tailwind 設定
└── postcss.config.js        # PostCSS 設定
```

---

## データ構造

### `diet_log.json`

すべてのデータは JSON 形式で保存されます：

```json
{
  "metadata": {
    "goal_start_weight": 78.0,
    "goal_target_weight": 70.0,
    "goal_start_date": "2026-08-21",
    "goal_deadline": "2026-10-31"
  },
  "daily_records": [
    {
      "date": "2026-08-21",
      "weight_morning": {
        "value": 78.0,
        "time": "07:30",
        "note": ""
      },
      "exercise": [
        {
          "type": "running",
          "duration_minutes": 30,
          "time": "07:00",
          "calories_burned": 300
        }
      ],
      "meals": [
        {
          "time": "12:00",
          "description": "弁当（普通盛）",
          "estimated_calories": 700
        }
      ],
      "total_calories_consumed": 700,
      "total_calories_burned": 300
    }
  ]
}
```

---

## 運動の消費カロリー（参考値）

体重 78kg の場合：

| 運動種別 | 1時間あたり | 30分 |
|---|---|---|
| ランニング | 600 kcal | 300 kcal |
| ウォーキング | 300 kcal | 150 kcal |
| サイクリング | 400 kcal | 200 kcal |
| ジム（有酸素） | 500 kcal | 250 kcal |
| ジム（筋トレ） | 450 kcal | 225 kcal |
| ヨガ | 250 kcal | 125 kcal |
| 水泳 | 550 kcal | 275 kcal |

※ 実際の消費カロリーは体重・年齢・運動強度により異なります

---

## スマートフォンでのアクセス

### 開発環境

1. PC で `npm run dev` を実行
2. スマートフォンを同じ WiFi に接続
3. PC の IP アドレスを確認：`ipconfig` (Windows) or `ifconfig` (Mac)
4. スマートフォンのブラウザで `http://<PC-IP>:5173` を開く

### 本番環境

Vercel または GitHub Pages にデプロイして HTTPS でアクセス可能

---

## トラブルシューティング

### データが保存されない

- ブラウザの localStorage が有効か確認
- DevTools の Application タブで localStorage を確認

### グラフが表示されない

- ブラウザのコンソールでエラーを確認
- Recharts のインストールを確認：`npm list recharts`

### Obsidian との同期ができない

- Node.js API サーバーが起動しているか確認
- ネットワーク接続を確認

---

## 今後の拡張予定

- [ ] スマートウォッチ連携（Apple Health / Google Fit）
- [ ] 栄養情報の自動抽出（食事写真 OCR）
- [ ] AI アドバイス機能
- [ ] Slack / Discord 通知
- [ ] PDFレポート生成

---

## ライセンス

個人用プロジェクト

---

## 支援・質問

設計書を参照：`../設計書.md`
