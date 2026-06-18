<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { DriverApi } from '#/api/bpp/flow/gate/driver/manager';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Modal, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDriverPage } from '#/api/bpp/flow/gate/driver/manager';
import {
  driverInfoColumns,
  driverSearchSchema,
} from '#/views/bpp/gate/driver/management/data';
import DetailForm from '#/views/bpp/gate/driver/management/modules/detailForm.vue';

/** 页面下方详情表单 */
const detailFormRef = ref();

/** 表单模式（新增/编辑/查看），默认查看 */
const formMode = ref<'create' | 'edit' | 'view'>('view');

/** 选中的司机ID */
const selectedDriverId = ref<string>('');

/** 选中的行数据 */
const selectedRowData = ref<DriverApi.driverVO | null>(null);

/** 是否首次加载，用于默认选中第一行 */
let isFirstLoad = true;

/** 点击表格行 */
const handleRowClick = (row: DriverApi.driverVO) => {
  if (formMode.value === 'edit' && detailFormRef.value?.hasUnsavedChanges()) {
    Modal.confirm({
      title: '提示',
      content: '当前有未保存的更改，是否放弃更改？',
      okText: '确认放弃',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        selectedRowData.value = row;
        selectedDriverId.value = String(row.id);
        formMode.value = 'view';
      },
    });
    return;
  }
  selectedRowData.value = row;
  selectedDriverId.value = String(row.id);
  formMode.value = 'view';
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: driverSearchSchema(),
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
    },
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      enabled: true,
    },
    columns: driverInfoColumns(),
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
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
      isCurrent: true,
    },
    printConfig: {
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
          const res = await getDriverPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryParam,
          });

          // 首次加载，默认选中第一行
          if (isFirstLoad && res?.list?.length > 0) {
            const firstRow = res.list[0];
            selectedRowData.value = firstRow;
            selectedDriverId.value = String(firstRow.id);
            formMode.value = 'view';
            isFirstLoad = false;
          }
          return res;
        },
      },
    },
  } as VxeTableGridOptions<DriverApi.driverVO>,
  gridEvents: {
    cellClick: ({ row }: { row: DriverApi.driverVO }) => {
      handleRowClick(row);
    },
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
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
        selectedDriverId.value = '';
        detailFormRef.value?.clearForm();
      },
    });
    return;
  }
  formMode.value = 'create';
  selectedRowData.value = null;
  selectedDriverId.value = '';
  detailFormRef.value?.clearForm();
}

/** 切换到编辑模式 */
function handleEdit() {
  if (!selectedDriverId.value || !selectedRowData.value) {
    message.warning('请先点击选择一行数据');
    return;
  }
  formMode.value = 'edit';
}

/** 保存 */
async function handleSave() {
  detailFormRef.value?.handleSave();
}

/** 导出 */
function handleExport() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  const TIME_FIELDS = new Set(['createTime', 'updateTime']);
  const BOOL_FIELDS = new Set(['isValid']);

  const { fullData } = $grid.getTableData();
  const columns = $grid.getColumns();

  const dataColumns = columns.filter(
    (col: any) => col.type !== 'seq' && col.type !== 'checkbox' && col.field,
  );

  const headerRow = dataColumns
    .map((col: any) => col.title || col.field)
    .join('</th><th>');
  const bodyRows = fullData
    .map((row: any) =>
      dataColumns
        .map((col: any) => {
          const field = col.field;
          const val = row[field];
          if (val == null || val === '') return '';
          if (TIME_FIELDS.has(field))
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
          if (BOOL_FIELDS.has(field))
            return val === true || val === 'true' ? '是' : '否';
          return String(val);
        })
        .join('</td><td>'),
    )
    .join('</td></tr><tr><td>');

  const now = dayjs().format('YYYYMMDDHHmmss');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head><meta charset="UTF-8"></head>
    <body><table border="1"><tr><th>${headerRow}</th></tr><tr><td>${bodyRows}</td></tr></table></body>
    </html>
  `;

  const blob = new Blob([`\uFEFF${html}`], {
    type: 'application/vnd.ms-excel',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `司机信息${now}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-50">
    <!-- 搜索栏和表格 -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <Page auto-content-height class="h-full">
        <Grid table-title="司机信息列表">
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
                {
                  label: '导出',
                  type: 'primary',
                  icon: ACTION_ICON.DOWNLOAD,
                  onClick: handleExport,
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
        :driver-id="selectedDriverId"
        :mode="formMode"
        :row-data="selectedRowData"
        @success="handleRefresh"
      />
    </div>
  </div>
</template>
