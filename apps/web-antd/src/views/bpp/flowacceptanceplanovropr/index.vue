<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flowoverlimitwork';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getAcceptancePlanOverOperation,
  getAcceptancePlanOverOperationContainerPage,
  getAcceptancePlanOverOperationPage,
} from '#/api/bpp/flowoverlimitwork';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';

import {
  acceptancePlanOvrOprColumns,
  acceptancePlanOvrOprFormSchema,
  useBoxGridColumns,
  useToolChangeGridColumns,
} from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';
import OnSiteOperation from './modules/onSiteOperation.vue';

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
// 现场操作确认弹框
const [OnSideOperationModal, OnSideOperationModalApi] = useVbenModal({
  connectedComponent: OnSiteOperation,
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
/** 查看详情 */
function handleViewDetail(row: OverLimitPlan) {
  message.info(`查看编号 ${row.acceptancePlanNo} 的详情`);
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
/** 现场操作确认 */
const handleOnSiteOperation = async () => {
  OnSideOperationModalApi.setData(null).open();
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
  boxGridApi.query();
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
    columns: acceptancePlanOvrOprColumns(),
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

// 箱列表表格配置
const [BoxGrid, boxGridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useBoxGridColumns(),
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
    proxyConfig: {
      autoLoad: false,
      manual: true,
      ajax: {
        query: async ({ page }, formValues) => {
          if (acceptancePlanNo.value.length > 0) {
            formValues.acceptancePlanNos = acceptancePlanNo.value;
          }
          if (formValues?.acceptancePlanNos?.length > 0) {
            return await getAcceptancePlanOverOperationContainerPage({
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            });
          }
          // 无参数时返回空数据（确保界面显示空）
          return { list: [], total: 0 };
        },
      },
    },
  } as VxeTableGridOptions<FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO>,
});

// 变更吊具记录表格配置
const [ToolChangeGrid] = useVbenVxeGrid({
  gridOptions: {
    columns: useToolChangeGridColumns(),
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
    data: [
      {
        id: 1,
        global_id: 'GID000001',
        operation_type: 'DS',
        drive_source: '客户申请',
        change_reason: '超高箱作业',
        vessel_code: 'XX',
        voyage_code: 'SG001E',
        container_no: 'TESU00000001',
        operation_position: '01BAY01',
        machine_type: 'QC',
        machine_no: 'QC01',
        spreader_type: 'HIGH',
        start_time: '2024-01-01 10:00:00',
        end_time: '2024-01-01 10:30:00',
        operation_file: 'file1.jpg,file2.jpg',
        remark: '需要使用特殊吊具',
        container_over_id: 1001,
        machine_stop_id: 2001,
        creator: 'admin',
        create_time: '2024-01-01 09:00:00',
        updater: 'admin',
        update_time: '2024-01-01 09:30:00',
        deleted: 0,
        tenant_id: 1,
      },
    ],
    // 禁用代理模式，确保不发送远程请求
    proxyConfig: null,
  } as VxeTableGridOptions<ToolChangeRecord>,
});

const radioValue = ref(null);

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
    <OnSideOperationModal class="w-1/2" @success="handleRefresh" />
    <!-- 超限作业申请列表 -->
    <div class="h-3/5 w-full">
      <Grid table-title="超限作业申请列表">
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
                label: '撤销',
                type: 'default',
                icon: ACTION_ICON.UNDO,
                onClick: handleHighPriceQuery,
              },
              {
                label: '撤销审核',
                type: 'default',
                icon: ACTION_ICON.UNDO,
                disabled: true,
                onClick: handleHighPriceQuery,
              },
              {
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.LOG,
                onClick: handleHighPriceQuery,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '审核',
                type: 'link',
                icon: ACTION_ICON.AUDIT,
                onClick: handleViewDetail.bind(null, row),
              },
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
            ]"
          />
        </template>
      </Grid>
    </div>
    <div class="my-3 flex h-2/5 w-full">
      <div class="w-1/2">
        <!-- 箱列表表格 -->
        <BoxGrid table-title="箱列表">
          <template #actions="{ row }">
            <TableAction
              :actions="[
                {
                  label: '查看',
                  type: 'link',
                  icon: ACTION_ICON.VIEW,
                  onClick: () =>
                    message.info(`查看箱 ${row.container_no} 的详情`),
                },
                {
                  label: '编辑',
                  type: 'link',
                  icon: ACTION_ICON.EDIT,
                  onClick: () => message.info(`编辑箱 ${row.container_no}`),
                },
                {
                  label: '删除',
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.DELETE,
                  popConfirm: {
                    title: `确认删除箱 ${row.container_no} 吗？`,
                    confirm: () => message.success('删除成功'),
                  },
                },
              ]"
            />
          </template>
          <template #toolbar-tools>
            <div class="mr-4">
              <a-radio-group name="radioGroup" v-model:value="radioValue">
                <a-radio value="箱现场突发">箱现场突发</a-radio>
                <a-radio value="舱盖板">舱盖板</a-radio>
                <a-radio value="客户发起">客户发起</a-radio>
              </a-radio-group>
            </div>
            <TableAction
              :actions="[
                {
                  label: '现场操作确认',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleOnSiteOperation,
                },
                {
                  label: '现场无此操作',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
                {
                  label: '无需变更道具',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
              ]"
            />
          </template>
        </BoxGrid>
      </div>
      <div class="ml-3 w-1/2">
        <!-- 变更吊具记录表格 -->
        <ToolChangeGrid table-title="变更吊具记录">
          <template #toolbar-tools>
            <TableAction
              :actions="[
                {
                  label: '日志查询',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
                {
                  label: '无变更作业',
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleCreate,
                },
              ]"
            />
          </template>
        </ToolChangeGrid>
      </div>
    </div>
  </Page>
</template>
