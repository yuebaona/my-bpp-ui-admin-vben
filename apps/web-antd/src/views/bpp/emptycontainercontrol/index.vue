<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/emptycontainercontrol';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getSubPlan,
  deleteSubPlan,
  // getSubPlanPage, //因使用固定数据暂时注销
} from '#/api/bpp/emptycontainercontrol';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';

import {
  subPlanColumns,
  PlanSearchFormSchema,
  STATIC_SUB_PLAN_LIST_DATA,
  STATIC_SUB_PLAN_DETAIL_DATA
} from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';
import LogQuery from './modules/logQuery.vue';

const checkedIds = ref<number[]>([]);
const subPlanNo = ref<string[]>([]);

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

const [LogQueryModal, logQueryModalApi] = useVbenModal({
  connectedComponent: LogQuery,
  destroyOnClose: true,
  footer: false,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: PlanSearchFormSchema(),
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
      search: true,
      custom: true,
      export: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    editRules: {
      applicantCompanyName: [{ required: true, content: '是否放箱不能为空' }],
    },
    // proxyConfig: {
    //   ajax: {
    //     query: async ({ page }, formValues) => {
    //       return await getSubPlanPage({
    //         pageNo: page.currentPage,
    //         pageSize: page.pageSize,
    //         ...formValues,
    //       });
    //     },
    //   },
    // },
  } as VxeTableGridOptions<EmptyContainerControlApi.subPlanVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

const [SubGrid] = useVbenVxeGrid({
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
      zoom: false,
      custom: false,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    editRules: {
      applicantCompanyName: [{ required: true }],
      acceptancePlanNo: [{ required: true }],
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          // return await getSubPlanPage({
          //   pageNo: page.currentPage,
          //   pageSize: page.pageSize,
          //   ...formValues,
          // });
          return {
            list: STATIC_SUB_PLAN_LIST_DATA,
            total: STATIC_SUB_PLAN_LIST_DATA.length
          };
        },
      },
    },
  } as VxeTableGridOptions<EmptyContainerControlApi.subPlanVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

function handleRowCheckboxChange({
                                   records,
                                 }: {
  records: EmptyContainerControlApi.subPlanVO[];
}) {
  checkedIds.value = records.map((item) => item.id);
  subPlanNo.value = records.map((item) => item.subPlanNo);
}

// 高级查询处理函数
/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建新申请 */
function handleCreateSubPlan() {
  formModalApi.setData(null).open();
}

function handleSubExport() {
  message.info('导出功能');
}

/** 查看详情 */
const handleSubDetail = async (row: EmptyContainerControlApi.subPlanVO) => {
  const res = await getSubPlan(row.id);
  formModalApi.setData(res).open();
};

/** 编辑申请 */
const handleSubEdit = async (row: EmptyContainerControlApi.subPlanVO) => {
  // 使用固定数据填充弹窗
  const editData = {
    acceptancePlanRespVO: {
      ...STATIC_SUB_PLAN_DETAIL_DATA
    },
    yardPositionResp: [
      {
        id: 1,
        yardPosition: 'A01-01-01',
        yardColumns: ['A', 'B'],
        totalCount: '50',
        minStorageDays: '3',
        maxStorageDays: '10'
      },
      {
        id: 2,
        yardPosition: 'B02-01-01',
        yardColumns: ['C', 'D'],
        totalCount: '30',
        minStorageDays: '2',
        maxStorageDays: '8'
      }
    ]
  };

  formModalApi.setData(editData).open();
};

/** 删除申请 */
const handleSubDelete = async (row: EmptyContainerControlApi.subPlanVO) => {
  await deleteSubPlan(row.id);
  message.success('删除成功');
  handleRefresh();
};

/** 日志查询 */
function handleLogQuery() {
  logQueryModalApi.open();
}

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
    <LogQueryModal />
    <!-- 主计划列表 -->
    <div class="h-3/5 w-full">
      <Grid table-title="主计划">
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
                onClick: handleCreateSubPlan,
              },
              {
                label: '强制完成',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleSubExport,
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
                onClick: handleSubEdit.bind(null, row),
              },
              {
                label: '详情',
                type: 'link',
                icon: ACTION_ICON.VIEW,
                onClick: handleSubDetail.bind(null, row),
              },
              {
                label: '删除',
                type: 'link',
                icon: ACTION_ICON.DELETE,
                auth: ['system:user:delete'],
                onClick: handleSubDelete.bind(null, row),
                danger: true,
              },
            ]"
          />
        </template>
      </Grid>
    </div>
    <div class="h-2/5 w-full">
      <SubGrid table-title="子计划">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['system:user:create'],
                onClick: handleCreateSubPlan,
              },
              {
                label: '导出',
                type: 'primary',
                icon: ACTION_ICON.DOWNLOAD,
                onClick: handleSubExport,
              },
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
                onClick: handleSubEdit.bind(null, row),
              },
              {
                label: '详情',
                type: 'link',
                icon: ACTION_ICON.VIEW,
                onClick: handleSubDetail.bind(null, row),
              },
              {
                label: '删除',
                type: 'link',
                icon: ACTION_ICON.DELETE,
                auth: ['system:user:delete'],
                onClick: handleSubDelete.bind(null, row),
                danger: true,
              },
            ]"
          />
        </template>
      </SubGrid>
    </div>
  </Page>
</template>
