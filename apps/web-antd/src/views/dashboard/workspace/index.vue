<script lang="ts" setup>
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  AnalysisChartCard,
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import AnalyticsVisitsSource from '../analytics/analytics-visits-source.vue';

const userStore = useUserStore();

// 集装箱业务相关项目数据
const projectItems: WorkbenchProjectItem[] = [
  {
    color: '#6DB33F',
    content: '集装箱追踪与监控系统 v2.0',
    date: '2024-07-15',
    group: '核心业务系统',
    icon: 'mdi:container',
    title: '集装箱管理系统',
    url: '/container/manage',
  },
  {
    color: '#409EFF',
    content: '智能仓储与堆场管理系统',
    date: '2024-08-20',
    group: '仓储管理',
    icon: 'mdi:warehouse',
    title: '堆场管理系统',
    url: '/yard/manage',
  },
  {
    color: '#ff4d4f',
    content: '货物运输与物流跟踪平台',
    date: '2024-09-10',
    group: '物流管理',
    icon: 'mdi:truck',
    title: '物流跟踪系统',
    url: '/logistics/tracking',
  },
  {
    color: '#1890ff',
    content: '客户订单与订舱管理系统',
    date: '2024-06-05',
    group: '订单管理',
    icon: 'mdi:clipboard-list-outline',
    title: '订舱管理系统',
    url: '/booking/manage',
  },
  {
    color: '#e18525',
    content: '集装箱检验与维护记录系统',
    date: '2024-08-01',
    group: '设备管理',
    icon: 'mdi:wrench',
    title: '集装箱检验系统',
    url: '/container/inspection',
  },
  {
    color: '#2979ff',
    content: '通关与单证管理平台',
    date: '2024-07-25',
    group: '单证管理',
    icon: 'mdi:file-document-multiple-outline',
    title: '单证管理系统',
    url: '/documentation/manage',
  },
];

// 集装箱业务快捷导航
const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#1fdaca',
    icon: 'mdi:home',
    title: '控制台',
    url: '/dashboard/workspace',
  },
  {
    color: '#ff6b6b',
    icon: 'mdi:container',
    title: '集装箱管理',
    url: '/container/manage',
  },
  {
    color: '#7c3aed',
    icon: 'mdi:clipboard-list-outline',
    title: '订单管理',
    url: '/booking/manage',
  },
  {
    color: '#3fb27f',
    icon: 'mdi:warehouse',
    title: '堆场管理',
    url: '/yard/manage',
  },
  {
    color: '#4daf1bc9',
    icon: 'mdi:truck',
    title: '物流跟踪',
    url: '/logistics/tracking',
  },
  {
    color: '#1a73e8',
    icon: 'mdi:file-document-multiple-outline',
    title: '单证管理',
    url: '/documentation/manage',
  },
];

// 集装箱业务待办事项
const todoItems = ref<WorkbenchTodoItem[]>([
  {
    completed: false,
    content: `检查集装箱 EGU1234567 的维修状态，客户要求明日装船`,
    date: '2024-09-15 09:30:00',
    title: '集装箱维修跟进',
  },
  {
    completed: false,
    content: `审核中远海运的订舱单 BKG20240915001，确认舱位分配`,
    date: '2024-09-15 14:20:00',
    title: '订舱单审核',
  },
  {
    completed: false,
    content: `更新堆场堆存计划，为新到港的 50 个集装箱安排位置`,
    date: '2024-09-15 16:45:00',
    title: '堆场计划更新',
  },
  {
    completed: false,
    content: `准备出口货物单证，预计 9 月 18 日装船`,
    date: '2024-09-16 11:15:00',
    title: '出口单证准备',
  },
]);

// 集装箱业务最新动态
const trendItems: WorkbenchTrendItem[] = [
  {
    avatar: 'svg:avatar-1',
    content: `创建了新的集装箱记录 <a>EGU1234567</a>`,
    date: '刚刚',
    title: '张明',
  },
  {
    avatar: 'svg:avatar-2',
    content: `更新了集装箱 <a>CBHU8765432</a> 的状态为 "在途"`,
    date: '1个小时前',
    title: '李华',
  },
  {
    avatar: 'svg:avatar-3',
    content: `审核通过了订舱单 <a>BKG20240915001</a>`,
    date: '2个小时前',
    title: '王强',
  },
  {
    avatar: 'svg:avatar-4',
    content: `为集装箱 <a>MSKU3456789</a> 安排了堆场位置`,
    date: '3个小时前',
    title: '赵静',
  },
  {
    avatar: 'svg:avatar-1',
    content: `完成了集装箱 <a>TCNU1237894</a> 的检验报告`,
    date: '昨天',
    title: '张明',
  },
  {
    avatar: 'svg:avatar-2',
    content: `上传了出口单证 <a>DOC20240914002</a>`,
    date: '昨天',
    title: '李华',
  },
  {
    avatar: 'svg:avatar-3',
    content: `创建了新的客户订单 <a>ORD20240914001</a>`,
    date: '2天前',
    title: '王强',
  },
  {
    avatar: 'svg:avatar-4',
    content: `更新了堆场堆存计划 <a>PLAN20240913001</a>`,
    date: '3天前',
    title: '赵静',
  },
  {
    avatar: 'svg:avatar-1',
    content: `处理了客户投诉 <a>CPL20240912001</a>`,
    date: '4天前',
    title: '张明',
  },
];

const router = useRouter();

// 导航方法
function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('http')) {
    openWindow(nav.url);
    return;
  }
  if (nav.url?.startsWith('/')) {
    router.push(nav.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
  }
}
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        您好, {{ userStore.userInfo?.nickname }}, 欢迎使用集装箱业务管理系统！
      </template>
      <template #description>
        今日有 4 个待办事项需要处理，请注意查看！
      </template>
    </WorkbenchHeader>

    <div class="mt-5 flex flex-col lg:flex-row">
      <div class="mr-4 w-full lg:w-3/5">
        <WorkbenchProject
          :items="projectItems"
          title="集装箱业务系统"
          @click="navTo"
        />
        <WorkbenchTrends
          :items="trendItems"
          class="mt-5"
          title="业务最新动态"
        />
      </div>
      <div class="w-full lg:w-2/5">
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="mt-5 lg:mt-0"
          title="业务快捷导航"
          @click="navTo"
        />
        <WorkbenchTodo :items="todoItems" class="mt-5" title="待办事项" />
        <AnalysisChartCard class="mt-5" title="集装箱状态统计">
          <AnalyticsVisitsSource />
        </AnalysisChartCard>
      </div>
    </div>
  </div>
</template>
