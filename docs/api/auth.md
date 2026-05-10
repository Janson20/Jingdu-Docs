# 认证接口

## 登录

```
POST /api/auth/login
```

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

### 请求示例

```json
{
  "username": "myuser",
  "password": "mypassword"
}
```

### 响应示例

```json
{
  "token": "base64_encoded_token_string"
}
```

## 注册

```
POST /api/auth/register
```

::: warning
注册接口当前可能已关闭，具体以站点配置为准。
:::

## 获取用户信息

```
GET /api/users/<user_id>
```

### 路径参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| user_id | string | 是 | 用户 ID |

### 响应示例

```json
{
  "id": "user_uuid",
  "username": "myuser",
  "description": "个性签名"
}
```

## 获取当前登录用户信息

```
GET /api/user/info
```

通过 Token 获取当前登录用户的详细信息，包括 IP 地址、用户名、UUID、简介、等级和 AI 积分。

### 认证方式

支持以下两种方式传递 Token：

1. **Authorization 请求头**（推荐）：`Authorization: Bearer <token>`
2. **查询参数**：`?token=<token>`

### 请求示例

```bash
# 使用 Authorization 请求头
curl -H "Authorization: Bearer your_token_here" https://jingdu.qzz.io/api/user/info

# 使用查询参数
curl https://jingdu.qzz.io/api/user/info?token=your_token_here
```

### 响应示例

```json
{
  "success": true,
  "data": {
    "ip": "192.168.1.1",
    "username": "myuser",
    "uuid": "01234567-89ab-cdef-0123-456789abcdef",
    "description": "这是一个个性签名",
    "level": 5,
    "level_name": "学者",
    "ai_credits": 128
  }
}
```

### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| ip | string | 请求者的 IP 地址 |
| username | string | 用户名 |
| uuid | string | 用户唯一标识 |
| description | string | 用户简介/个性签名 |
| level | integer | 用户等级（1-10） |
| level_name | string | 等级名称（如：新手、学者等） |
| ai_credits | integer | AI 积分余额 |

### 错误响应

| 状态码 | 说明 |
|--------|------|
| 401 | 未提供 Token 或 Token 无效/已过期 |
| 404 | 用户不存在 |
| 500 | 服务器内部错误 |

## 发送邮箱验证码

```
POST /send-code
```

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 邮箱地址 |
| type | string | 是 | 验证类型：register / login / bind |

::: info
- 验证码为 6 位数字
- 有效期 10 分钟
- 最多尝试 5 次
- 发送间隔 60 秒
:::
