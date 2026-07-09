# Admin 管理员管理 & 用户词表管理 — 测试用例

## 1. 管理员管理（admin_users）

### TC-ADM-01 新建管理员 [P0]

- **Given** 已登录 Admin（`admin@mywordflow.app`）
- **When** 在「管理员管理」页填写邮箱、密码并提交
- **Then** 列表出现新记录；可用新账号 `POST /api/admin/login` 成功

### TC-ADM-02 编辑管理员显示名与密码 [P0]

- **Given** 存在可编辑的管理员账号
- **When** 修改 displayName 与新密码并保存
- **Then** 列表显示新 displayName；新密码可登录

### TC-ADM-03 删除管理员 [P0]

- **Given** 存在第二个管理员账号（非当前登录者）
- **When** 点击删除并确认
- **Then** 列表不再显示该账号；原账号无法登录

### TC-ADM-04 禁止删除当前登录管理员 [P0]

- **Given** 当前 Admin JWT
- **When** `DELETE /api/admin/admins/:currentId`
- **Then** 403，`Cannot delete your own admin account`

### TC-ADM-05 禁止删除最后一个管理员 [P0]

- **Given** 系统中仅剩 1 个 admin（Service 层 count <= 1）
- **When** 另一 admin 会话尝试删除该唯一账号（单元测试模拟）
- **Then** 409，`Cannot delete the last admin account`
- **Note** HTTP E2E 在仅剩 1 人时删自己会先命中 TC-ADM-04 返回 403

### TC-ADM-06 App token 无法访问 admins API [P1]

- **Given** App 用户 JWT
- **When** `GET /api/admin/admins`
- **Then** 403

## 2. 用户词表管理

### TC-WL-01 查看用户词表列表 [P0]

- **Given** 用户管理页存在 App 用户
- **When** 点击「词表」打开 Drawer
- **Then** 显示该用户词表摘要（标题、单词数、创建时间）

### TC-WL-02 新建用户词表 [P0]

- **Given** 词表 Drawer 已打开
- **When** 点击「新建词表」，填写标题与单词并提交
- **Then** Drawer 列表出现新词表；`GET .../word-lists/:id` 返回 words

### TC-WL-03 编辑用户词表 [P0]

- **Given** 用户已有词表
- **When** 点击「编辑」，修改标题/单词并保存
- **Then** 列表与详情反映变更

### TC-WL-04 删除用户词表 [P0]

- **Given** 用户已有词表
- **When** 点击「删除」并确认
- **Then** 列表不再显示；`GET .../word-lists/:id` 404

### TC-WL-05 错误 userId / listId [P1]

- **Given** Admin JWT
- **When** 访问不存在的 userId 或 listId
- **Then** 404

### TC-WL-06 App token 无法访问 admin 词表详情 [P1]

- **Given** App 用户 JWT
- **When** `GET /api/admin/users/:id/word-lists/:listId`
- **Then** 403

## 3. 自动化映射

| 用例 ID | 自动化 | 文件/命令 |
|---------|--------|-----------|
| TC-ADM-01 | API E2E | `test/app.e2e-spec.ts` POST/PATCH/DELETE admins lifecycle |
| TC-ADM-01 | Vitest | `src/pages/admin/admins/index.test.tsx` |
| TC-ADM-02 | API E2E | 同上 lifecycle PATCH + login |
| TC-ADM-03 | API E2E | 同上 lifecycle DELETE |
| TC-ADM-04 | API E2E | `DELETE /api/admin/admins rejects deleting self` |
| TC-ADM-05 | Unit | `admin-auth.service.spec.ts` deleteAdmin rejects deleting last admin |
| TC-ADM-05 | API E2E | 409 场景由 duplicate email 用例覆盖（`POST /api/admin/admins rejects duplicate email`） |
| TC-ADM-06 | API E2E | `GET /api/admin/admins rejects app user token` |
| TC-ADM-04/05 | Unit | `src/modules/admin/admin-auth.service.spec.ts` |
| TC-WL-01 | Vitest | `src/pages/admin/users/index.test.tsx` |
| TC-WL-02~04 | API E2E | `Admin user word-list CRUD via admin API` |
| TC-WL-05 | API E2E | `GET .../word-lists/:listId 404 cases` |
| TC-WL-06 | API E2E | `... rejects app token` |
| TC-ADM-01~04 UI | 手动 | `@dev-stack` 浏览器访问 `/admin/admins` |
| TC-WL-01~04 UI | 手动 | `@dev-stack` 浏览器访问 `/admin/users` |

## 4. Out of scope

- admin 角色分级（super-admin / operator）
- App 用户封禁/删号/改 XP
- Playwright 浏览器自动化（后续任务）
