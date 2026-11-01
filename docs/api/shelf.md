# 书架接口

书架用于保存用户收藏的小说、分组与私人备注。全部接口均**需要认证**：
网页端使用 Session Cookie，移动端与第三方使用 `Authorization: Bearer <token>`。

> 说明：`/api/shelf/*` 端点在服务端已登记 CSRF 豁免（与其它 JSON 蓝图一致）；
> 网页端调用时仍建议附带 `X-CSRFToken`。未登录统一返回 **401**
> `{"success": false, "message": "请先登录"}`。

## 数据字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `book_id` | string | 书籍 ID |
| `title` | string | 书名（书籍下架时为「未知书籍」） |
| `author` / `author_id` | string | 作者名与作者 ID |
| `cover` | string | 原始封面值：新封面形如 `oss:cover/<作者UUID>/<文件名>`，历史数据为相对 `static/` 的路径；为空表示使用主题色占位封面 |
| `cover_url` | string | 可直接用于 `<img src>` 的封面地址（已解析为 CDN / static / 占位图）；**前端请使用该字段**，不要用 `/static/` 拼 `cover`。CDN 图片需带 `referrerpolicy="no-referrer"` |
| `is_repost` | bool | 是否为公共版权作品转载（仅转载书籍返回 `true`） |
| `original_author` | string | 转载书籍的原作者（原创书籍为空串） |
| `desc` | string | 简介 |
| `tags` | array | 书籍标签 |
| `group_name` | string | 所属分组，空串表示未分组 |
| `note` | string | 私人备注，最长 200 字符 |
| `added_at` / `updated_at` | string | 加入与更新时间 |
| `missing` | bool | 书籍是否已下架（条目仍在书架中） |
| `chapter` | int | 上次读到的章节号，`0` 表示还没读过 |
| `total_chapters` | int | 全书章节数，未知为 `0` |
| `progress_text` | string | 原始进度文本，形如 `7/20` |
| `percent` | int | 阅读进度百分比（0-100） |

## 接口列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/shelf` | 书架列表（分组筛选、排序、分页） |
| GET | `/api/shelf?book_ids=a,b,c` | 批量查询这些书的在架状态 |
| GET | `/api/shelf/item/<book_id>` | 查询单本书的书架状态 |
| POST | `/api/shelf/item/<book_id>` | 加入书架 |
| PUT | `/api/shelf/item/<book_id>` | 修改分组与备注 |
| DELETE | `/api/shelf/item/<book_id>` | 移出书架 |
| GET | `/api/shelf/groups` | 分组列表（含每组的书籍数量） |
| POST | `/api/shelf/groups` | 新建分组 |
| PUT | `/api/shelf/groups` | 重命名分组 |
| DELETE | `/api/shelf/groups` | 删除分组（组内书籍回到默认分组） |

## 书架列表

```
GET /api/shelf?group=在读&sort=read&page=1&per_page=24
```

- `group`：分组名；省略或 `all` 表示全部，`none` 表示未分组
- `sort`：`added`（最近加入，默认）、`read`（最近阅读）、`title`（书名）、`author`（作者）
- `page` / `per_page`：分页，`per_page` 上限 100，默认 24

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "book_id": "068bbf8d-...",
        "title": "示例小说",
        "author": "示例作者",
        "cover": "oss:cover/8f2c.../0123abcd.png",
        "cover_url": "https://cdn.jingdu.org/cover/8f2c.../0123abcd.png?k=...&t=...",
        "tags": ["玄幻"],
        "group_name": "在读",
        "note": "看到第 3 卷",
        "added_at": "2026-10-11 09:00:00 (UTC+8)",
        "missing": false,
        "chapter": 7,
        "total_chapters": 20,
        "percent": 35
      }
    ],
    "groups": [
      {"name": "想读", "count": 3},
      {"name": "在读", "count": 1}
    ],
    "default_group": "想读",
    "pagination": {"page": 1, "per_page": 24, "total": 4, "total_pages": 1}
  }
}
```

## 批量查询在架状态

```
GET /api/shelf?book_ids=<book_id_1>,<book_id_2>
```

用于阅读页、目录页就地渲染书架按钮（避免逐本请求）：

```json
{
  "success": true,
  "data": {
    "states": {
      "068bbf8d-...": {"in_shelf": true, "group_name": "在读"},
      "aabbccdd-...": {"in_shelf": false, "group_name": ""}
    }
  }
}
```

## 加入书架

```
POST /api/shelf/item/<book_id>
Content-Type: application/json

{"group": "在读", "note": "朋友推荐"}
```

- `group`、`note` 均可省略；重复加入是**幂等**的，只更新分组与备注
- 书籍不存在返回 **404**；分组名超过 10 字符返回 **400**

```json
{"success": true, "message": "已加入书架",
 "data": {"book_id": "068bbf8d-...", "in_shelf": true, "group_name": "在读", "note": "朋友推荐"}}
```

## 修改分组与备注

```
PUT /api/shelf/item/<book_id>
Content-Type: application/json

{"group": "已读完", "note": "看完了"}
```

字段省略表示保持原值，传空串表示清空。书籍不在书架中返回 **404**。

## 移出书架

```
DELETE /api/shelf/item/<book_id>
```

```json
{"success": true, "message": "已移出书架",
 "data": {"book_id": "068bbf8d-...", "in_shelf": false, "group_name": ""}}
```

## 分组管理

```
GET    /api/shelf/groups
POST   /api/shelf/groups      {"name": "在读"}
PUT    /api/shelf/groups      {"old_name": "在读", "new_name": "在追"}
DELETE /api/shelf/groups?name=在追
```

返回 `{groups, default_group, max_groups, name_max_length}`。
约束：每个分组名最长 10 个字符，最多 20 个分组；删除分组时组内书籍自动回到默认分组
（`default_group`，默认「想读」），默认分组本身不可删除，但可以重命名。

## 相关页面端点（表单）

网页端表单与接口共享同一套数据逻辑，禁用 JS 时表单仍可用；
这些端点**保留 CSRF 校验**，且提交后回跳来源页面：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/shelf` | 书架页面（支持 `?group=&sort=&page=`） |
| POST | `/shelf/add` | 加入书架，字段 `book_id`、`group`、`csrf_token` |
| POST | `/shelf/<book_id>/remove` | 移出书架 |
| POST | `/shelf/<book_id>/update` | 修改分组与备注 |
| POST | `/shelf/bulk-remove` | 批量移出，字段 `book_ids`（可重复） |
| POST | `/shelf/clear` | 清空书架，需带 `confirm=1` |
| POST | `/shelf/group/create` | 新建分组，字段 `name` |
| POST | `/shelf/group/rename` | 重命名分组，字段 `old_name`、`new_name` |
| POST | `/shelf/group/delete` | 删除分组，字段 `name` |
| POST | `/shelf/cleanup` | 清理已下架书籍的书架条目 |
