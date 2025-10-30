# パッケージアップグレード完全タスクリスト

**作成日**: 2025-10-29
**戦略**: Enterprise（品質重視・段階的実行・包括的検証）
**推定総作業時間**: 30-40時間

---

## 📋 概要

2年間開発が停止していたコードベースの開発再開に向けた、包括的なパッケージアップグレードタスクリストです。

### 主要な目標

1. ✅ 主要機能を網羅するE2Eテストの完備
2. ✅ 安全かつ段階的なパッケージアップグレード
3. ✅ 品質保証と継続的な検証体制の確立

### 特定された主要アップグレード

- **React**: 18.3.1 → 19.2.0（メジャーバージョンアップ）
- **MUI**: v5.18.0 → v7.3.4（2メジャーバージョンアップ）
- **Vite**: 5.4.21 → 7.1.12（2メジャーバージョンアップ）
- **ESLint**: 8.57.1 → 9.38.0（Flat config必須化）
- **GraphQL Codegen**: v4/v5 → v6（メジャーバージョンアップ）
- その他20+パッケージのマイナー・パッチアップデート

---

## ⚠️ 重要な注意事項

1. **各Phase開始前に必ずGitブランチを作成**
2. **各メジャーアップグレード後に必ずコミット**（ロールバック可能性確保）
3. **全てのアップグレード後に `pnpm validate` を実行**（lint + typecheck + build）
4. **問題発生時は即座に前のコミットに戻す**
5. **E2Eテストが完成するまでアップグレード開始しない**

---

## Phase 0: 事前準備（必須）

**所要時間**: 30分
**並列実行**: 不可（順次実行必須）

### タスク

#### 0.1 環境確認

- [ ] Node.js バージョン確認（Volta: 22.21.1）
  ```bash
  node --version
  ```
- [ ] pnpm インストール確認
  ```bash
  pnpm --version
  ```
- [ ] 依存関係インストール
  ```bash
  pnpm install
  ```

#### 0.2 現在の動作確認

- [ ] 開発サーバー起動確認
  ```bash
  pnpm dev
  # http://localhost:3000 でアクセス確認
  ```
- [ ] ビルド成功確認
  ```bash
  pnpm build
  ```
- [ ] Lint/TypeCheck 実行
  ```bash
  pnpm validate
  ```

#### 0.3 バックアップと Git 戦略

- [ ] 現在の package.json と pnpm-lock.yaml をバックアップ
  ```bash
  cp package.json package.json.backup
  cp pnpm-lock.yaml pnpm-lock.yaml.backup
  ```
- [ ] 作業用ブランチ作成
  ```bash
  git checkout -b feature/comprehensive-upgrade-2025
  ```
- [ ] 現在の状態をコミット
  ```bash
  git add -A
  git commit -m "chore: backup before upgrade - baseline commit"
  ```

#### 0.4 環境変数設定確認

- [ ] `.env` ファイル存在確認（`.env.sample` 参照）
- [ ] 必要な環境変数設定
  - `VITE_CLIENT_ID`
  - `VITE_CLIENT_SECRET`
  - `VITE_REDIRECT_URI`
  - `VITE_SENTRY_DNS`（オプション）

**成果物**:

- ✅ 動作確認済みのベースライン環境
- ✅ バックアップファイル
- ✅ 作業用Gitブランチ

---

## Phase 1: 現状調査・監査

**所要時間**: 2-3時間
**並列実行**: ✅ 可能（1.1と1.2は並列実行可）

### タスク

#### 1.1 依存関係の詳細監査（🔄 並列実行可）

- [ ] 全パッケージの最新バージョン確認
  ```bash
  pnpm outdated
  ```
- [ ] セキュリティ脆弱性チェック
  ```bash
  pnpm audit
  ```
- [ ] 使用されていない依存関係の特定
  ```bash
  npx depcheck
  ```

#### 1.2 破壊的変更の調査（🔄 並列実行可）

- [ ] React 19 breaking changes 調査
  - 公式マイグレーションガイド確認
  - 主要な変更点リスト化
- [ ] MUI v6/v7 breaking changes 調査
  - v5→v6、v6→v7の変更点
  - スタイルシステム変更確認
- [ ] Vite 6/v7 breaking changes 調査
  - 設定ファイル形式変更確認
  - プラグインAPI変更確認
- [ ] ESLint 9 Flat Config 調査
  - 移行ガイド確認
  - 設定ファイル書き換え方法

#### 1.3 現在のコードベース品質チェック

- [ ] ESLint エラー・警告の確認と修正
  ```bash
  pnpm lint
  ```
- [ ] TypeScript エラーの確認と修正
  ```bash
  pnpm typecheck
  ```
- [ ] 未使用コードの特定と削除検討

#### 1.4 調査結果のドキュメント化

- [ ] `UPGRADE_NOTES.md` 作成
  - 各パッケージの破壊的変更サマリー
  - 予想される影響範囲
  - リスク評価（High/Medium/Low）

**成果物**:

- ✅ 依存関係監査レポート
- ✅ 破壊的変更調査ドキュメント
- ✅ `UPGRADE_NOTES.md`

---

## Phase 2: E2Eテスト実装（最重要）

**所要時間**: 15-20時間
**並列実行**: ✅ 可能（2.3以降の各テストケースは並列開発可）

### 2.1 テスト環境のセットアップ

#### 2.1.1 Playwright 設定の更新

- [ ] `playwright.config.ts` の確認と最適化
  - ベースURL設定: `http://localhost:3000`
  - タイムアウト設定の調整
  - スクリーンショット/ビデオ設定
- [ ] テストディレクトリ構造の整理
  ```
  tests/
  ├── fixtures/          # テストデータ
  ├── helpers/           # テストユーティリティ
  ├── specs/             # テスト仕様
  │   ├── auth.spec.ts
  │   ├── sidebar.spec.ts
  │   ├── timeline.spec.ts
  │   └── api.spec.ts
  └── setup/
      └── auth.setup.ts  # 既存
  ```

#### 2.1.2 テストヘルパー関数の作成

- [ ] `tests/helpers/mockAuth.ts` - OAuth認証モック
- [ ] `tests/helpers/mockGraphQL.ts` - GraphQL APIモック
- [ ] `tests/helpers/storageHelper.ts` - LocalStorage操作
- [ ] `tests/helpers/pageObjects.ts` - Page Objectパターン実装

### 2.2 認証フローのモック設定

- [ ] GitHub OAuth フローのモック実装
  - `/login/oauth/access_token` エンドポイントのモック
  - 成功/失敗シナリオの実装
- [ ] LocalStorage 操作のヘルパー関数
  - Redux Persist データの設定/クリア
  - 認証トークンの注入

### 2.3 テストケース実装（🔄 並列開発可能）

#### Test 1: 認証フロー全体（🔄 並列実行可）

**ファイル**: `tests/specs/auth.spec.ts`

- [ ] 未認証状態でのLandingPage表示テスト
- [ ] OAuth開始ボタンクリックテスト
- [ ] OAuth コールバック処理テスト
  - `?code=` パラメータ処理
  - トークン取得API呼び出し
- [ ] 認証後のApp画面表示テスト
- [ ] リロード後の認証維持テスト（Redux Persist）
- [ ] ログアウト機能テスト（存在する場合）

**見積もり**: 3-4時間

#### Test 2: サイドバー機能（🔄 並列実行可）

**ファイル**: `tests/specs/sidebar.spec.ts`

- [ ] サイドバー表示テスト
- [ ] サイドバー開閉トグルテスト
- [ ] レスポンシブ表示テスト（モバイル/デスクトップ）
- [ ] ナビゲーション項目クリックテスト
- [ ] サイドバー状態の永続化テスト（Redux）

**見積もり**: 2-3時間

#### Test 3: タイムラインコンテナ（🔄 並列実行可）

**ファイル**: `tests/specs/timeline.spec.ts`

- [ ] タイムライン初期表示テスト
- [ ] スクロール動作テスト
- [ ] Infinite scroll テスト（存在する場合）
- [ ] Intersection Observer 動作確認
- [ ] 空状態の表示テスト

**見積もり**: 2-3時間

#### Test 4: GraphQL API連携（🔄 並列実行可）

**ファイル**: `tests/specs/api.spec.ts`

- [ ] Issue コメント取得テスト
  - APIモックレスポンス設定
  - データ表示確認
- [ ] Discussion コメント取得テスト
- [ ] ローディング状態の表示テスト
- [ ] キャッシュ動作テスト（RTK Query）
- [ ] 再フェッチ動作テスト

**見積もり**: 3-4時間

#### Test 5: エラーハンドリング（🔄 並列実行可）

**ファイル**: `tests/specs/error-handling.spec.ts`

- [ ] ネットワークエラー表示テスト
- [ ] 認証エラーハンドリングテスト
- [ ] GraphQL エラーレスポンステスト
- [ ] Error Boundary 動作テスト
- [ ] Sentry 連携テスト（モック）

**見積もり**: 2-3時間

#### Test 6: UI/UX詳細（🔄 並列実行可）

**ファイル**: `tests/specs/ui-ux.spec.ts`

- [ ] Material-UI テーマ適用確認
- [ ] ダークモード切替テスト（存在する場合）
- [ ] アニメーション動作テスト（Framer Motion）
- [ ] アクセシビリティテスト
  - キーボードナビゲーション
  - ARIA属性確認

**見積もり**: 2-3時間

### 2.4 テストの統合と CI/CD 準備

- [ ] 全テストの統合実行確認
  ```bash
  pnpm playwright
  ```
- [ ] CI/CD用のテスト設定
  - 並列実行設定
  - リトライ設定
  - レポート生成設定
- [ ] テストカバレッジレポート確認
- [ ] テスト実行時間の最適化

### 2.5 E2Eテストドキュメント作成

- [ ] `E2E_TEST_GUIDE.md` 作成
  - テスト実行方法
  - モック設定の説明
  - トラブルシューティング
  - テストケース一覧と目的

**成果物**:

- ✅ 10個の包括的なE2Eテストスイート
- ✅ テストヘルパー関数群
- ✅ `E2E_TEST_GUIDE.md`

**Phase 2 完了後のチェックポイント**:

```bash
# E2Eテスト全実行
pnpm playwright

# 全テストがグリーン（成功）であることを確認
# 失敗がある場合は修正してから次のPhaseに進む

# コミット
git add tests/
git commit -m "test: implement comprehensive E2E test suite"
```

---

## Phase 3: アップグレード準備

**所要時間**: 3-4時間
**並列実行**: ✅ 可能（3.1と3.2は並列実行可）

### 3.1 マイグレーションガイドの精読（🔄 並列実行可）

#### React 19

- [ ] 公式マイグレーションガイド精読
  - https://react.dev/blog/2024/04/25/react-19-upgrade-guide
- [ ] 主要な変更点の抽出
  - `use` Hook
  - Server Components（本プロジェクトは影響少）
  - 型定義の変更
- [ ] コードベースへの影響評価

#### MUI v6/v7

- [ ] v5→v6 マイグレーションガイド
  - https://mui.com/material-ui/migration/migration-v5/
- [ ] v6→v7 マイグレーションガイド
- [ ] スタイルシステム変更の確認
- [ ] コンポーネントAPIの変更確認
- [ ] テーマ構造の変更確認

#### Vite 6/v7

- [ ] Vite 6 マイグレーションガイド
  - https://vitejs.dev/guide/migration.html
- [ ] Vite 7 マイグレーションガイド
- [ ] プラグイン互換性確認
- [ ] 設定ファイル変更の確認

#### ESLint 9

- [ ] Flat Config マイグレーションガイド
  - https://eslint.org/docs/latest/use/configure/migration-guide
- [ ] `.eslintrc.cjs` → `eslint.config.js` 移行方法
- [ ] プラグイン互換性確認

### 3.2 アップグレード計画の策定（🔄 並列実行可）

- [ ] `UPGRADE_PLAN.md` 作成
  - Layer 1: 開発ツール（ESLint、TypeScript、ビルドツール）
  - Layer 2: テストフレームワーク（Vitest、Playwright）
  - Layer 3: ランタイム依存（React、MUI、その他）
- [ ] 各Layerのアップグレード順序決定
- [ ] ロールバック戦略の明確化
- [ ] リスク評価マトリックス作成

### 3.3 依存関係の整理

- [ ] 不要な依存関係の削除
  ```bash
  npx depcheck
  # 使用されていないパッケージを特定
  ```
- [ ] 開発依存と本番依存の分類確認
- [ ] Peer Dependencies 警告の解消

**成果物**:

- ✅ 各パッケージのマイグレーションノート
- ✅ `UPGRADE_PLAN.md`
- ✅ リスク評価マトリックス

---

## Phase 4: 段階的アップグレード実行

**所要時間**: 12-15時間
**並列実行**: ⚠️ 制限あり（各Layer内で慎重に並列化）

### ⚠️ 重要: 各アップグレード後の必須手順

```bash
# 1. インストール
pnpm install

# 2. 検証
pnpm validate  # lint + typecheck + build

# 3. E2Eテスト実行
pnpm playwright

# 4. 問題なければコミット
git add package.json pnpm-lock.yaml
git commit -m "chore: upgrade [package-name] to [version]"

# 5. 問題があればロールバック
git reset --hard HEAD~1
pnpm install
```

---

### Layer 1: 開発ツール（ビルド・Lint・型チェック）

**ブランチ**: `feature/upgrade-layer1-devtools`

```bash
git checkout -b feature/upgrade-layer1-devtools
```

#### 4.1.1 TypeScript アップグレード

- [ ] TypeScript 最新版にアップグレード
  ```bash
  pnpm update typescript@latest
  ```
- [ ] 型エラーの確認と修正
  ```bash
  pnpm typecheck
  ```
- [ ] `tsconfig.json` の調整（必要に応じて）
- [ ] **検証とコミット**

**見積もり**: 1時間

#### 4.1.2 ESLint 9 へのメジャーアップグレード（⚠️ 大規模変更）

- [ ] ESLint 9 とプラグインのアップグレード
  ```bash
  pnpm update eslint@9 \
    @typescript-eslint/eslint-plugin@latest \
    @typescript-eslint/parser@latest \
    eslint-plugin-react@latest \
    eslint-plugin-react-hooks@latest \
    eslint-plugin-import@latest \
    eslint-plugin-prettier@latest \
    eslint-plugin-sort-keys-custom-order@latest
  ```
- [ ] Flat Config への移行
  - `.eslintrc.cjs` 削除
  - `eslint.config.js` 作成
  - 設定の移行と調整
- [ ] `eslint-config-ts-prefixer` の互換性確認
  - 必要に応じてカスタム設定に置き換え
- [ ] Lint実行と警告・エラーの修正
  ```bash
  pnpm lint
  pnpm lint:fix
  ```
- [ ] **検証とコミット**

**見積もり**: 3-4時間

#### 4.1.3 Vite 7 へのメジャーアップグレード

- [ ] Vite と関連プラグインのアップグレード
  ```bash
  pnpm update vite@7 \
    @vitejs/plugin-react-swc@latest \
    vite-tsconfig-paths@latest
  ```
- [ ] `vite.config.ts` の調整確認
- [ ] ビルド実行確認
  ```bash
  pnpm build
  ```
- [ ] 開発サーバー起動確認
  ```bash
  pnpm dev
  ```
- [ ] **検証とコミット**

**見積もり**: 2時間

#### 4.1.4 その他ビルドツール

- [ ] PostCSS と Autoprefixer 更新
  ```bash
  pnpm update postcss@latest autoprefixer@latest
  ```
- [ ] Prettier 更新
  ```bash
  pnpm update prettier@latest
  ```
- [ ] **検証とコミット**

**見積もり**: 30分

#### Layer 1 完了チェック

- [ ] `pnpm validate` 全て成功
- [ ] `pnpm playwright` 全て成功
- [ ] 開発サーバー正常起動
- [ ] プロダクションビルド成功

```bash
# Layer 1 完了コミット
git add -A
git commit -m "chore: complete Layer 1 - devtools upgrade"
git checkout feature/comprehensive-upgrade-2025
git merge feature/upgrade-layer1-devtools
```

---

### Layer 2: テストフレームワーク

**ブランチ**: `feature/upgrade-layer2-testing`

```bash
git checkout -b feature/upgrade-layer2-testing
```

#### 4.2.1 Vitest アップグレード

- [ ] Vitest 最新版にアップグレード
  ```bash
  pnpm update vitest@latest jsdom@latest
  ```
- [ ] `vitest.config.ts` の調整確認
- [ ] 既存ユニットテストの実行確認
- [ ] **検証とコミット**

**見積もり**: 1時間

#### 4.2.2 Playwright アップグレード

- [ ] Playwright 最新版にアップグレード
  ```bash
  pnpm update @playwright/test@latest
  ```
- [ ] ブラウザのアップデート
  ```bash
  pnpm playwright install
  ```
- [ ] E2Eテスト実行確認
  ```bash
  pnpm playwright
  ```
- [ ] **検証とコミット**

**見積もり**: 1時間

#### Layer 2 完了チェック

- [ ] 全ユニットテスト成功
- [ ] 全E2Eテスト成功
- [ ] テストカバレッジ維持確認

```bash
# Layer 2 完了コミット
git add -A
git commit -m "chore: complete Layer 2 - testing frameworks upgrade"
git checkout feature/comprehensive-upgrade-2025
git merge feature/upgrade-layer2-testing
```

---

### Layer 3: ランタイム依存（⚠️ 最もリスクが高い）

**ブランチ**: `feature/upgrade-layer3-runtime`

```bash
git checkout -b feature/upgrade-layer3-runtime
```

#### 4.3.1 GraphQL Codegen アップグレード（⚠️ メジャーバージョンアップ）

- [ ] GraphQL Codegen v6 にアップグレード
  ```bash
  pnpm update @graphql-codegen/cli@6 \
    @graphql-codegen/typescript@5 \
    @graphql-codegen/typescript-operations@5 \
    @graphql-codegen/typescript-document-nodes@5 \
    @graphql-codegen/typescript-graphql-files-modules@latest \
    @graphql-codegen/typescript-rtk-query@latest
  ```
- [ ] `codegen.yml` の調整確認
- [ ] GraphQL 型の再生成
  ```bash
  pnpm codegen
  ```
- [ ] 生成されたコードの確認
- [ ] **検証とコミット**

**見積もり**: 1-2時間

#### 4.3.2 GraphQL 関連ライブラリ

- [ ] GraphQL コアライブラリ更新
  ```bash
  pnpm update graphql@latest graphql-tag@latest
  ```
- [ ] graphql-request アップグレード
  ```bash
  pnpm update graphql-request@7
  ```
- [ ] `@rtk-query/graphql-request-base-query` 更新
- [ ] API連携の動作確認
- [ ] **検証とコミット**

**見積もり**: 1時間

#### 4.3.3 React 19 へのメジャーアップグレード（⚠️ 慎重に）

- [ ] React と React-DOM のアップグレード
  ```bash
  pnpm update react@19 react-dom@19
  ```
- [ ] 型定義の更新
  ```bash
  pnpm update @types/react@19 @types/react-dom@19
  ```
- [ ] コンパイルエラーの確認と修正
- [ ] E2Eテスト実行
  ```bash
  pnpm playwright
  ```
- [ ] ブラウザでの動作確認
  - 認証フロー
  - サイドバー
  - タイムライン
  - すべての主要機能
- [ ] **検証とコミット**

**見積もり**: 2-3時間

#### 4.3.4 MUI v7 へのメジャーアップグレード（⚠️ 2段階アップグレード）

**ステップ1: v5 → v6**

- [ ] MUI v6 にアップグレード
  ```bash
  pnpm update @mui/material@6 \
    @mui/icons-material@6 \
    @mui/system@6 \
    @emotion/react@latest \
    @emotion/styled@latest
  ```
- [ ] 破壊的変更の対応
  - スタイルAPI変更
  - コンポーネントprops変更
- [ ] UIコンポーネントの動作確認
- [ ] **検証とコミット**

**ステップ2: v6 → v7**

- [ ] MUI v7 にアップグレード
  ```bash
  pnpm update @mui/material@7 \
    @mui/icons-material@7 \
    @mui/system@7
  ```
- [ ] 追加の破壊的変更対応
- [ ] UIコンポーネントの全体確認
- [ ] テーマ設定の調整
- [ ] **検証とコミット**

**見積もり**: 3-4時間

#### 4.3.5 その他のランタイム依存

- [ ] Redux関連更新
  ```bash
  pnpm update @reduxjs/toolkit@latest \
    react-redux@latest \
    redux-persist@latest
  ```
- [ ] 状態管理の動作確認（Redux Persist）

- [ ] Framer Motion 更新
  ```bash
  pnpm update framer-motion@12
  ```
- [ ] アニメーション動作確認

- [ ] その他UI/UXライブラリ

  ```bash
  pnpm update @iconify/react@6 \
    date-fns@4 \
    react-hook-form@latest \
    react-intersection-observer@10 \
    axios@latest \
    simplebar-react@latest
  ```

- [ ] 各ライブラリの動作確認
- [ ] **検証とコミット**

**見積もり**: 2時間

#### 4.3.6 Sentry アップグレード

- [ ] Sentry v10 にアップグレード
  ```bash
  pnpm update @sentry/react@10
  ```
- [ ] エラートラッキング動作確認（本番環境で）
- [ ] **検証とコミット**

**見積もり**: 30分

#### Layer 3 完了チェック

- [ ] `pnpm validate` 全て成功
- [ ] `pnpm playwright` 全て成功
- [ ] 全主要機能の動作確認
  - 認証フロー
  - サイドバー
  - タイムライン
  - GraphQL通信
  - Redux永続化
  - エラーハンドリング
- [ ] ビジュアルリグレッションチェック

```bash
# Layer 3 完了コミット
git add -A
git commit -m "chore: complete Layer 3 - runtime dependencies upgrade"
git checkout feature/comprehensive-upgrade-2025
git merge feature/upgrade-layer3-runtime
```

---

## Phase 5: 最終検証と文書化

**所要時間**: 3-4時間
**並列実行**: ✅ 可能（5.1と5.2は並列実行可）

### 5.1 包括的な品質検証（🔄 並列実行可）

#### 5.1.1 自動テスト

- [ ] 全E2Eテスト実行（3回）
  ```bash
  pnpm playwright
  pnpm playwright
  pnpm playwright
  ```
- [ ] 全ユニットテスト実行
  ```bash
  vitest run
  ```
- [ ] Lint/TypeCheck
  ```bash
  pnpm validate
  ```

#### 5.1.2 手動テスト

- [ ] 全主要機能の手動確認
  - 認証フロー（実際のGitHub OAuth）
  - サイドバーの全機能
  - タイムラインの表示とスクロール
  - GraphQL APIとの連携
  - エラーハンドリング
- [ ] 異なるブラウザでの動作確認
  - Chrome
  - Firefox
  - Safari（可能であれば）
- [ ] レスポンシブデザイン確認
  - デスクトップ
  - タブレット
  - モバイル

#### 5.1.3 パフォーマンステスト

- [ ] Lighthouse スコア計測
  ```bash
  pnpm build
  pnpm preview
  # Chrome DevTools > Lighthouse 実行
  ```
- [ ] バンドルサイズ確認
  ```bash
  pnpm build
  # dist/ ディレクトリのサイズ確認
  ```
- [ ] ページロード時間計測

### 5.2 セキュリティ最終チェック（🔄 並列実行可）

- [ ] 依存関係の脆弱性チェック
  ```bash
  pnpm audit
  ```
- [ ] 高リスク脆弱性の解消
- [ ] 環境変数の漏洩チェック
- [ ] Sentry エラートラッキング動作確認

### 5.3 ドキュメント更新

#### 5.3.1 CLAUDE.md 更新

- [ ] パッケージバージョン情報の更新
- [ ] 新しい開発コマンドの追加（あれば）
- [ ] 破壊的変更に伴う注意事項の追加

#### 5.3.2 UPGRADE_SUMMARY.md 作成

- [ ] アップグレード概要
  - Before/After バージョン一覧
  - 総作業時間
  - 遭遇した問題と解決方法
- [ ] 破壊的変更のサマリー
- [ ] 今後のメンテナンス推奨事項
- [ ] 次回アップグレード時の注意事項

#### 5.3.3 package.json のメタ情報更新

- [ ] バージョン番号の更新（適切であれば）
- [ ] ライセンス情報の確認
- [ ] スクリプトの最適化

### 5.4 Git整理とマージ

- [ ] 不要なブランチの削除
- [ ] コミット履歴の確認
- [ ] 最終コミット
  ```bash
  git add -A
  git commit -m "chore: complete comprehensive package upgrade 2025"
  ```
- [ ] メインブランチへのマージ
  ```bash
  git checkout main
  git merge feature/comprehensive-upgrade-2025
  ```
- [ ] タグ作成
  ```bash
  git tag -a v1.0.0-upgraded -m "Post-upgrade baseline after 2-year hiatus"
  git push origin main --tags
  ```

**成果物**:

- ✅ 全テスト合格
- ✅ パフォーマンスベンチマーク
- ✅ `UPGRADE_SUMMARY.md`
- ✅ 更新された `CLAUDE.md`
- ✅ クリーンなGit履歴

---

## 📊 進捗トラッキング

### チェックリスト概要

- [ ] Phase 0: 事前準備（4タスク）
- [ ] Phase 1: 現状調査・監査（4タスク）
- [ ] Phase 2: E2Eテスト実装（25+タスク）
- [ ] Phase 3: アップグレード準備（3タスク）
- [ ] Phase 4: 段階的アップグレード実行（3層、20+タスク）
- [ ] Phase 5: 最終検証と文書化（4タスク）

### 推定スケジュール

| Phase   | 所要時間  | 累計     |
| ------- | --------- | -------- |
| Phase 0 | 0.5時間   | 0.5時間  |
| Phase 1 | 2-3時間   | 3.5時間  |
| Phase 2 | 15-20時間 | 23.5時間 |
| Phase 3 | 3-4時間   | 27.5時間 |
| Phase 4 | 12-15時間 | 42.5時間 |
| Phase 5 | 3-4時間   | 46.5時間 |

**合計推定時間**: 30-46時間（平均38時間）

---

## 🚨 トラブルシューティング

### 問題が発生した場合の対処法

1. **即座にロールバック**

   ```bash
   git reset --hard HEAD~1
   pnpm install
   ```

2. **問題の切り分け**
   - E2Eテストで具体的にどのテストが失敗しているか確認
   - エラーメッセージから問題のあるパッケージを特定
   - 公式マイグレーションガイドを再確認

3. **段階的なデバッグ**
   - 問題のあるパッケージのみロールバック
   - 他のパッケージは最新のまま維持
   - 問題を解決してから再度アップグレード

4. **コミュニティリソース**
   - GitHub Issues で同様の問題を検索
   - Stack Overflow で解決策を探す
   - 公式ドキュメントのトラブルシューティングセクション確認

---

## ✅ 完了条件

以下の全てが満たされた時、パッケージアップグレードが完了とみなす：

1. ✅ 全E2Eテストが安定して成功（3回連続）
2. ✅ `pnpm validate` が全て成功（lint + typecheck + build）
3. ✅ 全主要機能が手動テストで動作確認済み
4. ✅ パフォーマンス劣化なし（Lighthouse スコア維持）
5. ✅ セキュリティ脆弱性なし（pnpm audit クリーン）
6. ✅ 全ドキュメント更新済み
7. ✅ メインブランチへのマージ完了
8. ✅ タグ作成とプッシュ完了

---

## 📚 参考リソース

### 公式ドキュメント

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [MUI v6 Migration](https://mui.com/material-ui/migration/migration-v5/)
- [Vite Migration Guide](https://vitejs.dev/guide/migration.html)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/migration-guide)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### 作成されるドキュメント

- `UPGRADE_NOTES.md` - 破壊的変更調査ノート
- `UPGRADE_PLAN.md` - 詳細アップグレード計画
- `E2E_TEST_GUIDE.md` - E2Eテスト実行ガイド
- `UPGRADE_SUMMARY.md` - アップグレード完了サマリー

---

## 🎯 次のステップ（アップグレード完了後）

1. 新規機能開発の準備
   - 機能要件の明確化
   - 設計とアーキテクチャレビュー
   - 実装計画の策定

2. 継続的なメンテナンス体制の確立
   - 定期的な依存関係更新（月次/四半期）
   - 自動化されたセキュリティスキャン
   - E2Eテストの継続的な拡充

3. モニタリングとパフォーマンス最適化
   - Sentry エラートラッキングの活用
   - パフォーマンスメトリクスの定期計測
   - ユーザーフィードバックの収集

---

**作成者**: Claude Code
**最終更新**: 2025-10-29
**バージョン**: 1.0.0
