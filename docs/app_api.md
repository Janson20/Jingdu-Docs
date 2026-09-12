# 净读 AI 助手 App 接口文档

**Base URL**: `https://jingdu.qzz.io`

**字符编码**: UTF-8

**Content-Type**:
- 普通请求: `application/json`
- 文件上传: `multipart/form-data`
- 流式响应: `text/event-stream`

---

## 目录

1. [认证](#1-认证)
2. [全局配置](#2-全局配置)
3. [用户信息](#3-用户信息)
4. [AI 服务开关](#4-ai-服务开关)
5. [免费模式状态](#5-免费模式状态)
6. [AI 聊天（流式 SSE）](#6-ai-聊天流式-sse)
7. [FIM 补全](#7-fim-补全)
8. [文件上传解析](#8-文件上传解析)
9. [聊天历史管理](#9-聊天历史管理)
10. [章节概括](#10-章节概括)
11. [PPTX 下载](#11-pptx-下载)
12. [积分系统](#12-积分系统)
13. [每日任务](#13-每日任务)
14. [使用统计](#14-使用统计)
15. [开发者 API Key](#15-开发者-api-key)
16. [附录](#16-附录)

---

## 认证方式

所有**需要登录**的接口在 HTTP 头携带：

```
Authorization: Bearer <token>
```

Token 通过 `POST /api/app/auth/login` 获取，默认有效期 **30 天**（2592000 秒）。
Token 格式: `base64_json.sha256_signature`（服务端实现细节，App 端无需关心）。

### 响应统一格式

**成功**:
```json
{"success": true, "data": { ... }}
```

**失败**:
```json
{
  "success": false,
  "error": {
    "code": "error_code_string",
    "message": "人类可读的错误描述"
  }
}
```

---

## 1. 认证

### POST /api/app/auth/register

注册新账号。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 2~50 字符，会经过敏感词过滤 |
| password | string | 是 | 至少 6 字符 |
| email | string | 否 | 合法邮箱格式，选填 |

```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com"
}
```

**Response 201**:

| 字段 | 类型 | 说明 |
|------|------|------|
| token | string | Bearer token，有效期 30 天 |
| expires_in | int | 过期秒数 (2592000) |
| user.uuid | string | 用户 UUID |
| user.username | string | 用户名 |

```json
{
  "success": true,
  "data": {
    "token": "eyJ1c2VyX2lkIj...abc123signature",
    "expires_in": 2592000,
    "user": {
      "uuid": "a1b2c3d4e5f6...",
      "username": "testuser"
    }
  }
}
```

**错误**:
- `invalid_param` (400) — 用户名太短/密码太短
- `register_failed` (400) — 用户名已存在/邮箱已注册

---

### POST /api/app/auth/login

用户名密码登录。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 注册时的用户名 |
| password | string | 是 | 密码 |

```json
{
  "username": "testuser",
  "password": "123456"
}
```

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| token | string | Bearer token |
| expires_in | int | 过期秒数 |
| user.uuid | string | 用户 UUID |
| user.username | string | 用户名 |
| user.avatar | string | 头像 URL，默认为空字符串 |
| user.description | string | 用户简介，默认为空字符串 |

```json
{
  "success": true,
  "data": {
    "token": "eyJ1c2VyX2lkIj...abc123signature",
    "expires_in": 2592000,
    "user": {
      "uuid": "a1b2c3d4e5f6...",
      "username": "testuser",
      "avatar": "",
      "description": ""
    }
  }
}
```

**错误**: `auth_failed` (401) — 用户名或密码错误

---

### POST /api/app/auth/refresh

刷新 token。**需要验证旧 token**（在 Authorization 头中携带），旧 token 被吊销。

**Request**: 无需 body

**Response 200**:

```json
{
  "success": true,
  "data": {
    "token": "new_token_string...",
    "expires_in": 2592000
  }
}
```

---

### POST /api/app/auth/logout

登出，吊销当前 token。

**Request**: 无需 body

**Response 200**:

```json
{"success": true}
```

---

## 2. 全局配置

### GET /api/app/config

获取 App 启动时需要的全部配置。**无需登录**，App 应在启动时调用一次并缓存。

**Response 200**:

| 顶级字段 | 类型 | 说明 |
|----------|------|------|
| ai_models | array | 可选 AI 模型列表 |
| vision_models | array[string] | 支持图片输入的模型 ID 列表 |
| personas | array | 人设列表（含 system_prompt 和示例提问） |
| max_rounds | int | 单次会话最大对话轮数 (50) |
| max_file_size | int | 文档上传大小上限 (10485760 = 10MB) |
| max_image_size | int | 图片上传大小上限 (20971520 = 20MB) |
| free_daily_limit | int | 免费模式每日上限 (40) |
| free_hourly_limit | int | 免费模式每小时上限 (10) |
| subscription_plans | object | 订阅方案配置 |
| task_rewards | object | 每日任务配置 |

**完整响应示例**:

```json
{
  "success": true,
  "data": {
    "ai_models": [
      {"id": "deepseek-flash", "name": "DeepSeek-V4.1-Flash"},
      {"id": "deepseek-v4-pro", "name": "DeepSeek V4 Pro"},
      {"id": "qwen3.7-plus", "name": "Qwen3.7 Plus"},
      {"id": "qwen3.6-flash", "name": "Qwen3.6 Flash"},
      {"id": "qwen3.5-flash", "name": "Qwen3.5 Flash"},
      {"id": "qwen3.7-max", "name": "Qwen3.7 Max"}
    ],
    "vision_models": ["deepseek-flash", "qwen3.7-plus", "qwen3.6-flash", "qwen3.5-flash"],
    "personas": [
      {
        "id": "writing",
        "name": "全能写作助手",
        "system_prompt": "你是一名专业写作助手，精通商务邮件、学术论文、营销文案、创意故事等文体。你能根据用户需求调整语气（正式、亲切、幽默），对已有文本进行润色、重构并提供修改说明，也能从零生成内容。请保持清晰、准确，避免生成违法、侵权或有害信息，始终以鼓励的态度交流。",
        "questions": [
          "请帮我润色这封求职邮件，让它更专业、诚恳。",
          "我想写一篇关于远程办公的公众号文章，能给我三个开头灵感吗？",
          "这段产品描述太枯燥了，怎样改得让人眼前一亮？"
        ]
      },
      {
        "id": "coding",
        "name": "编程随行导师",
        "system_prompt": "你是一位经验丰富的编程导师，精通 Python、JavaScript、Java、Web 开发、数据库等。用通俗语言解释复杂概念，帮助调试代码、优化算法、学习最佳实践。提供代码示例时务必加注释并确保可运行；对报错要分析原因并给出修复方案。只提供教学和指导，不帮助作弊或非法入侵。请耐心引导，多问启发式问题。",
        "questions": [
          "我的 Python 代码报错 IndexError: list index out of range，该怎么排查？",
          "能用一个简单的比喻解释一下 React 的虚拟 DOM 吗？",
          "想零基础学编程，先学 Python 还是 JavaScript？为什么？"
        ]
      },
      {
        "id": "learning",
        "name": "高效学习教练",
        "system_prompt": "你是一名学习策略专家，精通费曼学习法、间隔重复、主动回忆、康奈尔笔记等技巧。根据用户的考试/技能目标，制定分阶段学习计划，并教授适合的笔记和记忆方法。回答需结构清晰、可操作，鼓励用户建立成长心态，避免夸大效果。",
        "questions": [
          "我要在2个月内备考雅思7分，帮我定制一份每周学习计划。",
          "总是学了就忘，如何用间隔重复法高效记单词？",
          "怎样在阅读专业书籍时做出真正有用的笔记？"
        ]
      },
      {
        "id": "companion",
        "name": "心灵树洞伙伴",
        "system_prompt": "你是一位富有同理心的倾听者，基于积极心理学和认知行为疗法原则提供情绪支持。你能引导用户识别情绪、挑战消极想法、进行正念或呼吸练习。但你不是执业心理咨询师，若察觉严重心理危机，必须温和建议寻求专业帮助。保持无评判的温暖语气，绝不提供诊断或药物建议。",
        "questions": [
          "最近频繁加班压力很大，能带我做一个5分钟的呼吸放松练习吗？",
          "我总是否定自己的成就，该如何调整这种心态？",
          "和好朋友闹矛盾了，心里很难受，想跟你聊一聊。"
        ]
      },
      {
        "id": "fitness",
        "name": "私人健身顾问",
        "system_prompt": "你是一名认证健身教练，可根据用户的身体状况、目标（增肌/减脂/体能）和可用器械，设计安全、个性化的训练计划，包括力量、有氧和柔韧性训练。讲解动作要领、呼吸节奏和常见错误。务必强调热身与整理运动，不提供医疗建议，有伤病请嘱用户咨询医生。请用激励但不施压的语气沟通。",
        "questions": [
          "只有一副哑铃，想兼顾增肌和减脂，帮我排一份一周训练表。",
          "深蹲时膝盖总是不舒服，可能是哪里做错了？",
          "推荐几个在办公室就能做的缓解肩颈酸痛的拉伸动作。"
        ]
      },
      {
        "id": "legal",
        "name": "法律百事通",
        "system_prompt": "你是一位熟悉中国法律法规的法律信息助手，可解释法律概念、分析常见情境、指导法律文书（合同、起诉状等）的基本撰写。所有回答必须在开头或结尾说明\"本回复仅为法律信息分享，不构成正式法律意见，具体案件请咨询律师\"。回答严谨、依据法条，注意保护用户隐私。",
        "questions": [
          "签租房合同时，哪些条款要特别警惕？帮我列个审查清单。",
          "遭遇电信诈骗，被骗了几千块，该如何正确报案和维权？",
          "和朋友合伙开公司，股权分配上容易踩哪些法律坑？"
        ]
      },
      {
        "id": "nutrition",
        "name": "营养饮食规划师",
        "system_prompt": "你是一名注册营养师，根据用户的健康目标、过敏原、口味和预算，定制个性化饮食计划与食谱。提供营养知识，解析食物搭配原理。强调均衡、可持续的饮食观，反对极端节食。不诊断或治疗进食障碍，如有风险迹象会建议就医。回答时充满鼓励，注重食材的易得性。",
        "questions": [
          "给一份适合学生党的一周减脂食谱，预算有限、尽量简单。",
          "我是纯素食者，怎么吃才能保证蛋白质足量？",
          "明知该吃健康餐，但就是控制不住嘴馋，有什么科学有效的方法？"
        ]
      },
      {
        "id": "career",
        "name": "职场领航者",
        "system_prompt": "你是一位资深职业规划师兼 HR 专家。提供简历优化、面试模拟、职业路径规划、职场沟通与领导力建议。根据用户背景和行业趋势给出具体可行的步骤。在面试模拟中，你将扮演面试官，最后给出表现反馈。请积极发现用户优势，避免对特定公司妄加评判。",
        "questions": [
          "我想从技术岗转到管理岗，简历上应该突出什么？",
          "请模拟一次产品经理面试，你当面试官，向我提问。",
          "工作5年，感觉进入了瓶颈期，如何规划下一个5年？"
        ]
      },
      {
        "id": "travel",
        "name": "旅行智囊团",
        "system_prompt": "你是一位懂生活、懂省钱的环球旅行顾问。能根据偏好（自然/文化/美食/探险）、时间和预算，推荐目的地并规划详细行程，提供交通、住宿、签证和实用打包建议。信息力求准确，但需提醒用户出行前核实实时政策与航班。用热情、细致的风格交流，时常分享隐藏玩法。",
        "questions": [
          "7月去云南玩8天，人均预算5000元，推荐一条不累又好玩的路线。",
          "第一次带父母出国游，去哪个国家比较轻松？给个大致的行程框架。",
          "一个人背包去东南亚，有哪些既省钱又安全的住宿妙招？"
        ]
      },
      {
        "id": "lifehack",
        "name": "生活妙招管家",
        "system_prompt": "你是一名生活效率专家，擅长家居收纳、时间管理、理财小技巧和数字工具运用。你提供的妙招简单、低成本、可立刻执行。回答以清单和步骤为主，生动简洁。鼓励用户分享自己的小窍门，营造轻松互助的氛围。",
        "questions": [
          "如何用手机自带App搭建一个超简单的每日待办系统？",
          "小户型太乱了，分享几个不花钱的收纳妙招。",
          "总是拖延重要的工作，教我几个立刻能用的时间管理技巧。"
        ]
      }
    ],
    "max_rounds": 50,
    "max_file_size": 10485760,
    "max_image_size": 20971520,
    "free_daily_limit": 40,
    "free_hourly_limit": 10,
    "subscription_plans": {
      "month": {"name": "月卡", "price": 2800, "daily": 120, "days": 30},
      "quarter": {"name": "季卡", "price": 8800, "daily": 140, "days": 90},
      "year": {"name": "年卡", "price": 35000, "daily": 160, "days": 365}
    },
    "task_rewards": {
      "chat":             {"reward": 3,  "name": "和模型对话",       "threshold": 1},
      "file_chat":        {"reward": 5,  "name": "上传文件与模型对话", "threshold": 1},
      "pro_model":        {"reward": 5,  "name": "体验高级模型",       "threshold": 1},
      "daily_credits":    {"reward": 5,  "name": "积分消耗家",         "threshold": 20},
      "model_variety":    {"reward": 8,  "name": "模型探索家",         "threshold": 3},
      "daily_rounds":     {"reward": 12, "name": "对话达人",           "threshold": 10}
    }
  }
}
```

**App 启动流程建议**:
1. 调用 `GET /api/app/config` 获取配置
2. 检查本地是否缓存了有效 token
3. 如果 token 有效，调用 `GET /api/app/profile` 加载用户信息
4. 如果 token 过期，调 `POST /api/app/auth/refresh`
5. 如果 refresh 失败，跳转登录页

---

## 3. 用户信息

### GET /api/app/profile

获取当前登录用户的完整信息。**需要登录**。

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| uuid | string | 用户 UUID |
| username | string | 用户名 |
| email | string | 绑定的邮箱，可能为空 |
| email_verified | bool | 邮箱是否已验证 |
| avatar | string | 头像 URL |
| description | string | 个人简介 |
| titles | array[string] | 用户头衔列表，如 `["净读用户"]` |
| balance | int | 当前积分余额 |
| level | int | 等级数字 (1~100) |
| level_name | string | 等级名称，如 "青铜"、"白银"、"黄金" |
| level_color | string | 等级颜色十六进制，如 `"#cd7f32"` |
| exp | int | 当前经验值 |
| exp_to_next | int | 距下一级还需经验值 |
| checked_in_today | bool | 今日是否已签到 |
| subscriptions | object | 订阅信息，键为 plan_type，值为详情 |
| tasks | object | 今日任务进度，键为任务类型 |

**subscriptions 详情**:

| 字段 | 类型 | 说明 |
|------|------|------|
| expires_at | string | 过期日期 ISO，如 `"2026-08-25"` |
| last_claimed_date | string | 最后领取日期，如 `"2026-07-25"` |
| is_expired | bool | 是否已过期 |
| can_claim_today | bool | 今日是否可领取每日积分 |

**tasks 详情**:

| 字段 | 类型 | 说明 |
|------|------|------|
| count | int | 当前完成次数 |
| claimed | bool | 是否已领取奖励 |
| reward | int | 奖励积分 |
| name | string | 任务名称 |

```json
{
  "success": true,
  "data": {
    "uuid": "a1b2c3d4e5f6...",
    "username": "testuser",
    "email": "test@example.com",
    "email_verified": true,
    "avatar": "https://jingdu.qzz.io/static/images/default_avatar.png",
    "description": "热爱阅读的一个人",
    "titles": ["净读用户", "读书达人"],
    "balance": 150,
    "level": 3,
    "level_name": "白银",
    "level_color": "#c0c0c0",
    "exp": 230,
    "exp_to_next": 70,
    "checked_in_today": false,
    "subscriptions": {
      "month": {
        "expires_at": "2026-08-25",
        "last_claimed_date": "2026-07-24",
        "is_expired": false,
        "can_claim_today": true
      }
    },
    "tasks": {
      "chat":          {"count": 2, "claimed": true,  "reward": 3,  "name": "和模型对话"},
      "file_chat":     {"count": 0, "claimed": false, "reward": 5,  "name": "上传文件与模型对话"},
      "pro_model":     {"count": 0, "claimed": false, "reward": 5,  "name": "体验高级模型"},
      "daily_credits": {"count": 15,"claimed": false, "reward": 5,  "name": "积分消耗家"},
      "model_variety": {"count": 2, "claimed": false, "reward": 8,  "name": "模型探索家"},
      "daily_rounds":  {"count": 2, "claimed": false, "reward": 12, "name": "对话达人"}
    }
  }
}
```

---

## 4. AI 服务开关

### POST /api/app/service/enable

开启当前用户的 AI 服务。**每个登录用户首次使用前必须调用一次**。

**Request**: 无需 body

**Response 200**:

```json
{"success": true, "data": {"enabled": true}}
```

---

## 5. 免费模式状态

### GET /api/app/free/status

获取当前 IP 的免费模式剩余次数。**无需登录**。由客户端 IP 地址识别限制。

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| daily_remaining | int | 今日剩余次数 |
| hourly_remaining | int | 本小时剩余次数 |
| daily_limit | int | 每日总上限 (40) |
| hourly_limit | int | 每小时总上限 (10) |

```json
{
  "success": true,
  "data": {
    "daily_remaining": 35,
    "hourly_remaining": 8,
    "daily_limit": 40,
    "hourly_limit": 10
  }
}
```

---

## 6. AI 聊天（流式 SSE）

### POST /api/app/chat/send

**核心接口**。使用 SSE (Server-Sent Events) 流式返回 AI 回复。**需要登录**。

**Content-Type**: `application/json`

**Response Content-Type**: `text/event-stream`

---

#### Request 字段

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| message | string | 否* | "" | 用户输入的文本消息。如果 `images` 不为空，此字段可为空 |
| model | string | 否 | "deepseek-flash" | 模型 ID，见 config 接口的 ai_models |
| mode | string | 否 | "html" | `"html"` 正常模式，`"pptx"` 生成 PPTX 演示文稿 |
| book_search | bool | 否 | false | 是否允许 AI 搜索净读书库 |
| history | array | 否 | [] | 历史消息数组，每条格式 `{content: string, isUser: bool}` |
| system_prompt | string | 否 | "" | 人设提示词，从 persona 的 system_prompt 字段获取 |
| images | array | 否 | [] | Base64 Data URL 数组，仅 vision_models 支持 |
| session_id | string | 否 | null | 聊天会话 ID，传此值会自动保存对话到历史记录 |
| file_attached | bool | 否 | false | 本次消息是否附带了文件内容 |
| deep_think | bool | 否 | false | 当 model 为 deepseek-flash 时设为 true 自动切换为 deepseek-v4-pro |

**models 说明**:

| id | 提供商 | 说明 |
|----|--------|------|
| deepseek-flash | DeepSeek | DeepSeek-V4.1-Flash，默认模型；由原 V4 Flash 与 V4 Flash Vision 合并升级，同时支持通用对话与图片输入 |
| deepseek-v4-pro | DeepSeek | 深度思考，适合复杂推理 |
| qwen3.7-plus | Qwen | 通义千问增强版，支持图片 |
| qwen3.6-flash | Qwen | 通义千问快速版，支持图片 |
| qwen3.5-flash | Qwen | 通义千问轻量版，支持图片 |
| qwen3.7-max | Qwen | 通义千问最大模型，不支持图片 |

**Request 示例**:

```json
{
  "message": "用 Python 写一个二分查找算法",
  "model": "deepseek-flash",
  "mode": "html",
  "history": [
    {"content": "你会写代码吗？", "isUser": true},
    {"content": "是的，我可以帮您编写各种编程代码。请问您需要什么语言？", "isUser": false}
  ],
  "system_prompt": "你是一位经验丰富的编程导师...",
  "session_id": "abc123sessionid"
}
```

**带图片的 Request 示例**:

```json
{
  "message": "这张图里有什么？",
  "model": "qwen3.7-plus",
  "images": ["data:image/jpeg;base64,/9j/4AAQ..."],
  "session_id": "abc123sessionid"
}
```

---

#### SSE 响应格式

响应是 `text/event-stream`，每行以 `data: ` 开头，每条消息以 `\n\n` 分隔。

**App 端消费方式**:
- Android: 使用 `OkHttp` 或 `EventSource` 库逐行读取
- iOS: 使用 `URLSession` 的 `stream` delegate 或 `NSStream`
- Flutter: 使用 `dart:io` 的 `HttpClient` 逐行读取
- React Native: 使用 `fetch` + `ReadableStream` 或 `react-native-sse`

**事件类型**:

##### 1. 普通内容块（最频繁）

```json
data: {"choices":[{"delta":{"content":"我可以"}}]}

data: {"choices":[{"delta":{"content":"为您"}}]}

data: {"choices":[{"delta":{"content":"编写"}}]}
```

App 端应将所有 `delta.content` 片段按顺序拼接，得到完整文本。

##### 2. 思考过程（仅 DeepSeek V4 Pro）

```json
data: {"choices":[{"delta":{"reasoning_content":"让我想想"}}]}

data: {"choices":[{"delta":{"reasoning_content":"这个问题需要"}}]}

data: {"choices":[{"delta":{"reasoning_content":"先分析边界条件"}}]}
```

`reasoning_content` 和 `content` 会交替出现。App 端应分别拼接：`reasoningContent += delta.reasoning_content`、`content += delta.content`。

##### 3. 错误事件

```json
data: {"error":"API返回错误: 401 Unauthorized"}
```

出现此事件时立即停止读取。

##### 4. PPTX 生成状态（仅 mode="pptx"）

```json
data: {"pptx_status":"generating"}
```

每隔约 200 字符发送一次，表示 AI 正在收集 YAML 内容生成 PPTX。

##### 5. 结束事件（最后一个有效事件）

```json
data: {"done":true,"cost":5,"new_balance":145,"return_amount":1,"input_tokens":120,"output_tokens":80,"peak":false,"peak_multiplier":1.0}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| cost | int | 本次消耗积分 |
| new_balance | int | 扣除后余额 |
| return_amount | int | 等级返还积分 |
| input_tokens | int | 输入 tokens 数 |
| output_tokens | int | 输出 tokens 数 |
| peak | bool | 是否高峰时段 |
| peak_multiplier | float | 高峰倍率 |

**PPTX 模式额外字段**:

```json
{
  "done": true,
  "cost": 15,
  "new_balance": 135,
  "pptx_result": {
    "success": true,
    "pptx_filename": "abc123.pptx",
    "pptx_url": "/api/app/chat/ppt/download/abc123.pptx"
  },
  "pptx_additional_cost": 10
}
```

##### 6. 终止标记

```json
data: [DONE]
```

收到此标记后关闭连接。

---

#### App 端 SSE 解析流程（伪代码）

```
let content = ""
let reasoningContent = ""

async function chatSend(requestBody) {
  const response = await fetch("/api/app/chat/send", {
    method: "POST",
    headers: {"Authorization": "Bearer <token>", "Content-Type": "application/json"},
    body: JSON.stringify(requestBody)
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const {done, value} = await reader.read()
    if (done) break

    buffer += decoder.decode(value, {stream: true})

    while (buffer.contains("\n")) {
      const line = buffer.substring(0, buffer.indexOf("\n")).trim()
      buffer = buffer.substring(buffer.indexOf("\n") + 1)

      if (!line.startsWith("data: ")) continue

      const dataStr = line.substring(6)
      if (dataStr === "[DONE]") return

      const data = JSON.parse(dataStr)

      if (data.error) {
        showError(data.error)
        return
      }

      if (data.done) {
        onDone(data)
        return
      }

      if (data.pptx_status === "generating") {
        showPptxStatus()
        continue
      }

      const choices = data.choices || []
      if (choices.length > 0) {
        const delta = choices[0].delta || {}
        if (delta.reasoning_content) {
          reasoningContent += delta.reasoning_content
          updateReasoningUI(reasoningContent)
        }
        if (delta.content) {
          content += delta.content
          updateContentUI(content)
        }
      }
    }
  }
}
```

---

#### 错误响应

| 错误码 | HTTP | 说明 |
|--------|------|------|
| service_disabled | 403 | AI 服务未开启，先调 `/api/app/service/enable` |
| insufficient_credits | 403 | 积分不足，引导用户签到/充值 |
| api_error | 500 | AI API 调用失败 |
| invalid_param | 400 | 消息为空 |

---

## 7. FIM 补全

### POST /api/app/chat/fim

Fill-in-the-Middle 补全。**需要登录**，**仅支持 DeepSeek 模型**。

**Request**:

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | "deepseek-flash" | 必须为 DeepSeek 系列 |
| prompt | string | 是 | - | 开头内容，最长 1000 字符（含 suffix） |
| suffix | string | 否 | "" | 结尾内容，可选 |

```json
{
  "model": "deepseek-flash",
  "prompt": "def binary_search(arr, target):",
  "suffix": "return -1"
}
```

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| response | string | AI 补全的内容（不含前缀和后缀） |
| cost | int | 消耗积分 |
| usage.input_tokens | int | 输入 tokens |
| usage.output_tokens | int | 输出 tokens |
| new_balance | int | 扣除后余额 |

```json
{
  "success": true,
  "data": {
    "response": "\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    ",
    "cost": 2,
    "usage": {"input_tokens": 15, "output_tokens": 72},
    "new_balance": 148
  }
}
```

---

## 8. 文件上传解析

### POST /api/app/chat/upload

上传文件并解析为文本（或图片返回 Base64）。**需要登录**。

**Content-Type**: `multipart/form-data`

**表单字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | 文件二进制数据 |

---

#### 支持的文件类型

**文档类**（解析为文本）:

| 扩展名 | 文件类型 | 引擎 |
|--------|----------|------|
| .pdf | PDF文档 | PyMuPDF |
| .docx, .doc | Word文档 | python-docx |
| .xlsx, .xls | Excel表格 | openpyxl |

**代码/文本类**（直接读取为文本）:
.py, .js, .ts, .html, .css, .java, .cpp, .c, .h, .hpp, .cs, .go, .rs, .rb, .php, .swift, .kt, .scala, .m, .sh, .bash, .sql, .r, .pl, .lua, .json, .xml, .yaml, .yml, .toml, .md, .txt, .ini, .cfg, .conf

**图片类**（不解析，返回 Base64 Data URL）:
.jpg, .jpeg, .png, .gif, .webp, .bmp

**文件大小限制**:
- 文档/代码: **10MB**
- 图片: **20MB**

---

#### Response（文档/代码）

| 字段 | 类型 | 说明 |
|------|------|------|
| filename | string | 原始文件名 |
| file_type | string | 文件类型描述，如 "Python代码"、"PDF文档" |
| content | string | 解析出的文本内容（最多 100 万字符） |
| content_length | int | 文本长度 |
| extension | string | 文件扩展名，如 "py"、"pdf" |
| is_image | bool | false |

```json
{
  "success": true,
  "data": {
    "filename": "example.py",
    "file_type": "Python代码",
    "content": "def hello():\n    print('Hello')\n",
    "content_length": 38,
    "extension": "py",
    "is_image": false
  }
}
```

#### Response（图片）

| 字段 | 类型 | 说明 |
|------|------|------|
| filename | string | 原始文件名 |
| file_type | string | "图片" |
| extension | string | 扩展名 |
| is_image | bool | true |
| data_url | string | Base64 Data URL，可直接用于 `<img>` 或传入 chat/send 的 images 数组 |

```json
{
  "success": true,
  "data": {
    "filename": "photo.jpg",
    "file_type": "图片",
    "extension": "jpg",
    "is_image": true,
    "data_url": "data:image/jpeg;base64,/9j/4AAQ..."
  }
}
```

**App 端注意事项**:
1. 文档/代码上传后，将 `content` 拼接到用户的 `message` 中发送给 AI
2. 图片上传后，将 `data_url` 放入 `/api/app/chat/send` 的 `images` 数组
3. 文档/代码上传后设置 `file_attached: true` 以触发文件对话任务计数

---

## 9. 聊天历史管理

聊天会话（Session）是消息的容器。一个 Session 包含多条 Message。
**所有接口需要登录**。

### GET /api/app/chat/history

获取当前用户的会话列表，按最后更新时间降序排列。

**Query Parameters**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码，从 1 开始 |
| per_page | int | 20 | 每页条数，最大 100 |

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| sessions | array | 会话列表 |
| total | int | 会话总数 |
| page | int | 当前页码 |
| per_page | int | 每页条数 |

**session 对象**:

| 字段 | 类型 | 说明 |
|------|------|------|
| session_id | string | 会话 UUID |
| title | string | 会话标题 |
| model | string | 使用的模型 ID |
| message_count | int | 消息总数 |
| total_cost | int | 累计消耗积分 |
| created_at | string | 创建时间 ISO |
| updated_at | string | 最后更新时间 ISO |

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "session_id": "a1b2c3d4...",
        "title": "Python 学习",
        "model": "deepseek-flash",
        "message_count": 6,
        "total_cost": 8,
        "created_at": "2026-07-25T10:00:00",
        "updated_at": "2026-07-25T10:30:00"
      }
    ],
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}
```

### POST /api/app/chat/history

创建新会话。

**Request**:

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| model | string | 否 | "deepseek-flash" | 模型 ID |
| title | string | 否 | "新对话" | 会话标题 |

```json
{"model": "deepseek-flash", "title": "Python 学习"}
```

**Response 201**:

```json
{"success": true, "data": {"session_id": "a1b2c3d4..."}}
```

### GET /api/app/chat/history/`<session_id>`

获取单个会话的详细信息及所有消息。

**Path Parameters**: `session_id` — 会话 UUID

**Response 200**:

**session 对象**: 同上

**messages 数组**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 消息 ID |
| role | string | "user" 或 "assistant" |
| content | string | 消息文本 |
| reasoning_content | string | 思考过程文本（assistant 特有） |
| file_info | object | 文件信息 JSON，可为 null |
| input_tokens | int | 输入 tokens（assistant 特有） |
| output_tokens | int | 输出 tokens（assistant 特有） |
| cost | int | 消耗积分（assistant 特有） |
| created_at | string | 创建时间 ISO |

```json
{
  "success": true,
  "data": {
    "session": {
      "session_id": "a1b2c3d4...",
      "title": "Python 学习",
      "model": "deepseek-flash",
      "message_count": 2,
      "total_cost": 3,
      "created_at": "2026-07-25T10:00:00",
      "updated_at": "2026-07-25T10:05:00"
    },
    "messages": [
      {
        "id": "msg1",
        "role": "user",
        "content": "用 Python 写一个二分查找",
        "reasoning_content": null,
        "file_info": null,
        "input_tokens": 0,
        "output_tokens": 0,
        "cost": 0,
        "created_at": "2026-07-25T10:00:05"
      },
      {
        "id": "msg2",
        "role": "assistant",
        "content": "以下是二分查找的实现...",
        "reasoning_content": "让我想想这个算法的边界条件...",
        "file_info": null,
        "input_tokens": 25,
        "output_tokens": 120,
        "cost": 3,
        "created_at": "2026-07-25T10:00:08"
      }
    ]
  }
}
```

### PUT /api/app/chat/history/`<session_id>`

更新会话。可修改标题、追加消息。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 否 | 修改标题 |
| messages | array | 否 | 追加的消息数组 |

**message 对象**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| role | string | 是 | "user" 或 "assistant" |
| content | string | 是 | 消息文本 |
| reasoning_content | string | 否 | 思考过程 |
| file_info | object | 否 | 文件信息 |
| input_tokens | int | 否 | 输入 tokens |
| output_tokens | int | 否 | 输出 tokens |
| cost | int | 否 | 消耗积分 |

```json
{
  "title": "新标题",
  "messages": [
    {"role": "user", "content": "你好"},
    {"role": "assistant", "content": "你好！", "cost": 1, "input_tokens": 10, "output_tokens": 20}
  ]
}
```

**Response 200**: `{"success": true}`

### DELETE /api/app/chat/history/`<session_id>`

删除会话及所有消息。

**Response 200**: `{"success": true}`

---

## 10. 章节概括

### POST /api/app/chat/prepare-summary

准备单章概括。从书籍中读取指定章节内容。**需要登录且 AI 服务已开启**。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| book_id | string | 是 | 书籍 UUID |
| chapter | string | 是 | 章节号，如 "1"、"2" |
| book_title | string | 否 | 书名，用于显示 |
| chapter_title | string | 否 | 章节标题，用于显示 |

```json
{
  "book_id": "book123",
  "chapter": "1",
  "book_title": "Python 入门",
  "chapter_title": "第一章 基础"
}
```

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| book_title | string | 书名 |
| chapter_title | string | 章节标题 |
| content_length | int | 章节内容字符数 |

```json
{
  "success": true,
  "data": {
    "book_title": "Python 入门",
    "chapter_title": "第一章 基础",
    "content_length": 5432
  }
}
```

### POST /api/app/chat/prepare-book-summary

准备全书概括。读取书籍所有章节信息。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| book_id | string | 是 | 书籍 UUID |
| book_title | string | 否 | 书名 |

```json
{"book_id": "book123", "book_title": "Python 入门"}
```

**Response 200**:

```json
{
  "success": true,
  "data": {
    "book_title": "Python 入门",
    "chapter_title": "全书（共10章）",
    "total_chapters": 10
  }
}
```

---

## 11. PPTX 下载

### GET /api/app/chat/ppt/download/`<filename>`

下载之前通过 PPTX 模式生成的演示文稿文件。**需要登录**。

**Path Parameters**: `filename` — 文件名字符串，必须以 `.pptx` 结尾

**Response**: 文件二进制流，`Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation`，`Content-Disposition: attachment`

---

## 12. 积分系统

### GET /api/app/balance

获取当前积分余额。**需要登录**。

```json
{"success": true, "data": {"balance": 150}}
```

### POST /api/app/checkin

每日签到，获得 **5** 积分。每日仅限一次。**需要登录**。

```json
// 成功
{"success": true, "data": {"message": "签到成功，获得5积分", "balance": 155}}

// 已签到
{"success": false, "error": {"code": "already_checked_in", "message": "今日已签到"}}
```

### POST /api/app/redeem

使用兑换码兑换积分。**需要登录**。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 兑换码，不区分大小写，服务端自动转大写 |

```json
{"code": "ABCD1234"}
```

```json
// 成功
{"success": true, "data": {"message": "兑换成功，获得 100 积分", "new_balance": 250}}

// 失败
{"success": false, "error": {"code": "redeem_failed", "message": "兑换码不存在"}}
```

### POST /api/app/subscribe

购买订阅套餐。**需要登录**。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| plan_type | string | 是 | `"month"` / `"quarter"` / `"year"` |

**plan_type 说明**:

| 值 | 价格 | 每日积分 | 天数 |
|----|------|----------|------|
| month | 2800 | 120 | 30 |
| quarter | 8800 | 140 | 90 |
| year | 35000 | 160 | 365 |

```json
{"plan_type": "month"}
```

```json
// 成功
{
  "success": true,
  "data": {
    "message": "成功开通月卡，有效期至 2026-08-25，余额剩余 7200 积分",
    "new_balance": 7200,
    "subscriptions": {
      "month": {
        "expires_at": "2026-08-25",
        "last_claimed_date": null,
        "is_expired": false,
        "can_claim_today": true
      }
    }
  }
}

// 积分不足
{"success": false, "error": {"code": "purchase_failed", "message": "积分不足，当前余额 500，需要 2800 积分"}}
```

### POST /api/app/subscription/claim

领取订阅的每日积分奖励。**需要登录**。

**Request**:

```json
{"plan_type": "month"}
```

```json
// 成功
{
  "success": true,
  "data": {
    "message": "领取成功，获得 120 积分",
    "reward": 120,
    "new_balance": 7320,
    "subscriptions": {
      "month": {
        "expires_at": "2026-08-25",
        "last_claimed_date": "2026-07-25",
        "is_expired": false,
        "can_claim_today": false
      }
    }
  }
}

// 已领取
{"success": false, "error": {"code": "claim_failed", "message": "今日已领取"}}
```

---

## 13. 每日任务

### GET /api/app/tasks

获取今日任务进度。**需要登录**。

**Response 200**:

```json
{
  "success": true,
  "data": {
    "tasks": {
      "chat":          {"count": 2, "claimed": true,  "reward": 3,  "name": "和模型对话"},
      "file_chat":     {"count": 0, "claimed": false, "reward": 5,  "name": "上传文件与模型对话"},
      "pro_model":     {"count": 0, "claimed": false, "reward": 5,  "name": "体验高级模型"},
      "daily_credits": {"count": 15,"claimed": false, "reward": 5,  "name": "积分消耗家"},
      "model_variety": {"count": 2, "claimed": false, "reward": 8,  "name": "模型探索家"},
      "daily_rounds":  {"count": 2, "claimed": false, "reward": 12, "name": "对话达人"}
    }
  }
}
```

**任务完成条件**:

| 任务 | 需要条件 | 阈值 |
|------|----------|------|
| chat | 对话次数 >= 1 | 1 |
| file_chat | 带文件对话次数 >= 1 | 1 |
| pro_model | 使用 deepseek-v4-pro 次数 >= 1 | 1 |
| daily_credits | 累计消耗积分 >= 20 | 20 |
| model_variety | 使用不同模型数 >= 3 | 3 |
| daily_rounds | 对话轮数 >= 10 | 10 |

### POST /api/app/tasks/claim

领取任务奖励。**需要登录**。

**Request**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| task_type | string | 是 | `"chat"` / `"file_chat"` / `"pro_model"` / `"daily_credits"` / `"model_variety"` / `"daily_rounds"` |

```json
{"task_type": "chat"}
```

```json
// 成功
{"success": true, "data": {"message": "领取成功，获得3积分", "earned": 3, "balance": 153}}

// 条件未满足
{"success": false, "error": {"code": "claim_failed", "message": "今日尚未完成任务「和模型对话」"}}

// 已领取
{"success": false, "error": {"code": "claim_failed", "message": "今日任务「和模型对话」奖励已领取"}}
```

---

## 14. 使用统计

### GET /api/app/stats

获取 AI 使用统计概览。**需要登录**。

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| month | object | 本月统计 |
| all_time | object | 全部历史统计 |
| models | array | 各模型细分统计 |
| tier_config | object | 阶梯费率配置 |

```json
{
  "success": true,
  "data": {
    "month": {
      "total_requests": 15,
      "total_credits": 45,
      "total_input_tokens": 3200,
      "total_output_tokens": 1800,
      "total_official_cost": 0.036,
      "tier3_requests": 0
    },
    "all_time": {
      "total_requests": 128,
      "total_credits": 560,
      "total_input_tokens": 45000,
      "total_output_tokens": 28000,
      "total_official_cost": 0.42,
      "tier3_requests": 2
    },
    "models": [
      {
        "model": "deepseek-flash",
        "count": 12,
        "total_cost": 30,
        "total_input": 2800,
        "total_output": 1500,
        "input_l1": 2000,
        "input_l2": 500,
        "input_l3": 300,
        "output_l1": 1000,
        "output_l2": 300,
        "output_l3": 200
      }
    ],
    "tier_config": {
      "tier1": 10000,
      "tier2": 100000
    }
  }
}
```

### GET /api/app/requests

获取 AI 请求历史（分页）。**需要登录**。

**Query Parameters**:

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 |

**Response 200**:

| 字段 | 类型 | 说明 |
|------|------|------|
| requests | array | 请求列表 |
| has_more | bool | 是否有下一页 |
| page | int | 当前页码 |

```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": 1,
        "model": "deepseek-flash",
        "source": "app_chat",
        "input_tokens": 50,
        "output_tokens": 120,
        "cost": 3,
        "timestamp": "2026-07-25T10:00:00"
      }
    ],
    "has_more": false,
    "page": 1
  }
}
```

---

## 15. 开发者 API Key

### GET /api/app/developer/keys

获取当前用户的开发者 API Key 列表（不显示完整 key）。**需要登录**。

```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "id": 1,
        "name": "我的App密钥",
        "key_prefix": "sk-a1b2c3...",
        "rate_limit": 60,
        "is_active": 1,
        "expires_at": null,
        "last_used_at": null,
        "created_at": "2026-07-25T10:00:00"
      }
    ]
  }
}
```

### POST /api/app/developer/keys

创建新的开发者 API Key。**需要登录**。

**Request**:

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | string | 是 | - | 密钥名称 |
| rate_limit | int | 否 | 60 | 每分钟请求上限 |
| expires_days | int | 否 | null | 过期天数，null 为永不过期 |

```json
{"name": "我的App密钥", "rate_limit": 60, "expires_days": 30}
```

**Response 201**: `key` 字段**仅在此返回一次**，App 端需提示用户立即保存。

```json
{
  "success": true,
  "data": {
    "key": "sk-a1b2c3d4e5f6g7h8",
    "message": "请立即保存密钥，之后将无法再次查看"
  }
}
```

### PUT /api/app/developer/keys/`<id>`

更新密钥属性。**需要登录**。

**Request**（可更新以下任一字段）:

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 新名称 |
| rate_limit | int | 新速率限制 |
| is_active | bool | 是否启用 |
| expires_days | int | 过期天数 |

```json
{"name": "新名称", "is_active": false}
```

**Response 200**: `{"success": true}`

### DELETE /api/app/developer/keys/`<id>`

删除密钥。**需要登录**。

**Response 200**: `{"success": true}`

---

## 16. 附录

### 完整错误码表

| code | HTTP | 含义 | 触发场景 |
|------|------|------|----------|
| `unauthorized` | 401 | 未提供认证凭证 | Authorization 头缺失 |
| `token_expired` | 401 | Token 过期或无效 | Token 格式错误、签名不匹配、已过期 |
| `insufficient_credits` | 403 | 积分不足 | 余额 <= 0 时调用 chat/send |
| `service_disabled` | 403 | AI 服务未开启 | 未调 service/enable |
| `invalid_param` | 400 | 参数校验失败 | 必填字段缺失、格式错误 |
| `invalid_model` | 400 | 不支持的模型 | FIM 用了 Qwen 模型 |
| `not_found` | 404 | 资源不存在 | 会话/章节/文件不存在 |
| `forbidden` | 403 | 无权访问 | 操作他人的会话 |
| `file_too_large` | 413 | 文件超过大小限制 | 文件 > 10MB(文档) 或 > 20MB(图片) |
| `unsupported_type` | 413 | 不支持的文件类型 | 上传了不在允许列表中的扩展名 |
| `parse_failed` | 500 | 文件解析失败 | PDF/DOCX 损坏 |
| `already_checked_in` | 400 | 今日已签到 | 重复签到 |
| `register_failed` | 400 | 注册失败 | 用户名/邮箱已存在 |
| `auth_failed` | 401 | 登录失败 | 用户名或密码错误 |
| `redeem_failed` | 400 | 兑换失败 | 兑换码不存在/已使用/已过期 |
| `purchase_failed` | 400 | 购买订阅失败 | 积分不足 |
| `claim_failed` | 400 | 领取失败 | 已领取/条件未满足 |
| `api_error` | 500 | AI API 调用失败 | 上游 API 返回错误 |
| `server_error` | 500 | 服务器内部错误 | 未预期的异常 |

### 积分计算规则（App 端仅展示，不需实现）

```
实付积分 = max(ceil(基础积分 × 模型折扣 × 高峰倍率), 1)
基础积分 = 阶梯计费（超额累进，L1/L2/L3 三级）
模型折扣: DeepSeek 0.29 折 / Qwen 0.9 折
高峰倍率: 北京时间 9:00-12:00 和 14:00-18:00 为 2.0，其余 1.0
```

### 数据模型速览

**user**:
- uuid, username, password, salt, email, email_verified, created_at, policy_agreed_at

**chat_sessions**:
- session_id, user_uuid, title, model, message_count, total_cost, created_at, updated_at

**chat_messages**:
- id, session_id, role, content, reasoning_content, file_info, input_tokens, output_tokens, cost, created_at

### 模型别名映射

| 旧名称（web 端兼容） | 新名称（建议用） |
|----------------------|------------------|
| deepseek-chat | deepseek-flash |
| deepseek-v4-flash | deepseek-flash |
| deepseek-v4-flash-vision-exp | deepseek-flash |
| deepseek-reasoner | deepseek-v4-pro |
| qwen-plus | qwen3.7-plus |
| qwen-flash | qwen3.6-flash |
