<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SearchTableColumnApi } from '#/api/bpp/flow/search/table/index';
import type { SystemDictTypeApi } from '#/api/system/dict/type';

import { onMounted, ref } from 'vue';

import { confirm, Page, useVbenModal, VbenLoading } from '@vben/common-ui';
import { downloadFileFromBlobPart, isEmpty } from '@vben/utils';

import { Input, message, Select } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSimpleDictTypeList } from '#/api/bpp/base/dict/type';
import {
  createTableColumn,
  deleteTableColumn,
  deleteTableColumnList,
  exportTableColumn,
  getTableColumnPage,
  getTableFieldInfoByTableName,
  updateBatch,
} from '#/api/bpp/flow/search/table/index';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import ImportTable from './modules/import-table.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const loadingText = ref('加载中...');
const vbenLoading = ref(false);
/** 导入数据库表 */
const [ImportModal, importModalApi] = useVbenModal({
  connectedComponent: ImportTable,
  destroyOnClose: true,
});
/** 保存数据 */
async function handleSave() {
  loadingText.value = '保存中。。。';
  vbenLoading.value = true;
  try {
    const updateDataList = gridApi.grid.getData();
    if (updateDataList) {
      await updateBatch(updateDataList);
    }
  } finally {
    vbenLoading.value = false;
  }
}
/** 导入数据库表 */
function handleImport() {
  importModalApi.open();
}
/** 刷新表格 */
async function handleRefresh(tableNames) {
  if (tableNames) {
    // 首先根据表名获取字段信息
    const tableFieldInfoList = await getTableFieldInfoByTableName({
      tableNameList: tableNames,
    });
    // 再将字段信息入库
    await createTableColumn({ tableFieldInfoList });
  }
  gridApi.query();
}

/** 创建高级查询字段定义 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑高级查询字段定义 */
function handleEdit(row: SearchTableColumnApi.TableColumn) {
  formModalApi.setData(row).open();
}

/** 删除高级查询字段定义 */
async function handleDelete(row: SearchTableColumnApi.TableColumn) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteTableColumn(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除高级查询字段定义 */
async function handleDeleteBatch() {
  await confirm($t('ui.actionMessage.deleteBatchConfirm'));
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deletingBatch'),
    duration: 0,
  });
  vbenLoading.value = true;
  try {
    await deleteTableColumnList(checkedIds.value);
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
  records: SearchTableColumnApi.TableColumn[];
}) {
  checkedIds.value = records.map((item) => item.id!);
}

/** 导出表格 */
async function handleExport() {
  const data = await exportTableColumn(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '高级查询字段定义.xls', source: data });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    border: true,
    showOverflow: true,
    autoResize: true,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getTableColumnPage({
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
  } as VxeTableGridOptions<SearchTableColumnApi.TableColumn>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});
// 下拉框过滤
const dictTypeFilterOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};
/** 初始化字典类型 */
const dictTypeOptions = ref<SystemDictTypeApi.DictType[]>([]); // 字典类型选项
onMounted(async () => {
  dictTypeOptions.value = await getSimpleDictTypeList();
});
</script>

<template>
  <div>
    <VbenLoading v-if="vbenLoading" :spinning="true" :text="loadingText" />
    <Page auto-content-height>
      <ImportModal @success="handleRefresh" />
      <FormModal @success="handleRefresh" />
      <Grid table-title="高级查询字段定义列表">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '保存',
                type: 'primary',
                icon: ACTION_ICON.EDIT,
                auth: ['search:table-column:create'],
                onClick: handleSave,
              },
              {
                label: $t('ui.actionTitle.create', ['高级查询']),
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['search:table-column:create'],
                onClick: handleImport,
              },
              {
                label: $t('ui.actionTitle.export'),
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                auth: ['search:table-column:export'],
                onClick: handleExport,
              },
              {
                label: $t('ui.actionTitle.deleteBatch'),
                type: 'primary',
                danger: true,
                icon: ACTION_ICON.DELETE,
                auth: ['search:table-column:delete'],
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
                auth: ['search:table-column:update'],
                onClick: handleEdit.bind(null, row),
              },
              {
                label: $t('common.delete'),
                type: 'link',
                danger: true,
                icon: ACTION_ICON.DELETE,
                auth: ['search:table-column:delete'],
                popConfirm: {
                  title: $t('ui.actionMessage.deleteConfirm', [row.id]),
                  confirm: handleDelete.bind(null, row),
                },
              },
            ]"
          />
        </template>
        <!-- 字段描述 -->
        <template #columnComment="{ row }">
          <Input v-model:value="row.columnComment" />
        </template>
        <!-- 显示类型 -->
        <template #htmlType="{ row, column }">
          <Select
            v-model:value="row.htmlType"
            class="w-full"
            allow-clear
            show-search
          >
            <Select.Option
              v-for="option in column.params.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select>
        </template>
        <!-- 字典类型 -->
        <template #dictType="{ row }">
          <Select
            v-model:value="row.dictType"
            class="w-full"
            :filter-option="dictTypeFilterOption"
            allow-clear
            show-search
          >
            <Select.Option
              v-for="option in dictTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            >
              {{ option.name }}
            </Select.Option>
          </Select>
        </template>
        <!-- 示例 -->
        <template #example="{ row }">
          <Input v-model:value="row.example" />
        </template>
      </Grid>
    </Page>
  </div>
</template>
