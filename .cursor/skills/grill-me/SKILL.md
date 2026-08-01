---
name: grill-me
description: >-
  逐分支拷问需求或计划，直到达成共识；一次一问、带推荐选项、先自查后提问。
  Use when user wants to stress-test a plan, get grilled on a design, mentions
  grill me / 拷问我 / 压测计划 / 压测这个计划.
---

# grill-me（MyWordFlow Admin）

启动时声明：**「正在执行 grill-me 拷问流程。」**

## 何时使用

- 用户说「拷问我」「grill me」「压测计划」「压测这个计划」
- Plan mode 下新页面 / 路由 / 权限 / OpenAPI 集成前
- 对实施计划做压测，定稿前逐项过未定项

<HARD-GATE>
拷问期间：**禁止**修改 `src/` 业务代码；**禁止**运行 `npm run lint` / `npm run build` / `npm run dev`。
</HARD-GATE>

## 六条核心手法

1. **AskQuestion 逐问**：每个问题必须走 `AskQuestion`，一次只问一个，等答复再问下一个；禁止在正文列 A/B/C。
2. **先自查后提问**：提问前读下方「必读自查源」；能从文档或代码得出答案的分支自行解决并声明结论，不占用户轮次。
3. **决策树开场**：先输出命中分支 + 依赖关系 + 拓扑序，再按序推进。
4. **带推荐选项**：每问 2–4 个具体选项，第一项标 `（推荐）`；避免无信息量的「是/否」。
5. **反驳风险假设**：用户答案若与既有约定冲突或引入风险，先反驳并引用依据，再记录决策。
6. **进度与收尾**：每轮末尾更新「已解决 / 待解决」分支表；全部解决后输出决策汇总 + 交接（writing-plans / 直接实现）。

## 必读自查源

| 顺序 | 文档 | 用途 |
|------|------|------|
| 1 | [CLAUDE.md](../../CLAUDE.md) | 命令、Critical Rules、架构要点 |
| 2 | [config/routes.ts](../../config/routes.ts) | 路由、menu i18n key、access |
| 3 | [src/access.ts](../../src/access.ts) | 权限门 |
| 4 | `src/locales/` | 8 locale 覆盖 |
| 5 | backend | `/api/admin/*` 契约（mywordflow-backend） |

## Admin 决策树分支

按依赖拓扑序推进：

| 分支 | 检查要点 |
|------|----------|
| **生成代码边界** | 是否动 `src/services/ant-design-pro/`（禁改，只能 `npm run openapi`） |
| **antd API** | 写组件前是否已 `npx antd info <Component>` 核实 v6 API |
| **权限** | `access.ts` / `currentUser.access`；路由 `access` 字段 |
| **路由与菜单** | `config/routes.ts` → `menu.xxx` i18n key |
| **i18n** | 8 个 locale 是否都要补 |
| **Mock vs 真 API** | `npm start`（mock）还是 `npm run dev`（真 `/api/admin/*`） |
| **样式层级** | Tailwind → antd-style → CSS Modules → Less（legacy） |
| **数据加载** | ProTable `request` 还是 `@tanstack/react-query` |
| **提交门** | `npm run lint` + `npx antd lint ./src` 须通过 |
| **Backend 联动** | 是否需 backend 新增或变更 admin API |

## 决策落点

| 类型 | 落点 |
|------|------|
| 已确认决策 | 页面 co-located `data.d.ts` 或 plan / Issue 描述 |
| 路由变更 | `config/routes.ts` + `src/locales/*/menu.ts` |
| 未解决分支 | plan todo 或 Issue 标注 `⚠️ 待定：…` |

## 与其他 Skill 的边界

| Skill | 职责 |
|-------|------|
| **grill-me**（本 Skill） | 逐分支拷问，产出共识与待解决清单 |
| **writing-plans** | 文件级工程计划 |
| **/antd**（`.claude/skills/antd`） | antd 组件 API 查询与 lint |
