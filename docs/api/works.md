# 作品流接口

作品流接口由 `routes/works.py` 提供，返回**服务端渲染好的卡片 HTML**，供首页的无限滚动与页内类别切换使用。

## 获取作品流

```http
GET /api/works
```

### 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `type` | string | `all`（默认）、`project`、`forum`、`blog`、`resource` |
| `page` | int | 页码，从 1 开始，默认 1 |
| `per_page` | int | 每页数量，1-24，默认 12 |
| `q` | string | 关键词，匹配标题 / 简介 / 正文 / 标签（四类内容） |
| `tag` | string | 标签精确筛选（四类内容；帖子 / 博客读取 JSON 标签） |
| `section` | string | 帖子 / 博客分区筛选；仅对 `type=forum` / `blog` 生效 |
| `author` | string | 作者 UUID，只返回该用户公开作品 |
| `mine` | `1` | 只返回当前登录用户的作品，含未通过审核的工程；需要登录 |

### 响应示例

```json
{
  "success": true,
  "data": {
    "html": "<article class=\"work-card\" ...>...</article>",
    "type": "forum",
    "section": "教程",
    "page": 1,
    "per_page": 12,
    "total": 13,
    "has_more": true,
    "next_page": 2,
    "counts": {
      "all": 13,
      "project": 0,
      "forum": 1,
      "blog": 1,
      "resource": 11
    }
  }
}
```

- `html` 为已转义的卡片片段，直接插入列表容器即可；不需要前端再拼字段。
- `total` 为当前筛选条件下的总数，`has_more` / `next_page` 用于无限滚动。
- `counts` 用于更新类别标签角标。
- `section` 为当前生效的帖子 / 博客分区；分区筛选不改变类别角标的全局总数。
- 未登录时使用 `mine=1` 返回 401。
- 接口响应带 `Cache-Control: no-store`，避免追加到旧列表。

## 页面入口

| 路径 | 说明 |
|------|------|
| `/` | 作品广场首页；`?type=` 切换类别 |
| `/publish` | 统一发布页（需登录） |
| `/my/works` | 我的作品（需登录） |
| `/api/works` | 作品流分页数据 |
