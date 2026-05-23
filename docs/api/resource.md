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
| search | string | 否 | 搜索关键词 |

### 响应示例

```json
{
  "success": true,
  "data": {
    "resources": [...],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 50,
      "total_pages": 3
    }
  }
}
```

## 获取资源详情

```
GET /resource/detail/<resource_id>
```

返回资源的完整信息，包括版本历史。

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

## 编辑资源

```
POST /resource/edit/<resource_id>
```

**需要认证**（仅资源所有者）

支持 **保存为新版本**（自动生成版本历史）或直接覆盖当前版本。

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
