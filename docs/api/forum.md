# 论坛接口

## 基础信息

- **Base URL**: `/forum` 和 `/api/forum`

## 获取帖子列表

```
GET /api/forum
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认 1） |
| per_page | integer | 否 | 每页数量 |

### 响应示例

```json
{
  "posts": [...],
  "total": 100,
  "page": 1,
  "per_page": 20,
  "total_pages": 5
}
```

帖子以热榜算法排序：

```
热榜得分 = (view×1 + reply×3 + like×4 + bookmark×5 + repost×6 + 2) / (天数 + 1)
```

综合浏览量、回复数、点赞、收藏、转发五个维度的互动数据，结合时间衰减（新帖有优势，老帖靠互动量维持位置），并加入微量随机扰动避免同分帖子顺序固定。

## 获取帖子详情

```
GET /forum/<post_id>
```

返回帖子的完整内容、所有回复（楼中楼结构）、浏览量和回复数。

## 创建帖子

```
POST /forum/create
```

**需要认证**（Session）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 帖子标题 |
| content | string | 是 | 帖子正文 |

::: info 发布限制
- 每天最多发布 **10 + 等级** 个帖子
- 发布帖子可获得 **10 经验值**，每日最多 10 次
:::

## 编辑帖子

```
POST /forum/edit/<post_id>
```

**需要认证**（仅帖子作者）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 帖子标题 |
| content | string | 是 | 帖子正文 |

## 删除帖子

```
POST /forum/delete/<post_id>
```

**需要认证**（仅帖子作者）

## 我的帖子

```
GET /forum/my
```

**需要认证**（Session）

返回当前用户发布的所有帖子列表。

## 添加评论（楼中楼）

```
POST /forum/comment/add
```

**需要认证**（Session）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| post_id | string | 是 | 帖子 ID |
| content | string | 是 | 评论内容 |
| parent_id | string | 否 | 父评论 ID（楼中楼） |
| reply_to_id | string | 否 | 回复的目标评论 ID |

::: tip
- 登录后评论可获得 **3 经验值**，每日最多 10 次
- 评论会显示 IP 归属地（省/市级）
- 支持 `:)` 等表情代码自动转换为 emoji
:::

## 删除评论

```
POST /forum/comment/delete/<comment_id>
```

**需要认证**（仅评论者或帖子作者）

## 催更历史

```
GET /api/urge_history
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码 |
| per_page | integer | 否 | 每页数量 |

## B站问号榜

```
GET /api/bili_qml
```

返回 B 站千粉新号排行榜数据。

---

## 帖子互动（点赞/收藏/转发）

### 点赞帖子

```
POST /forum/like/<post_id>
```

**需要认证**（Session）

Toggle 模式：已点赞则取消，未点赞则点赞。

**响应示例**：

```json
{
  "success": true,
  "liked": true,
  "like_count": 42
}
```

### 收藏帖子

```
POST /forum/bookmark/<post_id>
```

**需要认证**（Session）

Toggle 模式：已收藏则取消，未收藏则收藏。

**响应示例**：

```json
{
  "success": true,
  "bookmarked": true,
  "bookmark_count": 15
}
```

### 转发帖子

```
POST /forum/repost/<post_id>
```

**需要认证**（Session）

将帖子摘要通过私信转发给好友。排除已拉黑用户和系统公告（ID=0）。

**请求体**（JSON）：

```json
{
  "target_uuid": "接收方UUID"
}
```

**响应示例**：

```json
{
  "success": true,
  "message": "转发成功",
  "conversation_id": 123
}
```

::: tip 经验奖励
- 帖子作者被点赞 +1 经验（每日上限 50 次）
- 帖子作者被收藏 +2 经验（每日上限 30 次）
- 帖子作者被转发 +3 经验（每日上限 20 次）
:::

### 获取帖子卡片数据

```
GET /api/forum/<post_id>/card
```

**无需认证**。返回帖子公开数据，用于转发/嵌入展示。数据由服务端实时查询，不可伪造。

**响应示例**：

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "帖子标题",
    "author": "用户A",
    "summary": "前150字摘要...",
    "date": "2025-01-15 10:30",
    "view_count": 100,
    "reply_count": 5,
    "like_count": 10,
    "bookmark_count": 3,
    "repost_count": 2
  }
}
```

### 获取帖子互动状态

```
GET /api/forum/<post_id>/status
```

返回当前登录用户对该帖的点赞/收藏状态，以及三项计数。

**响应示例**：

```json
{
  "success": true,
  "data": {
    "liked": true,
    "bookmarked": false,
    "like_count": 42,
    "bookmark_count": 15,
    "repost_count": 8
  }
}
```

### 获取私信联系人（转发用）

```
GET /forum/api/contacts
```

**需要认证**（Session）

返回当前用户的私信联系人列表（排除系统公告和已拉黑用户）。

**响应示例**：

```json
{
  "success": true,
  "data": [
    { "uuid": "xxx", "username": "书友A", "conversation_id": 1 },
    { "uuid": "yyy", "username": "书友B", "conversation_id": 2 }
  ]
}
```

### 我的点赞

```
GET /forum/my-likes
```

**需要认证**（Session）

返回当前用户点赞过的所有帖子列表（分页）。

### 我的收藏

```
GET /forum/my-bookmarks
```

**需要认证**（Session）

返回当前用户收藏过的所有帖子列表（分页）。
