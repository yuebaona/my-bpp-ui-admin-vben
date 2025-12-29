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
import { getAcceptancePlanOverOperationPage } from '#/api/bpp/flow/acceptance/plan/over/operation';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import Form from '#/views/bpp/flow/acceptance/plan/over/operation/modules/form.vue';

import {
  acceptancePlanColumns,
  acceptancePlanSearchSchema,
  payInfoFormSchema,
  planInfoFormSchema,
} from './data';
import BundleBox from './modules/bundleBox.vue';
import Edit from './modules/edit.vue';
import LadingBill from './modules/ladingBill.vue';
import Return from './modules/return.vue';

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

// 提单信息管理模态框
const [LadingBillModal, ladingBillModalApi] = useVbenModal({
  connectedComponent: LadingBill,
  destroyOnClose: true,
});

// 捆绑箱维护弹窗
const [BundleBoxModal, bundleBoxModalApi] = useVbenModal({
  connectedComponent: BundleBox,
  destroyOnClose: true,
});

// 返场信息管理弹窗
const [ReturnModal, returnModalApi] = useVbenModal({
  connectedComponent: Return,
  destroyOnClose: true,
});

// 批量编辑
const [EditModal, editModalApi] = useVbenModal({
  connectedComponent: Edit,
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

/** 编辑申请 */
const handleEdit = async (row: FlowOverLimitWorkApi.AcceptancePlanVO) => {
  // const res = await getAcceptancePlanOverOperation(row.id);
  formModalApi.setData(row).open();
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
}

// 高级查询处理函数
// function handleHighPriceQuery() {
//   message.info('高级查询功能');
// }

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
      export: true,
      // search: true,
      custom: true,
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
    // console.log('表单提交:', planInfoFormValues);
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
    // console.log('表单提交:', payInfoFormValues);
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
  // await getDictDataList();
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
// const handleQuery = (params: any) => {
//   // console.log('查询参数:', params);
//   queryResult.value = params;
// };

// 处理重置事件
const handleReset = () => {
  // console.log('重置查询条件');
  queryResult.value = null;
};

/** 处理点击提单号事件 */
const handleClickPickupNo = () => {
  // message.info('查看提单号信息');
  ladingBillModalApi.setData(null).open();
};

const handleClickSubBox = () => {
  bundleBoxModalApi.setData(null).open();
};

const handleClickReturn = () => {
  returnModalApi.setData(null).open();
};

function batchEdit() {
  editModalApi.setData(null).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal class="w-1/2" @success="handleRefresh" />
    <AdvancedQueryModal class="w-2/5">
      <AdvancedQuery @reset="handleReset" />
    </AdvancedQueryModal>
    <LadingBillModal class="w-3/4" @success="handleRefresh" />
    <BundleBoxModal class="w-3/4" @success="handleRefresh" />
    <ReturnModal class="w-1/4" @success="handleRefresh" />
    <EditModal class="w-3/4" @success="handleRefresh" />
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
                label: '批量修改',
                type: 'primary',
                icon: ACTION_ICON.EDIT,
                onClick: batchEdit,
              },
              {
                label: '删除TO',
                type: 'default',
                icon: ACTION_ICON.DELETE,
                onClick: handleCreate,
              },
              {
                label: '返场信息管理',
                type: 'primary',
                icon: ACTION_ICON.BRIEFCASE,
                onClick: handleClickReturn,
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
        <template #pickupNoAction="{ row }">
          <a-button type="primary" size="small" @click="handleClickPickupNo">
            提单信息管理
          </a-button>
        </template>
        <template #boxAction="{ row }">
          <a-button type="primary" size="small" @click="handleClickSubBox">
            捆绑箱维护
          </a-button>
        </template>
      </Grid>
    </div>
  </Page>
</template>
