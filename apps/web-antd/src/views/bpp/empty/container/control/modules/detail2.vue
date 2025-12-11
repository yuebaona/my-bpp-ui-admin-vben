<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { useDescription } from '#/components/description';

import { containerAreaRangeColumns, mainPlanDetailSchema } from '../data';
// 主计划信息
const containerData = reactive<EmptyContainerControlApi.mainPlanVO[]>([]);
const formData = ref<EmptyContainerControlApi.mainPlanVO>();
const [Descriptions] = useDescription({
  componentProps: {
    bordered: true,
    column: 2,
    class: 'm-10',
    size: 'small',
    title: '基础信息',
    labelMinWidth: 30,
  },
  labelStyle: {
    textAlign: 'right',
  },
  contentStyle: {
    textAlign: 'left',
  },
  schema: mainPlanDetailSchema(),
});
const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: containerAreaRangeColumns().filter(
      (col) => col.type !== 'checkbox' && col.title !== '操作',
    ),
    height: '250px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: false,
      search: false,
      zoom: false,
      custom: false,
    },
    pagerConfig: {
      enabled: false,
    },
    data: containerData,
    showFooter: true,
  } as VxeTableGridOptions<EmptyContainerControlApi.mainPlanVO>,
});

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    // 加载数据
    const data = modalApi.getData<EmptyContainerControlApi.mainPlanVO>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = data;
    } finally {
      modalApi.unlock();
    }
  },
});
</script>
<template>
  <Modal title="主计划详情" class="w-1/2">
    <Descriptions :data="formData" />
    <div>
      <div class="ant-descriptions-title">箱区范围</div>
      <Grid />
    </div>
  </Modal>
</template>
<style scoped lang="scss">
.ant-descriptions-title {
  flex: auto;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 6px;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: rgb(50 54 57 / 88%);
  white-space: nowrap;
}
</style>
