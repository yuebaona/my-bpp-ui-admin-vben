<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getGateInOutTypePage } from '#/api/bpp/base/gate/io/typ';

import {
  gateIOColumns,
  gateIOSearchSchema,
  transportInstructionColumns,
} from './data';

const editingRow = ref<null | string>(null);

const [GateIOTypeGrid, gateIOTypeGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: gateIOSearchSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    columns: gateIOColumns(),
    height: 'auto',
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: true,
      custom: true,
      export: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
      pageSizes: [10, 20, 50, 100],
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const res = await getGateInOutTypePage({
            ...formValues,
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          });
          return {
            list: res.list,
            total: res.total,
          };
        },
      },
    },
  },
});

const [TransportInstructionGrid, transportInstructionGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: transportInstructionColumns(),
    height: 'auto',
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: false,
      custom: false,
      export: true,
      // import: true,
      refresh: false,
      zoom: false,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
      pageSizes: [10, 20, 50, 100],
    },
  },
});

function handleRefresh() {
  gateIOTypeGridApi.query();
  transportInstructionGridApi.query();
}

</script>

<template>
  <Page auto-content-height>
    <div class="mb-3 h-3/5 w-full">
      <GateIOTypeGrid table-title="送提箱受理计划类型定义">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增受理计划类型',
                type: 'primary',
                icon: ACTION_ICON.ADD,
              },
              {
                label: '批量删除',
                type: 'info',
                icon: ACTION_ICON.DELETE,
              },
              {
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.FILE,
              },
            ]"
          />
        </template>
      </GateIOTypeGrid>
    </div>
    <div class="h-2/5 w-full">
      <TransportInstructionGrid table-title="运输指令类型定义">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增运输指令类型',
                type: 'primary',
                icon: ACTION_ICON.ADD,
              },
            ]"
          />
        </template>
      </TransportInstructionGrid>
    </div>
  </Page>
</template>
