<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    legend: {
      bottom: 10,
      left: 'center',
      data: [
        '20英尺集装箱',
        '40英尺集装箱',
        '45英尺集装箱',
        '特种集装箱',
        '冷藏集装箱',
        '开顶集装箱',
      ],
    },
    series: [
      {
        itemStyle: {
          borderRadius: 4,
        },
        data: [
          {
            name: '20英尺集装箱',
            value: 3500,
          },
          {
            name: '40英尺集装箱',
            value: 4800,
          },
          {
            name: '45英尺集装箱',
            value: 850,
          },
          {
            name: '特种集装箱',
            value: 620,
          },
          {
            name: '冷藏集装箱',
            value: 1250,
          },
          {
            name: '开顶集装箱',
            value: 480,
          },
        ],
        label: {
          show: false,
        },
        roseType: 'radius',
        radius: ['20%', '75%'],
        type: 'pie',
      },
    ],
    tooltip: {
      formatter: '{b}: {c} TEU ({d}%)',
      trigger: 'item',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
