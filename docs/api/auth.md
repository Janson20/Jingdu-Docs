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
