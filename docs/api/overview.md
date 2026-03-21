# API 概览

净读提供 RESTful API 接口，支持 OpenAPI 3.0 标准。

## 基本信息

- **Base URL**: `https://jingdu.qzz.io`
- **认证方式**: Session Cookie 或 Token（请求头 `Authorization: Bearer <token>`）
- **频率限制**: 100 次/小时（API 接口）
- **响应格式**: JSON

## API 文档

- **Swagger UI**: 访问 `/api/docs` 查看交互式 API 文档
- **OpenAPI 规范**: 访问 `/api/openapi.json` 获取 OpenAPI 3.0 规范文件

## 频率限制

| 接口类型 | 限制 |
|---------|------|
| 普通 API | 100 次/小时 |
| 敏感操作 | 20 次/小时 |
| 登录 | 10 次/小时 |

超过限制会返回 `429 Too Many Requests` 错误。

## 认证说明

API 支持两种认证方式：

1. **Session Cookie** — 通过网页登录后自动携带
2. **Token** — 在请求头中添加 `Authorization: Bearer <token>`

## 通用响应格式

### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "错误描述",
  "data": null
}
```

## API 接口列表

| 模块 | 说明 | 链接 |
|------|------|------|
| 认证 | 注册、登录、Token 管理 | [认证接口](/api/auth) |
| 书籍 | 书籍 CRUD、章节管理 | [书籍接口](/api/books) |
| 博客 | 博客 CRUD、评论 | [博客接口](/api/blog) |
| 论坛 | 帖子 CRUD、评论 | [论坛接口](/api/forum) |
| 资源 | 资源 CRUD、版本管理 | [资源接口](/api/resource) |
| DeepSeek | AI 对话代理 | [DeepSeek 代理](/api/deepseek) |
