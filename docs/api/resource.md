# 资源接口

## 获取资源列表

```
GET /resource/api/list
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | integer | 否 | 页码 |
| per_page | integer | 否 | 每页数量 |
| search | string | 否 | 搜索关键词 |

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
