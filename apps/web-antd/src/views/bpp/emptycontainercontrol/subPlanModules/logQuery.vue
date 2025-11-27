<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import {onMounted, reactive} from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { logQueryColumns, logQueryFormSchema } from '../data';

// import {
//   getLogQueryData, // 后续启用真实接口时取消注释
// } from '#/api/bpp/emptycontainercontrol';

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
        query: async ({ page }) => {
          // 这里会通过 handleQuery 方法设置数据
          // 初始状态返回空数据
          return {
            list: [],
            total: 0,
          };
        },
      },
    },
  } as VxeTableGridOptions<any>,
});

/** 查询处理函数 */
const handleQuery = async () => {
  try {
    // TODO: 后续启用真实接口时取消注释以下代码，并注释掉模拟数据部分
    // const params = {
    //   pageNo: 1,
    //   pageSize: 10,
    //   ...formValues
    // };
    // const res = await getLogQueryData(params);
    // gridApi.reload(res);

    // 暂时使用固定数据模拟接口返回
    const mockResponse = {
      list: STATIC_MASTER_PLAN_QUERY_DATA,
      total: STATIC_MASTER_PLAN_QUERY_DATA.length
    };

    gridApi.reload(mockResponse);

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

// 弹窗打开时自动查询数据（可选）
// modalApi.onOpen(() => {
//   handleQuery();
// });

// 组件挂载时自动加载数据
onMounted(() => {
  handleQuery();
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
