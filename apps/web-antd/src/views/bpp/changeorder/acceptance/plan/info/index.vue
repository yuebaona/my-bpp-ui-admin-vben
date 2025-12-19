<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AcceptancePlanApi, RecordBase } from '#/api/bpp/changeorder/acceptance/plan/info';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import {
  getPlan,
  getPlanPage,
} from '#/api/bpp/changeorder/acceptance/plan/info';
import { $t } from '#/locales';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import Detail from '#/views/bpp/changeorder/acceptance/plan/info/modules/acceptancePlanDetails.vue';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

/** 获取字典数据 */
const getDictDataList = async () => {
  await loadDictData([
    'acceptance_plan_type',
    'acceptance_plan_status',
    'payment_method',
    'billing_method',
    'trade_type',
  ]);
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

/** 查看改单记录 */
const handleDetail = async (row: AcceptancePlanApi.Plan) => {
  const res = await getPlan(row.id);
  detailModalApi.setData(res).open();
};

const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});

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
// async function handleDelete(row: AcceptancePlanApi.Plan) {
//   const hideLoading = message.loading({
//     content: $t('ui.actionMessage.deleting', [row.id]),
//     duration: 0,
//   });
//   try {
//     await deletePlan(row.id!);
//     message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
//     handleRefresh();
//   } finally {
//     hideLoading();
//   }
// }

// /** 批量删除受理计划信息 */
// async function handleDeleteBatch() {
//   await confirm($t('ui.actionMessage.deleteBatchConfirm'));
//   const hideLoading = message.loading({
//     content: $t('ui.actionMessage.deletingBatch'),
//     duration: 0,
//   });
//   try {
//     await deletePlanList(checkedIds.value);
//     checkedIds.value = [];
//     message.success($t('ui.actionMessage.deleteSuccess'));
//     handleRefresh();
//   } finally {
//     hideLoading();
//   }
// }

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: AcceptancePlanApi.Plan[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

// /** 导出表格 */
// async function handleExport() {
//   const data = await exportPlan(await gridApi.formApi.getValues());
//   downloadFileFromBlobPart({ fileName: '受理计划信息.xls', source: data });
// }

/** 撤销 */
async function handleRollback() {
  message.success($t('撤销成功！'));
  handleRefresh();
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
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
    keepSource: false,
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
      zoom: true,
      custom: true,
      export: true,
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
    <DetailModal />
    <FormModal class="w-1/2" @success="handleRefresh" />
    <div class="h-3/5 w-full">
      <Grid table-title="受理计划信息列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: $t('ui.actionTitle.create', ['受理计划']),
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['bpp:flow-acceptance-plan:create'],
                onClick: handleCreate,
              },
              {
                label: '撤销',
                type: 'default',
                icon: ACTION_ICON.UNDO,
                auth: ['bpp:flow-acceptance-plan:rollback'],
                onClick: handleRollback,
              },
              {
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.LOG,
                auth: ['bpp:flow-acceptance-plan:create'],
                onClick: handleRollback,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '查看改单记录',
                type: 'link',
                icon: ACTION_ICON.VIEW,
                auth: ['bpp:flow-acceptance-plan:query'],
                onClick: handleDetail.bind(null, row),
              },
              {
                label: '修改',
                type: 'link',
                icon: ACTION_ICON.EDIT,
                auth: ['bpp:flow-acceptance-plan:update'],
                onClick: handleRollback,
              },
            ]"
          />
        </template>
      </Grid>
    </div>
  </Page>
</template>
