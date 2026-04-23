<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { message, Modal } from 'ant-design-vue';

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
    // border: true,
    columns: gateIOColumns(),
    height: 'auto',
    virtualYConfig: {
      enabled: true,
      gt: 100,
    },
    keepSource: true,
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
    floatingFilterConfig: {
      enabled: true, // 启用浮动过滤器
    },
    filterConfig: {
      showIcon: false,
    },
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
    editRules: {
      businessCode: [
        { required: true, message: '必填项' },
        { pattern: /^[A-Z]{7}$/, message: '必须是7位字母' },
      ],
      businessName: [{ required: true, message: '必填项' }],
      plnValidDays: [{ required: true, message: '请填写数字', type: 'number' }],
      mappingCode: [
        { required: true, message: '必填项' },
        { pattern: /^[A-Z]{6}$/, message: '必须是6位字母' },
      ],
      isValid: [{ required: true, message: '必填项' }],
      pickupLocation: [{ required: true, message: '必填项' }],
      deliveryLocation: [{ required: true, message: '必填项' }],
    },
    mouseConfig: {
      selected: true, // 启用单元格选中功能，Tab切换需要此配置
    },
    keyboardConfig: {
      isArrow: true, // 支持上下左右键移动单元格
      isEnter: true, // 支持回车键保存或移动
      isTab: true, // 支持Tab键切换单元格
      isEsc: true, // 支持Esc键退出编辑
      isEdit: true, // 开启单元格选中编辑功能
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
      pageSize: 20,
      enabled: true,
      pageSizes: [
        {
          label: '20',
          value: 20,
        },
        {
          label: '50',
          value: 50,
        },
        {
          label: '100',
          value: 100,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
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
    virtualYConfig: {
      enabled: true,
      gt: 100,
    },
    keepSource: true,
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
    floatingFilterConfig: {
      enabled: true, // 启用浮动过滤器
    },
    filterConfig: {
      showIcon: false,
    },
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
    editRules: {
      transportOrderCode: [
        { required: true, message: '必填项' },
        { pattern: /^[A-Z]{7}_[OI]$/, message: '必须是7位大写字母+下划线+O/I' },
      ],
      transportOrderName: [{ required: true, message: '必填项' }],
      contDirection: [{ required: true, message: '必填项' }],
      emptyFull: [{ required: true, message: '必填项' }],
      transportOrderValidDays: [
        { required: true, message: '请填写数字', type: 'number' },
      ],
      mappingCode: [
        { required: true, message: '必填项' },
        { pattern: /^[A-Z]{6}_[OI]$/, message: '必须是6位大写字母+下划线+O/I' },
      ],
      isValid: [{ required: true, message: '必填项' }],
      gateInOutType: [{ required: true, message: '必填项' }],
      isUsedForPln: [{ required: true, message: '必填项' }],
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
      refresh: true,
      zoom: false,
    },
    pagerConfig: {
      pageSize: 20,
      enabled: true,
      pageSizes: [
        {
          label: '20',
          value: 20,
        },
        {
          label: '50',
          value: 50,
        },
        {
          label: '100',
          value: 100,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
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

// 批量删除
async function handleBatchDelete() {
  const $gateGrid = gateIOTypeGridApi.grid;
  const $transportGrid = transportInstructionGridApi.grid;
  if (!$gateGrid || !$transportGrid) return;

  // 获取两个表格的选中记录
  const gateSelectedRecords = $gateGrid.getCheckboxRecords();
  const transportSelectedRecords = $transportGrid.getCheckboxRecords();

  // 检查是否同时有勾选记录
  if (gateSelectedRecords.length > 0 && transportSelectedRecords.length > 0) {
    message.warning(
      '送提箱受理计划列表和运输指令类型定义列表不能同时有勾选记录',
    );
    return;
  }

  // 检查是否有勾选记录
  if (
    gateSelectedRecords.length === 0 &&
    transportSelectedRecords.length === 0
  ) {
    message.warning('请选择要删除的记录');
    return;
  }

  // 处理送提箱类型表格的新增行删除
  if (gateSelectedRecords.length > 0) {
    // 检查是否全部是新增行
    const allAreNew = gateSelectedRecords.every(
      (record) => record.__isNew__ === true,
    );

    if (allAreNew) {
      // 全部是新增行，直接从前端移除，不调用后端接口
      try {
        for (const record of gateSelectedRecords) {
          await $gateGrid.remove(record);
        }
        message.success('删除成功');

        // 如果删除的记录包含当前选中的类型，清空选中状态并刷新运输指令表格
        if (
          selectedGateIoTypeId.value &&
          gateSelectedRecords.some((r) => r.id === selectedGateIoTypeId.value)
        ) {
          selectedGateIoTypeId.value = null;
          await transportInstructionGridApi.query();
        }
      } catch (error) {
        console.error('删除失败:', error);
        message.error('删除失败');
      }
      return;
    }

    // 检查是否包含新增行
    const hasNewRecord = gateSelectedRecords.some(
      (record) => record.__isNew__ === true,
    );
    if (hasNewRecord) {
      message.warning('不能同时选择新增记录和已保存的记录进行删除，请分别处理');
      return;
    }
  }

  let ids: number[] = [];
  let type: string = '';

  // 根据选中的记录类型设置参数
  if (gateSelectedRecords.length > 0) {
    // 送提箱受理类型
    ids = gateSelectedRecords.map((record) => record.id);
    type = 'M';
  } else if (transportSelectedRecords.length > 0) {
    // 运输指令类型
    ids = transportSelectedRecords.map((record) => record.id);
    type = 'D';
  }

  // 执行删除操作的函数
  const performDelete = async () => {
    try {
      await batchDeleteGateInOutType(ids, type);
      // 刷新表格
      await gateIOTypeGridApi.query();
      await transportInstructionGridApi.query();
      message.success('删除成功');
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error('删除失败');
    }
  };

  // 根据删除类型显示不同的确认对话框
  if (type === 'M') {
    // 删除业务受理类型时，提示用户对应的运输指令类型也会被删除
    Modal.confirm({
      title: '确认删除',
      content:
        '要删除业务受理类型，则对应的运输指令类型也同步进行删除，是否确认？',
      okText: '是',
      cancelText: '否',
      onOk: performDelete,
    });
  } else {
    // 删除运输指令类型时，判断是否全部勾选
    const checkAllTransport = async () => {
      try {
        // 获取当前选中的业务受理类型ID
        const gateId = selectedGateIoTypeId.value;
        if (!gateId) {
          performDelete();
          return;
        }

        // 获取该业务受理类型对应的所有运输指令总数
        const res = await getTransportInstructionPage({
          gateIoTypIds: gateId,
          pageNo: 1,
          pageSize: 100, // 假设一页足够容纳所有数据
        });

        const totalTransport = res.total;
        const selectedTransportCount = transportSelectedRecords.length;

        // 如果选中数量等于总数，显示确认对话框
        if (selectedTransportCount === totalTransport && totalTransport > 0) {
          Modal.confirm({
            title: '确认删除',
            content: '要删除此业务受理类型的全部运输指令类型，是否确认？',
            okText: '是',
            cancelText: '否',
            onOk: performDelete,
          });
        } else {
          // 否则直接删除
          performDelete();
        }
      } catch (error) {
        console.error('获取运输指令总数失败:', error);
        // 失败时直接执行删除
        performDelete();
      }
    };
    checkAllTransport();
  }
}

// 保存
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

  // 获取所有进提箱类型的原始数据（用于获取完整信息）
  const allGateRecords = $gateGrid.getTableData().tableData;

  // 构建一个 Map 存储每个进提箱类型的完整信息
  const gateInfoMap = new Map();
  allGateRecords.forEach((record: any) => {
    gateInfoMap.set(record.id, record);
  });

  if (
    gateModifiedRecords.length === 0 &&
    transportModifiedRecords.length === 0
  ) {
    message.info('没有需要保存的记录');
    return;
  }

  try {
    // 构建保存数据数组
    const saveData: any[] = [];

    // 1. 处理送提箱类型的新增和修改记录
    for (const gateRecord of gateModifiedRecords) {
      // 获取完整的进提箱类型信息（如果是修改，使用修改后的值；如果是新增，使用新增的值）
      const fullGateInfo = {
        id: gateRecord.id,
        businessCode: gateRecord.businessCode || '',
        businessName: gateRecord.businessName || '',
        pickupLocation: gateRecord.pickupLocation || '',
        deliveryLocation: gateRecord.deliveryLocation || '',
        plnValidDays: gateRecord.plnValidDays || 0,
        isValid: gateRecord.isValid ?? true,
        mappingCode: gateRecord.mappingCode || '',
        deleteTime: gateRecord.deleteTime || '',
        gateIoTypDtlSaveReqVOList: [],
      };
      saveData.push(fullGateInfo);
    }

    // 2. 处理运输指令的新增和修改记录
    for (const transportRecord of transportModifiedRecords) {
      const gateId = transportRecord.gateIoTypId;

      // 构建运输指令数据
      const transportData = {
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
        isValid: transportRecord.isValid ?? true,
        isUsedForPln: transportRecord.isUsedForPln ?? null,
      };

      // 查找对应的进提箱类型记录
      const gateInfo = saveData.find((item) => item.id === gateId);
      if (gateInfo) {
        // 如果存在，直接添加到对应的 gateIoTypDtlSaveReqVOList
        gateInfo.gateIoTypDtlSaveReqVOList.push(transportData);
      } else {
        // 如果不存在，需要从原始数据中获取该进提箱类型的完整信息
        const originalGateInfo = gateInfoMap.get(gateId);
        if (originalGateInfo) {
          // 该进提箱类型没有修改，但需要包含其关联的运输指令
          const newGateInfo = {
            id: originalGateInfo.id,
            businessCode: originalGateInfo.businessCode || '',
            businessName: originalGateInfo.businessName || '',
            pickupLocation: originalGateInfo.pickupLocation || '',
            deliveryLocation: originalGateInfo.deliveryLocation || '',
            plnValidDays: originalGateInfo.plnValidDays || 0,
            isValid: originalGateInfo.isValid ?? true,
            mappingCode: originalGateInfo.mappingCode || '',
            deleteTime: originalGateInfo.deleteTime || '',
            gateIoTypDtlSaveReqVOList: [transportData],
          };
          saveData.push(newGateInfo);
        } else {
          // 理论上不应该出现这种情况，但为了安全，创建一个基本的进提箱类型
          const newGateInfo = {
            id: gateId,
            businessCode: '',
            businessName: '',
            pickupLocation: '',
            deliveryLocation: '',
            plnValidDays: 0,
            isValid: true,
            mappingCode: '',
            deleteTime: '',
            gateIoTypDtlSaveReqVOList: [transportData],
          };
          saveData.push(newGateInfo);
        }
      }
    }

    // 3. 处理没有关联任何运输指令修改的进提箱类型（确保 gateIoTypDtlSaveReqVOList 是空数组）
    for (const gateRecord of gateModifiedRecords) {
      const gateInfo = saveData.find((item) => item.id === gateRecord.id);
      if (gateInfo && !gateInfo.gateIoTypDtlSaveReqVOList) {
        gateInfo.gateIoTypDtlSaveReqVOList = [];
      }
    }

    if (saveData.length === 0) {
      message.info('没有需要保存的记录');
      return;
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

  const { row: newRow } = await $grid.insertAt(
    {
      isValid: true,
      pickupLocation: 'ZDHMT',
      deliveryLocation: 'ZDHMT',
    },
    -1,
  );
  newRow.__isNew__ = true;
  await $grid.setEditRow(newRow);

  $grid.scrollToRow(newRow);
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

  // 检查是否选择了新增的记录
  if (selectedRecords[0].__isNew__) {
    message.warning(
      '不允许为新增的送提箱受理类型记录新增运输指令，请先保存送提箱受理类型',
    );
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
      gateInOutType: 'GATE_IN',
      isValid: true,
      isUsedForPln: true,
      emptyFull: 'E',
    },
    -1,
  );
  newRow.__isNew__ = true;
  await $grid.setEditRow(newRow);

  $grid.scrollToRow(newRow);
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
                auth: ['base:gate-io-typ:manager'],
                onClick: debouncedHandleGateIOAdd,
              },
              {
                label: '运输指令类型',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['base:gate-io-typ:manager'],
                onClick: debouncedHandleTransportAdd,
              },
              {
                label: '删除',
                type: 'default',
                icon: ACTION_ICON.DELETE,
                auth: ['base:gate-io-typ:manager'],
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
