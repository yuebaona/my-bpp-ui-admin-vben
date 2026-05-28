<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';
import type { VehicleManagementApi } from '#/api/bpp/vehicle/management';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { message, Modal } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getVehicleById,
  getVehicleListPage,
} from '#/api/bpp/vehicle/management';
import {
  settingInfoColumns,
  vehicleSearchSchema,
} from '#/views/bpp/gate/weight/check/data';

const isEditing = ref(false);

const [Grid, gridApi] = useVbenVxeGrid({
  // formOptions: {
  //   schema: vehicleSearchSchema(),
  //   submitButtonOptions: {
  //     content: $t('cxmo.action.search'),
  //   },
  //   wrapperClass: 'grid-cols-4 md:grid-cols-4',
  //   submitOnEnter: true,
  // },
  gridOptions: {
    border: true,
    resizableConfig: {
      isDblclickAutoWidth: true, // 启用双击自适应列宽
      isAllColumnDrag: true,
    },
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
      // remote: true,
    },
    editConfig: {
      mode: 'row',
      showIcon: false,
      showStatus: true,
      trigger: 'dblclick',
      autoClear: false,
      showInsertStatus: true,
      showUpdateStatus: true,
      highlight: true,
    },
    CheckboxConfig: {
      range: true,
    },
    columns: settingInfoColumns(isEditing),
    height: 'auto',
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    printConfig: {
      enabled: true,
    },
    toolbarConfig: {
      search: true,
      print: true,
      custom: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
      pageSizes: [
        {
          label: '10',
          value: 10,
        },
        {
          label: '25',
          value: 25,
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
          label: '1000',
          value: 1000,
        },
        {
          label: '10000',
          value: 10_000,
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
          // await getDictDataList();
          const queryParam = { ...formValues };

          // return await getVehicleListPage({
          //   pageNo: page.currentPage,
          //   pageSize: page.pageSize,
          //   ...queryParam,
          // });

          const res = await getVehicleListPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryParam,
          });
          return res;
        },
      },
    },
  } as VxeTableGridOptions<VehicleManagementApi.vehicleVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
    filterChange: useDebounceFn(async ({ filterList }) => {
      const searchCont = filterList.reduce((obj, item) => {
        if (item.datas && item.datas.length > 0) {
          obj[item.field] = item.datas[0];
        }
        return obj;
      }, {});
      // 调用gridApi.query()刷新表格数据，实现实时筛选
      // await gridApi.query();
    }, 300),
    checkboxRangeSelect: ({ rangeRecords }: { rangeRecords: any }) => {
      handleRowCheckboxChange({ records: rangeRecords });
    },
  },
});

// 操作处理函数
/** 刷新表格 */
function handleRefresh() {
  gridApi.reload();
}

/** 创建新配置 */
async function handleCreate() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  // 插入新行
  const { row: newRow } = await $grid.insertAt({}, 0);

  await $grid.setEditRow(newRow, true);
  isEditing.value = true;
}

/** 删除新配置 */
async function handleDelete() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  // 获取勾选行
  const selectedRecords = $grid.getCheckboxRecords();

  // 如果没有勾选行，提示用户
  if (selectedRecords.length === 0) {
    message.warning('请先勾选要删除的行');
    return;
  }

  // 确认删除
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRecords.length} 行吗？`,
    async onOk() {
      for (const record of selectedRecords) {
        await $grid.remove(record);
      }
      message.success('删除成功');
    },
  });
}

/** 修改新配置 */
async function handleEdit() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  // 获取勾选的行
  const selectedRecords = $grid.getCheckboxRecords();

  // 如果没有勾选行，提示用户
  if (selectedRecords.length === 0) {
    message.warning('请先勾选要修改的行');
    return;
  }

  // 设置编辑状态为 true
  isEditing.value = true;

  // 对每个勾选的行设置编辑模式
  for (const row of selectedRecords) {
    await $grid.setEditRow(row, true);
  }
}

/** 保存新配置 */
async function handleSave() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  try {
    // 结束所有编辑
    await $grid.clearEdit();

    // 获取所有数据（包括新增和修改的）
    const allRecords = $grid.getData();

    // 获取插入的行
    const insertRecords = $grid.getInsertRecords();

    // 获取修改的行
    const updateRecords = $grid.getUpdateRecords();

    // 获取删除的行
    const removeRecords = $grid.getRemoveRecords();

    console.log('所有数据:', allRecords);
    console.log('新增数据:', insertRecords);
    console.log('修改数据:', updateRecords);
    console.log('删除数据:', removeRecords);

    // TODO: 在这里调用保存 API
    // await saveData({
    //   insertRecords,
    //   updateRecords,
    //   removeRecords,
    // });

    message.success('保存成功');

    // 重置编辑状态
    isEditing.value = false;

    // 刷新表格
    handleRefresh();
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败');
  }
}

/** 车队信息选中操作 */
const vehicleIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanVO[];
}) {
  vehicleIds.value = records.map((item) => item.id);
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="重量校验设置列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
              auth: ['empty:container-control-main:create'],
            },
            {
              label: '删除',
              type: 'primary',
              icon: ACTION_ICON.DELETE,
              onClick: handleDelete,
              auth: ['empty:container-control-main:create'],
            },
            {
              label: '修改',
              type: 'primary',
              icon: ACTION_ICON.EDIT,
              onClick: handleEdit,
              auth: ['empty:container-control-main:create'],
            },
            {
              label: '保存',
              type: 'primary',
              icon: ACTION_ICON.LOG,
              onClick: handleSave,
              auth: ['empty:container-control-main-log:query'],
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
