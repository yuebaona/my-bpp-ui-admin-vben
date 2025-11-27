<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { logQueryColumns, logQueryFormSchema } from '../data';
// import { getLogQueryData } from '#/api/bpp/emptycontainercontrol';
import { STATIC_MASTER_PLAN_QUERY_DATA } from '../data';

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
    // 重置时清空表格数据
    gridApi.reload({ list: [], total: 0 });
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
        // query: async ({ page }, formValues) => {
        //   // 调用后端接口获取数据
        //   const res = await getLogQueryData({
        //     pageNo: page.currentPage,
        //     pageSize: page.pageSize,
        //     ...formValues,
        //   });
        //
        //   return {
        //     list: res.items,
        //     total: res.total,
        //   };
        // },
        query: async () => {
          return {
            list: STATIC_MASTER_PLAN_QUERY_DATA,
            total: STATIC_MASTER_PLAN_QUERY_DATA.length
          }
        },
      },
    },
  } as VxeTableGridOptions<any>,
});

/** 查询处理函数 */
const handleQuery = async () => {
  try {
    // 触发表格重新加载数据
    gridApi.reload();
  } catch (error) {
    console.error('查询失败:', error);
  }
};

const [Modal, modalApi] = useVbenModal({
  title: '日志查询',
  fullscreen: false,
  class: 'w-[95vw] max-w-[1450px]',
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
