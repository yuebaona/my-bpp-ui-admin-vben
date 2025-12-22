<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { onActivated, reactive, ref, watch } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';
import { message, Select } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { getCustomerList, getVVd } from "#/api/bpp/common";
import {
  acceptancePlanOverOperationContainerComplete,
  acceptancePlanOverOperationContainerNoOperation,
  cancelAcceptancePlanOverOperation,
  deleteMachineSpreaderRecord,
  getAcceptancePlanOverOperation,
  getAcceptancePlanOverOperationContainerPage,
  getAcceptancePlanOverOperationPage,
  getMachineSpreaderChangeRecordPage,
  machineSpreaderRecordDeleteList,
} from '#/api/bpp/flow/acceptance/plan/over/operation';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';
import { router } from '#/router';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import Detail from '#/views/bpp/flow/acceptance/plan/over/operation/modules/detail.vue';
import Form from '#/views/bpp/flow/acceptance/plan/over/operation/modules/form.vue';
import OnSiteOperation from '#/views/bpp/flow/acceptance/plan/over/operation/modules/onSiteOperation.vue';

import {
  acceptancePlanOvrOprColumns,
  acceptancePlanOvrOprFormSchema,
  machineSpreaderChangeRecordGridColumns,
  useBoxGridColumns,
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

const vesselNameState = reactive({
  data: [],
  value: [],
  fetching: false,
});

const vesselVoyageState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const selectKey = ref(0);
// 使用字典 store
const bppBaseDict = bppBaseDictStore();
const loadDictData = async (dictTypes: string[]) => {
  for (const dictType of dictTypes) {
    bppBaseDict.setBppBaseDictCacheByData(
      (
        await getDictDataPage({
          dictType,
          pageNo: 1,
          pageSize: 100,
        })
      ).list,
      dictType,
    );
  }
};
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
/** 撤销  */
function handleRevoke() {
  if (acceptancePlanNo.value.length === 0) {
    message.error($t('cxmo.message.revokeMessage'));
    return;
  }
  const invalidNodes = new Set([
    'CONFIRMED',
    'INITIALIZATION',
    'REJECTED',
    'REVIEWING',
  ]);
  const hasInvalidNode = planStatusArr.value.some((node) =>
    invalidNodes.has(node),
  );
  if (!hasInvalidNode) {
    message.error($t('cxmo.message.revokeVerifyMessage'));
    return;
  }
  confirm({
    content: `您确定撤销以下${acceptancePlanNo.value.toString()}申请编号的数据吗？`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('cxmo.action.processing'),
        duration: 0,
      });
      try {
        await cancelAcceptancePlanOverOperation(checkedIds.value);
        message.success($t('cxmo.action.success'));
        handleRefresh();
      } finally {
        hideLoading();
      }
    })
    .catch(() => {});
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
    spreaderType: '',
    vesselCode: '',
    vesselVoyage: '',
    vesselName: '',
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
        message.error($t('cxmo.message.boxMessage'));
        return;
      }
      const invalidNodes = new Set(['COM', 'INITIALIZATION']);
      const hasInvalidNode = containerOperationNodes.value.some((node) =>
        invalidNodes.has(node),
      );
      if (hasInvalidNode) {
        message.error($t('cxmo.message.iniOrComMessage'));
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
      if (plannedSpreaderTypes.value.length > 1) {
        const uniqueNodes = new Set(plannedSpreaderTypes.value);
        if (uniqueNodes.size > 1) {
          message.error('存在不同的现场作业吊具，请检查');
        }
      }
      data.value = {
        overOperationContainerIds: containerIds,
        initiationType: initiationTypeValue.value,
        machineSpreaderChangeType: machineSpreaderChangeTypes.value[0],
        acceptancePlanNo: boxAcceptancePlanNo.value[0],
        containerNo: containerNos.value.join(','),
        spreaderType: plannedSpreaderTypes.value[0],
        vesselCode: vesselCodes.value[0],
        vesselVoyage: vesselVoyages.value[0],
        vesselName: vesselNames.value[0],
      };
      break;
    }
    case '箱现场突发': {
      data.value = {
        initiationType: initiationTypeValue.value,
      };
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
    message.error($t('cxmo.message.boxMessage'));
    return;
  }
  const invalidNodes = new Set(['COM', 'INITIALIZATION']);
  const hasInvalidNode = containerOperationNodes.value.some((node) =>
    invalidNodes.has(node),
  );
  if (hasInvalidNode) {
    message.error($t('cxmo.message.iniOrComMessage'));
    return;
  }
  confirm({
    content: `${containerNos.value.toString()}箱实际没有在本码头入港作业。`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('cxmo.action.processing'),
        duration: 0,
      });
      try {
        await acceptancePlanOverOperationContainerNoOperation(
          containerIds.value,
        );
        message.success($t('cxmo.action.success'));
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
    message.error($t('cxmo.message.boxMessage'));
    return;
  }
  const invalidNodes = new Set(['COM', 'INITIALIZATION']);
  const hasInvalidNode = containerOperationNodes.value.some((node) =>
    invalidNodes.has(node),
  );
  if (hasInvalidNode) {
    message.error($t('cxmo.message.iniOrComMessage'));
    return;
  }
  confirm({
    content: `${containerNos.value.toString()}箱是否确认现场操作已全部完成？`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('cxmo.action.processing'),
        duration: 0,
      });
      try {
        await acceptancePlanOverOperationContainerComplete(containerIds.value);
        message.success($t('cxmo.action.success'));
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
    message.error($t('cxmo.message.spreaderChangeMessage'));
    return;
  }
  confirm({
    content: `选中记录确认现场未进行变更吊具处理？`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('cxmo.action.processing'),
        duration: 0,
      });
      try {
        await machineSpreaderRecordDeleteList(
          machineSpreaderChangeRecordCheckedIds.value,
        );
        message.success($t('cxmo.action.success'));
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
const planStatusArr = ref<string[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanVO[];
}) {
  checkedIds.value = records.map((item) => item.id);
  acceptancePlanNo.value = records.map((item) => item.acceptancePlanNo);
  planStatusArr.value = records.map((item) => item.planStatus);
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
const vesselNames = ref<string[]>([]);
const plannedSpreaderTypes = ref<string[]>([]);
const boxList = ref<
  FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[]
>([]);
function boxHandleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[];
}) {
  boxList.value = records;
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
const machineSpreaderChangeRecordHandleRowCheck = ({
  records,
}: {
  records: FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO[];
}) => {
  machineSpreaderChangeRecordCheckedIds.value = records.map((item) => item.id);
};
/** 获取字典数据 */
const getDictDataList = async () => {
  await loadDictData([
    'system_rate',
    'acceptance_plan_status',
    'payment_method',
    'import_export_type',
    'on_site_operation_node',
    'on_site_operation_category',
    'driving_source',
    'change_reason',
    'spreader_type',
    'actual_operation',
    'initiation_type',
  ]);
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
    submitOnEnter: true,
  },
  gridOptions: {
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
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
          await getDictDataList();
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
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
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
      floatingFilterConfig: {
        enabled: true,
      },
      filterConfig: {
        showIcon: false,
      },
      columns: machineSpreaderChangeRecordGridColumns(),
      height: 'auto',
      keepSource: false,
      rowConfig: {
        keyField: 'id',
        isHover: true,
      },
      toolbarConfig: {
        refresh: false,
        search: true,
        export: true,
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
            if (searchKeyword.value) {
              formValues.condition = searchKeyword.value;
            }
            if (
              formValues?.batchQueryConditions?.length > 0 ||
              formValues?.condition
            ) {
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
// 监听超限作业申请选中的受理编号变化
watch(
  () => acceptancePlanNo.value,
  (newAcceptancePlanNos, oldAcceptancePlanNos) => {
    const addedPlanNos = new Set(
      oldAcceptancePlanNos.filter((no) => !newAcceptancePlanNos.includes(no)),
    );
    boxList.value.forEach((item) => {
      if (addedPlanNos.has(item.acceptancePlanNo)) {
        boxGridApi.grid.setCheckboxRow(item, false);
      }
    });
  },
  { deep: true },
);
onActivated(() => {
  handleRefresh();
});
// 控制搜索框显隐的状态
const showSearchInput = ref(false);
// 搜索框输入的值
const searchKeyword = ref('');

const toggleSearchInput = () => {
  showSearchInput.value = !showSearchInput.value;
  if (!showSearchInput.value) {
    searchKeyword.value = '';
    machineSpreaderChangeRecordGridApi.query();
  }
};

// 执行搜索的方法
const handleSearch = () => {
  machineSpreaderChangeRecordGridApi.query();
};
const applicantCompanyNameState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const applicantCompanyNameSearch = useDebounceFn(async (value: string) => {
  gridApi.formApi.form.setFieldValue('applicantCompanyName', value);
  if (!value) return;
  applicantCompanyNameState.fetching = true;
  const res = await getCustomerList({
    pageNo: 1,
    pageSize: 100,
    customerName: value,
  });
  if (res) {
    applicantCompanyNameState.data = res.map((item: any) => ({
      label: item.customerName,
      value: item.customerName,
      data: item,
    }));
  }
  applicantCompanyNameState.fetching = false;
}, 100);
const handleVesselSearch = async (value: string) => {
  gridApi.formApi.form.setFieldValue('vesselName', value);
  if (!value) return;
  vesselNameState.fetching = true;
  const res = await getVVd({ condition: value });
  if (res) {
    vesselNameState.data = res.map((item: any) => ({
      label: item.vieVslName,
      value: item.vieVslName,
      data: item,
    }));
  }
  vesselNameState.fetching = false;
};

const vesselNameSelect = async (value: any) => {
  gridApi.formApi.form.setFieldValue('vesselName', value.label);

  vesselVoyageState.fetching = true;
  const res = await getVVd({ condition: value.label, queryType: 'VOYAGE' });

  if (res) {
    vesselVoyageState.data = res.map((item: any) => ({
      label: item.vieVoy,
      value: item.vieVoy,
    }));
  }

  vesselVoyageState.value = [];
  gridApi.formApi.form.setFieldValue('vesselVoyage', '');
  vesselVoyageState.fetching = false;
};

const vesselNameChange = async () => {
  gridApi.formApi.form.setFieldValue('vesselName', '');
  gridApi.formApi.form.setFieldValue('vesselVoyage', '');
  vesselVoyageState.value = [];
  vesselVoyageState.data = [];
  selectKey.value++;
};
const handleVoyageSearch = async (value: string) => {
  gridApi.formApi.form.setFieldValue('vesselVoyage', value);
}
const vesselVoyageSelect = async (value: any) => {
  gridApi.formApi.form.setFieldValue('vesselVoyage', value.label);
};
const vesselVoyageChange = async () => {
  gridApi.formApi.form.setFieldValue('vesselVoyage', '');
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
        <template #form-applicantCompanyName>
          <Select
            v-model:value="applicantCompanyNameState.value"
            mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
            label-in-value
            placeholder="请输入申请单位"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="
              applicantCompanyNameState.fetching ? undefined : null
            "
            :options="applicantCompanyNameState.data"
            @search="applicantCompanyNameSearch"
            allow-clear
          />
        </template>
        <template #form-vesselName>
          <Select
            v-model:value="vesselNameState.value"
            mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
            label-in-value
            placeholder="请输入作业船名"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="vesselNameState.fetching ? undefined : null"
            :options="vesselNameState.data"
            @search="handleVesselSearch"
            allow-clear
            @select="vesselNameSelect"
            @change="vesselNameChange"
          />
        </template>

        <template #form-vesselVoyage>
          <Select
            v-model:value="vesselVoyageState.value"
            mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
            label-in-value
            placeholder="请输入船名航次"
            style="width: 100%"
            :filter-option="true"
            :not-found-content="vesselVoyageState.fetching ? undefined : null"
            :options="vesselVoyageState.data"
            allow-clear
            @select="vesselVoyageSelect"
            @change="vesselVoyageChange"
            @search="handleVoyageSearch"
            :key="selectKey"
          />
        </template>
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
              {
                label: $t('cxmo.action.revoke'),
                type: 'default',
                icon: ACTION_ICON.UNDO,
                onClick: handleRevoke,
              },
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
              row.reviewFlag
                ? {
                    label: $t('cxmo.action.audit'),
                    type: 'link',
                    icon: ACTION_ICON.AUDIT,
                    onClick: handleViewDetail.bind(null, row),
                  }
                : '',
              // 判断 planStatus 是否在指定状态中
              ['INITIALIZATION', 'REVIEWING', 'CANCELED', 'REJECTED'].includes(
                row.planStatus,
              )
                ? {
                    label: $t('cxmo.action.edit'),
                    type: 'link',
                    icon: ACTION_ICON.EDIT,
                    auth: ['bpp:flow-acceptance-plan-over-operation:update'],
                    onClick: handleEdit.bind(null, row),
                  }
                : '',
              {
                label: $t('cxmo.action.detail'),
                type: 'link',
                icon: ACTION_ICON.VIEW,
                auth: ['bpp:flow-acceptance-plan-over-operation:query'],
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
                  onClick: handleOnSiteOperation,
                },
                {
                  label: $t('cxmo.overOperation.actuallyNoOperation'),
                  type: 'primary',
                  onClick:
                    handleAcceptancePlanOverOperationContainerNoOperation,
                },
                {
                  label: $t('cxmo.overOperation.stopSubSequentOperations'),
                  type: 'primary',
                  onClick: handleAcceptancePlanOverOperationContainerComplete,
                },
              ]"
            />
          </template>
        </BoxGrid>
      </div>
      <div class="ml-3 w-1/2">
        <!-- 变更吊具记录表格 -->
        <MachineSpreaderChangeRecordGrid
          :table-title="$t('cxmo.overOperation.machineSpreaderRecord')"
        >
          <template #toolbar-tools>
            <div class="mr-2 flex items-center">
              <!-- 搜索输入框 - 根据showSearchInput控制显隐 -->
              <a-input-search
                v-model:value="searchKeyword"
                :placeholder="$t('cxmo.message.searchMessage')"
                enter-button
                @search="handleSearch"
                v-if="showSearchInput"
                @press-enter="handleSearch"
                allow-clear
              />
            </div>
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
            <!-- 搜索按钮 - 切换输入框显隐 -->
            <a-button
              type="primary"
              shape="circle"
              @click="toggleSearchInput"
              class="ml-2"
            >
              <template #icon>
                <IconifyIcon
                  icon="iconamoon:search-thin"
                  style="font-size: 15px"
                />
              </template>
            </a-button>
          </template>

          <template #actions="{ row }">
            <TableAction
              :actions="[
                row.reviewFlag
                  ? {
                      label: $t('cxmo.action.audit'),
                      type: 'link',
                      icon: ACTION_ICON.AUDIT,
                      onClick: handleViewDetail.bind(null, row),
                    }
                  : '',
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
<style scoped lang="scss"></style>
