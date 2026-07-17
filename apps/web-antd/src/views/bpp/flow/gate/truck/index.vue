<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { TruckViewApi } from '#/api/bpp/flow/gate/truck/index.ts';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTruckPage } from '#/api/bpp/flow/gate/truck/index.ts';
import {
  truckInfoColumns,
  truckSearchSchema,
} from '#/views/bpp/flow/gate/truck/data';
import DetailForm from '#/views/bpp/flow/gate/truck/modules/detailForm.vue';

// 页面下方详情表单
const detailFormRef = ref();

// 表单模式（新增/编辑/查看），默认查看
const formMode = ref<'create' | 'edit' | 'view'>('view');

// 选中的车辆ID
const selectedTruckId = ref<string>('');

// 是否首次加载，用于默认选中第一行
let isFirstLoad = true;

// 点击表格行
const handleRowClick = (row: TruckViewApi.truckPageVO) => {
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
        selectedTruckId.value = String(row.id);
        formMode.value = 'view';
        detailFormRef.value?.clearForm();
      },
    });
    return;
  }
  selectedTruckId.value = String(row.id);
  formMode.value = 'view';
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: truckSearchSchema(),
    submitButtonOptions: {
      content: $t('cxmo.action.search'),
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    border: true,
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      enabled: true,
    },
    columns: truckInfoColumns(),
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
          const res = await getTruckPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...queryParam,
          });

          // 首次加载，默认选中第一行
          if (isFirstLoad && res?.list?.length > 0) {
            const firstRow = res.list[0];
            selectedTruckId.value = String(firstRow.id);
            formMode.value = 'view';
            isFirstLoad = false;
          }
          return res;
        },
      },
    },
  } as VxeTableGridOptions<TruckViewApi.truckPageVO>,
  gridEvents: {
    cellClick: ({ row }: { row: TruckViewApi.truckPageVO }) => {
      handleRowClick(row);
    },
  },
});

/** 刷新表格 */
function handleRefresh(createdId?: string) {
  gridApi.query();
  if (createdId) {
    selectedTruckId.value = String(createdId);
    formMode.value = 'view';
    detailFormRef.value?.loadTruckDetail(createdId);
  }
}

/** 切换到新增模式 */
function handleCreate() {
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
        formMode.value = 'create';
        selectedTruckId.value = '';
        detailFormRef.value?.clearForm();
      },
    });
    return;
  }
  formMode.value = 'create';
  selectedTruckId.value = '';
  detailFormRef.value?.clearForm();
}

/** 切换到编辑模式 */
function handleEdit() {
  if (!selectedTruckId.value) {
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
        <Grid table-title="车辆信息列表">
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
        :truck-id="selectedTruckId"
        :mode="formMode"
        @success="handleRefresh"
      />
    </div>
  </div>
</template>
