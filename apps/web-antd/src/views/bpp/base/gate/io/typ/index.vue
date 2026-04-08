<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchDeleteGateInOutType,
  batchDeleteTransportType,
  createGateInOutType,
  createTransportInstruction,
  deleteGateInOutType,
  deleteTransportInstruction,
  getGateInOutTypePage,
  getTransportInstructionPage,
  updateGateInOutType,
  updateTransportInstruction,
} from '#/api/bpp/base/gate/io/typ';

import {
  gateIOColumns,
  gateIOSearchSchema,
  transportInstructionColumns,
} from './data';

// 当前选中的送提箱类型ID
const selectedGateIoTypeId = ref<null | number>(null);
const debouncedHandleGateIOAdd = useDebounceFn(handleGateIOAdd, 300);
const debouncedHandleTransportAdd = useDebounceFn(handleTransportAdd, 300);

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
    editConfig: {
      mode: 'row',
      showIcon: false,
      showStatus: true,
      trigger: 'dblclick',
      // autoClear: false,
    },
    mouseConfig: {
      selected: true,  // 启用单元格选中功能，Tab切换需要此配置
    },
    keyboardConfig: {
      isArrow: true,      // 支持上下左右键移动单元格
      // isEnter: true,      // 支持回车键保存或移动
      isTab: true,        // 支持Tab键切换单元格
      isEsc: true,        // 支持Esc键退出编辑
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
  gridEvents: {
    cellClick: handleRowClick,
    checkboxChange: handleCheckboxChange,
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
    editConfig: {
      mode: 'row',
      showIcon: false,
      showStatus: true,
      trigger: 'dblclick',
      // autoClear: false,
    },
    mouseConfig: {
      selected: true,  // 启用单元格选中功能，Tab切换需要此配置
    },
    keyboardConfig: {
      isArrow: true,      // 支持上下左右键移动单元格
      // isEnter: true,      // 支持回车键保存或移动
      isTab: true,        // 支持Tab键切换单元格
      isEsc: true,        // 支持Esc键退出编辑
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
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          const res = await getTransportInstructionPage({
            gateIoTypIds: selectedGateIoTypeId.value || 0,
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

// 行点击事件处理函数
function handleRowClick({ row, column }: { column: any; row: any; }) {
  // 检查是否处于编辑状态，或点击的是操作栏，如果是则不触发行点击逻辑
  if (!isEditing(row) && column.title !== '操作') {
    selectedGateIoTypeId.value = row.id;
    transportInstructionGridApi.query();
  }
}

// 勾选事件处理函数
function handleCheckboxChange({ records }: { records: any[] }) {
  if (records.length > 0) {
    // 总是使用最后勾选的记录（最新勾选的）
    const latestSelectedRecord = records[records.length - 1];
    selectedGateIoTypeId.value = latestSelectedRecord.id;
    transportInstructionGridApi.query();
  } else {
    // 未选择时清空选中状态
    selectedGateIoTypeId.value = null;
    transportInstructionGridApi.query();
  }
}

// 送提箱类型批量删除
async function handleBatchDelete() {
  const $grid = gateIOTypeGridApi.grid;
  if (!$grid) return;

  // 获取选中的行
  const selectedRecords = $grid.getCheckboxRecords();
  if (selectedRecords.length === 0) {
    message.warning('请选择要删除的记录');
    return;
  }

  // 提取 id
  const ids = selectedRecords.map((record) => record.id);

  try {
    await batchDeleteGateInOutType(ids);
    // 刷新表格
    await gateIOTypeGridApi.query();
  } catch (error) {
    console.error('批量删除失败:', error);
  }
}

// 运输指令批量删除
async function handleBatchTransportDelete() {
  const $grid = transportInstructionGridApi.grid;
  if (!$grid) return;

  // 获取选中的行
  const selectedRecords = $grid.getCheckboxRecords();
  if (selectedRecords.length === 0) {
    message.warning('请选择要删除的运输指令类型记录');
    return;
  }

  // 提取 id
  const ids = selectedRecords.map((record) => record.id);

  try {
    await batchDeleteTransportType(ids);
    // 刷新表格
    await transportInstructionGridApi.query();
  } catch (error) {
    console.error('批量删除运输指令类型失败:', error);
  }
}

// 编辑状态
function isEditing(row: any) {
  if (row.gateIoTypId) {
    return transportInstructionGridApi.grid?.isEditByRow(row);
  } else {
    return gateIOTypeGridApi.grid?.isEditByRow(row);
  }
}

// 编辑
function handleEdit(row: any) {
  if (row.gateIoTypId) {
    transportInstructionGridApi.grid?.setEditRow(row);
  } else {
    gateIOTypeGridApi.grid?.setEditRow(row);
  }
}

// 保存操作
async function handleSave(row: any) {
  try {
    if (row.gateIoTypId) {
      await transportInstructionGridApi.grid?.clearEdit();

      if (row.__isNew__ === true) {
        await createTransportInstruction(row);
      } else {
        await updateTransportInstruction(row);
      }
      // 刷新表格
      await transportInstructionGridApi.query();

    } else {
      await gateIOTypeGridApi.grid?.clearEdit();

      // 判断是新增还是更新
      if (row.__isNew__ === true) {
        await createGateInOutType(row);
      } else {
        await updateGateInOutType(row);
      }
      // 刷新表格
      await gateIOTypeGridApi.query();
    }
  } catch (error) {
    console.error('保存失败:', error);
  }
}

// 取消操作
function handleCancel(row: any) {
  if (row.gateIoTypId) {
    transportInstructionGridApi.grid?.clearEdit();
    // 如果是新增的行，删除该行；否则恢复原始数据
    if (row.__isNew__ === true) {
      transportInstructionGridApi.grid?.remove(row);
    } else {
      transportInstructionGridApi.grid?.revertData(row);
    }
  } else {
    gateIOTypeGridApi.grid?.clearEdit();
    // 如果是新增的行，删除该行；否则恢复原始数据
    if (row.__isNew__ === true) {
      gateIOTypeGridApi.grid?.remove(row);
    } else {
      gateIOTypeGridApi.grid?.revertData(row);
    }
  }
}

// 删除定义
async function handleDelete(row: any) {
  try {
    if (row.gateIoTypId) {
      await deleteTransportInstruction(row.id);
      // 刷新表格
      await transportInstructionGridApi.query();
    } else {
      await deleteGateInOutType(row.id);
      // 刷新表格
      await gateIOTypeGridApi.query();
    }
  } catch (error) {
    console.error('删除失败:', error);
  }
}

// 新增送提箱定义
async function handleGateIOAdd() {
  const $grid = gateIOTypeGridApi.grid;
  if (!$grid) return;

  const { row: newRow } = await $grid.insertAt({ id: null, isValid: true }, -1);
  newRow.__isNew__ = true;
  await $grid.setEditRow(newRow);
}

// 新增运输指令定义
async function handleTransportAdd() {
  const $grid = transportInstructionGridApi.grid;
  if (!$grid) return;

  // 检查是否已选择且仅选择了一个送提箱类型
  const $gateGrid = gateIOTypeGridApi.grid;
  if (!$gateGrid) return;

  const selectedRecords = $gateGrid.getCheckboxRecords();
  if (selectedRecords.length === 0) {
    message.warning('请先选择一个送提箱受理计划类型定义');
    return;
  }
  if (selectedRecords.length > 1) {
    message.warning('只能选择一个送提箱受理计划类型定义');
    return;
  }

  // 获取选中的送提箱类型ID
  const selectedGateId = selectedRecords[0].id;
  selectedGateIoTypeId.value = selectedGateId;

  // 在运输指令列表中添加可编辑的空白行
  const { row: newRow } = await $grid.insertAt(
    {
      id: null,
      gateIoTypId: selectedGateId,
      isValid: true,
      isUsedForPln: true,
    },
    -1,
  );
  newRow.__isNew__ = true;
  await $grid.setEditRow(newRow);
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
                onClick: debouncedHandleGateIOAdd,
              },
              {
                label: '批量删除',
                type: 'default',
                icon: ACTION_ICON.DELETE,
                onClick: handleBatchDelete,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            v-if="!isEditing(row)"
            :actions="[
              {
                label: '编辑',
                type: 'link',
                icon: ACTION_ICON.EDIT,
                onClick: () => handleEdit(row),
              },
              {
                label: '删除',
                type: 'link',
                danger: true,
                icon: ACTION_ICON.DELETE,
                popConfirm: {
                  title: '确定要删除该定义吗？',
                  onConfirm: () => handleDelete(row),
                  placement: 'top',
                },
              },
            ]"
          />
          <TableAction
            v-else
            :actions="[
              {
                label: '保存',
                type: 'link',
                onClick: () => handleSave(row),
              },
              {
                label: '取消',
                type: 'link',
                onClick: () => handleCancel(row),
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
                onClick: debouncedHandleTransportAdd,
              },
              {
                label: '批量删除',
                type: 'default',
                icon: ACTION_ICON.DELETE,
                onClick: handleBatchTransportDelete,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            v-if="!isEditing(row)"
            :actions="[
              {
                label: '编辑',
                type: 'link',
                icon: ACTION_ICON.EDIT,
                onClick: () => handleEdit(row),
              },
              {
                label: '删除',
                type: 'link',
                danger: true,
                icon: ACTION_ICON.DELETE,
                popConfirm: {
                  title: '确定要删除该定义吗？',
                  onConfirm: () => handleDelete(row),
                  placement: 'top',
                },
              },
            ]"
          />
          <TableAction
            v-else
            :actions="[
              {
                label: '保存',
                type: 'link',
                onClick: () => handleSave(row),
              },
              {
                label: '取消',
                type: 'link',
                onClick: () => handleCancel(row),
              },
            ]"
          />
        </template>
      </TransportInstructionGrid>
    </div>
  </Page>
</template>
