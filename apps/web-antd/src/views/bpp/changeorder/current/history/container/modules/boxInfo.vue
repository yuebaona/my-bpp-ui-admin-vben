// 箱信息组件
<script setup lang="ts">
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Card, message } from 'ant-design-vue';

import { ACTION_ICON, TableAction } from '#/components/table-action';
import {
  boxInfoColumns,
  boxInfoSearchFormSchema,
} from '#/views/bpp/changeorder/current/history/container/data';

const emit = defineEmits(['addToEdit']);

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
      pageSizes: [
        {
          label: '10',
          value: 10,
        },
        {
          label: '25',
          value: 25,
        },
        {
          label: '50',
          value: 50,
        },
        {
          label: '100',
          value: 100,
        },
        {
          label: '1000',
          value: 1000,
        },
        {
          label: '10000',
          value: 10_000,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
    },
    editRules: {
      // applicantCompanyName: [{ required: true, content: '是否放箱不能为空' }],
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          // 模拟假数据
          const mockData = [
            {
              id: '1',
              contNo: 'CONT1',
              vesselVoyage: 'COSCO SHIPPING 001',
              pickupNo: 'TD1',
              sealNo: 'PL12345',
              ownerCode: '111',
              containerFlow: '进口',
              containerStatus: '正常',
            },
            {
              id: '2',
              contNo: 'CONT2',
              vesselVoyage: 'MAERSK 002',
              pickupNo: 'TD2',
              sealNo: 'PL67890',
              ownerCode: '222',
              containerFlow: '出口',
              containerStatus: '异常',
            },
            {
              id: '3',
              contNo: 'CONT3',
              vesselVoyage: 'HAPAG LLOYD 003',
              pickupNo: 'TD3',
              sealNo: 'PL13579',
              ownerCode: '333',
              containerFlow: '中转',
              containerStatus: '正常',
            },
            {
              id: '4',
              contNo: 'CONT4',
              vesselVoyage: 'OOCL 004',
              pickupNo: 'TD4',
              sealNo: 'PL24680',
              ownerCode: '444',
              containerFlow: '进口',
              containerStatus: '正常',
            },
            {
              id: '5',
              contNo: 'CONT5',
              vesselVoyage: 'YANG MING 005',
              pickupNo: 'TD5',
              sealNo: 'PL97531',
              ownerCode: '555',
              containerFlow: '出口',
              containerStatus: '异常',
            },
          ];

          return {
            total: mockData.length,
            list: mockData,
          };
        },
      },
    },
  },
});

// 加入修改
function handleAddToEdit() {
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning('请至少选择一条箱信息');
    return;
  }
  emit('addToEdit', selectedRows);
  message.success(`已选择 ${selectedRows.length} 条箱信息加入修改`);
}
</script>

<template>
  <Card title="箱信息列表" class="w-full">
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
