# 免费 API 文档

以下接口均无需认证，基于 IP 限制调用次数。

---

## 一、免费 DeepSeek 聊天

基于 DeepSeek-V4.1-Flash 模型（模型名 deepseek-flash）。

- 限制：每 IP 每天 40 次、每小时 10 次
- 输入上限：5000 tokens
- 输出上限：2000 tokens

### 查询剩余次数

```python
import requests

resp = requests.get("https://jingdu.qzz.io/api/deepseek/free/status")
print(resp.json())
# {"daily_limit": 40, "hourly_limit": 10, "daily_remaining": 38, "hourly_remaining": 8}
```

### 调用（非流式）

```python
import requests

resp = requests.post(
    "https://jingdu.qzz.io/api/deepseek/free/chat/completions",
    json={
        "messages": [
            {"role": "user", "content": "用一句话介绍人工智能"}
        ]
    },
    timeout=60,
)
data = resp.json()
print(data["choices"][0]["message"]["content"])
```

### 调用（流式）

```python
import requests

resp = requests.post(
    "https://jingdu.qzz.io/api/deepseek/free/chat/completions",
    json={
        "messages": [
            {"role": "user", "content": "写一首关于春天的诗"}
        ],
        "stream": True,
    },
    stream=True,
    timeout=60,
)
for line in resp.iter_lines(decode_unicode=True):
    if line and line.startswith("data:"):
        data_str = line[5:].strip()
        if data_str == "[DONE]":
            break
        import json
        chunk = json.loads(data_str)
        content = chunk["choices"][0].get("delta", {}).get("content", "")
        if content:
            print(content, end="", flush=True)
```

### 系统提示词注入

所有免费聊天请求会自动在消息列表最前面注入一条 **system 消息**，包含**净读平台信息**（简介、核心功能、反馈渠道）、**当前日期**（年月日）与请求 **IP 属地**（精确到省/市）。你无需额外处理；如需告知模型用户的设备与浏览环境，可附带可选的 `client_env` 字段：

```python
import requests

resp = requests.post(
    "https://jingdu.qzz.io/api/deepseek/free/chat/completions",
    json={
        "messages": [
            {"role": "user", "content": "帮我做一个演示文稿"}
        ],
        "client_env": {"device": "mobile", "orientation": "portrait"}
    },
    timeout=60,
)
```

| 字段 | 说明 |
|------|------|
| `device` | `mobile`（移动端）或 `desktop`（桌面端） |
| `orientation` | `portrait`（竖屏）或 `landscape`（横屏） |

> 注入的 system 消息只包含上述环境信息，不影响消息格式兼容性；未提供 `client_env` 时仍会注入日期与 IP 属地。

---

## 二、免费识图

基于 Qwen3.5-Flash 模型，提取图片文字并描述图片内容。

- 限制：每 IP 每天 20 次
- 图片大小：< 2MB

### 查询剩余次数

```python
import requests

resp = requests.get("https://jingdu.qzz.io/api/deepseek/free/image/status")
print(resp.json())
# {"daily_limit": 20, "daily_remaining": 18}
```

### 识图（本地文件）

```python
import base64
import requests

def recognize_image(filepath: str) -> dict:
    with open(filepath, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    resp = requests.post(
        "https://jingdu.qzz.io/api/deepseek/free/image/recognize",
        json={"image": b64, "mime_type": "image/png"},
        timeout=60,
    )
    return resp.json()


result = recognize_image("screenshot.png")
print(result["result"])
```

### 识图（URL 图片）

```python
import base64
import requests

def recognize_image_url(image_url: str) -> dict:
    resp = requests.get(image_url)
    resp.raise_for_status()
    b64 = base64.b64encode(resp.content).decode("utf-8")

    resp = requests.post(
        "https://jingdu.qzz.io/api/deepseek/free/image/recognize",
        json={"image": b64, "mime_type": resp.headers.get("Content-Type", "image/jpeg")},
        timeout=60,
    )
    return resp.json()


result = recognize_image_url("https://example.com/photo.jpg")
print(result["result"])
```

### 响应格式

成功：

```json
{
  "result": "【图片文字】\n...\n\n【图片描述】\n...",
  "model": "qwen3.5-flash",
  "image_size": 12345
}
```

超限：

```json
{"error": {"message": "免费识图 API 每日调用次数已达上限（20次/天）", "code": "daily_limit_exceeded"}}
```

### 请求字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `image` | 是 | 图片 base64 字符串，支持裸 base64 或完整 data URL |
| `mime_type` | 否 | 当 `image` 为裸 base64 时指定 MIME 类型，默认 `image/jpeg` |
