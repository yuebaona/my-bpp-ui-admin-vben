<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { gatePlanColumns } from '../data';
const emit = defineEmits(['success']);

const containerData = reactive<any[]>([
  {
    planNo: 'BL001',
    isRelease: true,
    bayRanges: 'test',
    availableQuantity: 50,
  },
]);

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: gatePlanColumns(),
    height: '400px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'position',
      isHover: true,
    },
    editConfig: {
      mode: 'cell',
      showIcon: false,
      trigger: 'click',
    },
    toolbarConfig: {
      enabled: false,
      // refresh: false,
      // search: false,
      // zoom: false,
      // custom: true,
      // slots: {
      //   custom: 'toolbar-custom',
      // },
    },
    pagerConfig: {
      enabled: false,
    },
    data: containerData,
  } as VxeTableGridOptions<any>,
});

const [Modal, modalApi] = useVbenModal({
  showConfirmButton: false,
  async onConfirm() {
    modalApi.close();
  },
});
</script>

<template>
  <Modal title="闸口计划" @success="emit('success')">
    <Grid />
  </Modal>
</template>
