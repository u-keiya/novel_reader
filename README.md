# Novel Reader

小説リーダーアプリケーション

## 概要

このアプリケーションは、Web上で小説を読むためのリーダーアプリケーションです。
ユーザーは小説をアップロードし、ブラウザ上で快適に読むことができます。

## 技術スタック

- **フロントエンド**
  - Next.js 13.5.1
  - TailwindCSS
  - shadcn/ui
  - TypeScript

- **バックエンド**
  - Supabase
    - 認証
    - データベース
    - ストレージ

## 主な機能

- ユーザー認証
- 小説のアップロード
- 小説の閲覧
- いいね機能
- レスポンシブデザイン
- ダークモード対応

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone [repository-url]
cd novel-reader
```

2. 依存パッケージのインストール
```bash
npm install
```

3. 環境変数の設定
`.env`ファイルを作成し、必要な環境変数を設定：
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションは http://localhost:3000 で実行されます。

## プロジェクト構造

- `app/` - Next.jsのアプリケーションルーティング
- `components/` - 再利用可能なUIコンポーネント
- `lib/` - ユーティリティ関数とSupabase設定
- `store/` - 状態管理
- `hooks/` - カスタムフック
- `supabase/` - データベースマイグレーション

## ライセンス

[ライセンス情報を追加]