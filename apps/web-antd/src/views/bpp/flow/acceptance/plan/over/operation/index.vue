<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { onMounted, reactive, ref, watch } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';
import { router } from '#/router';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import {
  acceptancePlanOverOperationContainerComplete,
  acceptancePlanOverOperationContainerNoOperation,
  deleteMachineSpreaderRecord,
  getAcceptancePlanOverOperation,
  getAcceptancePlanOverOperationContainerPage,
  getAcceptancePlanOverOperationPage,
  getMachineSpreaderChangeRecordPage,
  machineSpreaderRecordDeleteList,
} from '#/api/bpp/flow/acceptance/plan/over/operation';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import {
  acceptancePlanOvrOprColumns,
  acceptancePlanOvrOprFormSchema,
  machineSpreaderChangeRecordGridColumns,
  useBoxGridColumns,
} from './data';
import Detail from '#/views/bpp/flow/acceptance/plan/over/operation/modules/detail.vue';
import Form from '#/views/bpp/flow/acceptance/plan/over/operation/modules/form.vue';
import OnSiteOperation from '#/views/bpp/flow/acceptance/plan/over/operation/modules/onSiteOperation.vue';

interface OnSideOperation {
  overOperationContainerIds: string;
  initiationType: string;
  machineSpreaderChangeType: string;
  acceptancePlanNo: string;
  containerNo: string;
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
  boxGridApi.query();
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
/** 现场操作确认 */
const handleOnSiteOperation = async () => {
  const data = ref<OnSideOperation>({
    overOperationContainerIds: '',
    initiationType: '',
    machineSpreaderChangeType: '',
    acceptancePlanNo: '',
    containerNo: '',
  });
  if (!initiationTypeValue.value) {
    // 提示要选择发起类型
    message.error('请选择发起类型');
    return;
  }
  switch (
    bppBaseDict.getBppBaseDictData('initiation_type', initiationTypeValue.value)
      .label
  ) {
    case '客户发起': {
      if (containerNos.value.length === 0) {
        message.error('请选择要操作的箱');
        return;
      }
      if (boxAcceptancePlanNo.value.length > 1) {
        const uniqueNos = new Set(boxAcceptancePlanNo.value);
        if (uniqueNos.size > 1) {
          message.error('存在不同的受理编号，请检查');
          return;
        }
      }
      if (vesselCodes.value.length > 1) {
        const uniqueNames = new Set(vesselCodes.value);
        if (uniqueNames.size > 1) {
          message.error('存在不同的船名，请检查');
          return;
        }
      }
      if (vesselVoyages.value.length > 1) {
        const uniqueVoyages = new Set(vesselVoyages.value);
        if (uniqueVoyages.size > 1) {
          message.error('存在不同的航次，请检查');
          return;
        }
      }
      if (machineSpreaderChangeTypes.value.length > 1) {
        const uniqueTypes = new Set(machineSpreaderChangeTypes.value);
        if (uniqueTypes.size > 1) {
          message.error('存在不同的吊具类型，请检查');
          return;
        }
      }
      if (containerOperationNodes.value.length > 1) {
        const uniqueNodes = new Set(containerOperationNodes.value);
        if (uniqueNodes.size > 1) {
          message.error('存在不同的现在作业节点，请检查');
        }
      }
      if (containerOperationNodes.value.includes('INITIALIZATION', 'COM')) {
        message.error('请选择现场作业节点不是初始化或完成的状态');
        return;
      }
      data.value = {
        overOperationContainerIds: containerIds,
        initiationType: initiationTypeValue.value,
        machineSpreaderChangeType: machineSpreaderChangeTypes.value[0],
        acceptancePlanNo: boxAcceptancePlanNo.value[0],
        containerNo: containerNos.value.join(','),
      };
      break;
    }
    case '箱现场突发': {
      break;
    }
    case '舱盖板': {
      data.value = {
        containerNo: 'HATCH',
        initiationType: initiationTypeValue.value,
      };
      break;
    }
  }
  OnSideOperationModalApi.setData(data).open();
};
/** 实际未发生 */
const handleAcceptancePlanOverOperationContainerNoOperation = async () => {
  // 判断是否选中箱
  if (containerIds.value.length === 0) {
    message.error('请选择要操作的箱');
    return;
  }
  confirm({
    content: `${containerNos.value.toString()}箱实际没有在本码头入港作业。`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('ui.actionMessage.processing'),
        duration: 0,
      });
      try {
        await acceptancePlanOverOperationContainerNoOperation(
          containerIds.value,
        );
        message.success($t('ui.actionMessage.success'));
        handleRefresh();
      } finally {
        hideLoading();
      }
    })
    .catch(() => {});
};
/** 停止后续作业  */
const handleAcceptancePlanOverOperationContainerComplete = async () => {
  // 判断是否选中箱
  if (containerIds.value.length === 0) {
    message.error('请选择要操作的箱');
    return;
  }
  if (containerOperationNodes.value.includes('INITIALIZATION', 'COM')) {
    message.error('请选择现场作业节点不是初始化或完成的状态');
    return;
  }
  confirm({
    content: `${containerNos.value.toString()}箱是否确认现场操作已全部完成？`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('ui.actionMessage.processing'),
        duration: 0,
      });
      try {
        await acceptancePlanOverOperationContainerComplete(containerIds.value);
        message.success($t('ui.actionMessage.success'));
        handleRefresh();
      } finally {
        hideLoading();
      }
    })
    .catch(() => {});
};
/** 无变更作业 */
const handleMachineSpreaderRecordDeleteList = async () => {
  // 判断是否选中变更记录
  if (machineSpreaderChangeRecordCheckedIds.value.length === 0) {
    message.error('请选择要变更吊具');
    return;
  }
  confirm({
    content: `选中记录确认现场未进行变更吊具处理？`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('ui.actionMessage.processing'),
        duration: 0,
      });
      try {
        await machineSpreaderRecordDeleteList(
          machineSpreaderChangeRecordCheckedIds.value,
        );
        message.success($t('ui.actionMessage.success'));
        handleRefresh();
      } finally {
        hideLoading();
      }
    })
    .catch(() => {});
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
  boxGridApi.query();
}
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
const machineSpreaderChangeRecordHandleRowCheck = ({
  records,
}: {
  records: FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO[];
}) => {
  machineSpreaderChangeRecordCheckedIds.value = records.map((item) => item.id);
};
/** 获取字典数据 */
const getDictDataList = async () => {
  bppBaseDict.setBppBaseDictCacheByData(
    (
      await getDictDataPage({
        dictType: 'initiation_type',
        pageNo: 1,
        pageSize: 100,
      })
    ).list,
  );
  // bppBaseDict.setBppBaseDictCacheByData(
  //   (
  //     await getDictDataPage({
  //       dictType: 'acceptance_plan_status',
  //       pageNo: 1,
  //       pageSize: 100,
  //     })
  //   ).list,
  // );

};
// 高级查询处理函数
function handleHighPriceQuery() {
  message.info('高级查询功能');
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: acceptancePlanOvrOprFormSchema(),
    submitButtonOptions: {
      content: $t('cxmo.action.search'),
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
  gridEvents: {
    checkboxAll: boxHandleRowCheckboxChange,
    checkboxChange: boxHandleRowCheckboxChange,
  },
});

// 变更吊具记录表格配置
const [MachineSpreaderChangeRecordGrid, machineSpreaderChangeRecordGridApi] =
  useVbenVxeGrid({
    gridOptions: {
      columns: machineSpreaderChangeRecordGridColumns(),
      height: 'auto',
      keepSource: false,
      rowConfig: {
        keyField: 'id',
        isHover: true,
      },
      toolbarConfig: {
        refresh: false,
        search: false,
        export: true,
        tools: [
          // 方式3
          { name: '自定义导出按钮', code: 'export', status: 'primary' },
          {
            name: '自定义高级导出按钮',
            code: 'open_export',
            status: 'success',
          },
        ],
      },
      pagerConfig: {
        pageSize: 10,
        enabled: true,
      },
      proxyConfig: {
        // autoLoad: false,
        manual: true,
        ajax: {
          query: async ({ page }, formValues) => {
            if (batchQueryConditions.value.length > 0) {
              formValues.batchQueryConditions = batchQueryConditions.value;
            }
            if (formValues?.batchQueryConditions?.length > 0) {
              return await getMachineSpreaderChangeRecordPage({
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
    } as VxeTableGridOptions<FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO>,
    gridEvents: {
      checkboxAll: machineSpreaderChangeRecordHandleRowCheck,
      checkboxChange: machineSpreaderChangeRecordHandleRowCheck,
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
// 字段配置
const fields = ref([
  {
    fldName: 'name',
    fldLabel: '姓名',
    fldType: 'string',
    options: [],
  },
  {
    fldName: 'age',
    fldLabel: '年龄',
    fldType: 'number',
    options: [],
  },
  {
    fldName: 'gender',
    fldLabel: '性别',
    fldType: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    fldName: 'birthday',
    fldLabel: '生日',
    fldType: 'date',
    options: [],
  },
  {
    fldName: 'department',
    fldLabel: '部门',
    fldType: 'select',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '市场部', value: 'market' },
      { label: '人事部', value: 'hr' },
    ],
  },
  {
    fldName: 'salary',
    fldLabel: '薪资',
    fldType: 'number',
    options: [],
  },
]);

// 运算符映射
const operatorsMap = reactive({
  default: [
    {
      refCode: 'eq',
      refName: '等于',
      supportedTypes: ['string', 'number', 'date', 'select'],
    },
    {
      refCode: 'ne',
      refName: '不等于',
      supportedTypes: ['string', 'number', 'date', 'select'],
    },
    { refCode: 'gt', refName: '大于', supportedTypes: ['number', 'date'] },
    { refCode: 'ge', refName: '大于等于', supportedTypes: ['number', 'date'] },
    { refCode: 'lt', refName: '小于', supportedTypes: ['number', 'date'] },
    { refCode: 'le', refName: '小于等于', supportedTypes: ['number', 'date'] },
    { refCode: 'like', refName: '包含', supportedTypes: ['string'] },
    { refCode: 'notlike', refName: '不包含', supportedTypes: ['string'] },
    {
      refCode: 'null',
      refName: '为空',
      supportedTypes: ['string', 'number', 'date', 'select'],
    },
    {
      refCode: 'notnull',
      refName: '不为空',
      supportedTypes: ['string', 'number', 'date', 'select'],
    },
  ],
});

// 默认层级数据 - 空查询条件
const defaultLevels = ref([
  {
    relation: 'AND',
    conditions: [
      {
        relation: 'AND',
        conditions: [
          {
            relation: 'AND',
            conditions: [
              {
                field: '',
                operator: '',
                value: '',
              },
            ],
          },
        ],
      },
    ],
  },
]);
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

// 处理保存模板事件
const handleSaveTemplate = (templateName: string) => {
  console.log('保存模板:', templateName);
};
</script>

<template>
  <Page auto-content-height>
    <FormModal class="w-1/2" @success="handleRefresh" />
    <AdvancedQueryModal class="w-2/5">
      <AdvancedQuery
        :fields="fields"
        :operators-map="operatorsMap"
        :default-levels="defaultLevels"
        @query="handleQuery"
        @reset="handleReset"
        @save-template="handleSaveTemplate"
      />
    </AdvancedQueryModal>
    <DetailModal />
    <OnSideOperationModal class="w-1/2" @success="handleRefresh" />
    <!-- 超限作业申请列表 -->
    <div class="h-3/5 w-full">
      <Grid :table-title="$t('cxmo.overOperation.operationListName')">
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
                auth: ['system:user:create'],
                onClick: handleCreate,
              },
              // {
              //   label: '撤销',
              //   type: 'default',
              //   icon: ACTION_ICON.UNDO,
              //   onClick: handleHighPriceQuery,
              // },
              //
              // {
              //   label: '撤销审核',
              //   type: 'default',
              //   icon: ACTION_ICON.UNDO,
              //   disabled: true,
              //   onClick: handleHighPriceQuery,
              // },
              // {
              //   label: '日志查询',
              //   type: 'primary',
              //   icon: ACTION_ICON.LOG,
              //   onClick: handleHighPriceQuery,
              // },
            ]"
          />
        </template>
        <template #actions="{ row }">
          <TableAction
            :actions="[
              (row.reviewFlag ? {
                label: '审核',
                type: 'link',
                icon: ACTION_ICON.AUDIT,
                onClick: handleViewDetail.bind(null, row),
              }: ''),
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
        <BoxGrid :table-title="$t('cxmo.overOperation.boxListName')">
          <template #toolbar-tools>
            <div class="mr-4">
              <a-radio-group
                name="radioGroup"
                v-model:value="initiationTypeValue"
              >
                <a-radio
                  :value="item.value"
                  v-for="(item, index) in bppBaseDict.getBppBaseDictOptions(
                    'initiation_type',
                  )"
                  :key="index"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </div>
            <TableAction
              :actions="[
                {
                  label: $t('cxmo.overOperation.onSiteOperationConfirm'),
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleOnSiteOperation,
                },
                {
                  label: $t('cxmo.overOperation.actuallyNoOperation'),
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick:
                    handleAcceptancePlanOverOperationContainerNoOperation,
                },
                {
                  label: $t('cxmo.overOperation.stopSubSequentOperations'),
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleAcceptancePlanOverOperationContainerComplete,
                },
              ]"
            />
          </template>
        </BoxGrid>
      </div>
      <div class="ml-3 w-1/2">
        <!-- 变更吊具记录表格 -->
        <MachineSpreaderChangeRecordGrid :table-title="$t('cxmo.overOperation.machineSpreaderRecord')">
          <template #toolbar-tools>
            <TableAction
              :actions="[
                // {
                //   label: '日志查询',
                //   type: 'primary',
                //   auth: ['system:user:create'],
                //   onClick: handleCreate,
                // },
                {
                  label: $t('cxmo.overOperation.noChangeOperations'),
                  type: 'primary',
                  auth: ['system:user:create'],
                  onClick: handleMachineSpreaderRecordDeleteList,
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
                  auth: ['system:user:update'],
                  onClick: handleOnSiteEditOperation.bind(null, row),
                },
                {
                  label: $t('common.delete'),
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.DELETE,
                  auth: ['system:user:delete'],
                  popConfirm: {
                    title: $t('ui.actionMessage.deleteConfirm'),
                    confirm: handleMachineSpreaderDelete.bind(null, row),
                  },
                },
              ]"
            />
          </template>
        </MachineSpreaderChangeRecordGrid>
      </div>
    </div>
  </Page>
</template>
