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

帖子以随机推荐排序展示，增加内容曝光。

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
