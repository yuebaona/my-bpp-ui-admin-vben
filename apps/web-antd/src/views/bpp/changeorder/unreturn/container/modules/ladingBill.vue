<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';

import { ladingBillColumns } from '../data';
import { IconifyIcon } from "@vben/icons";

const emit = defineEmits(['success']);

// 模拟数据 - 实际项目中应该从API获取
const ladingBillData = reactive<any[]>([
  {
    position: '1',
    pickupNo: 'BL001',
    cargo: '电子产品',
    packageWeight: '50',
    quantity: '100',
    totalWeight: '5000',
    volume: '10',
  },
  {
    position: '2',
    pickupNo: 'BL002',
    cargo: '服装',
    packageWeight: '20',
    quantity: '200',
    totalWeight: '4000',
    volume: '15',
  },
  {
    position: '3',
    pickupNo: 'BL003',
    cargo: '机械零件',
    packageWeight: '100',
    quantity: '50',
    totalWeight: '5000',
    volume: '8',
  },
]);

// 新增行方法
const addNewRow = () => {
  const newRow = {
    position: (ladingBillData.length + 1).toString(),
    pickupNo: '',
    cargo: '',
    packageWeight: '',
    quantity: '',
    totalWeight: '',
    volume: '',
  };
  ladingBillData.push(newRow);
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
    columns: ladingBillColumns(),
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
    data: ladingBillData,
    showFooter: true,
    mergeFooterItems: [
      { row: 0, col: 0, rowspan: 1, colspan: 9 },
    ],
    footerData: [
      {
        checkbox: 'BUTTON',
      },
    ]
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
      <template #checkbox="{ row }">
        <Button
          type="dashed"
          @click="addNewRow"
          class="w-full"
        >
          <template #icon>
            <IconifyIcon icon="si:add-fill" style="font-size: 16px" />
          </template>
          新增一行
        </Button>
      </template>
    </Grid>
<!--    <div class="mt-2">-->
<!--      <Button type="dashed" block @click="addNewRow"> + 新增一行 </Button>-->
<!--    </div>-->
  </Modal>
</template>
