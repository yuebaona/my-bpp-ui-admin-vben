// 箱信息组件
<script setup lang="ts">
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Card } from 'ant-design-vue';

import {
  boxInfoColumns,
  boxInfoSearchFormSchema,
} from '#/views/bpp/changeorder/current/history/container/data';
import {ACTION_ICON, TableAction} from "#/components/table-action";

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: boxInfoSearchFormSchema(),
    wrapperClass: 'grid-cols-1 md:grid-cols-2',
  },
  gridOptions: {
    columns: boxInfoColumns(),
    height: '385px',
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

// const checkedIds = ref<number[]>([]);
function handleAddToEdit() {}
</script>

<template>
  <Card title="箱信息列表" class="w-4/5">
    <Grid>
      <template #toolbar-tools>
        <TableAction
          :actions="[
                {
                  label: '加入修改',
                  type: 'primary',
                  icon: ACTION_ICON.ADD,
                  auth: ['system:user:create'],
                  onClick: handleAddToEdit,
                },
          ]"
        />
      </template>
    </Grid>
  </Card>
</template>
