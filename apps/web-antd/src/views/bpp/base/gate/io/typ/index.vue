<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BppBaseGateIoTypApi } from '#/api/bpp/base/gate/io/typ';
import type { BppBaseGateIoTypDtlApi } from '#/api/bpp/base/gate/io/typ/dtl';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteGateIoTyp,
  deleteGateIoTypList,
  exportGateIoTyp,
  getGateIoTypPage,
} from '#/api/bpp/base/gate/io/typ';
import {
  deleteGateIoTypDtl,
  deleteGateIoTypDtlList,
  exportGateIoTypDtl,
  getGateIoTypDtlPage,
} from '#/api/bpp/base/gate/io/typ/dtl';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import { useDtlGridColumns, useDtlGridFormSchema } from './dtl/data';
import Form from './modules/gate-io-typ-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建受理计划类型 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑受理计划类型 */
function handleEdit(row: BppBaseGateIoTypApi.GateIoTyp) {
  formModalApi.setData(row).open();
}

/** 删除受理计划类型 */
async function handleDelete(row: BppBaseGateIoTypApi.GateIoTyp) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteGateIoTyp(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除受理计划类型 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deletingBatch'),
    duration: 0,
  });
  try {
    await deleteGateIoTypList(checkedIds.value);
    checkedIds.value = [];
    message.success($t('ui.actionMessage.deleteSuccess'));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: BppBaseGateIoTypApi.GateIoTyp[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出表格 */
async function handleExport() {
  const data = await exportGateIoTyp(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '受理计划类型.xls', source: data });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getGateIoTypPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<BppBaseGateIoTypApi.GateIoTyp>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

// 进提箱类型明细表表格配置
// 获取当前选中的行
const gateIoTypIds = '';
const [GateIoTypDtlGrid, gateIoTypDtlApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDtlGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getGateIoTypDtlPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            gateIoTypIds,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<BppBaseGateIoTypDtlApi.GateIoTypDtl>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <div class="h-3/5 w-full">
      <Grid table-title="受理计划类型列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: $t('ui.actionTitle.create', ['受理计划类型']),
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['bpp:gate-io-typ:create'],
                onClick: handleCreate,
              },
              {
                label: $t('ui.actionTitle.export'),
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                auth: ['bpp:gate-io-typ:export'],
                onClick: handleExport,
              },
              {
                label: $t('ui.actionTitle.deleteBatch'),
                type: 'primary',
                danger: true,
                icon: ACTION_ICON.DELETE,
                auth: ['bpp:gate-io-typ:delete'],
                disabled: isEmpty(checkedIds),
                onClick: handleDeleteBatch,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: $t('common.edit'),
                type: 'link',
                icon: ACTION_ICON.EDIT,
                auth: ['bpp:gate-io-typ:update'],
                onClick: handleEdit.bind(null, row),
              },
              {
                label: $t('common.delete'),
                type: 'link',
                danger: true,
                icon: ACTION_ICON.DELETE,
                auth: ['bpp:gate-io-typ:delete'],
                popConfirm: {
                  title: $t('ui.actionMessage.deleteConfirm', [row.id]),
                  confirm: handleDelete.bind(null, row),
                },
              },
            ]"
          />
        </template>
      </Grid>
    </div>

    <div class="h-2/5 w-full">
      <GateIoTypDtlGrid table-title="运输指令类型列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: $t('ui.actionTitle.create', ['运输指令类型']),
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['bpp:gate-io-typ:create'],
                onClick: handleCreate,
              },
              {
                label: $t('ui.actionTitle.export'),
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                auth: ['bpp:gate-io-typ:export'],
                onClick: handleExport,
              },
              {
                label: $t('ui.actionTitle.deleteBatch'),
                type: 'primary',
                danger: true,
                icon: ACTION_ICON.DELETE,
                auth: ['bpp:gate-io-typ:delete'],
                disabled: isEmpty(checkedIds),
                onClick: handleDeleteBatch,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: $t('common.edit'),
                type: 'link',
                icon: ACTION_ICON.EDIT,
                auth: ['bpp:gate-io-typ:update'],
                onClick: handleEdit.bind(null, row),
              },
              {
                label: $t('common.delete'),
                type: 'link',
                danger: true,
                icon: ACTION_ICON.DELETE,
                auth: ['bpp:gate-io-typ:delete'],
                popConfirm: {
                  title: $t('ui.actionMessage.deleteConfirm', [row.id]),
                  confirm: handleDelete.bind(null, row),
                },
              },
            ]"
          />
        </template>
      </GateIoTypDtlGrid>
    </div>
  </Page>
</template>
