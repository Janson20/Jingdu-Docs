# 段评接口

段评（段落评论）即阅读页中针对具体段落发表的评论，支持点赞、楼中楼回复（最多两层）等能力。

- **Base URL**: `https://jingdu.qzz.io`
- **认证方式**: Session Cookie
- **CSRF**: 无需携带（JSON API 豁免）
- **发布限流**: 30 次/分钟

## 获取整章段评

`GET /api/para-comment/<book_id>/<chapter_no>`

无需登录即可调用。返回按段落分组（`para_index` 为段落索引，从 0 开始），顶层评论按点赞数降序、时间升序排列，回复按时间升序嵌套在 `replies` 中，`total` 为该段累计评论数（含楼中楼）。

**请求示例**

```http
GET /api/para-comment/143e0e66-9d52-7d93-8000-b7c7717f4001/1
```

**响应示例**

```json
{
  "success": true,
  "author_id": "06a8d8da-603e-790a-8000-34f034db9bb1",
  "data": {
    "0": {
      "top": [
        {
          "id": 1,
          "para_index": 0,
          "user_id": "06a8d8da-603e-790a-8000-34f034db9bb1",
          "username": "某某",
          "level": 3,
          "level_color": "#2ecc71",
          "level_name": "学徒",
          "is_author": true,
          "content": "这一段的描写太精彩了！",
          "like_count": 2,
          "liked": false,
          "ip_location": "广东 深圳",
          "parent_id": null,
          "reply_to_id": null,
          "created_at": "2026-08-25 20:00:00 (UTC+8)",
          "replies": [
            {
              "id": 2,
              "user_id": "...",
              "username": "路人甲",
              "content": "同感！",
              "like_count": 0,
              "liked": false,
              "parent_id": 1,
              "reply_to_id": null,
              "created_at": "2026-08-25 20:05:00 (UTC+8)"
            }
          ]
        }
      ],
      "total": 2
    }
  }
}
```

字段说明：

| 字段 | 说明 |
|------|------|
| `para_index` | 段落索引（从 0 开始） |
| `username` / `level` / `level_color` / `level_name` | 评论者用户名与等级 |
| `is_author` | 是否为该书作者 |
| `liked` | 当前查看者是否已点赞 |
| `parent_id` | 所属顶层评论 ID（顶层为 `null`） |
| `reply_to_id` | 被回复的评论 ID（回复别人的回复时非空，前端以 @用户名 展示） |
| `ip_location` | 评论者 IP 属地 |

## 发布段评

`POST /api/para-comment`

需要登录。请求体为 JSON：

```json
{
  "book_id": "143e0e66-9d52-7d93-8000-b7c7717f4001",
  "chapter_no": 1,
  "para_index": 0,
  "content": "这一段的描写太精彩了！",
  "reply_target_id": null
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `book_id` | 是 | 书籍 ID |
| `chapter_no` | 是 | 章节号（从 1 开始） |
| `para_index` | 是 | 段落索引（从 0 开始） |
| `content` | 是 | 评论内容，300 字以内，发布前经敏感词过滤 |
| `reply_target_id` | 否 | 要回复的评论 ID；回复目标为回复时服务器自动归并为两层结构（`parent_id` 指向其顶层，`reply_to_id` 指向被回复的评论） |

**响应**

```json
{
  "success": true,
  "message": "段评发布成功",
  "comment": { "id": 1, "para_index": 0, "parent_id": null, "reply_to_id": null }
}
```

发布成功后评论者获得 3 经验值（每日上限 20 次）。

**错误响应**

| 状态码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 400 | 参数无效 / 内容为空 / 超过 300 字 / 段落索引超出范围 / 回复目标不在当前段落 |
| 404 | 书籍或章节不存在 |
| 429 | 超过 30 次/分钟限流 |

## 点赞段评

`POST /api/para-comment/<comment_id>/like`

需要登录。点赞为切换式（再点一次取消点赞）。

**响应**

```json
{ "success": true, "liked": true, "like_count": 1 }
```

段评被点赞后，评论作者获得 1 经验值（每日上限 30 次）。

## 删除段评

`DELETE /api/para-comment/<comment_id>`

需要登录。仅评论作者本人或该书作者可删除；删除顶层评论会连带删除其全部回复及点赞。

**响应**

```json
{ "success": true, "message": "段评已删除" }
```

无权限删除返回 `403`，删除前请用 `GET` 接口核实评论归属。
