import type { DefaultTheme } from 'vitepress';

import { defineConfig } from 'vitepress';

import { version } from '../../../package.json';

export const zh = defineConfig({
  description: 'Vben Admin & 企业级管理系统框架',
  lang: 'zh-Hans',
  themeConfig: {
    darkModeSwitchLabel: '主题',
    darkModeSwitchTitle: '切换到深色模式',
    docFooter: {
      next: '下一页',
      prev: '上一页',
    },
    editLink: {
      pattern:
        'https://github.com/vbenjs/vue-vben-admin/edit/main/docs/src/:path',
      text: '在 GitHub 上编辑此页面',
    },
    footer: {
      copyright: `Copyright © 2020-${new Date().getFullYear()} Vben`,
      message: '基于 MIT 许可发布.',
    },
    langMenuLabel: '多语言',
    lastUpdated: {
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
      text: '最后更新于',
    },
    lightModeSwitchTitle: '切换到浅色模式',
    nav: nav(),

    outline: {
      label: '页面导航',
    },
    returnToTopLabel: '回到顶部',

    sidebar: {
      '/commercial/': { base: '/commercial/', items: sidebarCommercial() },
      '/components/': { base: '/components/', items: sidebarComponents() },
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/back/': { base: '/back/', items: sidebarBack () },
    },
    sidebarMenuLabel: '菜单',
  },
});

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      collapsed: false,
      text: '简介',
      items: [
        {
          link: 'introduction/vben',
          text: '关于 Vben Admin',
        },
        {
          link: 'introduction/why',
          text: '为什么选择我们?',
        },
        { link: 'introduction/quick-start', text: '快速开始' },
        { link: 'introduction/thin', text: '精简版本' },
        {
          base: '/',
          link: 'components/introduction',
          text: '组件文档',
        },
      ],
    },
    {
      text: '基础',
      items: [
        { link: 'essentials/concept', text: '基础概念' },
        { link: 'essentials/development', text: '本地开发' },
        { link: 'essentials/route', text: '路由和菜单' },
        { link: 'essentials/settings', text: '配置' },
        { link: 'essentials/icons', text: '图标' },
        { link: 'essentials/styles', text: '样式' },
        { link: 'essentials/external-module', text: '外部模块' },
        { link: 'essentials/build', text: '构建与部署' },
        { link: 'essentials/server', text: '服务端交互与数据Mock' },
      ],
    },
    {
      text: '深入',
      items: [
        { link: 'in-depth/login', text: '登录' },
        // { link: 'in-depth/layout', text: '布局' },
        { link: 'in-depth/theme', text: '主题' },
        { link: 'in-depth/access', text: '权限' },
        { link: 'in-depth/locale', text: '国际化' },
        { link: 'in-depth/features', text: '常用功能' },
        { link: 'in-depth/check-updates', text: '检查更新' },
        { link: 'in-depth/loading', text: '全局loading' },
        { link: 'in-depth/ui-framework', text: '组件库切换' },
      ],
    },
    {
      text: '工程',
      items: [
        { link: 'project/standard', text: '规范' },
        { link: 'project/cli', text: 'CLI' },
        { link: 'project/dir', text: '目录说明' },
        { link: 'project/test', text: '单元测试' },
        { link: 'project/tailwindcss', text: 'Tailwind CSS' },
        { link: 'project/changeset', text: 'Changeset' },
        { link: 'project/vite', text: 'Vite Config' },
      ],
    },
    {
      text: '其他',
      items: [
        { link: 'other/project-update', text: '项目更新' },
        { link: 'other/remove-code', text: '移除代码' },
        { link: 'other/faq', text: '常见问题' },
      ],
    },
  ];
}

function sidebarCommercial(): DefaultTheme.SidebarItem[] {
  return [
    {
      link: 'community',
      text: '交流群',
    },
    {
      link: 'technical-support',
      text: '技术支持',
    },
    {
      link: 'customized',
      text: '定制开发',
    },
  ];
}

function sidebarBack(): DefaultTheme.SidebarItem[] {
  return [
    {
      collapsed: false,
      text:'介绍',
      items:[
        { link: 'introduction/api', text: '接口文档'},
        { link: 'introduction/technology', text: '技术选型'},
        { link: 'introduction/structure', text: '项目结构'},
      ]
    },
    {
      collapsed: false,
      text:'后端手册',
      items:[
        { link: 'backend/module-new', text: '新建服务' },
        { link: 'backend/gen-single-table', text: '代码生成单表' },
        { link: 'backend/gen-master-sub-table', text: '代码生成主子表' },
        { link: 'backend/gen-tree-table', text: '代码生成树表'},
        { link: 'backend/function-permission', text: '功能权限'},
        { link: 'backend/data-permission', text: '数据权限'},
        { link: 'backend/user-system', text: '用户体系'},
        { link: 'backend/social-user', text: '三方登录'},
        { link: 'backend/OAuth', text: 'OAuth 2.0'},
        { link: 'backend/multi-tenant', text: 'SaaS多租户（字段隔离）'},
        { link: 'backend/webSocket', text: 'WebSocket实时通信'},
        { link: 'backend/error-code', text: '异常处理（错误码）'},
        { link: 'backend/verification', text: '参数校验、时间传参'},
        { link: 'backend/pagination', text: '分页实现'},
        { link: 'backend/VO-conversion', text: 'VO对象转换、数据翻译'},
        { link: 'backend/file-storage', text: '文件存储（上传下载）'},
        { link: 'backend/excel', text: 'Excel导入导出'},
        { link: 'backend/log', text: '操作日志、访问日志、异常日志'},
        { link: 'backend/myBatis', text: 'MyBatis'},
        { link: 'backend/myBatis-operation', text: 'MyBatis联表&分页查询'},
        { link: 'backend/data', text: '多源数据（读写分离）、事务'},
        { link: 'backend/redis-cache', text: 'Redis缓存'},
        { link: 'backend/local-cache', text: '本地缓存'},
        { link: 'backend/asynchronous', text: '异步任务'},
        { link: 'backend/distributed-lock', text: '分布式锁'},
        { link: 'backend/idempotence', text: '幂等性（防重复提交）'},
        { link: 'backend/rateLimiter', text: '请求限流'},
        { link: 'backend/signature', text: 'HTTP接口签名'},
        { link: 'backend/unit-test', text: '单元测试'},
        { link: 'backend/verification-code', text: '验证码'},
        { link: 'backend/tool-util', text: '工具类Util'},
      ],
    },
    {
      collapsed: false,
      text: '微服务',
      items: [
        { link: 'microservices/debug', text: '微服务调试'},
        { link: 'microservices/Nacos-register', text: '注册中心Nacos'},
        { link: 'microservices/Nacos-configure', text: '配置中心Nacos'},
        { link: 'microservices/gateway', text: '服务网关'},
        { link: 'microservices/feign', text: '服务调用Feign'},
        { link: 'microservices/xxl-job', text: '定时任务XXL Job'},
        { link: 'microservices/queue-memory', text: '消息队列（内存）'},
        { link: 'microservices/queue-Redis', text: '消息队列（Redis）'},
        { link: 'microservices/queue-RocketMQ', text: '消息队列（RocketMQ）'},
        { link: 'microservices/queue-RabbitMQ', text: '消息队列（RabbitMQ）'},
        { link: 'microservices/queue-Kafka', text: '消息队列（Kafka）'},
      ],
    },
  {
    collapsed: false,
    text: '系统手册',
    items: [
      { link: 'system/message', text: '短信配置'},
      { link: 'system/email', text: '邮件配置'},
      { link: 'system/internal-message', text: '站内信配置'},
      { link: 'system/data-masking', text: '数据脱敏'},
      { link: 'system/region', text: '地区&IP 库'},
    ],
  },
  {
    collapsed: false,
    text: '运维手册',
    items: [
      { link: 'maintenance/env', text: '开发环境'},
      { link: 'maintenance/linux', text: 'Linux 部署'},
      { link: 'maintenance/docker', text: 'Docker 部署'},
      { link: 'maintenance/jenkins', text: 'Jenkins 部署'},
      { link: 'maintenance/baota', text: '宝塔部署'},
      { link: 'maintenance/monitor', text: '服务监控'},
    ],
  },


  ];
}


function sidebarComponents(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '组件',
      items: [
        {
          link: 'introduction',
          text: '介绍',
        },
      ],
    },
    {
      collapsed: false,
      text: '布局组件',
      items: [
        {
          link: 'layout-ui/page',
          text: 'Page 页面',
        },
      ],
    },
    {
      collapsed: false,
      text: '通用组件',
      items: [
        {
          link: 'common-ui/vben-api-component',
          text: 'ApiComponent Api组件包装器',
        },
        {
          link: 'common-ui/vben-alert',
          text: 'Alert 轻量提示框',
        },
        {
          link: 'common-ui/vben-modal',
          text: 'Modal 模态框',
        },
        {
          link: 'common-ui/vben-drawer',
          text: 'Drawer 抽屉',
        },
        {
          link: 'common-ui/vben-form',
          text: 'Form 表单',
        },
        {
          link: 'common-ui/vben-vxe-table',
          text: 'Vxe Table 表格',
        },
        {
          link: 'common-ui/vben-count-to-animator',
          text: 'CountToAnimator 数字动画',
        },
        {
          link: 'common-ui/vben-ellipsis-text',
          text: 'EllipsisText 省略文本',
        },
      ],
    },
  ];
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      activeMatch: '^/(guide|components)/',
      text: '前端',
      items: [
        {
          activeMatch: '^/guide/',
          link: '/guide/introduction/vben',
          text: '指南',
        },
        {
          activeMatch: '^/components/',
          link: '/components/introduction',
          text: '组件',
        },
        {
          text: '历史版本',
          items: [
            {
              link: 'https://doc.vvbin.cn',
              text: '2.x版本文档',
            },
          ],
        },
      ],
    },
    {
      link: '/back/introduction/api',
      text: '后端',
    },
//     {
//       text: '演示',
//       items: [
//         {
//           text: 'Vben Admin',
//           items: [
//             {
//               link: 'https://www.vben.pro',
//               text: '演示版本',
//             },
//             {
//               link: 'https://ant.vben.pro',
//               text: 'Ant Design Vue 版本',
//             },
//             {
//               link: 'https://naive.vben.pro',
//               text: 'Naive 版本',
//             },
//             {
//               link: 'https://ele.vben.pro',
//               text: 'Element Plus版本',
//             },
//           ],
//         },
//         {
//           text: '其他',
//           items: [
//             {
//               link: 'https://vben.vvbin.cn',
//               text: 'Vben Admin 2.x',
//             },
//           ],
//         },
//       ],
//     },
//     {
//       text: version,
//       items: [
//         {
//           link: 'https://github.com/vbenjs/vue-vben-admin/releases',
//           text: '更新日志',
//         },
//         {
//           link: 'https://github.com/orgs/vbenjs/projects/5',
//           text: '路线图',
//         },
//         {
//           link: 'https://github.com/vbenjs/vue-vben-admin/blob/main/.github/contributing.md',
//           text: '贡献',
//         },
//       ],
//     },
//     {
//       link: '/commercial/technical-support',
//       text: '🦄 技术支持',
//     },
//     {
//       link: '/sponsor/personal',
//       text: '✨ 赞助',
//     },
//     {
//       link: '/commercial/community',
//       text: '👨‍👦‍👦 交流群',
      // items: [
      //   {
      //     link: 'https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=22ySzj7pKiw&businessType=9&from=246610&biz=ka&mainSourceId=share&subSourceId=others&jumpsource=shorturl#/pc',
      //     text: 'QQ频道',
      //   },
      //   {
      //     link: 'https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=mjZmlhgVzzUxvdxllB6C1vHpX8O8QRL0&authKey=DBdFbBwERmfaKY95JvRWqLCJIRGJAmKyZbrpzZ41EKDMZ5SR6MfbjOBaaNRN73fr&noverify=0&group_code=4286109',
      //     text: 'QQ群',
      //   },
      //   {
      //     link: 'https://discord.gg/VU62jTecad',
      //     text: 'Discord',
      //   },
      // ],
//     },
    // {
    //   link: '/friend-links/',
    //   text: '🤝 友情链接',
    // },
  ];
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  root: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonAriaLabel: '搜索文档',
        buttonText: '搜索文档',
      },
      modal: {
        errorScreen: {
          helpText: '你可能需要检查你的网络连接',
          titleText: '无法获取结果',
        },
        footer: {
          closeText: '关闭',
          navigateText: '切换',
          searchByText: '搜索提供者',
          selectText: '选择',
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          reportMissingResultsLinkText: '点击反馈',
          reportMissingResultsText: '你认为该查询应该有结果？',
          suggestedQueryText: '你可以尝试查询',
        },
        searchBox: {
          cancelButtonAriaLabel: '取消',
          cancelButtonText: '取消',
          resetButtonAriaLabel: '清除查询条件',
          resetButtonTitle: '清除查询条件',
        },
        startScreen: {
          favoriteSearchesTitle: '收藏',
          noRecentSearchesText: '没有搜索历史',
          recentSearchesTitle: '搜索历史',
          removeFavoriteSearchButtonTitle: '从收藏中移除',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          saveRecentSearchButtonTitle: '保存至搜索历史',
        },
      },
    },
  },
};
