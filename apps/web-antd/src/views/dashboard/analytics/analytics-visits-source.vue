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
        '进口卸货',
        '出口装货',
        '堆场中转',
        '修箱维护',
        '报关清关',
        '熏蒸检疫',
      ],
    },
    series: [
      {
        animationDelay() {
          return Math.random() * 400;
        },
        animationEasing: 'exponentialInOut',
        animationType: 'scale',
        center: ['50%', '50%'],
        color: [
          '#5ab1ef',
          '#b6a2de',
          '#67e0e3',
          '#2ec7c9',
          '#ff7875',
          '#ffa940',
        ],
        data: [
          { name: '进口卸货', value: 4200 },
          { name: '出口装货', value: 3800 },
          { name: '堆场中转', value: 1500 },
          { name: '修箱维护', value: 650 },
          { name: '报关清关', value: 950 },
          { name: '熏蒸检疫', value: 480 },
        ].sort((a, b) => {
          return a.value - b.value;
        }),
        name: '集装箱操作类型',
        radius: ['40%', '80%'],
        type: 'pie',
      },
    ],
    tooltip: {
      formatter: '{b}: {c} 箱次 ({d}%)',
      trigger: 'item',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
