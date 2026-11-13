# 博客接口

## 基础信息

- **Base URL**: `/blog` 和 `/api/blog`

## 获取博客列表

```
GET /api/blog
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认 1） |
| per_page | integer | 否 | 每页数量（默认 10） |

::: info
博客内容使用 Markdown 渲染，支持代码高亮和目录导航。
:::

## 获取博客详情

```
GET /blog/<blog_id>
```

返回博客完整内容（Markdown 渲染为 HTML）、作者信息、评论区。

## 创建博客

```
POST /blog/create
```

**需要认证**（Session）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 博客标题 |
| content | string | 是 | 博客内容（Markdown），可包含嵌入令牌 |
| section | string | 否 | 分区，未知值回落到「杂谈」 |
| tags | string | 否 | 逗号分隔，最多 5 个 |
| image_tokens | string | 否 | 新增配图的客户端令牌 JSON 数组 |
| polls_json | string | 否 | 投票定义 JSON 数组，见「投票接口」 |

::: info 发布限制
- 每天最多发布 **2 + 等级** 篇博客
- 单篇博客内容字数上限：**50000字**
- 发布博客可获得 **10 经验值**，每日最多 10 次
:::

## 编辑博客

```
POST /blog/edit/<blog_id>
```

**需要认证**（仅博客作者）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 博客标题 |
| content | string | 是 | 博客内容（Markdown），可包含嵌入令牌 |
| section | string | 否 | 分区 |
| tags | string | 否 | 逗号分隔，最多 5 个 |
| polls_json | string | 否 | 投票定义 JSON 数组 |

## 删除博客

```
POST /blog/delete/<blog_id>
```

**需要认证**（仅博客作者）

## 我的博客

```
GET /blog/my
```

**需要认证**（Session）

返回当前用户发布的所有博客文章列表。

## 添加评论

```
POST /blog/comment/add
```

**需要认证**（Session）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| blog_id | string | 是 | 博客 ID |
| content | string | 是 | 评论内容 |

::: tip
- 登录后评论可获得 **3 经验值**，每日最多 10 次
- 评论会显示 IP 归属地
:::

## 删除评论

```
POST /blog/comment/delete/<comment_id>
```

**需要认证**（仅评论者或博客作者）


### 点赞 / 取消点赞

```
POST /blog/like/<blog_id>
```

**需要认证**（Session），**无请求体**。

```json
{"success": true, "attitude": 1, "liked": true, "disliked": false, "like_count": 1, "dislike_count": 0}
```

### 点踩 / 取消点踩

```
POST /blog/dislike/<blog_id>
```

**需要认证**（Session），**无请求体**。

同一篇文章只能点赞或点踩，以相同态度再次调用即为取消。净币结算规则：点赞作者 `+2`，点踩作者 `-1`，
取消操作对称回退。详见 [净币接口](/api/coin)。

## 博客编辑器接口

以下接口返回 JSON，需要登录 Session；按接口约定不校验 CSRF Token。

### 预览

```
POST /api/blog/preview
```

请求体：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| content | string | 是 | Markdown 正文 |
| polls | array | 否 | 编辑器中的投票定义 |
| blog_id | integer | 否 | 编辑已有博客时传，用于解析已有配图与权限校验 |
| theme | string | 否 | `light` / `dark`，控制预览主题 |

返回 `{"success": true, "html": "<!doctype html>..."}`，前端把 `html` 放进沙箱 iframe。

### 搜索可嵌入的站内内容

```
GET /api/blog/embeds/search?type=blog&q=关键词
```

- `type`：`forum`、`blog`、`project`、`resource`、`novel`
- `q`：关键词，最长 60 字；留空返回最近内容
- 只返回公开内容；每项包含 `token`、标题、作者、摘要、日期、封面与站内地址

## 投票接口

### 投票 / 改票

```
POST /api/blog/polls/<poll_id>/vote
```

请求体：

```json
{"options": [0]}
```

- 单选投票只能传 1 个选项；多选至少传 1 个
- 登录后每个账号一份 ballot；重复提交会替换自己的旧票
- 截止后返回 409
- 返回 `{"success": true, "html": "..."}`，`html` 是更新后的投票区块，前端就地替换

### 提前结束投票

```
POST /api/blog/polls/<poll_id>/close
```

仅博客作者可调用；返回更新后的投票区块 HTML。

### 无 JavaScript 回退

```
POST /blog/poll/<poll_id>/vote
```

表单字段 `options` 可重复；提交成功后重定向回博客详情页并定位到该投票。

## 令牌语法

令牌必须独占一行，且不能放在围栏代码块中：

```text
[[embed:forum:123]]
[[embed:blog:123]]
[[embed:project:123]]
[[embed:resource:123]]
[[embed:novel:<book_id>]]
[[player:netease:song:123456]]
[[player:netease:playlist:123456]]
[[player:bilibili:BV1xx411c7mD]]
[[poll:12]]
```

新建投票时编辑器先写 `[[poll:new:<临时令牌>]]`，服务端入库后替换成真实 `[[poll:<id>]]`。

每篇博客最多 30 个令牌；投票另有上限：最多 3 个投票，每个 2 至 10 个选项。

