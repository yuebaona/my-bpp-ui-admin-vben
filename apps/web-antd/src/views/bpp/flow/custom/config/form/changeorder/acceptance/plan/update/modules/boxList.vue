// 集装箱列表
<script setup lang="ts">
import { Card } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { inboxInfoColumns } from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/data';

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
    columns: inboxInfoColumns(),
    height: '300px',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: true,
      custom: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    proxyConfig: {
      autoLoad: false,
    },
  },
});
</script>
<template>
  <Card title="集装箱列表">
    <Grid />
  </Card>
</template>
