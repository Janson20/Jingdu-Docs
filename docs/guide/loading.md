# 页面加载与骨架屏

净读的常用列表页不再等整页数据查完才显示，而是**先把页面框架和骨架屏送到浏览器，再异步取回列表**。这样在弱网或数据库繁忙时，用户能立刻看到页面结构，而不是一片空白。

## 作品广场：首屏直出 + 无限滚动

首页 `/` 现在是一个作品广场，不再使用整页骨架。服务端先把第一页（12 件）的卡片直接写进 HTML，搜索引擎与关闭 JavaScript 的浏览器都能看到完整内容；启用 JavaScript 后，`works-feed.js` 在滚动到列表底部附近时请求 `/api/works`，把下一页的卡片追加到瀑布流。

- 页内类别标签只替换列表，不刷新整页；地址栏同步为 `/?type=project` 这类地址。
- 搜索、标签、作者筛选都通过同一个接口取数。
- 请求失败时显示重试按钮，不会清空已经加载的卡片。
- 旧入口 `/project`、`/forum`、`/blog`、`/resource/` 也渲染同一作品流，同样首屏直出。

## 哪些页面仍会先显示骨架

- 小说库（`/book`）
- 月票榜（`/monthly-ticket`）

骨架的形状与真实卡片一致（封面、标题、标签、按钮），数据到达后直接替换，不会先撑开再塌回去。

## 分页与筛选也是异步的

在小说库与月票榜里，翻页与搜索只替换列表区域：

- 地址栏会同步更新，可以直接复制分享
- 浏览器「后退 / 前进」能恢复上一页列表
- 加载时列表区域显示骨架，顶部有细进度条
- 读屏器会播报「正在加载列表 / 列表已更新」

标签筛选是一个例外：书库的标签栏由服务端直出，点标签会打开完整页面。这些标签落地页需要被搜索引擎收录，也适合直接分享；先直出标签栏还能避免列表加载完成后页面整体下移。作品广场的类别标签与卡片首屏也由服务端直出，从第 2 页起才走 `/api/works`。

## 打不开或加载失败怎么办

1. 先检查网络，然后点列表里的「重新加载」。
2. 如果一直失败，点「直接打开完整列表」。它会以 `?ssr=1` 打开同一个页面，由服务端一次性渲染全部内容。
3. 关闭了 JavaScript 的浏览器会自动看到提示，也可以直接点这个完整列表链接。

## 对搜索引擎有影响吗

没有。页面会根据请求类型选择渲染方式：

- **普通浏览器导航**：小说库/月票榜先骨架再异步列表；作品广场首屏直出，滚动时再取下一页
- **搜索引擎爬虫**：直接返回完整 HTML（服务端渲染），保证收录
- **没有 `Sec-Fetch-Mode` 的旧浏览器 / 脚本 / 测试客户端**：同样返回完整 HTML
- **`?ssr=1`**：始终返回完整 HTML

列表的局部响应带 `X-Robots-Tag: noindex`，不会被当成重复页面收录。

::: details 维护者备注：新增一个异步列表页

1. 在路由里引入 `page_async`：

   ```python
   from page_async import defer_page_content, is_partial_request, render_region
   ```

2. 在查询列表数据**之前**判断是否只返回壳：

   ```python
   if defer_page_content():
       return render_template('xxx.html', async_mode=True, ...)
   ```

3. 查完数据后，局部请求只渲染列表片段：

   ```python
   context = dict(items=items, page=page, total=total, ...)
   if is_partial_request():
       return render_region('_xxx_region.html', **context)
   return render_template('xxx.html', async_mode=False, **context)
   ```

4. 页面模板里放一个带 `data-async-region` 的容器，骨架用 `templates/_async_macros.html` 里的宏：

   ```html
   <div id="xxx-region" class="async-region" data-async-region
        data-async-url="{{ request.full_path.rstrip('?') }}">
       {{ skeleton_feed(5) }}
   </div>
   {{ async_status() }}
   {{ noscript_notice() }}
   ```

5. 列表片段模板第一行放元信息，前端会用它更新标题、数量和表单隐藏域：

   ```html
   <script type="application/json" class="async-meta">
   {{ {'title': page_title, 'total': total, 'keyword': keyword}|tojson }}
   </script>
   ```

6. 分页 / 标签链接加 `data-async-link`，GET 筛选表单加 `data-async-form`。

7. 有筛选条件的页建议只在**无筛选首屏**启用异步；标签页、搜索页继续 SSR，避免影响这些落地页的收录。

:::
