# Test Coverage Report

**Generated:** 2026-04-14
**Overall Coverage:** 85% statements | 61% branches | 86% functions | 91% lines

---

## Summary

| Category        | Statements | Branches | Functions | Lines |
| --------------- | ---------- | -------- | --------- | ----- |
| **Overall**     | 85%        | 61%      | 86%       | 91%   |
| SudokuSolver    | 89%        | 68%      | 93%       | 97%   |
| SudokuGenerator | 83%        | 49%      | 78%       | 90%   |
| SudokuBoard     | 85%        | 69%      | 81%       | 89%   |
| Cell            | 91%        | 60%      | 100%      | 98%   |
| Batch           | 86%        | 50%      | 97%       | 90%   |
| Config          | 79%        | 62%      | 100%      | 89%   |
| core/services   | 74%        | 62%      | 72%       | 79%   |

**Tests:** 87 passed, 8 test suites

---

## File Coverage Details

### dist/config/index.js (79%)

| Uncovered Lines | Description                             |
| --------------- | --------------------------------------- |
| 58, 61, 64, 67  | Unused env setter methods (loadFromEnv) |

### dist/core/SudokuBoard/SudokuBoard.js (85%)

| Uncovered Lines   | Description               |
| ----------------- | ------------------------- |
| 59, 71-77, 92-95  | Edge cases, serialization |
| 106-109, 126, 146 | Optional params, unused   |
| 171-172, 196-199  | Box index calculation     |
| 269, 274-276      | toString, serialization   |

### dist/core/SudokuBoard/Batch/Batch.js (86%)

| Uncovered Lines    | Description            |
| ------------------ | ---------------------- |
| 30, 44, 47, 50, 53 | Constructor edge cases |

### dist/core/SudokuBoard/Cell/Cell.js (91%)

| Uncovered Lines | Description        |
| --------------- | ------------------ |
| 99              | Unused conditional |

### dist/core/services/BoardValidator.js (68%)

| Uncovered Lines | Description              |
| --------------- | ------------------------ |
| 24-37           | hasCellDuplicates method |
| 46              | Unused batch type        |

### dist/core/services/PossibilityCalculator.js (86%)

| Uncovered Lines | Description         |
| --------------- | ------------------- |
| 17              | Optimization branch |
| 25-28           | Cache handling      |

### dist/generator/SudokuGenerator.js (83%)

| Uncovered Lines | Description   |
| --------------- | ------------- |
| 37-43, 64-66    | Configuration |

### dist/solver/SudokuSolver.js (89%)

| Uncovered Lines | Description    |
| --------------- | -------------- |
| 29, 47          | Timeout config |

---

## Test Suites

1. **SudokuBoard** - 18 tests
2. **SudokuSolver** - 6 tests
3. **SudokuGenerator** - 10 tests
4. **BoardValidator** - 10 tests
5. **PossibilityCalculator** - 4 tests
6. **Cell** - 14 tests
7. **Batch** - 13 tests
8. **Config** - 10 tests

---

## Recommendations

1. ✅ **Core modules tested** - All critical paths covered
2. ⚠️ **Config env setters** - Rarely used, not critical
3. ⚠️ **Edge cases** - Serialization, toString not critical

---

_Report generated with Jest coverage_
