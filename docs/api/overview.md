# API 概览

净读提供 RESTful API 接口，支持 OpenAPI 3.0 标准。

## 基本信息

- **Base URL**: `https://jingdu.org`
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
| 段评 | 段落评论、点赞、回复 | [段评接口](/api/para-comment) |
| 资源 | 资源 CRUD、版本管理 | [资源接口](/api/resource) |
| 内容互动 | 帖子 / 博客 / 资源的点赞、收藏、转发、评论与卡片 | [作品流](/features/works#统一互动) |
| 作品流 | 首页无限滚动、类别切换、我的作品 | [作品流接口](/api/works) |
| DeepSeek | AI 对话代理 | [DeepSeek 代理](/api/deepseek) |

## 统一内容互动接口

帖子、博客、资源共用以下接口，`<type>` 取 `forum_post`、`blog`、`resource`：

- `GET /api/content/<type>/<id>/status` — 当前用户态度、收藏状态与互动计数
- `POST /api/content/<type>/<id>/attitude` — 点赞 / 点踩，JSON `{"attitude": 1}` 或 `{"attitude": -1}`
- `POST /api/content/<type>/<id>/bookmark` — 收藏 / 取消收藏
- `POST /api/content/<type>/<id>/repost` — 转发给私信好友，JSON `{"target_uuid": "..."}`
- `GET /api/content/<type>/<id>/card` — 转发卡片数据
- `GET /api/content/<type>/<id>/comments` — 评论树
- `POST /api/content/<type>/<id>/comments` — 发表评论或回复
- `POST /api/content/comments/<comment_id>` — 删除评论

旧的 `/forum/like`、`/blog/like` 等接口继续保留，并写入同一份互动数据。
