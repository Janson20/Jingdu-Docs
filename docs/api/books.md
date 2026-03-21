# 书籍接口

## 获取书籍列表

```
GET /api/books
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| author | string | 否 | 按作者筛选 |
| category | string | 否 | 按分类筛选 |
| search | string | 否 | 搜索关键词 |
| limit | integer | 否 | 返回数量限制 |

## 获取书籍详情

```
GET /api/books/<book_id>
```

### 路径参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| book_id | string | 是 | 书籍 ID |

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
| category | string | 否 | 分类 |

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

## 获取所有分类

```
GET /api/categories
```

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

返回首页所需的全部数据（热门、最新、分类等）。

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
