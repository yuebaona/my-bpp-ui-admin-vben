<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchDeleteGateInOutType,
  batchSaveGateInOutTypeAndTransport,
  getGateInOutTypePage,
  getTransportInstructionPage,
} from '#/api/bpp/base/gate/io/typ';

import {
  gateIOColumns,
  gateIOSearchSchema,
  transportInstructionColumns,
} from './data';

// 当前选中的送提箱类型ID
const selectedGateIoTypeId = ref<null | number>(null);
const debouncedHandleGateIOAdd = useDebounceFn(handleGateIOAdd, 300);

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
    border: true,
    columns: gateIOColumns(),
    height: 'auto',
    keepSource: true,
    rowConfig: {
      // keyField: 'id',
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
      selected: true, // 启用单元格选中功能，Tab切换需要此配置
    },
    keyboardConfig: {
      isArrow: true, // 支持上下左右键移动单元格
      isEnter: true, // 支持回车键保存或移动
      isTab: true, // 支持Tab键切换单元格
      isEsc: true, // 支持Esc键退出编辑
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
    // editClosed: handleGateIOEditClosed,
  },
});

const [TransportInstructionGrid, transportInstructionGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: transportInstructionColumns(),
    height: 'auto',
    keepSource: true,
    rowConfig: {
      // keyField: 'id',
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
      selected: true, // 启用单元格选中功能，Tab切换需要此配置
    },
    keyboardConfig: {
      isArrow: true, // 支持上下左右键移动单元格
      isEnter: true, // 支持回车键保存或移动
      isTab: true, // 支持Tab键切换单元格
      isEsc: true, // 支持Esc键退出编辑
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
  gridEvents: {
    // editClosed: handleTransportEditClosed,
  },
});

// 行点击事件处理函数
function handleRowClick({ row }: { row: any }) {
  selectedGateIoTypeId.value = row.id;
  transportInstructionGridApi.query();
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

async function handleSave() {
  const $gateGrid = gateIOTypeGridApi.grid;
  const $transportGrid = transportInstructionGridApi.grid;

  if (!$gateGrid || !$transportGrid) return;

  // 获取进提箱类型的新增和修改记录
  const gateRecordset = $gateGrid.getRecordset();
  const gateModifiedRecords = [
    ...gateRecordset.insertRecords,
    ...gateRecordset.updateRecords,
  ];

  // 获取运输指令类型的新增和修改记录
  const transportRecordset = $transportGrid.getRecordset();
  const transportModifiedRecords = [
    ...transportRecordset.insertRecords,
    ...transportRecordset.updateRecords,
  ];

  if (
    gateModifiedRecords.length === 0 &&
    transportModifiedRecords.length === 0
  ) {
    message.info('没有需要保存的记录');
    return;
  }

  try {
    // 构建保存数据结构
    const saveData = [];

    // 处理进提箱类型记录
    for (const gateRecord of gateModifiedRecords) {
      // 查找与当前进提箱类型相关的运输指令记录
      const relatedTransportRecords = transportModifiedRecords.filter(
        (transportRecord) => transportRecord.gateIoTypId === gateRecord.id,
      );

      // 构建运输指令列表
      const gateIoTypDtlSaveReqVOList = relatedTransportRecords.map(
        (transportRecord) => ({
          id: transportRecord.id,
          gateIoTypId: transportRecord.gateIoTypId,
          transportOrderCode: transportRecord.transportOrderCode || '',
          transportOrderName: transportRecord.transportOrderName || '',
          gateInOutType: transportRecord.gateInOutType || '',
          contDirection: transportRecord.contDirection || '',
          emptyFull: transportRecord.emptyFull || '',
          transportOrderValidDays:
            transportRecord.transportOrderValidDays || null,
          mappingCode: transportRecord.mappingCode || '',
          isValid: transportRecord.isValid || null,
          isUsedForPln: transportRecord.isUsedForPln || null,
        }),
      );

      // 构建进提箱类型数据
      const gateData = {
        id: gateRecord.id,
        businessCode: gateRecord.businessCode || '',
        businessName: gateRecord.businessName || '',
        pickupLocation: gateRecord.pickupLocation || '',
        deliveryLocation: gateRecord.deliveryLocation || '',
        plnValidDays: gateRecord.plnValidDays || 0,
        isValid: gateRecord.isValid || false,
        mappingCode: gateRecord.mappingCode || '',
        deleteTime: '',
        gateIoTypDtlSaveReqVOList,
      };

      saveData.push(gateData);
    }

    // 处理没有关联进提箱类型的运输指令记录
    const transportRecordsWithoutGate = transportModifiedRecords.filter(
      (transportRecord) =>
        !gateModifiedRecords.some(
          (gateRecord) => gateRecord.id === transportRecord.gateIoTypId,
        ),
    );

    if (transportRecordsWithoutGate.length > 0) {
      // 为这些运输指令创建一个新的进提箱类型记录
      const gateData = {
        id: null,
        businessCode: '',
        businessName: '',
        pickupLocation: '',
        deliveryLocation: '',
        plnValidDays: 0,
        isValid: false,
        mappingCode: '',
        deleteTime: '',
        gateIoTypDtlSaveReqVOList: transportRecordsWithoutGate.map(
          (transportRecord) => ({
            id: transportRecord.id,
            gateIoTypId: transportRecord.gateIoTypId,
            transportOrderCode: transportRecord.transportOrderCode || '',
            transportOrderName: transportRecord.transportOrderName || '',
            gateInOutType: transportRecord.gateInOutType || '',
            contDirection: transportRecord.contDirection || '',
            emptyFull: transportRecord.emptyFull || '',
            transportOrderValidDays:
              transportRecord.transportOrderValidDays || null,
            mappingCode: transportRecord.mappingCode || '',
            isValid: transportRecord.isValid || null,
            isUsedForPln: transportRecord.isUsedForPln || null,
          }),
        ),
      };
      saveData.push(gateData);
    }

    // 调用批量保存接口
    await batchSaveGateInOutTypeAndTransport(saveData);

    // 刷新表格
    await gateIOTypeGridApi.query();
    await transportInstructionGridApi.query();
    message.success('保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败');
  }
}

// 送提箱类型表格：编辑关闭时，若为新增行则移除
// async function handleGateIOEditClosed({ row }: { row: any }) {
//   const $grid = gateIOTypeGridApi.grid;
//   if (!$grid) return;
//   if (row.__isNew__) {
//     await $grid.remove(row);
//   }
// }

// 运输指令表格：编辑关闭时，若为新增行则移除
// async function handleTransportEditClosed({ row }: { row: any }) {
//   const $grid = transportInstructionGridApi.grid;
//   if (!$grid) return;
//   if (row.__isNew__) {
//     await $grid.remove(row);
//   }
// }

// 新增送提箱定义
async function handleGateIOAdd() {
  const $grid = gateIOTypeGridApi.grid;
  if (!$grid) return;

  const { row: newRow } = await $grid.insertAt({ isValid: true }, -1);
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
                label: '保存',
                type: 'primary',
                onClick: handleSave,
              },
              {
                label: '受理计划类型',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: debouncedHandleGateIOAdd,
              },
              {
                label: '运输指令类型',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                onClick: handleTransportAdd,
              },
              {
                label: '删除',
                type: 'default',
                icon: ACTION_ICON.DELETE,
                onClick: handleBatchDelete,
              },
            ]"
          />
        </template>
      </GateIOTypeGrid>
    </div>
    <div class="h-2/5 w-full">
      <TransportInstructionGrid table-title="运输指令类型定义" />
    </div>
  </Page>
</template>
