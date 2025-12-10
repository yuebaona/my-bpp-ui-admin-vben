<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';

import { bundleBoxColumns } from '../data';

const emit = defineEmits(['success']);

// 模拟数据 - 实际项目中应该从API获取
const bundleBoxData = reactive<any[]>([
  {
    position: '1',
    containerNo: 'BL001',
    mainContainerNo: '电子产品',
    size: '50',
    containerType: '100',
    containerHeight: '5000',
    volume: '10',
  },
  {
    position: '2',
    containerNo: 'BL002',
    mainContainerNo: '服装',
    size: '20',
    containerType: '200',
    containerHeight: '4000',
    volume: '15',
  },
  {
    position: '3',
    containerNo: 'BL003',
    mainContainerNo: '机械零件',
    size: '100',
    containerType: '50',
    containerHeight: '5000',
    volume: '8',
  },
]);

// 新增行方法
const addNewRow = () => {
  const newRow = {
    position: (bundleBoxData.length + 1).toString(),
    containerNo: '',
    mainContainerNo: '',
    size: '',
    containerType: '',
    containerHeight: '',
    iso: '',
  };
  bundleBoxData.push(newRow);
};

// 删除行方法
const deleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  await $grid.remove(row);
};

// 保存数据方法
const saveData = () => {
  // 这里应该调用API保存数据
  message.success('数据保存成功');
  emit('success');
};

// 表格配置
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: bundleBoxColumns(),
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
    data: bundleBoxData,
  } as VxeTableGridOptions<any>,
});

// 模态框配置
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    await saveData();
    modalApi.close();
  },
});
</script>

<template>
  <Modal title="提单信息管理" @success="emit('success')">
    <Grid>
      <!-- 操作列模板 -->
      <template #operationAction="{ row }">
        <TableAction
          :actions="[
            {
              label: '删除',
              type: 'link',
              danger: true,
              onClick: () => deleteRow(row),
            },
          ]"
        />
      </template>
    </Grid>
    <div class="mt-2">
      <Button type="dashed" block @click="addNewRow"> + 新增一行 </Button>
    </div>
  </Modal>
</template>
