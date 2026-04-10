# 私信 API

私信模块提供完整的 RESTful API，支持 Session 和 Token 两种认证方式。

## 认证方式

所有私信 API 均需要认证，支持两种方式：

| 方式 | 说明 |
|------|------|
| Session | 已登录用户的浏览器请求自动携带 |
| Token | 在请求头 `Authorization: Bearer <token>` 或请求参数 `?token=<token>` 中传递 |

## 基础信息

- **Base URL**: `/message/api`
- **响应格式**: JSON
- **统一响应格式**:

```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

## 接口列表

### 获取会话列表

```
GET /message/api/conversations
```

**查询参数**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 |
| per_page | int | 20 | 每页数量（最大 50） |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "other_uuid": "abc123",
        "other_name": "书友A",
        "last_message": "你好！",
        "last_sender": "abc123",
        "unread_count": 2,
        "updated_at": "2025-01-15 10:30:00"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

### 获取消息历史

```
GET /message/api/messages/<conversation_id>
```

**查询参数**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 |
| per_page | int | 30 | 每页数量（最大 50） |

**响应示例**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 100,
        "sender_uuid": "abc123",
        "sender_name": "书友A",
        "content": "你好！",
        "status": 2,
        "created_at": "2025-01-15 10:30:00",
        "is_mine": false
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 30,
      "total": 15,
      "total_pages": 1
    }
  }
}
```

**消息状态说明**:

| status | 含义 |
|--------|------|
| 0 | 已发送 |
| 1 | 已送达 |
| 2 | 已读 |

### 发送消息

```
POST /message/api/send
```

**请求体**:

```json
{
  "target_uuid": "目标用户UUID",
  "content": "消息内容"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| target_uuid | string | 是 | 接收方用户 UUID |
| content | string | 是 | 消息内容（最大 2000 字符） |

**限流**: 每分钟 30 次

**响应示例**:

```json
{
  "success": true,
  "message": "发送成功",
  "data": {
    "conversation_id": 1,
    "message_id": 100
  }
}
```

**错误码**:

| HTTP 状态码 | 说明 |
|-------------|------|
| 400 | 参数错误、消息为空、超长、拉黑等 |
| 401 | 未认证 |
| 404 | 目标用户不存在 |

### 标记已读

```
POST /message/api/read/<conversation_id>
```

将会话中收到的所有未读消息标记为已读。

**响应示例**:

```json
{
  "success": true,
  "message": "已标记3条消息为已读"
}
```

### 获取未读消息数

```
GET /message/api/unread-count
```

获取当前用户的未读消息总数。调用此接口时，所有新消息（status=0）会自动标记为已送达（status=1）。

**响应示例**:

```json
{
  "success": true,
  "data": {
    "unread_count": 5
  }
}
```

::: tip
建议前端定期轮询此接口（如每 15 秒），以更新导航栏的未读消息角标。
:::

### 删除会话

```
DELETE /message/api/delete/<conversation_id>
```

删除会话及其所有消息记录，此操作不可恢复。

**响应示例**:

```json
{
  "success": true,
  "message": "会话已删除"
}
```

### 拉黑用户

```
POST /message/api/block
```

**请求体**:

```json
{
  "target_uuid": "目标用户UUID"
}
```

**限流**: 每小时 20 次

### 取消拉黑

```
POST /message/api/unblock
```

**请求体**:

```json
{
  "target_uuid": "目标用户UUID"
}
```

### 获取拉黑列表

```
GET /message/api/blocked
```

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "uuid": "abc123",
      "name": "用户A",
      "blocked_at": "2025-01-15 10:00:00"
    }
  ]
}
```

### 检查拉黑状态

```
GET /message/api/block-status/<target_uuid>
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "is_blocked": false,
    "is_blocked_by": false
  }
}
```

| 字段 | 说明 |
|------|------|
| is_blocked | 当前用户是否拉黑了目标用户 |
| is_blocked_by | 当前用户是否被目标用户拉黑 |
