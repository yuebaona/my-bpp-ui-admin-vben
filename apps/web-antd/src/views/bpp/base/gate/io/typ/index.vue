<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getGateInOutTypePage,
  updateGateInOutType,
  deleteGateInOutType,
  createGateInOutType,
  batchDeleteGateInOutType
} from '#/api/bpp/base/gate/io/typ';

import {
  gateIOColumns,
  gateIOSearchSchema,
  transportInstructionColumns,
} from './data';


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
      trigger: 'manual',
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

async function handleBatchDelete() {
  const $grid = gateIOTypeGridApi.grid;
  if (!$grid) return;

  // 获取选中的行
  const selectedRecords = $grid.getCheckboxRecords();
  if (selectedRecords.length === 0) {
    console.warn('请选择要删除的记录');
    return;
  }

  // 提取 id
  const ids = selectedRecords.map(record => record.id);

  try {
    await batchDeleteGateInOutType(ids);
    // 刷新表格
    await gateIOTypeGridApi.query();
    console.log('批量删除成功:', ids);
  } catch (error) {
    console.error('批量删除失败:', error);
  }
}

function handleRefresh() {
  gateIOTypeGridApi.query();
  transportInstructionGridApi.query();
}

function isEditing(row: any) {
  return gateIOTypeGridApi.grid?.isEditByRow(row);
}

function handleEdit(row: any) {
  gateIOTypeGridApi.grid?.setEditRow(row);
}

async function handleSave(row: any) {
  try {
    await gateIOTypeGridApi.grid?.clearEdit();

    // 判断是新增还是更新
    if (row.__isNew__ === true){
      await createGateInOutType(row);
      console.log('新增成功:', row);
    } else {
      await updateGateInOutType(row);
      console.log('更新成功:', row);
    }
    // 刷新表格
    await gateIOTypeGridApi.query();
    console.log('保存成功:', row);
  } catch (error) {
    console.error('保存失败:', error);
  }
}

function handleCancel(row: any) {
  gateIOTypeGridApi.grid?.clearEdit();
  // 如果是新增的行，删除该行；否则恢复原始数据
  if (row.__isNew__ === true){
    gateIOTypeGridApi.grid?.remove(row);
  } else {
    gateIOTypeGridApi.grid?.revertData(row);
  }
}

async function handleDelete(row: any) {
  try {
    await deleteGateInOutType(row.id);
    // 刷新表格
    await gateIOTypeGridApi.query();
    console.log('删除成功:', row);
  } catch (error) {
    console.error('删除失败:', error);
  }
}

async function handleAdd() {
  const $grid = gateIOTypeGridApi.grid;
  if (!$grid) return;

  const { row: newRow } = await $grid.insertAt({ id: null }, -1);
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
                onClick: () => handleAdd(),
              },
              {
                label: '批量删除',
                type: 'info',
                icon: ACTION_ICON.DELETE,
                onClick: handleBatchDelete,
              },
              {
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.FILE,
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
              },
            ]"
          />
        </template>
      </TransportInstructionGrid>
    </div>
  </Page>
</template>
