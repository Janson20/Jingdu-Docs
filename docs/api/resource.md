# 资源接口

## 基础信息

- **Base URL**: `/resource/api`

## 获取资源列表

```
GET /resource/api/list
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码（默认 1） |
| per_page | integer | 否 | 每页数量（1-50，默认 20） |
| search | string | 否 | 搜索关键词，匹配资源名称 / 作者 / 简介 / 标签 |
| tag | string | 否 | 按标签筛选，可与关键词叠加 |

### 响应示例

```json
{
  "success": true,
  "data": {
    "resources": [
      {
        "id": 1,
        "name": "示例资源",
        "version": "1.0.0",
        "author": "张三",
        "description": "资源简介",
        "website": "https://example.com",
        "pan_link": "https://pan.example.com/xxx",
        "pan_code": "abcd",
        "tags": ["工具", "效率"],
        "views": 12,
        "created_at": "2025-01-01 12:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 50,
      "total_pages": 3
    }
  }
}
```

每个资源都包含 `tags` 数组；未填写标签的资源返回 `["无标签"]`。

## 获取标签聚合

```
GET /resource/api/tags
```

返回全站资源标签及数量，按数量倒序、名称升序排列。

### 响应示例

```json
{
  "success": true,
  "data": {
    "tags": [
      { "tag": "工具", "count": 12 },
      { "tag": "无标签", "count": 3 }
    ]
  }
}
```

## 获取资源详情

```
GET /resource/detail/<resource_id>
```

返回资源的完整信息，包括版本历史。页面中会展示资源标签，点击标签可查看同标签的其他资源。

## 创建资源

```
POST /resource/create
```

**需要认证**（Session）

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 资源名称 |
| version | string | 是 | 版本号 |
| author | string | 是 | 作者/开发者 |
| description | string | 是 | 简介 |
| website | string | 否 | 官方网站 |
| pan_link | string | 是 | 网盘链接 |
| pan_code | string | 否 | 网盘提取码 |
| tags | string | 否 | 标签，多个标签用逗号分隔；最多 5 个、每个不超过 10 个字符 |

标签留空或全部为空白时，资源会自动归入「无标签」。标签过长或数量超限时不会静默截断，页面会直接给出提示并保留已填内容。

## 编辑资源

```
POST /resource/edit/<resource_id>
```

**需要认证**（仅资源所有者）

### 请求参数

与创建资源一致，其中 `tags` 会整体覆盖原有标签；不传或传空则资源重新归入「无标签」。

支持 **保存为新版本**（自动生成版本历史）或直接覆盖当前版本。标签属于主资源，不随版本历史保存。

## 删除资源

```
POST /resource/delete/<resource_id>
```

**需要认证**（仅资源所有者）

## 获取我的资源

```
GET /resource/api/resource/my
```

**需要认证**（Session）

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码 |
| per_page | integer | 否 | 每页数量 |

返回的每个资源同样包含 `tags` 数组。

## 页面入口

以下为 HTML 页面（非 JSON 接口），用于浏览器访问与分享：

| 页面 | 说明 |
|------|------|
| `/resource/search?tag=<标签>` | 按标签筛选资源，可与 `&q=<关键词>` 叠加 |
| `/resource/tag/<标签>` | 标签直达链接，会跳转到该标签的筛选页 |
