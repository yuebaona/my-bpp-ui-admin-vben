<script lang="ts" setup>
// import type { PageParam } from '@vben/request';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
// import type { EmptyContainerControlApi } from '#/api/bpp/emptycontainercontrol';
import type { LogQueryParams } from '#/api/bpp/empty/container/control';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getLogQueryPage } from '#/api/bpp/empty/container/control';

import {
  logQueryColumns,
  logQueryFormSchema,
  // STATIC_MASTER_PLAN_QUERY_DATA,
} from '../data';

const formValues = reactive({});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 80,
  },
  schema: logQueryFormSchema(),
  showDefaultActions: true,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  actionWrapperClass: 'col-span-1 text-right',
  handleValuesChange: (values) => {
    Object.assign(formValues, values);
  },
  handleSubmit: async () => {
    await handleQuery();
  },
  handleReset: async () => {
    formApi.resetForm();
    Object.assign(formValues, {});
    await handleQuery();
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: logQueryColumns(),
    height: '500px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: {
      enabled: true,
      pageSize: 10,
    },
    toolbarConfig: {
      custom: false,
      refresh: false,
      zoom: false,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const params: LogQueryParams = {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          };
          const res = await getLogQueryPage(params);
          return {
            list: res.list,
            total: res.total,
          };
        },
      },
    },
  } as VxeTableGridOptions<any>,
});

/** 查询处理函数 */
const handleQuery = async () => {
  try {
    await gridApi.query();
  } catch (error) {
    console.error('查询失败:', error);
  }
};

const [Modal, modalApi] = useVbenModal({
  title: '日志查询',
  fullscreen: false,
  class: 'w-[95vw] max-w-[1450px]',
  onOpened() {
    handleQuery();
  },
  onConfirm: () => {
    modalApi.close();
  },
});
</script>

<template>
  <Modal>
    <div class="flex flex-col gap-4 p-4">
      <Form />
      <Grid />
    </div>
  </Modal>
</template>
