<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import { onBeforeUnmount, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';
import { message, Modal } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createConfig,
  deleteConfigList,
  getLaneConfigPage,
  updateConfig,
} from '#/api/bpp/flow/gate/lane/management/index';
import {
  laneInfoColumns,
  laneSearchSchema,
} from '#/views/bpp/gate/lane/management/data';

const isEditing = ref(false);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: laneSearchSchema(),
    submitButtonOptions: {
      content: $t('cxmo.action.search'),
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
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
    editRules: {
      laneCode: [{ required: true, content: '必填项' }],
      gateAccessType: [{ required: true, content: '必填项' }],
      laneDesc: [{ required: true, content: '必填项' }],
      tradeType: [{ required: true, content: '必填项' }],
      customsCheckCode: [{ required: true, content: '必填项' }],
      customsCheckSwitch: [{ required: true, content: '必填项' }],
      gateType: [{ required: true, content: '必填项' }],
      containerRuleList: [{ required: true, content: '必填项' }],
      tosLaneCode: [{ required: true, content: '必填项' }],
    },
    CheckboxConfig: {
      range: true,
    },
    columns: laneInfoColumns(isEditing),
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
          if (hasUnsavedEdits()) {
            return new Promise((resolve, reject) => {
              Modal.confirm({
                title: '提示',
                content: '当前有未保存的更改，是否放弃更改？',
                okText: '确认放弃',
                cancelText: '取消',
                centered: true,
                onOk: () => {
                  const $grid = gridApi.grid;
                  if ($grid) {
                    $grid.clearEdit();
                    isEditing.value = false;
                  }
                  resolve(doQuery(page, formValues));
                },
                onCancel: () => {
                  reject(new Error('用户取消操作'));
                },
              });
            });
          }
          return doQuery(page, formValues);
        },
      },
    },
  } as VxeTableGridOptions<LaneConfigApi.configVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
    filterChange: useDebounceFn(async ({ filterList }) => {
      const filterParams = filterList.reduce((result, filter) => {
        const { datas, field } = filter;
        if (datas && datas.length > 0) {
          result[field] = datas;
        }
        return result;
      }, {});
      // 调用gridApi.query()刷新表格数据，实现实时筛选
      // await gridApi.query();
    }, 300),
    checkboxRangeSelect: ({ rangeRecords }: { rangeRecords: any }) => {
      handleRowCheckboxChange({ records: rangeRecords });
    },
  },
});

/** 查询 */
async function doQuery(page: any, formValues: any) {
  const queryParam = { ...formValues };
  return await getLaneConfigPage({
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...queryParam,
  });
}

/** 检查是否有未保存的编辑 */
function hasUnsavedEdits() {
  const $grid = gridApi.grid;
  if (!$grid) return false;
  return (
    $grid.getInsertRecords().length > 0 || $grid.getUpdateRecords().length > 0
  );
}

/** 浏览器刷新/关闭时拦截 */
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (hasUnsavedEdits()) {
    e.preventDefault();
    e.returnValue = '';
  }
};
window.addEventListener('beforeunload', handleBeforeUnload);
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// 操作处理函数
/** 刷新 */
function handleRefresh() {
  if (hasUnsavedEdits()) {
    Modal.confirm({
      title: '提示',
      content: '当前有未保存的更改，是否放弃更改？',
      okText: '确认放弃',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        const $grid = gridApi.grid;
        if ($grid) {
          $grid.clearEdit();
          isEditing.value = false;
        }
        gridApi.reload();
      },
    });
    return;
  }
  gridApi.reload();
}

/** 创建配置 */
async function handleCreate() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  const { row: newRow } = await $grid.insertAt({}, 0);

  await $grid.setEditRow(newRow, true);
  isEditing.value = true;
}

/** 保存配置 */
async function handleSave() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  try {
    const errMap = await $grid.validate(true);
    if (errMap) {
      message.error('请完善表单信息后再保存');
      return;
    }

    await $grid.clearEdit();

    const insertRecords = $grid.getInsertRecords();
    const updateRecords = $grid.getUpdateRecords();

    if (insertRecords.length > 0) {
      await createConfig(insertRecords);
    }
    if (updateRecords.length > 0) {
      await updateConfig(updateRecords);
    }

    message.success('保存成功');
    isEditing.value = false;
    handleRefresh();
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败');
  }
}

/** 删除配置 */
async function handleDelete() {
  const $grid = gridApi.grid;
  if (!$grid) return;
  const selectedRecords = $grid.getCheckboxRecords();
  if (selectedRecords.length === 0) {
    message.warning('请先勾选要删除的行');
    return;
  }

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRecords.length} 行吗？`,
    centered: true,
    async onOk() {
      try {
        const ids = selectedRecords.map((r: any) => r.id);
        await deleteConfigList(ids);
        message.success('删除成功');
        handleRefresh();
      } catch {
        message.error('删除失败');
      }
    },
  });
}

/** 配置信息选中操作 */
const selectedIds = ref<number[]>([]);
function handleRowCheckboxChange({ records }: { records: any[] }) {
  selectedIds.value = records.map((item) => item.id);
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="车道配置列表">
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
              label: '保存',
              type: 'primary',
              icon: ACTION_ICON.LOG,
              onClick: handleSave,
              auth: ['empty:container-control-main-log:query'],
            },
            {
              label: '删除',
              type: 'default',
              icon: ACTION_ICON.DELETE,
              onClick: handleDelete,
              auth: ['empty:container-control-main:create'],
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
