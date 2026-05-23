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
| content | string | 是 | 博客内容（Markdown） |

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
| content | string | 是 | 博客内容（Markdown） |

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
