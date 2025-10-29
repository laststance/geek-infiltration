# Material-UI v5.18.0 → v7.3.4 Migration Research Report

**Generated**: 2025-10-29
**Target Application**: React 19.0.0 + TypeScript 5.9.3 + Vite 7.1.12
**Current Versions**: @mui/material@5.18.0, @mui/icons-material@5.18.0, @mui/system@6.5.0
**Target Version**: v7.3.4
**Migration Strategy**: Two-stage (v5→v6→v7)

---

## Executive Summary

**Migration Complexity**: 🟡 MEDIUM
**Estimated Effort**: 4-8 hours (with codemods)
**Test Impact**: HIGH (345 Playwright tests require validation)
**Risk Level**: MEDIUM (managed with codemods + staged approach)

### Key Findings

✅ **Good News**:

- Both v6 and v7 support React 19 officially
- Comprehensive codemods available for automated migration
- Emotion@11.13.3 fully compatible (no styling engine changes needed)
- Most breaking changes are handled automatically
- v6 and v7 designed for minimal breaking changes

⚠️ **Challenges**:

- Grid → Grid2 migration required (breaking layout changes)
- Theme customization may need updates
- 345 E2E tests must be validated after migration
- Some manual fixes required after codemods

🎯 **Recommended Path**:

1. v5.18.0 → v6.5.0 (main changes)
2. v6.5.0 → v7.3.4 (minor updates)
3. Validate all 345 Playwright tests
4. Update any custom theme overrides

---

## Stage 1: v5.18.0 → v6.5.0 Migration

### Breaking Changes (High Impact)

#### 1. Grid → Grid2 Migration (HIGH RISK)

**Impact**: Layout behavior changes due to CSS Grid vs Flexbox + negative margins

**v5 Behavior**:

- Grid uses flexbox with negative margins
- Items overflow parent container
- Spacing added to item boxes

**v6 Behavior**:

- Grid2 uses CSS `gap` property
- Contained within parent padding
- No spacing in item boxes

**Changes Required**:

```diff
-import Grid from '@mui/material/Grid';
+import Grid2 from '@mui/material/Grid2';

-<Grid container spacing={2}>
-  <Grid item xs={12} sm={6}>
+<Grid2 container spacing={2}>
+  <Grid2 size={{ xs: 12, sm: 6 }}>
     Content
-  </Grid>
-</Grid>
+  </Grid2>
+</Grid2>
```

**Property Changes**:

- `xs`, `sm`, `md`, `lg`, `xl` → `size={{ xs: 12, sm: 6 }}`
- `xsOffset`, `smOffset`, etc. → `offset={{ xs: 1, sm: 2 }}`
- Removed: `item` prop (no longer needed)
- Removed: `zeroMinWidth` prop
- Removed: `disableEqualOverflow` prop (no longer needed)

**Codemod**:

```bash
npx @mui/codemod@latest v6.0.0/grid-v2 src/ --jscodeshift='--muiBreakpoints=xs,sm,md,lg,xl'
```

**Manual Testing Required**: All layouts using Grid must be visually validated

---

#### 2. Theme Palette Mode Rename

**Impact**: Medium - affects dark mode implementations

```diff
-theme.palette.type
+theme.palette.mode

-createTheme({ palette: { type: 'dark' } })
+createTheme({ palette: { mode: 'dark' } })
```

**Codemod**:

```bash
npx @mui/codemod@latest v5.0.0/theme-palette-mode src/
```

---

#### 3. Component Class Name Changes (Button, Chip)

**Impact**: High if using custom CSS targeting MUI classes

**Button Classes**:

```diff
-.MuiButton-textPrimary
+.MuiButton-text.MuiButton-colorPrimary

-.MuiButton-containedSecondary
+.MuiButton-contained.MuiButton-colorSecondary

-.MuiButton-outlinedSizeSmall
+.MuiButton-outlined.MuiButton-sizeSmall
```

**Chip Classes**:

```diff
-.MuiChip-clickableColorPrimary
+.MuiChip-clickable.MuiChip-colorPrimary

-.MuiChip-outlinedSecondary
+.MuiChip-outlined.MuiChip-colorSecondary
```

**Codemod**:

```bash
npx @mui/codemod@latest deprecations/button-classes src/
npx @mui/codemod@latest deprecations/chip-classes src/
```

**Risk**: If you have custom theme overrides using `styleOverrides`, these need manual updates

---

#### 4. Theme `variants` vs `styleOverrides` Precedence Change

**Impact**: High - affects component customization

**v5**: `variants` takes precedence over `styleOverrides.root`
**v6**: `styleOverrides.root` takes precedence over `variants`

**Action**: Review all theme customizations in `src/constants/theme` for unintended style changes

---

#### 5. Unstable_Grid2 → Grid2 Stabilization

**Impact**: Low - import path change only

```diff
-import { Unstable_Grid2 as Grid2 } from '@mui/material';
+import Grid2 from '@mui/material/Grid2';
```

**Codemod**: Handled by `v6.0.0/grid-v2` codemod

---

#### 6. UMD Bundle Removed

**Impact**: None (using Vite ESM build)

- 2.5MB package size reduction (25% smaller)
- No action required for your build setup

---

#### 7. React 18 Compatibility Shim Required

**Impact**: Medium - TypeScript types compatibility

Since you're on React 19 but MUI v6 uses `react-is@19`:

```json
// package.json - NOT NEEDED (you're on React 19)
{
  "overrides": {
    "react-is": "^19.0.0"
  }
}
```

✅ **No action required** - You're already on React 19

---

### Breaking Changes (Medium Impact)

#### 8. Accordion Changes

```diff
-<Accordion>
-  <AccordionSummary>Title</AccordionSummary>
+<Accordion>
+  <AccordionSummary heading="Title" />
```

**Impact**: If using Accordion component

---

#### 9. TextField/Select/FormControl Variant

**Impact**: Low - only if variant not specified

Codemod adds `variant="standard"` where missing:

```bash
npx @mui/codemod@latest v5.0.0/variant-prop src/
```

---

#### 10. Minimum TypeScript Version

**Requirement**: TypeScript 4.7+
**Your Version**: 5.9.3 ✅
**Action**: None required

---

### Emotion Compatibility

✅ **Fully Compatible**:

- @emotion/react@11.13.3 ✅
- @emotion/styled@11.13.0 ✅
- React 19 support confirmed

**No changes required** to your styling setup. Pigment CSS is optional in v6.

---

### v5→v6 Migration Checklist

```bash
# 1. Update package versions
pnpm add @mui/material@6.5.0 @mui/icons-material@6.5.0 @mui/system@6.5.0

# 2. Run codemods (in order)
npx @mui/codemod@latest v5.0.0/theme-palette-mode src/
npx @mui/codemod@latest v5.0.0/variant-prop src/
npx @mui/codemod@latest v6.0.0/grid-v2 src/ --jscodeshift='--muiBreakpoints=xs,sm,md,lg,xl'
npx @mui/codemod@latest deprecations/button-classes src/
npx @mui/codemod@latest deprecations/chip-classes src/

# 3. Type checking
pnpm typecheck

# 4. Build
pnpm build

# 5. Run tests
pnpm playwright

# 6. Manual review
# - Check theme customizations in src/constants/theme
# - Review Grid layouts visually
# - Test dark mode if implemented
```

---

## Stage 2: v6.5.0 → v7.3.4 Migration

### Breaking Changes

#### 1. Package Layout Updated (Node.js Exports)

**Impact**: Medium - deep imports no longer work

**Before**:

```typescript
import Button from '@mui/material/Button' // ✅ Still works
import { buttonClasses } from '@mui/material/Button' // ✅ Still works
```

**Now Blocked**:

```typescript
// ❌ Deep imports with 2+ levels no longer work
import something from '@mui/material/internal/something'
```

**Action**: Audit codebase for deep imports (unlikely in your setup)

---

#### 2. Lab Components Moved to Core

**Impact**: Medium if using Alert, Pagination, etc.

```diff
-import { Alert } from '@mui/lab';
+import { Alert } from '@mui/material';
```

**Components moved**:

- Alert
- AlertTitle
- Pagination
- PaginationItem
- Rating
- Skeleton
- SpeedDial
- SpeedDialAction
- SpeedDialIcon
- ToggleButton
- ToggleButtonGroup
- TreeView
- TreeItem

**Codemod**:

```bash
npx @mui/codemod@latest v7.0.0/lab-removed-components src/
```

⚠️ **Note**: Codemod doesn't handle TypeScript type imports - manual fix required

---

#### 3. Grid2 Further Refinements

**Impact**: Low - minor API improvements

- Continued alignment with CSS Grid best practices
- No major breaking changes from v6

---

#### 4. React 19 Full Support

**Impact**: None - you're already on React 19

✅ **Confirmed compatible**:

- React 19.0.0 ✅
- Emotion 11.13.3 ✅
- TypeScript 5.9.3 ✅

---

#### 5. Minimum Node.js Version

**Requirement**: Node.js 14+
**Your Setup**: Node 22.21.1 (via Volta) ✅
**Action**: None required

---

### v6→v7 Migration Checklist

```bash
# 1. Update package versions
pnpm add @mui/material@7.3.4 @mui/icons-material@7.3.4 @mui/system@7.3.4

# 2. Run codemods
npx @mui/codemod@latest v7.0.0/lab-removed-components src/

# 3. Manual TypeScript type import updates (if using Lab components)
# Search: import.*from '@mui/lab'
# Update type imports manually

# 4. Type checking
pnpm typecheck

# 5. Build
pnpm build

# 6. Run full test suite
pnpm playwright
```

---

## Risk Assessment Matrix

| Change                    | Risk Level | Impact                        | Mitigation           | Manual Work                |
| ------------------------- | ---------- | ----------------------------- | -------------------- | -------------------------- |
| Grid → Grid2              | 🔴 HIGH    | Layout shifts, visual changes | Codemod + visual QA  | High - test all layouts    |
| Theme variants precedence | 🟡 MEDIUM  | Style override conflicts      | Manual theme review  | Medium - check theme files |
| Button/Chip classes       | 🟡 MEDIUM  | Custom CSS breaks             | Codemod + CSS audit  | Low-Medium                 |
| Lab components moved      | 🟡 MEDIUM  | Import errors                 | Codemod + type fixes | Low                        |
| Palette mode rename       | 🟢 LOW     | Dark mode breaks              | Codemod              | None                       |
| Package layout            | 🟢 LOW     | Deep import errors            | Avoid deep imports   | None                       |
| Emotion compatibility     | 🟢 NONE    | N/A                           | Already compatible   | None                       |

---

## Testing Strategy

### 1. Visual Regression Testing (Critical)

**Priority**: 🔴 CRITICAL

**Grid/Layout Components**:

```bash
# Search for Grid usage in codebase
find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "Grid"
```

**Components to test**:

- All page layouts using Grid
- Sidebar layout (src/app/index.tsx)
- Card layouts
- Responsive breakpoints (xs, sm, md, lg, xl)

**Method**: Manual visual comparison before/after migration

---

### 2. E2E Test Validation (Critical)

**Priority**: 🔴 CRITICAL

```bash
# Run full Playwright suite
pnpm playwright

# Expected: All 345 tests pass
# If failures: Investigate layout/styling changes
```

**Failure Analysis**:

- Screenshot diffs for layout failures
- Console errors for import/type failures
- Interaction failures for class name changes

---

### 3. Theme Customization Testing

**Priority**: 🟡 HIGH

**Files to review**:

- `src/constants/theme` (custom theme definitions)
- Any `styleOverrides` in theme
- Any `variants` in theme

**Test scenarios**:

- Light mode rendering
- Dark mode rendering (if implemented)
- Custom color palettes
- Typography overrides

---

### 4. TypeScript Type Checking

**Priority**: 🟡 HIGH

```bash
pnpm typecheck
```

**Expected errors**:

- Lab component type imports (manual fix)
- Deep import errors (refactor to shallow imports)

---

### 5. Build Validation

**Priority**: 🟡 HIGH

```bash
pnpm validate  # lint:fix + typecheck + build
```

**Success criteria**:

- No TypeScript errors
- No ESLint errors
- Clean production build
- No bundle size increases (should decrease ~2.5MB in v6)

---

## Codebase Analysis Queries (Use with Serena)

### 1. Find Grid Component Usage

```typescript
// Search pattern for Grid imports and usage
find_symbol(
  '/Grid',
  '.',
  (substring_matching = true),
  (include_kinds = [5, 12]),
)
search_for_pattern("import.*Grid.*from '@mui/material'", '.')
search_for_pattern(
  '<Grid\\s',
  '.',
  (context_lines_before = 2),
  (context_lines_after = 5),
)
```

### 2. Find Theme Customizations

```typescript
// Search for theme definitions and customizations
find_symbol('/theme', 'src/constants', (substring_matching = true))
search_for_pattern('createTheme\\s*\\(', 'src/constants')
search_for_pattern(
  'styleOverrides',
  'src/constants',
  (context_lines_before = 3),
  (context_lines_after = 10),
)
search_for_pattern(
  'variants\\s*:',
  'src/constants',
  (context_lines_before = 3),
  (context_lines_after = 10),
)
```

### 3. Find Lab Component Imports

```typescript
// Search for @mui/lab imports (for v7 migration)
search_for_pattern("from '@mui/lab'", '.', (output_mode = 'content'))
```

### 4. Find Custom MUI Class Selectors

```typescript
// Search for custom CSS using MUI class names
search_for_pattern(
  '\\.MuiButton-',
  '.',
  (paths_include_glob = '*.ts,*.tsx,*.css'),
)
search_for_pattern(
  '\\.MuiChip-',
  '.',
  (paths_include_glob = '*.ts,*.tsx,*.css'),
)
```

### 5. Find Dark Mode Implementation

```typescript
// Search for palette.type or palette.mode usage
search_for_pattern('palette\\.type', '.', (output_mode = 'content'))
search_for_pattern('palette\\.mode', '.', (output_mode = 'content'))
```

### 6. Find Accordion Usage

```typescript
// Search for Accordion components
search_for_pattern(
  '<Accordion',
  '.',
  (output_mode = 'content'),
  (context_lines_after = 10),
)
```

### 7. Find Deep Material-UI Imports

```typescript
// Search for potentially problematic deep imports
search_for_pattern("from '@mui/material/[^'\"]+/[^'\"]+", '.')
```

---

## Migration Execution Plan

### Phase 1: Preparation (30 min)

1. ✅ Create feature branch: `git checkout -b feature/mui-v5-to-v7-upgrade`
2. ✅ Run Serena queries to understand current MUI usage
3. ✅ Document current Grid layouts with screenshots
4. ✅ Review theme customizations in `src/constants/theme`
5. ✅ Backup current package-lock/pnpm-lock

### Phase 2: v5→v6 Migration (2-3 hours)

1. Update dependencies:

   ```bash
   pnpm add @mui/material@6.5.0 @mui/icons-material@6.5.0 @mui/system@6.5.0
   ```

2. Run codemods:

   ```bash
   npx @mui/codemod@latest v5.0.0/theme-palette-mode src/
   npx @mui/codemod@latest v5.0.0/variant-prop src/
   npx @mui/codemod@latest v6.0.0/grid-v2 src/ --jscodeshift='--muiBreakpoints=xs,sm,md,lg,xl'
   npx @mui/codemod@latest deprecations/button-classes src/
   npx @mui/codemod@latest deprecations/chip-classes src/
   ```

3. Fix codemod output:
   - Review all changed files
   - Fix any formatting issues
   - Run `pnpm lint:fix`

4. Update theme customizations:
   - Check `src/constants/theme` for variant/styleOverrides conflicts
   - Update any Button/Chip class selectors

5. Validate:

   ```bash
   pnpm typecheck
   pnpm build
   pnpm dev  # Manual testing
   ```

6. Commit: `git commit -m "feat(deps): upgrade MUI v5→v6"`

### Phase 3: v6→v7 Migration (1-2 hours)

1. Update dependencies:

   ```bash
   pnpm add @mui/material@7.3.4 @mui/icons-material@7.3.4 @mui/system@7.3.4
   ```

2. Run codemods:

   ```bash
   npx @mui/codemod@latest v7.0.0/lab-removed-components src/
   ```

3. Manual fixes:
   - Search for `from '@mui/lab'` in TypeScript files
   - Update type imports manually
   - Fix any deep import paths

4. Validate:

   ```bash
   pnpm typecheck
   pnpm build
   ```

5. Commit: `git commit -m "feat(deps): upgrade MUI v6→v7"`

### Phase 4: Testing & Validation (2-3 hours)

1. Visual regression testing:
   - Start dev server: `pnpm dev`
   - Test all major pages
   - Compare Grid layouts to screenshots
   - Test responsive breakpoints

2. E2E testing:

   ```bash
   pnpm playwright
   ```

3. Fix failures:
   - Layout issues → adjust Grid2 props
   - Style issues → update theme
   - Type issues → fix imports

4. Final validation:
   ```bash
   pnpm validate
   ```

### Phase 5: Documentation & Review (30 min)

1. Update CHANGELOG or migration notes
2. Document any theme changes
3. Update component usage docs if needed
4. Create PR with migration summary

---

## Rollback Plan

### If Migration Fails at v6:

```bash
git reset --hard HEAD~1  # Undo last commit
pnpm install  # Restore v5 deps
```

### If v6 Works but v7 Fails:

```bash
# Stay on v6 - it's stable and supports React 19
git reset --hard HEAD~1
pnpm install
```

### Nuclear Option:

```bash
git checkout main
git branch -D feature/mui-v5-to-v7-upgrade
# Start over with better understanding
```

---

## Performance Expectations

### Bundle Size Impact

- **v5→v6**: ~2.5MB reduction (UMD removal)
- **v6→v7**: Minimal change
- **Overall**: Smaller bundle, faster load times

### Runtime Performance

- **v6**: Optional Pigment CSS for zero-runtime (not required)
- **v7**: Further optimizations
- **With Emotion**: No performance degradation expected

### Build Time

- **Expected**: Similar or slightly faster
- **Vite 7**: Already optimized for fast builds

---

## Common Pitfalls & Solutions

### 1. Grid Layout Breaking

**Symptom**: Layouts overflow or shift unexpectedly
**Cause**: Grid v1 negative margins vs Grid2 CSS gap
**Solution**: Visual testing + manual adjustments to `spacing` values

### 2. Theme Styles Not Applying

**Symptom**: Custom button/chip styles missing
**Cause**: `variants` vs `styleOverrides` precedence change
**Solution**: Restructure theme to use `styleOverrides.root` for base styles

### 3. TypeScript Errors After Migration

**Symptom**: Type errors for Lab components
**Cause**: Codemod doesn't update type imports
**Solution**: Manual update of `import type { Alert } from '@mui/lab'` → `'@mui/material'`

### 4. Deep Import Errors

**Symptom**: `Module not found: @mui/material/internal/...`
**Cause**: v7 package layout changes
**Solution**: Refactor to shallow imports from `@mui/material`

### 5. Dark Mode Breaking

**Symptom**: Dark mode not switching
**Cause**: `palette.type` → `palette.mode` rename
**Solution**: Run `v5.0.0/theme-palette-mode` codemod

---

## Resources

### Official Documentation

- [MUI v6 Migration Guide](https://mui.com/material-ui/migration/upgrade-to-v6/)
- [MUI v7 Migration Guide](https://mui.com/material-ui/migration/upgrade-to-v7/)
- [Grid2 Migration Guide](https://mui.com/material-ui/migration/upgrade-to-grid-v2/)
- [React 19 Support Announcement](https://mui.com/blog/material-ui-2024-updates/)

### Codemods Repository

- [MUI Codemods GitHub](https://github.com/mui/material-ui/tree/master/packages/mui-codemod)

### Community Resources

- [Refine MUI v6 Migration Guide](https://refine.dev/docs/ui-integrations/material-ui/migration-guide/material-ui-v5-to-v6/)
- [React-Admin v5.5 with MUI v6](https://marmelab.com/blog/2025/03/24/react-admin-march-2025-update.html)

---

## Decision Matrix: When to Migrate

### ✅ Migrate Now If:

- You need React 19 features (you do - already on 19.0.0)
- You want smaller bundle size (2.5MB reduction)
- You're starting new features (clean slate)
- You have 1-2 days for testing

### ⏸️ Delay Migration If:

- In middle of critical feature development
- About to release to production
- Insufficient testing time available
- Major refactoring already in progress

### 🚫 Don't Migrate If:

- Production incident ongoing
- No time for E2E test validation
- Team unavailable for review

---

## Conclusion

**Recommended Approach**: ✅ Proceed with two-stage migration

**Confidence Level**: 🟢 HIGH with proper testing

**Timeline**: 4-8 hours total effort

**Success Factors**:

1. Comprehensive codemod automation
2. Strong E2E test coverage (345 tests)
3. TypeScript for type safety
4. Staged approach (v5→v6→v7)
5. React 19 already in use (ahead of curve)

**Next Steps**:

1. Run Serena analysis queries (provided above)
2. Review current Grid usage and theme customizations
3. Create feature branch
4. Execute Phase 1 (v5→v6) migration
5. Validate with full test suite
6. Proceed to Phase 2 (v6→v7)

The migration path is well-documented, automated via codemods, and supported by MUI team. With your existing React 19 setup and strong test coverage, you're in an excellent position to upgrade successfully.
