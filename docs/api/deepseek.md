# DeepSeek 代理

净读提供 DeepSeek API 的代理服务，兼容 OpenAI API 格式。

## 服务信息

```
GET /api/deepseek
```

## 可用模型

```
GET /api/deepseek/v1/models
```

**需要认证**（Token 或 Session）

返回所有可用的 AI 模型列表。`deepseek-flash`（DeepSeek-V4.1-Flash，由原 DeepSeek V4 Flash 与 V4 Flash Vision 合并升级）支持图片输入，可与 Files API 配合使用。

## 聊天补全

```
POST /api/deepseek/v1/chat/completions
```

**需要认证**（Token 或 Session）

兼容 OpenAI Chat Completions API 格式，支持流式响应。

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model | string | 是 | 模型名称 |
| messages | array | 是 | 消息列表 |
| stream | boolean | 否 | 是否启用流式响应（默认 false） |
| max_tokens | integer | 否 | 输出长度上限；**不传即不限制输出长度**，模型会生成到自然结束或上下文用尽 |

> 代理默认不限制输出长度：若请求未携带 `max_tokens`，服务端会按“不限制”处理（未登录的免费体验接口不受影响，仍为 2000 tokens 上限）。输出越长消耗的积分越多。

### 多模态（图片）请求示例

`deepseek-flash`（DeepSeek-V4.1-Flash）支持三种图片输入方式（与官方一致）：

- **方式一：base64 内联**（`image_url`，图片 ≤ 32 MiB，请求体 ≤ 48 MiB）
- **方式二：外部图片 URL**（`image_url`，URL ≤ 8192 字符，图片 ≤ 32 MiB）
- **方式三：Files API 引用**（`file` 块 + `file_id`，图片 ≤ 64 MiB，推荐）

```json
{
  "model": "deepseek-flash",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "这张图片里有什么？"},
        {"type": "file", "file_id": "file-api-xxxxxxxxxxxxxxxx"}
      ]
    }
  ]
}
```

图片会转换为 Token 计费（单张最多约 384 个 Token），价格与文本一致。

## Files API（视觉模型图片上传）

**需要认证**（Token、Session 或开发者 Key），上传免费，仅在对话中引用时产生 Token 费用。

### 上传文件

```
POST /api/deepseek/v1/files
```

`multipart/form-data` 格式，表单字段与官方一致：

| 字段 | 必填 | 说明 |
|------|------|------|
| file | 是 | 图片文件（JPEG/PNG/GIF/WebP，≤ 64 MiB） |
| purpose | 是 | 固定为 `user_data` |
| expires_after[anchor] | 否 | 固定为 `created_at` |
| expires_after[seconds] | 否 | 过期秒数（3600 ~ 2592000），省略则永久保留 |

响应示例：

```json
{
  "id": "file-api-xxxxxxxxxxxxxxxx",
  "object": "file",
  "bytes": 102400,
  "created_at": 1700000000,
  "filename": "image.jpg",
  "purpose": "user_data"
}
```

### 文件列表

```
GET /api/deepseek/v1/files
```

支持 `after` / `limit` / `order` / `purpose` 查询参数。

### 文件详情

```
GET /api/deepseek/v1/files/<file_id>
```

### 删除文件

```
DELETE /api/deepseek/v1/files/<file_id>
```

删除后返回 `{"id": "...", "object": "file", "deleted": true}`。

::: info
除 `/v1/` 前缀外，同样提供不带前缀的路径（`/api/deepseek/files`），两种路径行为一致。
:::

### 请求示例

```json
{
  "model": "deepseek-chat",
  "messages": [
    { "role": "user", "content": "你好" }
  ],
  "stream": false
}
```

### 响应示例

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "model": "deepseek-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！有什么我可以帮助你的吗？"
      },
      "finish_reason": "stop"
    }
  ]
}
```

### 流式响应

设置 `stream: true` 时，响应以 Server-Sent Events (SSE) 格式返回，与 OpenAI 流式格式兼容。

::: info
每次调用会根据模型和对话轮数消耗对应的积分，详见 [AI 聊天 - 积分系统](/features/ai-chat#积分系统)。
:::

## 健康检查

```
GET /api/deepseek/health
```

## 统计信息

```
GET /api/deepseek/stats
```

**需要认证**
