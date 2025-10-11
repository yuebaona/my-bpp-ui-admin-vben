<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    legend: {
      bottom: 0,
      data: ['本月', '上月'],
    },
    radar: {
      indicator: [
        {
          name: '在港集装箱',
          max: 100,
        },
        {
          name: '吞吐量',
          max: 100,
        },
        {
          name: '装卸效率',
          max: 100,
        },
        {
          name: '船舶周转率',
          max: 100,
        },
        {
          name: '堆场利用率',
          max: 100,
        },
        {
          name: '集卡等待时间',
          max: 100,
        },
      ],
      radius: '65%',
    },
    series: [
      {
        areaStyle: {},
        data: [
          {
            itemStyle: {
              color: '#b6a2de',
            },
            name: '本月',
            value: [85, 92, 88, 76, 90, 65],
          },
          {
            itemStyle: {
              color: '#5ab1ef',
            },
            name: '上月',
            value: [78, 85, 80, 68, 82, 75],
          },
        ],
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        lineStyle: {
          width: 2,
        },
        name: '业务指标',
        symbolSize: 0,
        type: 'radar',
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
