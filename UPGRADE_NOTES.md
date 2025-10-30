# パッケージアップグレード調査ノート

**作成日**: 2025-10-29
**Phase**: Phase 1 (現状調査・監査)
**ステータス**: 完了

---

## 📊 概要

本ドキュメントは、2年間開発が停止していたプロジェクトの包括的なパッケージアップグレードに向けた詳細な調査結果をまとめたものです。

### 調査実施内容

1. 依存関係の最新バージョン調査（pnpm outdated）
2. セキュリティ脆弱性監査（pnpm audit）
3. 未使用依存関係の特定（depcheck）
4. 主要パッケージの破壊的変更調査
   - React 18 → 19
   - MUI v5 → v7
   - Vite 5 → v7
   - ESLint 8 → 9

---

## 🔍 依存関係監査結果

### 更新が必要なパッケージ（33件）

#### 🔴 メジャーバージョンアップグレード（High Impact）

| パッケージ                  | Current | Latest   | メジャー差 | 優先度      |
| --------------------------- | ------- | -------- | ---------- | ----------- |
| react                       | 18.3.1  | 19.2.0   | +1         | 🔴 Critical |
| react-dom                   | 18.3.1  | 19.2.0   | +1         | 🔴 Critical |
| @types/react                | 18.3.26 | 19.2.2   | +1         | 🔴 Critical |
| @types/react-dom            | 18.3.7  | 19.2.2   | +1         | 🔴 Critical |
| @mui/material               | 5.18.0  | 7.3.4    | +2         | 🔴 Critical |
| @mui/icons-material         | 5.18.0  | 7.3.4    | +2         | 🔴 Critical |
| @mui/system                 | 6.5.0   | 7.3.3    | +1         | 🟡 High     |
| vite                        | 5.4.21  | 7.1.12   | +2         | 🔴 Critical |
| eslint                      | 8.57.1  | 9.38.0   | +1         | 🔴 Critical |
| @graphql-codegen/cli        | 5.0.2   | 6.0.1    | +1         | 🟡 High     |
| @sentry/react               | 8.55.0  | 10.22.0  | +2         | 🟡 High     |
| framer-motion               | 11.18.2 | 12.23.24 | +1         | 🟡 High     |
| date-fns                    | 3.6.0   | 4.1.0    | +1         | 🟢 Medium   |
| graphql-request             | 6.1.0   | 7.3.1    | +1         | 🟡 High     |
| @iconify/react              | 5.2.1   | 6.0.2    | +1         | 🟢 Medium   |
| vitest                      | 2.1.9   | 4.0.4    | +2         | 🟡 High     |
| react-intersection-observer | 9.16.0  | 10.0.0   | +1         | 🟢 Medium   |

#### 🟡 マイナー/パッチアップグレード

| パッケージ                       | Current | Latest  |
| -------------------------------- | ------- | ------- |
| @typescript-eslint/eslint-plugin | 7.18.0  | 8.46.2  |
| @typescript-eslint/parser        | 7.18.0  | 8.46.2  |
| @vitejs/plugin-react-swc         | 3.11.0  | 4.2.0   |
| eslint-config-ts-prefixer        | 1.14.2  | 4.0.0   |
| eslint-plugin-react-hooks        | 4.6.2   | 7.0.1   |
| jsdom                            | 25.0.1  | 27.0.1  |
| graphql                          | 16.9.0  | 16.11.0 |
| その他...                        | -       | -       |

---

## 🚨 セキュリティ脆弱性

### Moderate（1件）

**esbuild** (Viteの依存関係)

- **脆弱性**: 開発サーバーへの不正リクエスト送信が可能
- **影響範囲**: <=0.24.2
- **修正バージョン**: >=0.25.0
- **パス**: `vite > esbuild`
- **対応**: Vite 7へのアップグレードで自動解決

### Low（1件）

**tmp** (all-contributors-cliの依存関係)

- **脆弱性**: シンボリックリンク経由の任意ファイル書き込み
- **影響範囲**: <=0.2.3
- **修正バージョン**: >=0.2.4
- **パス**: `all-contributors-cli > inquirer > external-editor > tmp`
- **対応**: 低優先度（開発時のみ使用）

---

## 🧹 未使用依存関係

### 削除検討対象（Unused Dependencies）

```
@emotion/cache
@emotion/serialize
@emotion/utils
@mui/system (※要確認: 一部で使用されている可能性)
graphql-request (※要確認: RTK Queryで使用)
simplebar-react
```

### 削除検討対象（Unused Dev Dependencies）

```
@graphql-codegen/cli
@graphql-codegen/typescript
@graphql-codegen/typescript-document-nodes
@graphql-codegen/typescript-graphql-files-modules
@graphql-codegen/typescript-operations
@graphql-codegen/typescript-rtk-query
all-contributors-cli
autoprefixer
change-case
eslint-plugin-sort-keys-custom-order
postcss
rimraf
```

### 不足している依存関係

```
@types/non-empty-object (app.d.tsで参照)
```

**注意**: GraphQL Codegen関連パッケージは `pnpm codegen` コマンドで使用されるため、実際には必要。depcheckの誤検出の可能性。

---

## 🔴 React 19 破壊的変更

### ✅ すでに対応済み

1. **ReactDOM.render → createRoot**
   - 本プロジェクトは既に `createRoot` を使用
   - `src/main.tsx:14-15` で確認済み

2. **新しいJSX Transform**
   - Vite + SWCで自動有効化済み

### ⚠️ 確認・対応が必要

#### 1. TypeScript型定義の変更

**useRefが必須引数化**

```typescript
// ❌ React 19ではエラー
useRef()

// ✅ 正しい書き方
useRef(null)
useRef(undefined)
```

**ReactElement["props"]がunknownに変更**

```typescript
// Before: 'any' (型安全でない)
type Example = ReactElement['props'] // any

// After: 'unknown' (型安全)
type Example = ReactElement['props'] // unknown
```

**ref callbackの暗黙的returnが拒否**

```typescript
// ❌ エラー
<div ref={current => (instance = current)} />

// ✅ 正しい
<div ref={current => {instance = current}} />
```

#### 2. 依存ライブラリの互換性確認

以下のライブラリがReact 19に対応しているか確認が必要:

- `@reduxjs/toolkit`: Redux公式、対応済みの可能性が高い
- `@mui/material v7`: React 19対応確認済み
- `framer-motion v12`: 対応状況要確認
- `react-redux`: 対応確認必要

#### 3. Sentryエラーハンドリング

React 19では `createRoot` に新しいエラーハンドリングオプションが追加:

```typescript
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // Error Boundaryでキャッチされなかったエラー
    Sentry.captureException(error, {
      contexts: { react: errorInfo },
    })
  },
  onCaughtError: (error, errorInfo) => {
    // Error Boundaryでキャッチされたエラー
    console.error('Caught error:', error, errorInfo)
  },
})
```

### 🛠️ 推奨移行手順

#### Phase 1: 準備（リスク最小化）

```bash
# React 18.3にアップグレード（警告確認用）
pnpm install react@18.3.1 react-dom@18.3.1

# 警告を確認してビルド
pnpm validate

# E2Eテスト実行
pnpm playwright
```

#### Phase 2: TypeScript Codemod実行

```bash
# React 19型定義の自動移行
npx types-react-codemod@latest preset-19 ./src

# 個別問題の修正
npx types-react-codemod@latest no-implicit-ref-callback-return ./src
```

#### Phase 3: React 19へアップグレード

```bash
pnpm install --save-exact react@^19.0.0 react-dom@^19.0.0 \
  @types/react@^19.0.0 @types/react-dom@^19.0.0

pnpm typecheck
pnpm build
pnpm playwright
```

### 📋 確認が必要なコード箇所

```bash
# useRef()の引数なし呼び出しを検索
grep -r "useRef()" src/

# ref callbackの暗黙的return検索
grep -r "ref={.*=>.*}" src/

# PropTypesの使用確認（削除対象）
grep -r "propTypes\|PropTypes" src/
```

### リスク評価

- **リスクレベル**: 🟡 Medium
- **推定作業時間**: 2-4時間
- **主なリスク**: 型定義の変更による型エラー
- **対策**: TypeScript Codemodによる自動移行

---

## 🎨 MUI v5 → v7 破壊的変更

### 移行戦略

**推奨**: 2段階移行（v5 → v6 → v7）

**理由**:

1. リスク分散（各段階での問題切り分けが容易）
2. v7はリリース直後（2025年3月）で成熟度が低い
3. 本プロジェクトのコードベースがクリーン（カスタムテーマ variants/styleOverrides なし）

### v5 → v6 破壊的変更

#### 1. Grid2の正式化

**影響箇所**:

- `src/app/TimelineContainer/index.tsx`
- `src/app/TimelineContainer/Timeline/index.tsx`

```typescript
// Before (v5)
import Grid from '@mui/material/Unstable_Grid2'

// After (v6)
import Grid2 from '@mui/material/Grid2'
```

#### 2. その他の変更

- React 18+ が必須（本プロジェクトは18.3.1で問題なし）
- TypeScript 4.7+ が必須
- デフォルトprops削除（関数コンポーネントの `defaultProps` サポート終了）
- Material Icons の名前変更（一部）
- テーマタイポグラフィのデフォルト変更

#### 3. 自動化コマンド

```bash
# v6への自動移行
npx @mui/codemod@latest v6.0.0/preset-safe ./src

# 手動でGrid2を修正
# src/app/TimelineContainer/** のimportを更新
```

### v6 → v7 破壊的変更

#### 1. Node.js要件

- **必須**: Node.js 14+ → **18+**
- **本プロジェクトの状況**: Node 22.21.1 使用で問題なし

#### 2. デフォルトpropsの完全削除

クラスコンポーネントでも `defaultProps` が非推奨に。

#### 3. Deep importsの禁止

```typescript
// ❌ エラー（v7で完全禁止）
import Button from '@mui/material/Button/Button'

// ✅ 正しい
import { Button } from '@mui/material'
```

**本プロジェクトの状況**: Deep importsは使用されていない（✅ 問題なし）

#### 4. 自動化コマンド

```bash
# v7への自動移行
npx @mui/codemod@latest v7.0.0/preset-safe ./src
```

### 移行タイムライン

| フェーズ           | 期間          | 対応内容                    |
| ------------------ | ------------- | --------------------------- |
| **Phase 1: v5→v6** | 今すぐ        | Grid2移行、安定版で実施     |
| **Phase 2: v6→v7** | 2025年4月以降 | v7安定後に実施（2ヶ月待機） |

### リスク評価

- **v5→v6リスク**: 🟢 Low（Grid2のみ手動修正が必要）
- **v6→v7リスク**: 🟢 Low（Deep imports未使用、クリーンなコードベース）
- **推定作業時間**: 各2-3日（テスト含む）
- **信頼度**: High（本プロジェクトのコードベースは移行に適している）

---

## ⚡ Vite 5 → v7 破壊的変更

### 移行戦略

**推奨**: 直接v7へのアップグレード ⭐

**理由**:

1. v5→v6の破壊的変更がほぼ無い
2. v6→v7の変更も本プロジェクトに影響しない
3. 公式プラグインが完全対応済み
4. テストサイクルが1回で済む

### 主要な破壊的変更

#### 1. Node.js要件（v6→v7）

- **必須**: Node.js 18+ → **20.19+ / 22.12+**
- **本プロジェクトの状況**: Node 22.21.1（Node 24.9.0）で問題なし

#### 2. build.targetのデフォルト変更

```typescript
// Before (v5/v6)
build.target: 'modules'

// After (v7)
build.target: 'baseline-widely-available'
```

**影響**: より新しいブラウザをターゲット（2022年11月以前リリース）

**対応**: 必要に応じて `vite.config.ts` で明示的に指定

```typescript
export default defineConfig({
  build: {
    sourcemap: true,
    target: 'baseline-widely-available', // 明示的に指定（オプション）
  },
})
```

#### 3. プラグイン互換性

- ✅ `@vitejs/plugin-react-swc` v3→v4: 破壊的変更なし
- ✅ `vite-tsconfig-paths`: 完全互換

#### 4. 削除されたAPI

- `splitVendorChunkPlugin`: 削除（本プロジェクトで未使用）
- Sass legacy API: 完全削除（本プロジェクトで未使用）

### 移行手順

```bash
# 依存関係更新
pnpm add -D vite@7.1.12 @vitejs/plugin-react-swc@4.2.0 vite-tsconfig-paths@latest

# 検証ステップ
pnpm typecheck      # 型チェック
pnpm dev            # 開発サーバー（HMR確認）
pnpm build          # プロダクションビルド
pnpm preview        # ビルドプレビュー
pnpm playwright     # E2Eテスト
```

### 期待される恩恵

- 🚀 **パフォーマンス**: より高速なビルド
- 🧑‍💻 **DX向上**: 改善されたHMR、エラーメッセージ
- 🌐 **エコシステム**: React 19対応、modern baseline
- 🔮 **将来性**: Environment API、ESM-first設計

### リスク評価

- **Node.js互換性**: 🟢 Low（すでにNode 22使用）
- **プラグイン非互換**: 🟢 Low（公式プラグインがv7対応）
- **ビルドターゲット**: 🟡 Medium（ターゲットブラウザで検証必要）
- **推定作業時間**: 4-6時間（検証含む）

---

## 🔧 ESLint 8 → 9 破壊的変更

### 移行戦略

**推奨**: **Phase 4での対応を推奨（現時点では延期）** ⏸️

**理由**:

1. `eslint-config-ts-prefixer` v4.0.0の文書化が不十分
2. `eslint-plugin-react-hooks` にFlat Config関連の既知の問題あり
3. 現在のESLint 8設定でprettier/prettierエラーは修正可能
4. リスクが即座の恩恵を上回る

### 最大の破壊的変更: Flat Config必須化

#### Before (eslintrc形式)

```javascript
// .eslintrc.cjs
module.exports = {
  extends: ['ts-prefixer'],
  plugins: ['react-hooks', 'react'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'warn',
  },
}
```

#### After (Flat Config形式)

```javascript
// eslint.config.js
import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        /* browser globals */
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react/display-name': 'warn',
    },
  },
]
```

### プラグイン互換性

| プラグイン                | 状況        | 対応                                   |
| ------------------------- | ----------- | -------------------------------------- |
| eslint-plugin-react       | ✅ 完全対応 | `reactPlugin.configs.flat.recommended` |
| eslint-plugin-prettier    | ✅ 完全対応 | `eslint-plugin-prettier/recommended`   |
| @typescript-eslint        | ✅ 完全対応 | `typescript-eslint` パッケージ         |
| eslint-plugin-react-hooks | ⚠️ 問題あり | v5.0.0待ち（published config missing） |
| eslint-config-ts-prefixer | ❌ 不明     | v4.0.0の文書化待ち                     |

### 現在のprettier/prettierエラーの解決

#### Phase 0で発見されたエラー

```
Error: prettier/prettier rule not found
```

#### Phase 4での対応方法（ESLint 8のまま）

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    'ts-prefixer',
    'plugin:prettier/recommended', // 追加（LAST in extends）
  ],
  plugins: ['react-hooks', 'react'], // prettierは自動追加されるため不要
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'warn',
  },
  settings: {
    react: { version: 'detect' },
  },
}
```

**必要なパッケージ**:

```bash
pnpm add -D eslint-plugin-prettier@^5.2.1 eslint-config-prettier@^9.1.0
```

### ESLint 9移行の推奨タイムライン

- **即時**: prettier/prettierエラーをESLint 8で修正
- **2025年Q1**: エコシステムの成熟度を監視
- **2025年Q2**: `eslint-config-ts-prefixer` v4.0.0の文書化確認
- **実施タイミング**: 上記2つが解決後、Phase 4 Layer 1で実施

### リスク評価

- **移行複雑度**: 🔴 High（設定ファイル完全書き換え）
- **エコシステム成熟度**: 🟡 Medium（一部プラグインに問題あり）
- **推定作業時間**: 4-8時間（デバッグ含む）
- **現時点での推奨**: ⏸️ **延期**

---

## 📊 リスク評価マトリックス

### 全体リスクスコア

| パッケージ         | 影響範囲    | 破壊的変更 | エコシステム成熟度 | 総合リスク    | 推奨対応 |
| ------------------ | ----------- | ---------- | ------------------ | ------------- | -------- |
| React 19           | 🔴 Critical | 🟡 Medium  | 🟢 High            | 🟡 **Medium** | 即実施   |
| MUI v6             | 🔴 Critical | 🟢 Low     | 🟢 High            | 🟢 **Low**    | 即実施   |
| MUI v7             | 🔴 Critical | 🟢 Low     | 🟡 Medium          | 🟡 **Medium** | 2025年Q2 |
| Vite v7            | 🟡 High     | 🟢 Low     | 🟢 High            | 🟢 **Low**    | 即実施   |
| ESLint 9           | 🟡 High     | 🔴 High    | 🟡 Medium          | 🔴 **High**   | 延期     |
| GraphQL Codegen v6 | 🟡 High     | 🟢 Low     | 🟢 High            | 🟢 **Low**    | 即実施   |
| Sentry v10         | 🟢 Medium   | 🟢 Low     | 🟢 High            | 🟢 **Low**    | 即実施   |

### リスク計算ロジック

- **影響範囲**: プロジェクト全体への影響度
- **破壊的変更**: 移行の複雑さ
- **エコシステム成熟度**: ライブラリの安定性
- **総合リスク**: 上記3つの総合評価

---

## 🎯 推奨アップグレード順序（Phase 4用）

### Layer 1: 開発ツール（リスク: 🟢 Low）

1. **TypeScript** → 最新版
2. ~~ESLint 9~~ → **延期**（prettier/prettierエラーのみ修正）
3. **Vite 7** → 直接アップグレード
4. **Prettier, PostCSS** → マイナーアップデート

**所要時間**: 2-3時間（ESLint 9を延期することで短縮）

### Layer 2: テストフレームワーク（リスク: 🟢 Low）

1. **Vitest 4** → 2メジャーバージョンアップ
2. **Playwright** → 最新版
3. **jsdom** → 最新版

**所要時間**: 1-2時間

### Layer 3: ランタイム依存（リスク: 🟡 Medium）

#### ステップ1: GraphQL周り

1. **GraphQL Codegen v6**
2. **graphql-request v7**
3. **graphql** → マイナーアップデート

#### ステップ2: React 19

1. **React 19** + **@types/react 19**
2. TypeScript Codemod実行
3. 型エラー修正

#### ステップ3: MUI v6（v7は延期）

1. **MUI v6** （v5→v6のみ）
2. Grid2移行
3. MUI Codemod実行

#### ステップ4: その他ランタイム

1. **Redux関連** → 最新版
2. **Framer Motion v12**
3. **Sentry v10**
4. **date-fns v4**
5. **その他UI/UXライブラリ**

**所要時間**: 12-15時間

---

## ✅ Phase 1 完了チェックリスト

- [x] pnpm outdated 実行（33パッケージ更新対象）
- [x] pnpm audit 実行（2件の脆弱性）
- [x] npx depcheck 実行（未使用依存関係リスト作成）
- [x] React 19 破壊的変更調査
- [x] MUI v6/v7 破壊的変更調査
- [x] Vite 6/v7 破壊的変更調査
- [x] ESLint 9 Flat Config 調査
- [x] ESLintエラーの詳細分析
- [x] UPGRADE_NOTES.md 作成

---

## 📚 参考リソース

### 公式ドキュメント

- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [MUI v6 Migration](https://mui.com/material-ui/migration/upgrade-to-v6/)
- [MUI v7 Migration](https://mui.com/material-ui/migration/upgrade-to-v7/)
- [Vite Migration Guide](https://vitejs.dev/guide/migration.html)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/migration-guide)

### TypeScript Codemods

- [types-react-codemod](https://github.com/eps1lon/types-react-codemod)
- [@mui/codemod](https://mui.com/material-ui/migration/migration-v5/#preset-safe)

### コミュニティリソース

- [React 19 新機能](https://react.dev/blog/2024/12/05/react-19)
- [MUI v6 Release Blog](https://mui.com/blog/material-ui-v6-is-out/)
- [MUI v7 Release Blog](https://mui.com/blog/material-ui-v7-is-here/)

---

## 🚀 次のステップ（Phase 2）

Phase 1の調査結果を踏まえ、Phase 2では**E2Eテスト実装**に進みます。

### Phase 2の目標

1. アップグレード前の動作を保証するE2Eテストスイート作成
2. 主要機能を網羅する10個のテストケース実装
3. Playwright環境の最適化
4. テストヘルパー関数の整備

**推定所要時間**: 15-20時間

---

**作成者**: Claude Code with Serena MCP
**最終更新**: 2025-10-29
