# 净币接口

净币是净读站内的独立虚拟积分，与 AI 积分相互独立。全部接口均**需要认证**（网页端使用 Session，移动端使用 Bearer Token）。

> 说明：净币相关 JSON 端点在服务端已登记 CSRF 豁免；网页端由全局 fetch 拦截器自动附带 `X-CSRFToken`。

## 网页端接口

### 净币概览

```
GET /coin/api/summary
```

返回余额、累计获得与消耗、今日签到状态与本月兑换额度。

```json
{
  "success": true,
  "data": {
    "balance": 1150,
    "total_earned": 1150,
    "total_spent": 0,
    "checked_in": true,
    "quota": {
      "month": "2026-10",
      "used": 10,
      "limit": 50,
      "remaining": 40,
      "times": 1,
      "times_limit": 5,
      "coin_cost": 200,
      "ai_credits": 10,
      "total_used": 10
    }
  }
}
```

### 每日签到

```
POST /coin/api/checkin
```

成功返回 `{"success": true, "message": "...", "balance": 1250, "streak": 3, "reward": 100, "achievements": [...]}`；
已完成签到时返回 **400** 与 `{"success": false, "message": "今日已签到"}`。

### 今日任务列表

```
GET /coin/api/tasks
```

返回经验任务（`kind: "exp"`）与 AI 每日任务（`kind: "ai"`）两组，每项包含 `id`、`name`、`reward`、
`progress`、`target`、`done`、`claimed`、`claimable`。

### 领取任务奖励

```
POST /coin/api/tasks/claim
Content-Type: application/json

{"task_kind": "exp", "task_id": "daily_visit"}
```

- `task_kind`：`exp`（站内行为任务）或 `ai`（AI 每日任务）
- 成功：`{"success": true, "message": "...", "reward": 10, "balance": 1160}`
- 失败（未完成 / 已领取 / 参数无效）：**400** 与 `{"success": false, "message": "..."}`

### 成就列表

```
GET /coin/api/achievements
```

返回全部成就的进度与达成状态，以及 `summary`（总数、已完成数、累计获得净币）。
成就为达成即自动发放，无需调用领取接口。

### 净币流水

```
GET /coin/api/ledger?page=1&source=checkin
```

- `page`：页码，每页 30 条
- `source`：可选，按来源筛选，取值见下表

| source | 含义 |
|--------|------|
| `signup` | 注册奖励 |
| `migration` | 存量用户补发 |
| `checkin` | 每日签到 |
| `exp_task` | 站内行为任务 |
| `ai_task` | AI 每日任务 |
| `achievement` | 成就任务 |
| `like` | 内容被点赞 |
| `dislike` | 内容被点踩 |
| `download` | 资源被下载 |
| `announcement` | 公告附件 |
| `vip_purchase` | 购买 VIP 章节 |
| `vip_income` | VIP 章节收益 |
| `exchange` | 兑换 AI 积分 |
| `admin` | 管理员调整 |

### 兑换 AI 积分

```
POST /coin/api/exchange
```

固定档位：200 净币 → 10 AI 积分。每个自然月每用户最多兑换 50 AI 积分。

- 成功：`{"success": true, "message": "...", "balance": 950, "ai_credits": 10, "quota": {...}}`
- 失败（净币不足 / 额度用完）：**400** 与 `{"success": false, "message": "..."}`

## VIP 章节接口

### 查询书籍 VIP 状态（公开）

```
GET /coin/api/vip/<book_id>/status
```

返回 `{enabled, start_chapter, total_chapters, vip_chapters, purchased}`；未开启时 `enabled` 为 `false`。

### 查询 VIP 配置与收益（作者）

```
GET /coin/api/vip/<book_id>
```

`is_author` 为真时额外返回 `income`（售出章次、收益、成交额、购买人数）与 `price_preview`（各章价格预览）。
非作者调用返回公开部分，不含收益信息。

### 设置 / 关闭 VIP（作者）

```
POST /coin/api/vip/<book_id>
Content-Type: application/json

{"action": "open", "start_chapter": 13}
{"action": "close"}
```

失败场景（均返回 **400** 与可读原因）：非本书作者、全书字数未达 6 万字、起始章早于允许位置、
起始章比当前配置更靠前、本书未开启 VIP（关闭时）。

### 购买 VIP 章节

```
POST /coin/api/vip/<book_id>/purchase
Content-Type: application/json

{"chapter_no": 13}
```

价格由服务端按章节字数重新计算。成功返回 `{success, message, price, balance, chapter_no}`；
净币不足返回 **400**；重复购买返回 **200** 且 `success: false`（`message` 含「已经购买」）。

## 移动端接口（`/api/app/*`）

统一使用 `Authorization: Bearer <token>`，响应封装为 `{"success": true, "data": {...}}`
或 `{"success": false, "error": {"code": "...", "message": "..."}}`。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/app/coins` | 净币概览（余额、签到状态、任务、成就、兑换额度） |
| POST | `/api/app/coins/checkin` | 每日签到 |
| POST | `/api/app/coins/tasks/claim` | 领取任务奖励，体为 `{"task_kind": "exp", "task_id": "daily_visit"}` |
| POST | `/api/app/coins/exchange` | 兑换 AI 积分 |
| GET | `/api/app/coins/ledger?page=1` | 净币流水（分页） |

## 与 VIP 章节相关的既有接口变化

### 目录接口

```
GET /api/books/<book_id>/chapters
```

除原有 `data`（章节标题数组）外，新增 `vip` 字段：

```json
{
  "vip": {
    "enabled": true,
    "start_chapter": 13,
    "total_chapters": 20,
    "price_per_1000": 10,
    "prices": {"13": 20, "14": 30},
    "purchased": [13]
  }
}
```

携带 `?token=<登录令牌>` 时会返回该用户已解锁的章节号。

### 章节内容接口

```
GET /api/books/<book_id>/chapters/<chapter_id>
```

未解锁的 VIP 章节返回 **403**，且**不下发正文**：

```json
{
  "success": false,
  "error": "本章为 VIP 章节，需在站内使用净币解锁后阅读",
  "code": "VIP_LOCKED",
  "vip": {"chapter_no": 13, "price": 20, "words": 1500, "start_chapter": 13}
}
```

### 段评接口

VIP 章节未解锁时，`GET /api/para-comment/<book_id>/<chapter_no>` 与提交段评均返回 **403**。
