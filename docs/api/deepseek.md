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

返回所有可用的 AI 模型列表。

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
  "model": "deepseek-v4-flash",
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
