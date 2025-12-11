// 箱信息组件
<script setup lang="ts">
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Card } from 'ant-design-vue';

import {
  boxInfoColumns,
  boxInfoSearchFormSchema,
} from '#/views/bpp/changeorder/current/history/container/data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: boxInfoSearchFormSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-1 md:grid-cols-2',
  },
  gridOptions: {
    columns: boxInfoColumns(),
    height: '300px',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: false,
      custom: true,
      export: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    editRules: {
      // applicantCompanyName: [{ required: true, content: '是否放箱不能为空' }],
    },
    proxyConfig: {},
  },
});
</script>

<template>
  <Card title="箱信息列表">
    <Grid />
  </Card>
</template>
