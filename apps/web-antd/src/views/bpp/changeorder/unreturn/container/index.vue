<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { onMounted, reactive, ref, watch } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
// import { getDictDataPage } from '#/api/bpp/base/dict/data';
import {
  deleteMachineSpreaderRecord,
  getAcceptancePlanOverOperation,
  getAcceptancePlanOverOperationPage,
} from '#/api/bpp/flow/acceptance/plan/over/operation';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';
import { router } from '#/router';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import Detail from '#/views/bpp/flow/acceptance/plan/over/operation/modules/detail.vue';
import Form from '#/views/bpp/flow/acceptance/plan/over/operation/modules/form.vue';
import OnSiteOperation from '#/views/bpp/flow/acceptance/plan/over/operation/modules/onSiteOperation.vue';

import {
  acceptancePlanColumns,
  acceptancePlanSearchSchema,
  payInfoFormSchema,
  planInfoFormSchema,
} from './data';

interface OnSideOperation {
  overOperationContainerIds: string;
  initiationType: string;
  machineSpreaderChangeType: string;
  acceptancePlanNo: string;
  containerNo: string;
  spreaderType: string;
  vesselCode: string;
  vesselVoyage: string;
  vesselName: string;
}
interface batchQueryConditionsVO {
  acceptancePlanNo: string;
  containerNo: string;
}
// 使用字典 store
const bppBaseDict = bppBaseDictStore();
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
  PlanInfoApi.query();
  machineSpreaderChangeRecordGridApi.query();
}

/** 创建新申请 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 办理任务 */
function handleAudit(row: any) {
  // router.push({
  //   name: 'BpmProcessInstanceDetail',
  //   query: {
  //     id: row.processInstance!.id,
  //   },
  // });
  router.push({
    path: '/bpm/process-instance/detail',
    query: {
      id: row.processInstance!.id,
    },
  });
}

/** 流程审核 */
function handleViewDetail(row: any) {
  if (!row.processInstanceId) {
    message.error($t('ui.actionMessage.noProcessInstance'));
    return;
  }
  handleAudit({
    processInstance: {
      id: row.processInstanceId,
    },
  });
}

/** 查看详情 */
const handleDetail = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  const res = await getAcceptancePlanOverOperation(row.id);
  detailModalApi.setData(res).open();
};

/** 编辑申请 */
const handleEdit = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  // const res = await getAcceptancePlanOverOperation(row.id);
  formModalApi.setData(row).open();
};
/** 变更吊具修改 */
const handleOnSiteEditOperation = async (
  row: FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO,
) => {
  OnSideOperationModalApi.setData(row).open();
};
/** 删除变更吊具信息 */
const handleMachineSpreaderDelete = async (
  row: FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO,
) => {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteMachineSpreaderRecord(row.id);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
};

/** 超限作业申请选中操作 */
const checkedIds = ref<number[]>([]);
const acceptancePlanNo = ref<string[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanVO[];
}) {
  checkedIds.value = records.map((item) => item.id);
  acceptancePlanNo.value = records.map((item) => item.acceptancePlanNo);
  PlanInfoApi.query();
}
/** 重置箱信息相关数据 */
const resetContainerData = () => {
  boxCheckedIds.value = [];
  boxAcceptancePlanNo.value = [];
  containerNos.value = [];
  containerIds.value = [];
  batchQueryConditions.value = [];
  machineSpreaderChangeTypes.value = [];
  containerOperationNodes.value = [];
  vesselCodes.value = [];
  vesselVoyages.value = [];
  vesselNames.value = [];
  plannedSpreaderTypes.value = [];
  // 清除表格选中状态
  if (PlanInfoApi.grid) {
    PlanInfoApi.grid.clearCheckboxRow(); // 清除所有选中行
    PlanInfoApi.grid.clearCheckboxRow(); // 清除复选框选中
  }

  if (machineSpreaderChangeRecordGridApi.grid) {
    machineSpreaderChangeRecordGridApi.grid.clearCheckboxRow();
    machineSpreaderChangeRecordGridApi.grid.clearCheckboxRow();
  }
  machineSpreaderChangeRecordGridApi.query();
};
/** 箱信息选中操作 */
const boxCheckedIds = ref<number[]>([]);
const boxAcceptancePlanNo = ref<string[]>([]);
const containerNos = ref<string[]>([]);
const containerIds = ref<number[]>([]);
const batchQueryConditions = ref<batchQueryConditionsVO[]>([]);
const machineSpreaderChangeTypes = ref<string[]>([]);
const containerOperationNodes = ref<string[]>([]);
const vesselCodes = ref<string[]>([]);
const vesselVoyages = ref<string[]>([]);
const vesselNames = ref<string[]>([]);
const plannedSpreaderTypes = ref<string[]>([]);
function boxHandleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[];
}) {
  const refMap = {
    boxCheckedIds,
    boxAcceptancePlanNo,
    containerNos,
    containerIds,
    machineSpreaderChangeTypes,
    containerOperationNodes,
    vesselCodes,
    vesselVoyages,
    vesselNames,
    plannedSpreaderTypes,
  };
  const fieldMappings = {
    boxCheckedIds: 'id',
    boxAcceptancePlanNo: 'acceptancePlanNo',
    containerNos: 'containerNo',
    containerIds: 'id',
    machineSpreaderChangeTypes: 'machineSpreaderChangeType',
    containerOperationNodes: 'containerOperationNode',
    vesselCodes: 'vesselCode',
    vesselVoyages: 'vesselVoyage',
    vesselNames: 'vesselName',
    plannedSpreaderTypes: 'plannedSpreaderType',
  };
  Object.entries(fieldMappings).forEach(([refName, field]) => {
    refMap[refName].value = records.map((item) => item[field]);
  });
  batchQueryConditions.value = records.map((item) => ({
    acceptancePlanNo: item.acceptancePlanNo,
    containerNo: item.containerNo,
  }));
  machineSpreaderChangeRecordGridApi.query();
}
/** 吊具变更记录选中操作 */
const machineSpreaderChangeRecordCheckedIds = ref<number[]>([]);

// 高级查询处理函数
function handleHighPriceQuery() {
  message.info('高级查询功能');
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: acceptancePlanSearchSchema(),
    submitButtonOptions: {
      content: $t('cxmo.action.search'),
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
    columns: acceptancePlanColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: true,
      custom: true,
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

// 改单计划信息表单数据
const planInfoFormValues = reactive({});
const payInfoFormValues = reactive({});

// 改单计划信息表单
const [PlanInfoForm, planInfoFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  schema: planInfoFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  actionWrapperClass: 'col-span-2 text-right',
  handleValuesChange: (values) => {
    Object.assign(planInfoFormValues, values);
  },
  handleSubmit: async () => {
    console.log('表单提交:', planInfoFormValues);
    message.success('表单提交成功');
  },
  handleReset: async () => {
    planInfoFormApi.resetForm();
    Object.assign(planInfoFormValues, {});
  },
});

const [PayInfoForm, payInfoFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  schema: payInfoFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  actionWrapperClass: 'col-span-2 text-right',
  handleValuesChange: (values) => {
    Object.assign(payInfoFormValues, values);
  },
  handleSubmit: async () => {
    console.log('表单提交:', payInfoFormValues);
    message.success('表单提交成功');
  },
  handleReset: async () => {
    payInfoFormApi.resetForm();
    Object.assign(payInfoFormValues, {});
  },
});

const initiationTypeValue = ref<null | string>(null);

const adcancedQueryModalOpen = () => {
  AdvancedQueryModalApi.open();
};
onMounted(async () => {
  await getDictDataList();
});
watch(
  () => bppBaseDict.getBppBaseDictOptions('initiation_type'),
  (options) => {
    if (options && options.length > 0 && !initiationTypeValue.value) {
      const customerInitiated = options.find(
        (item) => item.label === '客户发起',
      );
      if (customerInitiated) {
        initiationTypeValue.value = customerInitiated.value;
      }
    }
  },
  { immediate: true },
);

// 查询结果
const queryResult = ref<any>(null);

// 处理查询事件
const handleQuery = (params: any) => {
  console.log('查询参数:', params);
  queryResult.value = params;
};

// 处理重置事件
const handleReset = () => {
  console.log('重置查询条件');
  queryResult.value = null;
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
    <!-- 未回场箱信息修改 -->
    <div class="my-3 flex" style="height: 50px">111</div>
    <div class="my-3 flex" style="height: 220px">
      <div class="h-full w-1/2">
        <div class="flex h-full flex-col rounded-lg bg-white p-4 shadow">
          <h3 class="mb-4 text-lg">改单计划信息</h3>
          <PlanInfoForm class="h-full flex-1" />
        </div>
      </div>
      <div class="ml-3 h-full w-1/2">
        <div class="flex h-full flex-col rounded-lg bg-white p-4 shadow">
          <h3 class="mb-4 text-lg">改单付费信息</h3>
          <PayInfoForm class="h-full flex-1" />
        </div>
      </div>
    </div>
    <div class="h-3/5 w-full">
      <Grid table-title=" 受理计划列表 ">
        <template #form-expand-before>
          <advancedButton @click="adcancedQueryModalOpen" />
        </template>
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: $t('cxmo.action.add'),
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['bpp:flow-acceptance-plan-over-operation:create'],
                onClick: handleCreate,
              },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              {
                label: '编辑',
                type: 'link',
                icon: ACTION_ICON.EDIT,
                auth: ['bpp:flow-acceptance-plan-over-operation:update'],
                onClick: handleEdit.bind(null, row),
              },
            ]"
          />
        </template>
      </Grid>
    </div>
  </Page>
</template>
