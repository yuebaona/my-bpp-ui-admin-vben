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
    legend: {
      data: ['进口集装箱', '出口集装箱'],
      top: 0,
    },
    series: [
      {
        areaStyle: {},
        data: [
          120, 350, 580, 720, 950, 1200, 1450, 1600, 1350, 1100, 850, 620, 450,
          320, 280, 420, 580, 720,
        ],
        itemStyle: {
          color: '#5ab1ef',
        },
        name: '进口集装箱',
        smooth: true,
        type: 'line',
      },
      {
        areaStyle: {},
        data: [
          80, 220, 450, 680, 850, 1050, 1300, 1500, 1250, 980, 720, 480, 350,
          280, 320, 550, 780, 920,
        ],
        itemStyle: {
          color: '#019680',
        },
        name: '出口集装箱',
        smooth: true,
        type: 'line',
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#019680',
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      axisTick: {
        show: false,
      },
      boundaryGap: false,
      data: Array.from({ length: 18 }).map((_item, index) => `${index + 6}:00`),
      splitLine: {
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        show: true,
      },
      type: 'category',
    },
    yAxis: [
      {
        axisLabel: {
          formatter: '{value} TEU',
        },
        axisTick: {
          show: false,
        },
        max: 2000,
        splitArea: {
          show: true,
        },
        splitNumber: 4,
        type: 'value',
      },
    ],
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
