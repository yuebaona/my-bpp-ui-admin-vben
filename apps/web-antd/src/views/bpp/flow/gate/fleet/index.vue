<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { FleetViewApi } from '#/api/bpp/flow/gate/fleet';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { pageFleet } from '#/api/bpp/flow/gate/fleet/';
import {
  fleetInfoColumns,
  fleetSearchSchema,
} from '#/views/bpp/flow/gate/fleet/data';
import DetailForm from '#/views/bpp/flow/gate/fleet/modules/detailForm.vue';

/** 页面下方详情表单 */
const detailFormRef = ref();

/** 表单模式（新增/编辑/查看），默认查看 */
const formMode = ref<'create' | 'edit' | 'view'>('view');

/** 选中的车队ID */
const selectedFleetId = ref<string>('');

/** 选中的行数据 */
const selectedRowData = ref<FleetViewApi.fleetVO | null>(null);

/** 是否首次加载，用于默认选中第一行 */
let isFirstLoad = true;

/** 点击表格行 */
const handleRowClick = (row: FleetViewApi.fleetVO) => {
  if (
    (formMode.value === 'edit' || formMode.value === 'create') &&
    detailFormRef.value?.hasUnsavedChanges()
  ) {
    Modal.confirm({
      title: '提示',
      content: '当前有未保存的更改，是否放弃更改？',
      okText: '确认放弃',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        selectedRowData.value = row;
        selectedFleetId.value = String(row.id);
        formMode.value = 'view';
        detailFormRef.value?.clearForm();
      },
    });
    return;
  }
  selectedRowData.value = row;
  selectedFleetId.value = String(row.id);
  formMode.value = 'view';
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: fleetSearchSchema(),
    submitButtonOptions: {
      content: $t('cxmo.action.search'),
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    border: true,
    resizableConfig: {
      isDblclickAutoWidth: true,
      isAllColumnDrag: true,
    },
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
      reserve: true,
    },
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      enabled: true,
    },
    sortConfig: {
      remote: false,
    },
    columns: fleetInfoColumns(),
    height: '100%',
    keepSource: true,
    mouseConfig: {
      selected: true,
    },
    keyboardConfig: {
      isArrow: true,
      isEnter: true,
      isTab: true,
      isEsc: true,
      isEdit: true,
      isUndo: true,
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
      isCurrent: true,
    },
    ValidConfig: {
      aotoPos: true,
    },
    printConfig: {
      enabled: true,
    },
    exportConfig: {
      enabled: true,
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
      autoLoad: true,
      ajax: {
        query: async ({ page }, formValues) => {
          const queryParam = { ...formValues };
          const res = await pageFleet({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryParam,
          });

          if (isFirstLoad && res?.list?.length > 0) {
            const firstRow = res.list[0];
            selectedRowData.value = firstRow;
            selectedFleetId.value = String(firstRow.id);
            formMode.value = 'view';
            isFirstLoad = false;
          }
          return res;
        },
      },
    },
  } as VxeTableGridOptions<FleetViewApi.fleetVO>,
  gridEvents: {
    cellClick: ({ row }: { row: FleetViewApi.fleetVO }) => {
      handleRowClick(row);
    },
  },
});

/** 刷新表格 */
function handleRefresh(createdId?: string) {
  gridApi.query();
  if (createdId) {
    selectedFleetId.value = String(createdId);
    formMode.value = 'view';
    detailFormRef.value?.loadFleetDetail(createdId);
  }
}

/** 切换到新增模式 */
function handleCreate() {
  if (formMode.value === 'edit' && detailFormRef.value?.hasUnsavedChanges()) {
    Modal.confirm({
      title: '提示',
      content: '当前有未保存的更改，是否放弃更改？',
      okText: '确认放弃',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        formMode.value = 'create';
        selectedRowData.value = null;
        selectedFleetId.value = '';
        detailFormRef.value?.clearForm();
      },
    });
    return;
  }
  formMode.value = 'create';
  selectedRowData.value = null;
  selectedFleetId.value = '';
  detailFormRef.value?.clearForm();
}

/** 切换到编辑模式 */
function handleEdit() {
  if (!selectedFleetId.value || !selectedRowData.value) {
    message.warning('请先点击选择一行数据');
    return;
  }
  formMode.value = 'edit';
}

/** 保存 */
async function handleSave() {
  detailFormRef.value?.handleSave();
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-50">
    <!-- 搜索栏和表格 -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <Page auto-content-height class="h-full">
        <Grid table-title="车队信息列表">
          <template #toolbar-tools>
            <TableAction
              :actions="[
                {
                  label: '新增',
                  type: 'primary',
                  icon: ACTION_ICON.ADD,
                  auth: ['empty:container-control-main:create'],
                  onClick: handleCreate,
                },
                {
                  label: '编辑',
                  type: 'primary',
                  icon: ACTION_ICON.EDIT,
                  onClick: handleEdit,
                },
                {
                  label: '保存',
                  type: 'primary',
                  icon: ACTION_ICON.LOG,
                  onClick: handleSave,
                },
              ]"
            />
          </template>
        </Grid>
      </Page>
    </div>
    <!-- 详情栏 -->
    <div class="flex-shrink-0 border-t border-gray-200 bg-white">
      <DetailForm
        ref="detailFormRef"
        :fleet-id="selectedFleetId"
        :mode="formMode"
        :row-data="selectedRowData"
        @success="handleRefresh"
      />
    </div>
  </div>
</template>
