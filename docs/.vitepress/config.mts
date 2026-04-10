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
          { text: '写作发布', link: '/features/writing' },
          { text: '博客系统', link: '/features/blog' },
          { text: '论坛交流', link: '/features/forum' },
          { text: '资源分享', link: '/features/resource' },
          { text: 'AI 聊天', link: '/features/ai-chat' },
          { text: '私信', link: '/features/message' },
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
        ]
      },
      {
        text: '功能指南',
        items: [
          { text: '书籍阅读', link: '/features/reading' },
          { text: '书籍评价', link: '/features/review' },
          { text: '写作发布', link: '/features/writing' },
          { text: '催更功能', link: '/features/urge' },
          { text: '博客系统', link: '/features/blog' },
          { text: '论坛交流', link: '/features/forum' },
          { text: '资源分享', link: '/features/resource' },
          { text: 'AI 聊天', link: '/features/ai-chat' },
          { text: '私信', link: '/features/message' },
          { text: '等级系统', link: '/features/level' },
          { text: '聊天室', link: '/features/chat' },
          { text: '工具箱', link: '/features/toolkit' },
          { text: 'B站问号榜', link: '/features/biliqml' },
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
          { text: '资源接口', link: '/api/resource' },
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
