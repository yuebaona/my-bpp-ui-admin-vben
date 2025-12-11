// 单箱修改
<script setup lang="ts">
import { Card } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { boxlistColumns } from '#/views/bpp/changeorder/current/history/container/data';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
    columns: boxlistColumns(),
    height: '300px',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: false,
      custom: false,
      import: false,
      refresh: false,
      zoom: false,
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
  <Card title="单箱修改">
    <Grid />
  </Card>
</template>
