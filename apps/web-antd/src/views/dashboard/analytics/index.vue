<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import {
  MdiCargo,
  MdiPackageVariantClosed,
  MdiShip,
  MdiTruck,
} from '@vben/icons';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';
import AnalyticsVisits from './analytics-visits.vue';

// 集装箱业务概览数据
const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: MdiPackageVariantClosed,
    title: '在港集装箱',
    totalTitle: '总集装箱量',
    totalValue: 12_500,
    value: 450,
  },
  {
    icon: MdiCargo,
    title: '今日吞吐量',
    totalTitle: '本月吞吐量',
    totalValue: 35_600,
    value: 1200,
  },
  {
    icon: MdiShip,
    title: '到港船只',
    totalTitle: '本月到港',
    totalValue: 125,
    value: 5,
  },
  {
    icon: MdiTruck,
    title: '运输车辆',
    totalTitle: '总运输量',
    totalValue: 8900,
    value: 320,
  },
];

// 集装箱业务图表标签
const chartTabs: TabOption[] = [
  {
    label: '集装箱吞吐量趋势',
    value: 'trends',
  },
  {
    label: '月度吞吐量统计',
    value: 'visits',
  },
];
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #trends>
        <AnalyticsTrends />
      </template>
      <template #visits>
        <AnalyticsVisits />
      </template>
    </AnalysisChartsTabs>

    <div class="mt-5 w-full md:flex">
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/3"
        title="集装箱类型分布"
      >
        <AnalyticsVisitsData />
      </AnalysisChartCard>
      <AnalysisChartCard
        class="mt-5 md:mr-4 md:mt-0 md:w-1/3"
        title="货物类型占比"
      >
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
      <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/3" title="航线业务分布">
        <AnalyticsVisitsSales />
      </AnalysisChartCard>
    </div>
  </div>
</template>
