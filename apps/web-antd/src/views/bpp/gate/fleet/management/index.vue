<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { FleetManagementApi } from '#/api/bpp/flow/gate/fleet/manager';

import {
  getFleetPage,
} from '#/api/bpp/flow/gate/fleet/manager';

import { ref } from "vue";

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';
import dayjs from 'dayjs';

import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  fleetInfoColumns,
  fleetSearchSchema,
} from '#/views/bpp/gate/fleet/management/data';
import DetailForm from '#/views/bpp/gate/fleet/management/modules/detailForm.vue';

// 下方详情表单
const detailFormRef = ref();

// 表单模式（查看/编辑/新增），默认查看
const formMode = ref<'view' | 'edit' | 'create'>('view');

// 选中的车队ID
const selectedFleetId = ref<string>('');

// 选中的行数据
const selectedRowData = ref<FleetManagementApi.fleetVO | null>(null);

// 点击表格行
const handleRowClick = (row: FleetManagementApi.fleetVO) => {
  selectedRowData.value = row;
  selectedFleetId.value = row.id;
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
      enabled: true,
    },
    columns: fleetInfoColumns(),
    height: '530px',
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

          // return await getFleetListPage({
          //   pageNo: page.currentPage,
          //   pageSize: page.pageSize,
          //   ...queryParam,
          // });

          const res = await getFleetPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryParam,
          });
          return res;
        },
      },
    },
  } as VxeTableGridOptions<FleetManagementApi.fleetVO>,
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
    cellClick: ({ row }: { row: FleetManagementApi.fleetVO }) => {
      handleRowClick(row);
    },
  },
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 车队信息勾选操作 */
const fleetIds = ref<number[]>([]);
function handleRowCheckboxChange({ records }: { records: FleetApi.fleetVO[] }) {
  fleetIds.value = records.map((item: any) => item.id);
}

/** 切换到新增模式 */
function handleCreate() {
  formMode.value = 'create';
  selectedRowData.value = null;
  selectedFleetId.value = '';
}

/** 切换到编辑模式 */
function handleEdit() {
  const $grid = gridApi.grid;
  if (!$grid) return;

  // 获取选中的行
  const selectedRecords = $grid.getCheckboxRecords();
  if (selectedRecords.length !== 1) {
    message.warning('请勾选一行进行编辑');
    return;
  }

  selectedRowData.value = selectedRecords[0];
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

  const TIME_FIELDS = ['createTime', 'updateTime', 'rstrStarDt', 'rstrEndDt', 'rstrLastDt'];
  const BOOL_FIELDS = ['isRstr', 'enableFlg'];

  const { fullData } = $grid.getTableData();
  const columns = $grid.getColumns();

  const dataColumns = columns.filter(
    (col: any) => col.type !== 'seq' && col.type !== 'checkbox' && col.field,
  );

  const headerRow = dataColumns.map((col: any) => col.title || col.field).join('</th><th>');
  const bodyRows = fullData
    .map((row: any) =>
      dataColumns
        .map((col: any) => {
          const field = col.field;
          const val = row[field];
          if (val == null || val === '') return '';
          if (TIME_FIELDS.includes(field)) return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
          if (BOOL_FIELDS.includes(field)) return val === 1 || val === '1' ? '是' : '否';
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

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `车队信息${now}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

/** 日志查询 */
// function handleLogQuery() {
//   // logQueryModalApi.open();
// }
</script>

<template>
  <Page auto-content-height>
    <!--    <LogQueryModal />-->
    <div class="pb-[380px]">
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
              // {
              //   label: '日志查询',
              //   type: 'primary',
              //   icon: ACTION_ICON.VIEW,
              //   onClick: handleLogQuery,
              //   auth: ['empty:container-control-main-log:query'],
              // },
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleExport,
                auth: ['empty:container-control-main-log:query'],
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <!-- 底部固定详情栏 -->
    <DetailForm
      ref="detailFormRef"
      :fleet-id="selectedFleetId"
      :mode="formMode"
      :row-data="selectedRowData"
      @success="handleRefresh"
    />
  </Page>
</template>
