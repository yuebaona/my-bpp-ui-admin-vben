<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { InfraCodegenApi } from '#/api/infra/codegen';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTableByTableName } from '#/api/bpp/flow/search/table/index';
import { createCodegenList, getSchemaTableList } from '#/api/infra/codegen';
import { $t } from '#/locales';
import {
  useImportTableColumns,
  useImportTableFormSchema,
} from '#/views/infra/codegen/data';
import type {VbenFormSchema} from "#/adapter/form";
import {getDataSourceConfigList} from "#/api/infra/data-source-config";

/** 定义组件事件 */
const emit = defineEmits<{
  (e: 'success'): void;
}>();

const formData = reactive<InfraCodegenApi.CodegenCreateListReqVO>({
  dataSourceConfigId: 0,
  name: '',
  tableNames: [], // 已选择的表列表
});

/** 导入数据库表的表单 */
function importTableFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '表名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表名称',
      },
    },
    {
      fieldName: 'comment',
      label: '表描述',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表描述',
      },
    },
  ];
}
/** 表格实例 */
const [Grid,gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: importTableFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: [
      { type: 'checkbox', width: 40 },
      { field: 'name', title: '表名称', minWidth: 200 },
      { field: 'comment', title: '表描述', minWidth: 200 },
    ],
    height: 600,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return formValues.name?await getTableByTableName(formValues.name):await getTableByTableName("");
        },
      },
    },
    rowConfig: {
      keyField: 'name',
      isHover: true,
    },
    toolbarConfig: {
      enabled: false,
    },
    checkboxConfig: {
      highlight: true,
      range: true,
    },
    pagerConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions<InfraCodegenApi.DatabaseTable>,
  gridEvents: {
    checkboxChange: ({
      records,
    }: {
      records: InfraCodegenApi.DatabaseTable[];
    }) => {
      formData.tableNames = records.map((item) => item.name);
    },
  },
});

/** 模态框实例 */
const [Modal, modalApi] = useVbenModal({
  title: '导入数据库表',
  class: 'w-1/2',
  // 确定按钮
  async onConfirm() {
    modalApi.lock();
    // 1.1 获取表单值
    if (formData?.dataSourceConfigId === undefined) {
      message.error('请选择数据源');
      return;
    }
    // 1.2 校验是否选择了表
    if (formData.tableNames.length === 0) {
      message.error('请选择需要导入的表');
      return;
    }
    // 2. 提交请求
    const hideLoading = message.loading({
      content: '导入中...',
      duration: 0,
    });
    try {
      // await createCodegenList(formData);
      console.log('已选表格', formData.tableNames)
      // 关闭并提示
      await modalApi.close();
      emit('success',formData.tableNames);
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      hideLoading();
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal>
    <Grid />
  </Modal>
</template>
