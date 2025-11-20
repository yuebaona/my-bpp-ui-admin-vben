<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flowoverlimitwork';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getAcceptancePlanOverOperation,
  deleteSubPlan,
  getAcceptancePlanOverOperationPage,
} from '#/api/bpp/emptycontainercontrol';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';

import {
  subPlanColumns,
  acceptancePlanOvrOprFormSchema
} from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';

const [AdvancedQueryModal, AdvancedQueryModalApi] = useVbenModal({
  showCancelButton: false,
  showConfirmButton: false,
});
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建新申请 */
function handleCreate() {
  formModalApi.setData(null).open();
}

function handleExport() {
  message.info('导出功能');
}
/** 查看详情 */
const handleDetail = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  const res = await getAcceptancePlanOverOperation(row.id);
  detailModalApi.setData(res).open();
};

/** 编辑申请 */
const handleEdit = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  const res = await getAcceptancePlanOverOperation(row.id);
  formModalApi.setData(res).open();
};

/** 删除申请 */
const handleDelete = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  // 这里实现删除逻辑
  // 例如调用删除API
  await deleteSubPlan(row.id);
  message.success('删除成功');
  handleRefresh(); // 删除后刷新表格
};

const checkedIds = ref<number[]>([]);
const acceptancePlanNo = ref<number[]>([]);
function handleRowCheckboxChange({
                                   records,
                                 }: {
  records: FlowOverLimitWorkApi.AcceptancePlanVO[];
}) {
  checkedIds.value = records.map((item) => item.id);
  acceptancePlanNo.value = records.map((item) => item.acceptancePlanNo);
}

// 高级查询处理函数
function handleHighPriceQuery() {
  message.info('高级查询功能');
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: acceptancePlanOvrOprFormSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
  },
  gridOptions: {
    columns: subPlanColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: false,
      search: false,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    // 禁用代理模式，确保不发送远程请求
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getAcceptancePlanOverOperationPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
  } as VxeTableGridOptions<FlowOverLimitWorkApi.AcceptancePlanVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

const adcancedQueryModalOpen = () => {
  AdvancedQueryModalApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <FormModal class="w-1/2" @success="handleRefresh" />
    <AdvancedQueryModal class="w-2/5">
      <AdvancedQuery />
    </AdvancedQueryModal>
    <DetailModal />
    <!-- 子计划列表 -->
    <div class="h-3/5 w-full">
      <Grid table-title="子计划">
        <template #form-expand-before>
          <advancedButton @click="adcancedQueryModalOpen" />
        </template>
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['system:user:create'],
                onClick: handleCreate,
              },
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleHighPriceQuery,
              },
              {
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.VIEW,
                onClick: handleLogQuery,
              }
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '修改',
                type: 'link',
                icon: ACTION_ICON.EDIT,
                auth: ['system:user:update'],
                onClick: handleEdit.bind(null, row),
              },
              {
                label: '详情',
                type: 'link',
                icon: ACTION_ICON.VIEW,
                onClick: handleDetail.bind(null, row),
              },
              {
                label: '删除',
                type: 'link',
                icon: ACTION_ICON.DELETE,
                auth: ['system:user:delete'],
                onClick: handleDelete.bind(null, row),
                danger: true,
              },
            ]"
          />
        </template>
      </Grid>
    </div>
  </Page>
</template>
