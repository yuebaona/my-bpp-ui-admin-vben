<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FieldEditRuleHeadApi } from '#/api/field/editrulehead';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteEditRuleHead,
  deleteEditRuleHeadList,
  exportEditRuleHead,
  getEditRuleHeadPage,
} from '#/api/bpp/flow/field-rule';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import dynamicTable from './dynamic-table.vue';

defineOptions({ name: 'FieldRuleIndex', inheritAttrs: false });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建业务字段规则校验 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑业务字段规则校验 */
function handleEdit(row: FieldEditRuleHeadApi.EditRuleHead) {
  formModalApi.setData(row).open();
}

/** 删除业务字段规则校验 */
async function handleDelete(row: FieldEditRuleHeadApi.EditRuleHead) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteEditRuleHead(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除业务字段规则校验 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deletingBatch'),
    duration: 0,
  });
  try {
    await deleteEditRuleHeadList(checkedIds.value);
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
  records: FieldEditRuleHeadApi.EditRuleHead[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出表格 */
async function handleExport() {
  const data = await exportEditRuleHead(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '业务字段规则校验.xls', source: data });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getEditRuleHeadPage({
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
  } as VxeTableGridOptions<FieldEditRuleHeadApi.EditRuleHead>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
</script>

<template>
  <Page auto-content-height>
    <dynamicTable />
<!--    <FormModal @success="handleRefresh" />-->
<!--    <Grid table-title="业务字段规则校验列表">-->
<!--      <template #toolbar-tools>-->
<!--        <TableAction-->
<!--          :actions="[-->
<!--            {-->
<!--              label: $t('ui.actionTitle.create'),-->
<!--              type: 'primary',-->
<!--              icon: ACTION_ICON.ADD,-->
<!--              auth: ['field:edit-rule-head:create'],-->
<!--              onClick: handleCreate,-->
<!--            },-->
<!--            {-->
<!--              label: $t('ui.actionTitle.export'),-->
<!--              type: 'primary',-->
<!--              icon: ACTION_ICON.DOWNLOAD,-->
<!--              auth: ['field:edit-rule-head:export'],-->
<!--              onClick: handleExport,-->
<!--            },-->
<!--            {-->
<!--              label: $t('ui.actionTitle.deleteBatch'),-->
<!--              type: 'primary',-->
<!--              danger: true,-->
<!--              icon: ACTION_ICON.DELETE,-->
<!--              auth: ['field:edit-rule-head:delete'],-->
<!--              disabled: isEmpty(checkedIds),-->
<!--              onClick: handleDeleteBatch,-->
<!--            },-->
<!--          ]"-->
<!--        />-->
<!--      </template>-->
<!--      <template #actions="{ row }">-->
<!--        <TableAction-->
<!--          :actions="[-->
<!--            {-->
<!--              label: $t('common.edit'),-->
<!--              type: 'link',-->
<!--              icon: ACTION_ICON.EDIT,-->
<!--              auth: ['field:edit-rule-head:update'],-->
<!--              onClick: handleEdit.bind(null, row),-->
<!--            },-->
<!--            {-->
<!--              label: $t('common.delete'),-->
<!--              type: 'link',-->
<!--              danger: true,-->
<!--              icon: ACTION_ICON.DELETE,-->
<!--              auth: ['field:edit-rule-head:delete'],-->
<!--              popConfirm: {-->
<!--                title: $t('ui.actionMessage.deleteConfirm', [row.id]),-->
<!--                confirm: handleDelete.bind(null, row),-->
<!--              },-->
<!--            },-->
<!--          ]"-->
<!--        />-->
<!--      </template>-->
<!--    </Grid>-->
  </Page>
</template>
