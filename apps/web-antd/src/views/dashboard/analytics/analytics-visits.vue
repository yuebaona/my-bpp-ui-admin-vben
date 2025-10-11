<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    grid: {
      bottom: '10%',
      containLabel: true,
      left: '3%',
      right: '4%',
      top: '8%',
    },
    series: [
      {
        barMaxWidth: 80,
        color: '#5ab1ef',
        data: [
          12_500, 13_200, 14_800, 16_500, 18_200, 19_500, 21_000, 22_500,
          24_800, 26_500, 28_200, 30_500, 32_800,
        ],
        name: '月度吞吐量',
        type: 'bar',
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#5ab1ef',
          width: 1,
        },
      },
      formatter: '{b}: {c} TEU',
      trigger: 'axis',
    },
    xAxis: {
      data: Array.from({ length: 13 }).map((_item, index) => `${index + 1}月`),
      type: 'category',
    },
    yAxis: {
      axisLabel: {
        formatter: '{value} TEU',
      },
      max: 35_000,
      splitNumber: 5,
      type: 'value',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
