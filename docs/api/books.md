# 书籍接口

## 获取书籍列表

```
GET /api/books
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| author | string | 否 | 按作者筛选 |
| tag | string | 否 | 按标签筛选 |
| category | string | 否 | 按分类筛选（等价于 `tag`，为兼容旧调用方保留） |
| search | string | 否 | 搜索关键词，匹配书名 / 作者 / 简介 / 标签 |
| limit | integer | 否 | 返回数量限制 |

### 响应说明

每本书都包含 `tags` 数组（如 `["玄幻", "热血"]`）；`category` 字段保留为第一个标签，兼容旧调用方。

## 获取书籍详情

```
GET /api/books/<book_id>
```

### 路径参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| book_id | string | 是 | 书籍 ID |

返回的书籍信息中包含 `tags` 数组（无标签书籍为 `["无标签"]`）。

## 创建书籍

```
POST /api/books
```

**需要认证**（Token）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 认证 Token |
| title | string | 是 | 书名 |
| author | string | 是 | 作者 |
| cover | string | 否 | 封面 URL |
| desc | string | 否 | 描述 |
| tags | array | 否 | 书籍标签，最多 5 个、每个不超过 10 个字符；留空则记为「无标签」 |
| category | string | 否 | 分类（兼容旧参数，仅在未传 `tags` 时作为唯一标签） |

### 请求示例

```json
{
  "token": "<认证 Token>",
  "title": "剑影长歌",
  "author": "张三",
  "desc": "一部武侠长篇",
  "tags": ["武侠", "热血"]
}
```

标签规则详见 [书籍标签](/features/writing#书籍标签)。

## 更新书籍

```
PUT /api/books/<book_id>
```

**需要认证**（Token）

::: warning
该接口暂未实现。
:::

## 删除书籍

```
DELETE /api/books/<book_id>
```

**需要认证**（Token）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 认证 Token |

## 获取章节列表

```
GET /api/books/<book_id>/chapters
```

## 添加章节

```
POST /api/books/<book_id>/chapters
```

**需要认证**（Token）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 认证 Token |
| title | string | 是 | 章节标题 |
| content | string | 是 | 章节内容 |

## 获取章节内容

```
GET /api/books/<book_id>/chapters/<chapter_id>
```

## 更新章节内容

```
PUT /api/books/<book_id>/chapters/<chapter_id>
```

**需要认证**（Token）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 认证 Token |
| title | string | 否 | 章节标题 |
| content | string | 否 | 章节内容 |

## 删除章节

```
DELETE /api/books/<book_id>/chapters/<chapter_id>
```

**需要认证**（Token）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 认证 Token |

## 旧版兼容接口

以下接口为早期版本保留，建议使用上方标准 RESTful 接口：

### 通过作者获取书籍

```
GET /api/get-books-by-author?author=<作者名>
```

### 获取书籍信息

```
GET /api/get-book-info?book_id=<书籍ID>
```

### 获取书籍目录

```
GET /api/get-book-catalog?book_id=<书籍ID>
```

### 添加章节（旧版）

```
POST /api/add-chapter
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 认证 Token |
| book_id | string | 是 | 书籍 ID |
| title | string | 是 | 章节标题 |
| content | string | 是 | 章节内容 |

## 获取所有标签

```
GET /api/tags
```

返回全站书籍标签列表（字符串数组）。

### 兼容端点

```
GET /api/categories
```

旧版端点名，返回内容与 `/api/tags` 完全一致：书籍的「分类」已升级为多标签，该端点保留以兼容旧调用方。

## 图书库接口

### 获取图书库列表

```
GET /api/book
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认 1） |
| per_page | integer | 否 | 每页数量（1-100，默认 32） |
| search | string | 否 | 搜索关键词，匹配书名 / 作者 / 简介 / 标签 |
| q | string | 否 | 搜索关键词（`search` 的等价写法） |
| tag | string | 否 | 按标签筛选，可与关键词叠加 |

### 修改书籍标签

```
POST /api/book/<book_id>/tags
```

**需要认证**（Session，且仅书籍作者本人可操作）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tags | array | 是 | 新的标签列表，最多 5 个、每个不超过 10 个字符；传空数组则记为「无标签」 |

### 响应示例

```json
{
  "success": true,
  "message": "标签已更新",
  "data": { "tags": ["玄幻", "热血"] }
}
```

### 错误说明

| 状态码 | 说明 |
|--------|------|
| 401 | 未登录 |
| 403 | 非本书作者，无权修改 |
| 404 | 书籍不存在 |
| 400 | 标签校验失败（超长或超过 5 个） |

## 页面入口

以下为 HTML 页面（非 JSON 接口），用于浏览器访问与分享：

| 页面 | 说明 |
|------|------|
| `/book` | 图书库，支持 `?q=<关键词>`、`?tag=<标签>`、`?page=<页码>` |
| `/search/<标签>` | 按标签浏览书籍 |
| `/search?q=<关键词>` | 关键词搜索页（关键词为空时跳转回图书库） |

## 获取热门书籍

```
GET /api/books/hot
```

## 获取最新书籍

```
GET /api/books/latest?limit=10
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | integer | 否 | 返回数量限制 |

## 获取首页数据

```
GET /api/home
```

返回首页所需的全部数据（热门、最新、标签、公告等）。

响应中的 `tags` 为全站标签列表，`categories` 为兼容旧字段（内容与 `tags` 一致）。

## 书籍评价接口

### 获取书籍评价

```
GET /api/book/<book_id>/reviews
```

### 获取我的评价

```
GET /api/book/<book_id>/review
```

**需要认证**（Session）

### 提交/更新评价

```
POST /api/book/<book_id>/review
```

**需要认证**（Session）

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| is_recommended | boolean | 是 | 是否推荐 |
| content | string | 否 | 文字评价 |

### 获取评价统计

```
GET /api/book/<book_id>/stats
```
