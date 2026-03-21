# 论坛接口

## 获取帖子列表

```
GET /api/forum
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认 1） |
| per_page | integer | 否 | 每页数量 |

## 添加评论（楼中楼）

```
POST /forum/comment/add
```

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| post_id | string | 是 | 帖子 ID |
| content | string | 是 | 评论内容 |
| parent_id | string | 否 | 父评论 ID（楼中楼） |
| reply_to_id | string | 否 | 回复的目标评论 ID |

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
