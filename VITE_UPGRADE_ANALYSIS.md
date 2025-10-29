# Vite Upgrade Analysis: v5.4.21 → v7.1.12

## Executive Summary

This document analyzes the two-stage major version upgrade of Vite (v5→v6→v7) for the geek-infiltration project, including breaking changes, plugin compatibility, and migration strategy recommendations.

**Current State:**

- Vite: 5.4.21 → 7.1.12
- @vitejs/plugin-react-swc: 3.11.0 → 4.2.0
- vite-tsconfig-paths: Used in project

**Recommendation:** **Direct upgrade to v7** is feasible with minimal changes due to strong backward compatibility.

---

## Part 1: Vite v5 → v6 Breaking Changes

### 1.1 Node.js Support

**Impact: 🟡 MEDIUM**

| Version   | v5              | v6          |
| --------- | --------------- | ----------- |
| Supported | 18, 20, 21, 22+ | 18, 20, 22+ |
| Dropped   | -               | Node.js 21  |

**Action Required:**

- ✅ Project uses Node.js 22.21.1 (via Volta) - **Compatible**
- No changes needed

### 1.2 Default `resolve.conditions` Change

**Impact: 🟢 LOW (affects library authors primarily)**

**Change:**

```typescript
// Vite 5 (implicit defaults)
resolve.conditions: []

// Vite 6 (new defaults)
// Client environment:
resolve.conditions: ['module', 'browser', 'development|production']

// SSR environment:
ssr.resolve.conditions: ['module', 'node', 'development|production']
```

**Action Required:**

- ✅ Project doesn't customize `resolve.conditions` - **No changes needed**
- Default behavior improves module resolution for most use cases

### 1.3 JSON Import Changes

**Impact: 🟢 LOW**

**Change:**

```typescript
// Vite 5
json.stringify: true  // automatically disables json.namedExports

// Vite 6
json.stringify: true  // json.namedExports remains enabled
json.stringify: 'auto' // NEW: only serializes large JSON files (default)
```

**Action Required:**

- ✅ Project doesn't customize JSON import behavior - **No changes needed**

### 1.4 PostCSS Configuration

**Impact: 🟢 LOW**

**Change:**

- `postcss-load-config` updated from v4 → v6
- TypeScript postcss config files now require `tsx` or `jiti` (instead of `ts-node`)
- YAML postcss config files now require `yaml` package

**Action Required:**

- ✅ Project doesn't use PostCSS TypeScript/YAML configs - **No changes needed**

### 1.5 Sass Modern API (Default Change)

**Impact: 🟢 LOW**

**Change:**

```typescript
// Vite 5: Legacy API by default
// Vite 6: Modern API by default (introduced in v5.4)
```

**Action Required:**

- ✅ Project doesn't use Sass - **No changes needed**

### 1.6 Experimental Runtime API → Module Runner API

**Impact: 🟢 LOW (experimental feature)**

**Change:**

- Experimental Vite Runtime API evolved into Module Runner API
- Released as part of new experimental Environment API

**Action Required:**

- ✅ Project doesn't use experimental Runtime API - **No changes needed**

---

## Part 2: Vite v6 → v7 Breaking Changes

### 2.1 Node.js Support (CRITICAL)

**Impact: 🔴 HIGH**

| Version   | v6          | v7                           |
| --------- | ----------- | ---------------------------- |
| Supported | 18, 20, 22+ | 20.19+, 22.12+               |
| Dropped   | -           | Node.js 18 (EOL: April 2025) |

**Action Required:**

- ✅ Project uses Node.js 22.21.1 - **Compatible**
- Update Volta config if minimum requirement changes

### 2.2 Default Browser Target Change

**Impact: 🟡 MEDIUM**

**Change:**

```typescript
// Vite 6
build.target: 'modules'

// Vite 7
build.target: 'baseline-widely-available'
```

**New Browser Targets (Baseline Widely Available as of 2025-05-01):**

- Chrome/Edge: Released before 2022-11-01
- Firefox: Released before 2022-11-01
- Safari: Released before 2022-11-01

**Reasoning:**

- Aligns with **Baseline Widely Available** initiative
- Features supported across core browsers for 30+ months
- More predictable future updates

**Action Required:**

```typescript
// vite.config.ts - If modern browser support is sufficient
export default defineConfig({
  build: {
    target: 'baseline-widely-available', // Explicit (recommended)
    // or override if legacy support needed:
    // target: 'es2015'
  },
})
```

- ✅ Project doesn't customize `build.target` - **Accepts new default**
- Review if legacy browser support required

### 2.3 Sass Legacy API Removal

**Impact: 🟢 LOW**

**Change:**

- Sass legacy API support completely removed
- Must use modern API (default since v6)

**Action Required:**

- ✅ Project doesn't use Sass - **No changes needed**

### 2.4 Deprecated Features Removed

**Impact: 🟢 LOW**

**Removed APIs:**

- `splitVendorChunkPlugin` (use manual chunking strategies)
- Experimental `skipSsrTransform` flag

**Action Required:**

- ✅ Project doesn't use these features - **No changes needed**

### 2.5 ESM-Only Distribution

**Impact: 🟢 LOW**

**Change:**

- Vite 7 ships as ESM-only package
- Leverages Node.js native `require(esm)` support (Node 20.19+)

**Action Required:**

- ✅ Project uses ESM (`type: "module"` in package.json expected)
- No changes needed

### 2.6 Environment API Evolution

**Impact: 🟢 LOW (framework authors primarily)**

**New Feature:**

- `buildApp` hook for multi-environment build coordination
- Enhanced Environment API capabilities

**Action Required:**

- ✅ Project doesn't use Environment API - **No changes needed**
- Framework-level feature

---

## Part 3: Plugin Compatibility Analysis

### 3.1 @vitejs/plugin-react-swc (v3.11.0 → v4.2.0)

**Research Findings:**

- Repository archived and moved to vitejs/vite-plugin-react monorepo
- v4.x targets Vite 6+ (peer dependency updated)
- **No breaking API changes** - seamless upgrade

**Breaking Changes:**

```json
// package.json peer dependencies
{
  // v3.x
  "peerDependencies": {
    "vite": "^4 || ^5"
  },

  // v4.x
  "peerDependencies": {
    "vite": "^5 || ^6 || ^7"
  }
}
```

**Action Required:**

- ✅ **Direct upgrade compatible**
- No code changes needed
- Update peer dependency range

### 3.2 vite-tsconfig-paths

**Compatibility:**

- ✅ Compatible with Vite 6 and 7
- No breaking changes reported
- Path alias resolution mechanism unchanged

**Action Required:**

- ✅ **No changes needed**
- Verify latest version for best compatibility

---

## Part 4: vite.config.ts Analysis

### Current Configuration Review

```typescript
// vite.config.ts (current)
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      '/login/oauth/access_token': {
        target: 'https://github.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
  },
})
```

### Required Changes for v7

**Minimal Configuration Updates:**

```typescript
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    port: 3000,
    proxy: {
      '/login/oauth/access_token': {
        target: 'https://github.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    target: 'baseline-widely-available', // NEW: Explicit (optional)
  },
})
```

**Changes Summary:**

- ✅ **No mandatory changes required**
- 🟡 Optional: Explicitly set `build.target` for clarity
- Configuration fully compatible with Vite 7

---

## Part 5: Migration Strategy Comparison

### Option A: Two-Stage Migration (v5 → v6 → v7)

**Timeline:** 2-3 days

**Advantages:**

- ✅ Validates compatibility at each step
- ✅ Easier rollback if issues arise
- ✅ Incremental risk reduction

**Disadvantages:**

- ❌ More time-consuming
- ❌ Multiple test cycles required
- ❌ Double deployment/validation effort

**Steps:**

1. Upgrade to Vite 6.x + plugin-react-swc 4.x
2. Run full test suite (unit + E2E)
3. Validate production build
4. Upgrade to Vite 7.x
5. Re-run test suite
6. Final production validation

### Option B: Direct Migration (v5 → v7) ⭐ **RECOMMENDED**

**Timeline:** 1 day

**Advantages:**

- ✅ Faster implementation
- ✅ Single test cycle
- ✅ Minimal configuration changes
- ✅ Strong backward compatibility guarantees

**Disadvantages:**

- ❌ Slightly higher initial risk (mitigated by compatibility)

**Steps:**

1. Upgrade Vite to 7.1.12
2. Upgrade @vitejs/plugin-react-swc to 4.2.0
3. Update vite-tsconfig-paths to latest
4. Run full test suite (unit + E2E)
5. Validate production build
6. Deploy

**Rationale:**

- No breaking changes affecting project's usage patterns
- Plugin ecosystem has strong v7 compatibility
- Vite team prioritizes backward compatibility
- Current config requires zero changes

---

## Part 6: Risk Assessment

### Risk Matrix

| Risk Category          | Severity  | Likelihood | Mitigation                       |
| ---------------------- | --------- | ---------- | -------------------------------- |
| Node.js compatibility  | 🟢 LOW    | 0%         | Already on Node 22.21.1          |
| Plugin incompatibility | 🟢 LOW    | 5%         | Official plugins with v7 support |
| Build target issues    | 🟡 MEDIUM | 10%        | Test on target browsers          |
| Runtime errors         | 🟢 LOW    | 5%         | Comprehensive E2E tests          |
| Development workflow   | 🟢 LOW    | 2%         | HMR/dev server unchanged         |

### Critical Success Factors

1. **Testing Coverage:**
   - ✅ Unit tests (Vitest): Validate React components
   - ✅ E2E tests (Playwright): Critical user flows
   - ⚠️ Browser compatibility: Test OAuth flow on baseline browsers

2. **Rollback Plan:**
   - Git branch for upgrade
   - Production deployment with staged rollout
   - Quick revert capability via git tags

3. **Monitoring:**
   - Sentry error tracking (already configured)
   - Performance metrics comparison
   - Build size comparison

---

## Part 7: Implementation Checklist

### Pre-Migration

- [ ] Review current Node.js version (Volta config)
- [ ] Backup current `package.json` and `pnpm-lock.yaml`
- [ ] Create feature branch: `chore/upgrade-vite-v7`
- [ ] Document current build performance baseline

### Migration Steps

```bash
# 1. Update dependencies
pnpm add -D vite@7.1.12 @vitejs/plugin-react-swc@4.2.0 vite-tsconfig-paths@latest

# 2. Validate installation
pnpm install

# 3. Run type checking
pnpm typecheck

# 4. Run linting
pnpm lint

# 5. Start dev server (validate HMR)
pnpm dev
# Test: Hot reload, OAuth flow, GraphQL queries

# 6. Run unit tests
vitest run

# 7. Build production
pnpm build
# Compare build output size and structure

# 8. Preview production build
pnpm preview
# Test: Full application functionality

# 9. Run E2E tests
pnpm playwright

# 10. Validate OAuth flow
# Manual test: GitHub authentication, GraphQL API calls

# 11. Compare bundle sizes
ls -lh dist/assets/*.js
```

### Post-Migration

- [ ] Update `UPGRADE_TASK_LIST.md` (if exists)
- [ ] Document any configuration changes
- [ ] Update CI/CD if Node.js version changed
- [ ] Create pull request with detailed testing notes
- [ ] Monitor Sentry for errors post-deployment

---

## Part 8: Expected Benefits

### Performance Improvements

**Vite 7 with Rolldown (experimental):**

- 🚀 4x-16x faster builds (when Rolldown enabled)
- 🚀 Massive memory savings
- 🚀 Rust-powered bundler performance

**Note:** Rolldown is experimental in v7, production use requires opt-in

### Developer Experience

- ✅ Faster HMR in large projects
- ✅ Better error messages
- ✅ Improved TypeScript performance
- ✅ Enhanced plugin ecosystem

### Ecosystem Alignment

- ✅ Latest framework integrations (React 19 ready)
- ✅ Modern browser baseline standards
- ✅ ESM-first architecture
- ✅ Future-proof Environment API

---

## Part 9: Compatibility Summary

### ✅ Fully Compatible

- Node.js version (22.21.1)
- Package manager (pnpm)
- React + TypeScript setup
- Redux Toolkit
- Material-UI v5
- GraphQL CodeGen
- Vitest + Playwright
- Sentry integration

### 🟡 Review Recommended

- Browser target defaults (now `baseline-widely-available`)
- Production bundle size (expect minor changes)

### ❌ Incompatible

- None identified for this project

---

## Part 10: Conclusion

**Migration Difficulty: 🟢 LOW**

The upgrade from Vite 5.4.21 to 7.1.12 is **straightforward and low-risk** for this project due to:

1. ✅ Modern Node.js version (22.21.1)
2. ✅ ESM-first architecture already in use
3. ✅ No deprecated API usage
4. ✅ Official plugins with v7 support
5. ✅ Strong backward compatibility in Vite ecosystem

**Recommended Approach:** **Direct upgrade to v7** in a single migration cycle.

**Estimated Effort:** 4-6 hours (including testing and validation)

**Rollback Risk:** Low (git-based, no schema changes)

---

## References

- [Vite 6.0 Release Announcement](https://vite.dev/blog/announcing-vite6)
- [Vite 7.0 Release Announcement](https://vite.dev/blog/announcing-vite7)
- [Vite 6 Migration Guide](https://v6.vite.dev/guide/migration)
- [Vite 7 Migration Guide](https://vite.dev/guide/migration)
- [Baseline Widely Available Initiative](https://web.dev/baseline)
- [@vitejs/plugin-react-swc Repository](https://github.com/vitejs/vite-plugin-react-swc)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-29
**Project:** geek-infiltration
**Author:** Claude Code Analysis
