# 测试报告：Admin 管理员管理 & 用户词表管理

| 项 | 值 |
|----|-----|
| 日期 | 2026-07-09 |
| 后端提交 | mywordflow-backend @ 8909574（工作区未提交） |
| Admin 提交 | mywordflow-admin @ 2903c08（工作区未提交） |
| 测试人 | Agent |

## 执行摘要

- 后端 API E2E：**44 / 44 通过**
- 后端单元测试：**168 / 168 通过**（含 `admin-auth.service.spec.ts`）
- Admin Vitest（本功能）：**2 / 2 通过**（`src/pages/admin/admins`、`src/pages/admin/users`）
- Admin Vitest（全量）：**34 / 38 通过**（4 个失败为仓库既有用例，非本次改动）
- Admin lint/tsc：**通过**
- 手动 UI 验收：**未在本轮自动执行**（可用 `@dev-stack` 访问 `/admin/admins`、`/admin/users`）

## 命令与结果

| 命令 | 结果 | 备注 |
|------|------|------|
| `npm run test:e2e:docker` (backend) | PASS | 44 tests |
| `npm test` (backend) | PASS | 168 tests |
| `npx vitest run src/pages/admin/` (admin) | PASS | 2 tests |
| `npm run lint` (admin) | PASS | tsc 无错误；1 个既有 biome warning |
| `npm run lint` (backend) | FAIL | 141 个既有 eslint 问题（含 e2e 文件 no-unsafe-*），非本次引入 |

## 用例执行明细

| 用例 ID | 类型 | 结果 | 备注 |
|---------|------|------|------|
| TC-ADM-01 | API E2E | PASS | admins lifecycle |
| TC-ADM-01 | Vitest | PASS | admins/index.test.tsx |
| TC-ADM-02 | API E2E | PASS | PATCH + login 新密码 |
| TC-ADM-03 | API E2E | PASS | DELETE 非当前 admin |
| TC-ADM-04 | API E2E | PASS | DELETE self → 403 |
| TC-ADM-05 | Unit | PASS | admin-auth.service.spec.ts |
| TC-ADM-06 | API E2E | PASS | app token → 403 |
| TC-WL-01 | Vitest | PASS | users/index.test.tsx Drawer |
| TC-WL-02 | API E2E | PASS | POST word-list |
| TC-WL-03 | API E2E | PASS | PUT word-list |
| TC-WL-04 | API E2E | PASS | DELETE word-list |
| TC-WL-05 | API E2E | PASS | 404 userId/listId |
| TC-WL-06 | API E2E | PASS | app token → 403 |
| TC-ADM-01~04 UI | 手动 | 待验 | dev-stack `/admin/admins` |
| TC-WL-01~04 UI | 手动 | 待验 | dev-stack `/admin/users` |

## 缺陷 / 风险

- Admin 全量 `npm run test` 有 4 个既有失败用例（`app.test.tsx`、`requestErrorConfig.test.ts`），不影响本次新增页面测试。
- 已将 `vitest.config.ts` 迁移为 `vitest.config.mts` 以修复 Windows 下 Vitest 无法启动的问题。
- 后端 `npm run lint` 仍有历史 eslint 告警，与本次功能无关。

## 结论

- [x] 可合并（API E2E + 本功能 Vitest + Admin tsc 已通过）
- [ ] 需修复后重测
