# MyWordFlow Admin

MyWordFlow 后台管理系统，基于 **官方 Ant Design Pro v6**（Umi Max 4 + utoopack），对接 [`mywordflow-backend`](https://github.com/bracebrace008/mywordflow-backend) 的 Admin API。

## 关联仓库

| 仓库 | 角色 |
|------|------|
| [mywordflow-backend](https://github.com/bracebrace008/mywordflow-backend) | NestJS REST API（含 `/api/admin/*`） |
| [mywordflow-app](https://github.com/bracebrace008/mywordflow-app) | Flutter 移动 App |
| [mywordflow](https://github.com/bracebrace008/mywordflow) | 官网 / Demo |

## 技术栈

- Ant Design Pro v6
- React 19 + Umi Max 4
- Ant Design 6 + ProComponents

## 快速开始

### 1. 启动后端

在 `mywordflow-backend` 目录：

```bash
docker compose up -d
cp .env.example .env
npm install
npm run start:dev
```

确保 `.env` 中 `CORS_ORIGINS` 包含 `http://localhost:8000`。

### 2. 启动后台前端

```bash
npm install
npm start
```

默认地址：`http://localhost:8000`

开发模式下 `/api/*` 会代理到 `http://localhost:3000`。

## Admin 账号

| 字段 | 值 |
|------|-----|
| 邮箱 | `admin@mywordflow.app` |
| 密码 | `admin1234` |

首次启动后端时会自动 seed 该管理员账号。普通用户（如 `demo@mywordflow.app`）登录后会被拒绝访问后台。

## 功能

- 用户管理：分页查看、按邮箱搜索、编辑显示名与角色
- 精选词库管理：创建、编辑、删除精选词库及单词列表

## 生产部署

构建：

```bash
npm run build
```

生产环境需配置 `API_BASE_URL` 指向后端服务地址（见 `src/app.tsx` 中 `request.baseURL`）。
