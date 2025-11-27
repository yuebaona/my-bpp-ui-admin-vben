<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { logQueryColumns, logQueryFormSchema } from '../data';

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
    await gridApi.reload();
  },
  handleReset: async () => {
    formApi.resetForm();
    await gridApi.reload();
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
          // 模拟数据
          const list = Array.from({ length: 10 }).map((_, index) => ({
            id: index,
            mainPlanNo: `MP${Date.now()}${index}`,
            isRelease: index % 2 === 0 ? 'Y' : 'N',
            acceptancePlanNo: `AP${Date.now()}${index}`,
            containerHolder: `Holder ${index}`,
            tradeType: index % 2 === 0 ? '内贸' : '外贸',
            iso: '22G1',
            containerAreaRange: 'A01-A05',
            mainGateReleaseQty: 100 + index,
            modifier: 'admin',
            modifyTime: '2023-10-27 10:00:00',
            modifyType: index === 0 ? '创建' : index === 1 ? '修改' : '删除',
          }));

          return {
            items: list,
            total: 100,
          };
        },
      },
    },
  } as VxeTableGridOptions<any>,
});

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
