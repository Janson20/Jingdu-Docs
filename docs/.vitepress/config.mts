import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '净读帮助中心',
  description: '净读 (JingDu) 用户帮助文档',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速入门', link: '/guide/getting-started' },
      {
        text: '功能指南',
        items: [
          { text: '书籍阅读', link: '/features/reading' },
          { text: '我的书架', link: '/features/shelf' },
          { text: '写作发布', link: '/features/writing' },
          { text: '作品广场', link: '/features/works' },
          { text: '博客系统', link: '/features/blog' },
          { text: '论坛交流', link: '/features/forum' },
          { text: '内容审核与风控', link: '/features/moderation' },
          { text: '资源分享', link: '/features/resource' },
          { text: '工程分享', link: '/features/project' },
          { text: '中V史', link: '/features/zhongv-history' },
          { text: 'AI 聊天', link: '/features/ai-chat' },
          { text: 'AI 推荐', link: '/features/recommend' },
          { text: '私信', link: '/features/message' },
          { text: '净币系统', link: '/features/coin' },
          { text: '月票', link: '/features/monthly-ticket' },
          { text: 'VIP 章节', link: '/features/vip-chapter' },
          { text: '等级系统', link: '/features/level' },
        ]
      },
      { text: 'API 文档', link: '/api/overview' },
      { text: '常见问题', link: '/faq' },
    ],
    sidebar: [
      {
        text: '快速入门',
        items: [
          { text: '认识净读', link: '/guide/getting-started' },
          { text: '注册与登录', link: '/guide/auth' },
          { text: '个人资料设置', link: '/guide/profile' },
          { text: '界面说明与提示', link: '/guide/interface' },
          { text: '页面加载与骨架屏', link: '/guide/loading' },
        ]
      },
      {
        text: '功能指南',
        items: [
          { text: '书籍阅读', link: '/features/reading' },
          { text: '我的书架', link: '/features/shelf' },
          { text: '书籍评价', link: '/features/review' },
          { text: '写作发布', link: '/features/writing' },
          { text: '作品广场', link: '/features/works' },
          { text: '催更功能', link: '/features/urge' },
          { text: '博客系统', link: '/features/blog' },
          { text: '论坛交流', link: '/features/forum' },
          { text: '内容审核与风控', link: '/features/moderation' },
          { text: '账号封禁与申诉', link: '/features/account-ban' },
          { text: '资源分享', link: '/features/resource' },
          { text: '工程分享', link: '/features/project' },
          { text: '歌姬档案', link: '/features/archive' },
          { text: '中V史', link: '/features/zhongv-history' },
          { text: '网易云工具', link: '/features/netease-tool' },
          { text: '关注与私信', link: '/features/social' },
          { text: 'AI 聊天', link: '/features/ai-chat' },
          { text: 'AI 推荐', link: '/features/recommend' },
          { text: '私信', link: '/features/message' },
          { text: '净币系统', link: '/features/coin' },
          { text: '月票', link: '/features/monthly-ticket' },
          { text: 'VIP 章节', link: '/features/vip-chapter' },
          { text: '等级系统', link: '/features/level' },
          { text: '聊天室', link: '/features/chat' },
          { text: '工具箱', link: '/features/toolkit' },
        ]
      },
      {
        text: 'API 文档',
        items: [
          { text: 'API 概览', link: '/api/overview' },
          { text: '认证接口', link: '/api/auth' },
          { text: '书籍接口', link: '/api/books' },
          { text: '博客接口', link: '/api/blog' },
          { text: '论坛接口', link: '/api/forum' },
          { text: '段评接口', link: '/api/para-comment' },
          { text: '书架接口', link: '/api/shelf' },
          { text: '净币接口', link: '/api/coin' },
          { text: '资源接口', link: '/api/resource' },
          { text: '作品流接口', link: '/api/works' },
          { text: '私信接口', link: '/api/message' },
          { text: 'DeepSeek 代理', link: '/api/deepseek' },
        ]
      },
      {
        text: '其他',
        items: [
          { text: '常见问题', link: '/faq' },
          { text: '安全与隐私', link: '/security' },
        ]
      },
    ],
    socialLinks: [
      { icon: 'github', link: '' }
    ],
    footer: {
      message: '净读 JingDu',
      copyright: 'Copyright © 2024-present JingDu'
    }
  }
})
