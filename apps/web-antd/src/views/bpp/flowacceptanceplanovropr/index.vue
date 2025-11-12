<script lang="ts" setup>
import type { BoxData, OverLimitPlan, ToolChangeRecord } from './data';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';

import {
  acceptancePlanOvrOprColumns,
  acceptancePlanOvrOprFormSchema,
  useBoxGridColumns,
  useToolChangeGridColumns,
} from './data';

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  // 模拟导出功能
  message.success('导出成功');
}

/** 创建新申请 */
function handleCreate() {
  message.info('创建新的超限作业申请');
  // 这里可以添加创建新申请的逻辑
}

/** 查看详情 */
function handleViewDetail(row: OverLimitPlan) {
  message.info(`查看编号 ${row.acceptance_plan_no} 的详情`);
}

/** 编辑申请 */
function handleEdit(row: OverLimitPlan) {
  message.info(`编辑编号 ${row.acceptance_plan_no} 的申请`);
}

/** 删除申请 */
async function handleDelete(row: OverLimitPlan) {
  const hideLoading = message.loading({
    content: `正在删除申请 ${row.acceptance_plan_no}`,
    duration: 0,
  });
  try {
    // 模拟删除操作
    message.success(`删除申请 ${row.acceptance_plan_no} 成功`);
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除申请 */
async function handleDeleteBatch() {
  await confirm('确认批量删除选中的申请吗？');
  const hideLoading = message.loading({
    content: '正在批量删除',
    duration: 0,
  });
  try {
    // 模拟批量删除操作
    checkedIds.value = [];
    message.success('批量删除成功');
    handleRefresh();
  } finally {
    hideLoading();
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({ records }: { records: OverLimitPlan[] }) {
  checkedIds.value = records.map((item) => item.id);
}

// 模拟超限作业申请数据
const mockOverLimitData = [
  {
    id: 1,
    acceptance_plan_no: 'AP2024010001',
    acceptance_plan_webno: 'WEB2024010001',
    applicant_code: 'APL001',
    applicant_company_name: '广州航运有限公司',
    payer_code: 'PAY001',
    payer_name: '广州航运',
    payment_type: '预付',
    category: '进口',
    vessel_code: 'VES001',
    vessel_name: '中远之星',
    voyage_code: 'VY001',
    voyage_no: 'CS001E',
    planned_operation_time: '2024-01-15 10:00:00',
    is_jc: 'N',
    bill_no: 'BL2024010001',
    cargo_name: '大型设备',
    attachment_file: '',
    handling_person: '张三',
    handler_remark: '',
    handler_confirmation: '',
    res_confirm_time: '',
    is_allowed: 'Y',
    allowed_time: '2024-01-14 15:00:00',
    planned_machinery_type: '岸桥',
    planned_spreader_type: '超高吊具',
    system_rate: '0.1',
    plan_price: 10_000,
    plan_status: '已受理',
    approval_workflow_current_node: 'FINISH',
    appro_workflow_current_status: '已通过',
    appr_result: '同意',
    approval_workflow_next_node: '',
    submission_time: '2024-01-14 10:00:00',
    workflow_com_time: '2024-01-14 15:00:00',
    creator: 'admin',
    create_time: '2024-01-14 09:00:00',
    updater: 'admin',
    update_time: '2024-01-14 15:00:00',
    deleted: 0,
    tenant_id: 1,
  },
  {
    id: 2,
    acceptance_plan_no: 'AP2024010002',
    acceptance_plan_webno: 'WEB2024010002',
    applicant_code: 'MSC001',
    applicant_company_name: '地中海航运有限公司',
    payer_code: 'PAY002',
    payer_name: '地中海航运',
    payment_type: '月结',
    category: '出口',
    vessel_code: 'VES002',
    vessel_name: '地中海辉煌',
    voyage_code: 'VY002',
    voyage_no: 'MS002W',
    planned_operation_time: '2024-01-16 14:00:00',
    is_jc: 'Y',
    bill_no: 'BL2024010002',
    cargo_name: '超长钢材',
    attachment_file: '',
    handling_person: '李四',
    handler_remark: '',
    handler_confirmation: '',
    res_confirm_time: '',
    is_allowed: 'Y',
    allowed_time: '2024-01-15 16:00:00',
    planned_machinery_type: '龙门吊',
    planned_spreader_type: '超长吊具',
    system_rate: '0.12',
    plan_price: 15_000,
    plan_status: '已受理',
    approval_workflow_current_node: 'FINISH',
    appro_workflow_current_status: '已通过',
    appr_result: '同意',
    approval_workflow_next_node: '',
    submission_time: '2024-01-15 11:00:00',
    workflow_com_time: '2024-01-15 16:00:00',
    creator: 'admin',
    create_time: '2024-01-15 10:00:00',
    updater: 'admin',
    update_time: '2024-01-15 16:00:00',
    deleted: 0,
    tenant_id: 1,
  },
];

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: acceptancePlanOvrOprFormSchema(),
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
      refresh: true,
      search: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    data: mockOverLimitData,
    // 禁用代理模式，确保不发送远程请求
    proxyConfig: null,
  } as VxeTableGridOptions<OverLimitPlan>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
});

// 箱列表表格配置
const [BoxGrid] = useVbenVxeGrid({
  gridOptions: {
    columns: useBoxGridColumns(),
    height: '400px',
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
        container_no: 'TESU00000001',
        container_size: '40',
        container_type: 'FR',
        container_cargo_weight_kg: 18_000,
        container_total_weight_kg: 21_000,
        container_cargo_size_cm: '1350x245x350',
        container_overlimit_details:
          '左超宽:10,右超宽:0,前超长:0,后超长:0,超高:55',
        container_physical_status: 'YARD',
        container_node: '',
        acceptance_plan_no: 'AP2024010001',
        spreader_operation_id: null,
        creator: 'admin',
        create_time: '2024-01-14 09:00:00',
        updater: 'admin',
        update_time: '2024-01-14 09:00:00',
        deleted: 0,
        tenant_id: 1,
      },
      {
        id: 2,
        container_no: 'TESU00000002',
        container_size: '20',
        container_type: 'OT',
        container_cargo_weight_kg: 5000,
        container_total_weight_kg: 7000,
        container_cargo_size_cm: '1350x245x350',
        container_overlimit_details:
          '左超宽:0,右超宽:0,前超长:0,后超长:0,超高:40',
        container_physical_status: 'PRE_DS',
        container_node: 'Ini',
        acceptance_plan_no: 'AP2024010002',
        spreader_operation_id: 1,
        creator: 'admin',
        create_time: '2024-01-15 10:00:00',
        updater: 'admin',
        update_time: '2024-01-15 10:00:00',
        deleted: 0,
        tenant_id: 1,
      },
    ],
    // 禁用代理模式，确保不发送远程请求
    proxyConfig: null,
  } as VxeTableGridOptions<BoxData>,
});

// 变更吊具记录表格配置
const [ToolChangeGrid] = useVbenVxeGrid({
  gridOptions: {
    columns: useToolChangeGridColumns(),
    height: '400px',
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
</script>

<template>
  <Page auto-content-height>
    <div class="h-full w-full">
      <!-- 超限作业申请列表 -->
      <div class="h-3/5 w-full">
        <Grid table-title="超限作业申请列表">
          <template #toolbar-tools>
            <TableAction
              :actions="[
                {
                  label: '新增申请',
                  type: 'primary',
                  icon: ACTION_ICON.ADD,
                  onClick: () => message.info('新增申请'),
                },
                {
                  label: '导出数据',
                  type: 'primary',
                  icon: ACTION_ICON.DOWNLOAD,
                  onClick: handleExport,
                },
                {
                  label: '批量删除',
                  type: 'primary',
                  danger: true,
                  icon: ACTION_ICON.DELETE,
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
                  label: '查看详情',
                  type: 'link',
                  icon: ACTION_ICON.DETAIL,
                  onClick: handleViewDetail.bind(null, row),
                },
                {
                  label: '编辑',
                  type: 'link',
                  icon: ACTION_ICON.EDIT,
                  onClick: handleEdit.bind(null, row),
                },
                {
                  label: '删除',
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.DELETE,
                  popConfirm: {
                    title: `确认删除申请 ${row.acceptance_plan_no} 吗？`,
                    confirm: handleDelete.bind(null, row),
                  },
                },
              ]"
            />
          </template>
        </Grid>
      </div>
      <div class="my-3 flex h-2/5 w-full">
        <div class="h-full w-1/2">
          <div>
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
                      onClick: handleCreate,
                    },
                    {
                      label: '现场无此操作',
                      type: 'primary',
                      auth: ['system:user:create'],
                      onClick: handleCreate,
                    },
                    {
                      label: '此箱现场无后续变更吊具处理',
                      type: 'primary',
                      auth: ['system:user:create'],
                      onClick: handleCreate,
                    },
                  ]"
                />
              </template>
            </BoxGrid>
          </div>
        </div>
        <div class="ml-3 h-full w-1/2">
          <div>
            <!-- 变更吊具记录头部选项 -->

            <!-- 变更吊具记录表格 -->
            <ToolChangeGrid table-title="变更吊具记录">
              <template #toolbar-tools>
                <TableAction
                  :actions="[
                    {
                      label: '修改处理',
                      type: 'primary',
                      auth: ['system:user:create'],
                      onClick: handleCreate,
                    },
                    {
                      label: '日志查询',
                      type: 'primary',
                      auth: ['system:user:create'],
                      onClick: handleCreate,
                    },
                    {
                      label: '现场无吊具变更的作业',
                      type: 'primary',
                      auth: ['system:user:create'],
                      onClick: handleCreate,
                    },
                    {
                      label: '非客户发起的删除',
                      type: 'default',
                      auth: ['system:user:create'],
                      onClick: handleCreate,
                    },
                  ]"
                />
              </template>
            </ToolChangeGrid>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
