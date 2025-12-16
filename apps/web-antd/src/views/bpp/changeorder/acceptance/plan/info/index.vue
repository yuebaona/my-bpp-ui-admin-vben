<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AcceptancePlanApi } from '#/api/bpp/changeorder/acceptance/plan/info';

import { ref } from 'vue';

import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deletePlan,
  deletePlanList,
  exportPlan,
  getPlanPage,
} from '#/api/bpp/changeorder/acceptance/plan/info';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

/** 获取字典数据 */
const getDictDataList = async () => {
  await loadDictData(['acceptance_plan_type', 'acceptance_plan_status']);
};

// 预加载需要的字典数据
// 使用字典 store
const bppBaseDict = bppBaseDictStore();
const loadDictData = async (dictTypes: string[]) => {
  for (const dictType of dictTypes) {
    bppBaseDict.setBppBaseDictCacheByData(
      (
        await getDictDataPage({
          dictType,
          pageNo: 1,
          pageSize: 100,
        })
      ).list,
      dictType,
    );
  }
};

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建受理计划信息 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑受理计划信息 */
function handleEdit(row: AcceptancePlanApi.Plan) {
  formModalApi.setData(row).open();
}

/** 删除受理计划信息 */
async function handleDelete(row: AcceptancePlanApi.Plan) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deletePlan(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除受理计划信息 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deletingBatch'),
    duration: 0,
  });
  try {
    await deletePlanList(checkedIds.value);
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
  records: AcceptancePlanApi.Plan[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出表格 */
async function handleExport() {
  const data = await exportPlan(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '受理计划信息.xls', source: data });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    headerCellStyle({ column }) {
      const blueHeaderFields = [
        'planTwentyFtVolume',
        'planFortyFtVolume',
        'planFortyFiveFtVolume',
      ];
      const GreenHeaderFields = [
        'completeTwentyFtVolume',
        'completeFortyFtVolume',
        'completeFortyFiveFtVolume',
      ];
      const RedHeaderFields = [
        'remainingTwentyFtVolume',
        'remainingFortyFtVolume',
        'remainingFortyFiveFtVolume',
      ];
      if (blueHeaderFields.includes(column.field)) {
        return {
          color: '#0052D9',
        };
      }
      if (GreenHeaderFields.includes(column.field)) {
        return {
          color: 'green',
        };
      }
      if (RedHeaderFields.includes(column.field)) {
        return {
          color: '#FF0000',
        };
      }
    },
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          await getDictDataList();
          return await getPlanPage({
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
  } as VxeTableGridOptions<AcceptancePlanApi.Plan>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />
    <Grid table-title="受理计划信息列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['受理计划信息']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['acceptance:plan:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['acceptance:plan:export'],
              onClick: handleExport,
            },
            {
              label: $t('ui.actionTitle.deleteBatch'),
              type: 'primary',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['acceptance:plan:delete'],
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
              auth: ['acceptance:plan:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['acceptance:plan:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.id]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
