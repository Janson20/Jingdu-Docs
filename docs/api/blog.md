# 博客接口

## 获取博客列表

```
GET /api/blog
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认 1） |
| per_page | integer | 否 | 每页数量 |

## 添加评论

```
POST /blog/comment/add
```

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| blog_id | string | 是 | 博客 ID |
| content | string | 是 | 评论内容 |

::: info
登录后评论可获得经验值。
:::

## 删除评论

```
POST /blog/comment/delete/<comment_id>
```

**需要认证**（仅评论者或博客作者）
