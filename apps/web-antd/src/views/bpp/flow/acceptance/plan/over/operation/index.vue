<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { onActivated, reactive, ref, watch } from 'vue';

import { alert, confirm, Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';
import { Input, message, Select } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { getCustomerList, getVVd } from '#/api/bpp/common';
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
import { getTableColumnList } from '#/api/bpp/advanced/query';

import {
  acceptancePlanOvrOprColumns,
  acceptancePlanOvrOprFormSchema,
  machineSpreaderChangeRecordGridColumns,
  useBoxGridColumns,
} from './data';

interface OnSideOperation {
  oogContIds: string;
  initiationType: string;
  cheWorkChangeType: string;
  acptPlnNo: string;
  contNo: string;
  cheType: string;
  vslCode: string;
  vslVoy: string;
  vslName: string;
}
interface batchQueryConditionsVO {
  acptPlnNo: string;
  contNo: string;
}
interface LabelInValueType {
  value: number | string;
  label: string;
}
const vslNameState = reactive<{
  data: any[];
  fetching: boolean;
  value: LabelInValueType;
}>({
  value: { value: '', label: '' },
  fetching: false,
  data: [],
});

const vslVoyState = reactive<{
  data: any[];
  fetching: boolean;
  value: LabelInValueType;
}>({
  value: { value: '', label: '' },
  fetching: false,
  data: [],
});
const applicantCompanyNameState = reactive<{
  data: any[];
  fetching: boolean;
  value: LabelInValueType;
}>({
  value: { value: '', label: '' },
  fetching: false,
  data: [],
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
  draggable: true,
});
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  draggable: true,
});
const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
  draggable: true,
});
// 现场操作确认弹框
const [OnSideOperationModal, OnSideOperationModalApi] = useVbenModal({
  connectedComponent: OnSiteOperation,
  destroyOnClose: true,
  draggable: true,
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
  if (acptPlnNo.value.length === 0) {
    message.warning($t('cxmo.message.revokeMessage'));
    showIconAlert($t('cxmo.message.revokeMessage'), 'warning');
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
    message.warning($t('cxmo.message.revokeVerifyMessage'));
    showIconAlert($t('cxmo.message.revokeVerifyMessage'), 'warning');
    return;
  }
  confirm({
    content: `您确定撤销以下${acptPlnNo.value.toString()}申请编号的数据吗？`,
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
      formPagePath: '/flow/flow-acceptance-plan-ovr-opr',
    },
  });
}

/** 流程审核 */
function handleViewDetail(row: any) {
  if (!row.processInstanceId) {
    message.warning($t('ui.actionMessage.noProcessInstance'));
    showIconAlert($t('ui.actionMessage.noProcessInstance'), 'warning');
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
  const currentSelected = boxGridApi?.grid?.getCheckboxRecords() || [];
  const data = ref<OnSideOperation>({
    oogContIds: '',
    initiationType: '',
    cheWorkChangeType: '',
    acptPlnNo: '',
    contNo: '',
    cheType: '',
    vslCode: '',
    vslVoy: '',
    vslName: '',
  });

  if (!initiationTypeValue.value) {
    message.warning('请选择发起类型');
    showIconAlert($t('请选择发起类型'), 'warning');
    return;
  }

  switch (
    bppBaseDict.getBppBaseDictData('initiation_type', initiationTypeValue.value)
      .label
  ) {
    case '客户发起': {
      if (currentSelected.length === 0) {
        message.warning($t('cxmo.message.boxMessage'));
        showIconAlert($t('cxmo.message.boxMessage'), 'warning');
        return;
      }

      const contOperationNodes = currentSelected.map(
        (item) => item.contOperationNode,
      );
      const invalidNodes = new Set(['COM', 'INITIALIZATION']);
      const hasInvalidNode = contOperationNodes.some((node) =>
        invalidNodes.has(node),
      );
      if (hasInvalidNode) {
        message.warning($t('cxmo.message.iniOrComMessage'));
        showIconAlert($t('cxmo.message.iniOrComMessage'), 'warning');
        return;
      }

      // 检查是否选择了不同的受理编号
      if (currentSelected.length > 0) {
        const boxAcptPlnNos = currentSelected.map((item) => item.acptPlnNo);
        if (boxAcptPlnNos.length > 1) {
          const uniqueNos = new Set(boxAcptPlnNos);
          if (uniqueNos.size > 1) {
            message.warning('存在不同的受理编号，请检查');
            showIconAlert($t('存在不同的受理编号，请检查'), 'warning');
            return;
          }
        }

        const vslCodes = currentSelected.map((item) => item.vslCode);
        if (vslCodes.length > 1) {
          const uniqueCodes = new Set(vslCodes);
          if (uniqueCodes.size > 1) {
            message.warning('存在不同的船代码，请检查');
            showIconAlert($t('存在不同的船代码，请检查'), 'warning');
            return;
          }
        }

        const vslVoys = currentSelected.map((item) => item.vslVoy);
        if (vslVoys.length > 1) {
          const uniqueVoyages = new Set(vslVoys);
          if (uniqueVoyages.size > 1) {
            message.warning('存在不同的航次，请检查');
            showIconAlert($t('存在不同的航次，请检查'), 'warning');
            return;
          }
        }

        const cheWorkChangeTypes = currentSelected.map(
          (item) => item.cheWorkChangeType,
        );
        if (cheWorkChangeTypes.length > 1) {
          const uniqueTypes = new Set(cheWorkChangeTypes);
          if (uniqueTypes.size > 1) {
            message.warning('存在不同的吊具类型，请检查');
            showIconAlert($t('存在不同的吊具类型，请检查'), 'warning');
            return;
          }
        }

        const contOperationNodes = currentSelected.map(
          (item) => item.contOperationNode,
        );
        if (contOperationNodes.length > 1) {
          const uniqueNodes = new Set(contOperationNodes);
          if (uniqueNodes.size > 1) {
            message.warning('存在不同的现场作业节点，请检查');
            showIconAlert($t('存在不同的现场作业节点，请检查'), 'warning');
            return;
          }
        }

        const plannedCheTypes = currentSelected.map(
          (item) => item.plannedCheType,
        );
        if (plannedCheTypes.length > 1) {
          const uniqueTypes = new Set(plannedCheTypes);
          if (uniqueTypes.size > 1) {
            message.warning('存在不同的现场作业吊具，请检查');
            showIconAlert($t('存在不同的现场作业吊具，请检查'), 'warning');
            return;
          }
        }
      }

      const contNos = currentSelected.map((item) => item.contNo);
      const contIds = currentSelected.map((item) => item.id);

      data.value = {
        oogContIds: contIds,
        initiationType: initiationTypeValue.value,
        cheWorkChangeType: currentSelected[0]?.cheWorkChangeType || '',
        acptPlnNo: currentSelected[0]?.acptPlnNo || '',
        contNo: contNos.join(','),
        cheType: currentSelected[0]?.plannedCheType || '',
        vslCode: currentSelected[0]?.vslCode || '',
        vslVoy: currentSelected[0]?.vslVoy || '',
        vslName: currentSelected[0]?.vslName || '',
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
        contNo: 'HATCH',
        initiationType: initiationTypeValue.value,
      };
      break;
    }
  }
  OnSideOperationModalApi.setData(data).open();
};
/** 实际未发生 */
const handleAcceptancePlanOverOperationContainerNoOperation = async () => {
  // 获取当前选中的行
  const currentSelected = boxGridApi?.grid?.getCheckboxRecords() || [];

  if (currentSelected.length === 0) {
    message.warning($t('cxmo.message.boxMessage'));
    showIconAlert($t('cxmo.message.boxMessage'), 'warning');
    return;
  }

  // 实时获取选中行的 contOperationNode
  const currentOperationNodes = currentSelected.map(
    (item) => item.contOperationNode,
  );
  const invalidNodes = new Set(['COM', 'INITIALIZATION']);
  const hasInvalidNode = currentOperationNodes.some((node) =>
    invalidNodes.has(node),
  );

  if (hasInvalidNode) {
    message.warning($t('cxmo.message.currentOperationNode'));
    showIconAlert($t('cxmo.message.currentOperationNode'), 'warning');
    return;
  }

  const contNos = currentSelected.map((item) => item.contNo);
  const contIds = currentSelected.map((item) => item.id);

  confirm({
    content: `${contNos.toString()}箱实际没有在本码头入港作业。`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('cxmo.action.processing'),
        duration: 0,
      });
      try {
        await acceptancePlanOverOperationContainerNoOperation(contIds);
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
  // 获取当前选中的箱数据
  const currentSelected = boxGridApi?.grid?.getCheckboxRecords() || [];

  // 判断是否选中箱
  if (currentSelected.length === 0) {
    message.warning($t('cxmo.message.boxMessage'));
    showIconAlert($t('cxmo.message.boxMessage'), 'warning');
    return;
  }

  // 获取当前选中箱的 contOperationNode
  const currentOperationNodes = currentSelected.map(
    (item) => item.contOperationNode,
  );
  const invalidNodes = new Set(['COM', 'INITIALIZATION']);
  const hasInvalidNode = currentOperationNodes.some((node) =>
    invalidNodes.has(node),
  );
  if (hasInvalidNode) {
    message.warning($t('cxmo.message.currentOperationNode'));
    showIconAlert($t('cxmo.message.currentOperationNode'), 'warning');
    return;
  }
  const contNos = currentSelected.map((item) => item.contNo);
  const contIds = currentSelected.map((item) => item.id);
  confirm({
    content: `${contNos.toString()}箱是否确认现场操作已全部完成？`,
    icon: 'info',
  })
    .then(async () => {
      const hideLoading = message.loading({
        content: $t('cxmo.action.processing'),
        duration: 0,
      });
      try {
        await acceptancePlanOverOperationContainerComplete(contIds);
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
    message.warning($t('cxmo.message.spreaderChangeMessage'));
    showIconAlert($t('cxmo.message.spreaderChangeMessage'), 'warning');
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
const acptPlnNo = ref<string[]>([]);
const planStatusArr = ref<string[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanVO[];
}) {
  checkedIds.value = records.map((item) => item.id);
  acptPlnNo.value = records.map((item) => item.acptPlnNo);
  planStatusArr.value = records.map((item) => item.planStatus);
  boxGridApi.query();
}
/** 箱信息选中操作 */
const boxCheckedIds = ref<number[]>([]);
const boxAcptPlnNo = ref<string[]>([]);
const batchQueryConditions = ref<batchQueryConditionsVO[]>([]);
const cheWorkChangeTypes = ref<string[]>([]);
const contOperationNodes = ref<string[]>([]);
const vslCodes = ref<string[]>([]);
const vslVoys = ref<string[]>([]);
const vslNames = ref<string[]>([]);
const plannedCheTypes = ref<string[]>([]);
const boxList = ref<FlowOverLimitWorkApi.AcceptancePlanOverOperationcontVO[]>(
  [],
);
function boxHandleRowCheckboxChange({
  records,
}: {
  records: FlowOverLimitWorkApi.AcceptancePlanOverOperationcontVO[];
}) {
  boxList.value = records;
  const refMap = {
    boxCheckedIds,
    boxAcptPlnNo,
    cheWorkChangeTypes,
    contOperationNodes,
    vslCodes,
    vslVoys,
    vslNames,
    plannedCheTypes,
  };
  const fieldMappings = {
    boxCheckedIds: 'id',
    boxAcptPlnNo: 'acptPlnNo',
    cheWorkChangeTypes: 'cheWorkChangeType',
    contOperationNodes: 'contOperationNode',
    vslCodes: 'vslCode',
    vslVoys: 'vslVoy',
    vslNames: 'vslName',
    plannedCheTypes: 'plannedCheType',
  };
  Object.entries(fieldMappings).forEach(([refName, field]) => {
    refMap[refName].value = records.map((item) => item[field]);
  });
  batchQueryConditions.value = records.map((item) => ({
    acptPlnNo: item.acptPlnNo,
    contNo: item.contNo,
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
    'mechanical_type',
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
    resetButtonOptions: {
      onClick: () => {
        // 清空自定义插槽绑定的状态
        vslNameState.value = {
          value: '',
          label: '',
        };
        vslVoyState.value = {
          value: '',
          label: '',
        };
        applicantCompanyNameState.value = {
          value: '',
          label: '',
        };
      },
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
  },
  gridOptions: {
    border: true,
    resizableConfig: {
      isDblclickAutoWidth: true, // 启用双击自适应列宽
      isAllColumnDrag: true,
    },
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
      // remote: true,
    },
    columns: acceptancePlanOvrOprColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    printConfig: {
      enabled: true,
    },
    toolbarConfig: {
      search: true,
      print: true,
      custom: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
      pageSizes: [
        {
          label: '10',
          value: 10,
        },
        {
          label: '25',
          value: 25,
        },
        {
          label: '50',
          value: 50,
        },
        {
          label: '100',
          value: 100,
        },
        {
          label: '1000',
          value: 1000,
        },
        {
          label: '10000',
          value: 10_000,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
    },
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
    filterChange: useDebounceFn(async ({ filterList }) => {
      const searchCont = filterList.reduce((obj, item) => {
        if (item.datas && item.datas.length > 0) {
          obj[item.field] = item.datas[0];
        }
        return obj;
      }, {});
      // 调用gridApi.query()刷新表格数据，实现实时筛选
      // await gridApi.query();
    }, 300),
    checkboxRangeSelect: ({ rangeRecords }: { rangeRecords: any }) => {
      handleRowCheckboxChange({ records: rangeRecords });
    },
  },
});

// 箱列表表格配置
const [BoxGrid, boxGridApi] = useVbenVxeGrid({
  gridOptions: {
    cellConfig:{
      height: '120px'
    },
    border: true,
    resizableConfig: {
      isDblclickAutoWidth: true, // 启用双击自适应列宽
      isAllColumnDrag: true,
    },
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
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
      pageSizes: [
        {
          label: '10',
          value: 10,
        },
        {
          label: '25',
          value: 25,
        },
        {
          label: '50',
          value: 50,
        },
        {
          label: '100',
          value: 100,
        },
        {
          label: '1000',
          value: 1000,
        },
        {
          label: '10000',
          value: 10_000,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
    },
    proxyConfig: {
      autoLoad: false,
      manual: true,
      ajax: {
        query: async ({ page }, formValues) => {
          if (acptPlnNo.value.length > 0) {
            formValues.acptPlnNos = acptPlnNo.value;
          }
          if (formValues?.acptPlnNos?.length > 0) {
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
    checkboxRangeSelect: ({ rangeRecords }: { rangeRecords: any }) => {
      boxHandleRowCheckboxChange({ records: rangeRecords });
    },
  },
});

// 变更吊具记录表格配置
const [MachineSpreaderChangeRecordGrid, machineSpreaderChangeRecordGridApi] =
  useVbenVxeGrid({
    gridOptions: {
      border: true,
      resizableConfig: {
        isDblclickAutoWidth: true, // 启用双击自适应列宽
        isAllColumnDrag: true,
      },
      checkboxConfig: {
        highlight: true,
        isShiftKey: true,
      },
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
      exportConfig: {
        filename: '变更吊具记录',
      },
      pagerConfig: {
        pageSize: 10,
        enabled: true,
        pageSizes: [
          {
            label: '10',
            value: 10,
          },
          {
            label: '25',
            value: 25,
          },
          {
            label: '50',
            value: 50,
          },
          {
            label: '100',
            value: 100,
          },
          {
            label: '1000',
            value: 1000,
          },
          {
            label: '10000',
            value: 10_000,
          },
          {
            label: '全部',
            value: -1,
          },
        ],
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
      checkboxRangeSelect: ({ rangeRecords }: { rangeRecords: any }) => {
        machineSpreaderChangeRecordHandleRowCheck({ records: rangeRecords });
      },
    },
  });

const initiationTypeValue = ref<null | string>(null);

const advancedQueryModalOpen = async () => {
  // 调用表单数据
  // const res = await getTableColumnList({
  //   tableNameList:['acpt_pln','acpt_pln_oog_cont','che_chg_rec']
  // });
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
  queryResult.value = params;
  console.log(queryResult.value);
};

// 处理重置事件
const handleReset = () => {
  queryResult.value = null;
};

// 处理保存模板事件
const handleSaveTemplate = (templateName: string) => {};
// 监听超限作业申请选中的受理编号变化
watch(
  () => acptPlnNo.value,
  (newAcptPlnNos, oldAcptPlnNos) => {
    const addedPlanNos = new Set(
      oldAcptPlnNos.filter((no) => !newAcptPlnNos.includes(no)),
    );
    boxList.value.forEach((item) => {
      if (addedPlanNos.has(item.acptPlnNo)) {
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
const applicantCompanyNameSearch = useDebounceFn(async (value: string) => {
  applicantCompanyNameState.value = {
    label: value.toUpperCase(),
    value: value.toUpperCase(),
  };
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
  vslNameState.value = {
    label: value.toUpperCase(),
    value: value.toUpperCase(),
  };
  gridApi.formApi.form.setFieldValue('vslName', value);
  if (!value) return;
  vslNameState.fetching = true;
  const res = await getVVd({ condition: value });
  if (res) {
    vslNameState.data = res.map((item: any) => ({
      label: item.vieVslName,
      value: item.vieVslName,
      data: item,
    }));
  }
  vslNameState.fetching = false;
};

const vslNameSelect = async (value: any) => {
  gridApi.formApi.form.setFieldValue('vslName', value.label);

  vslVoyState.fetching = true;
  const res = await getVVd({ condition: value.label, queryType: 'VOYAGE' });

  if (res) {
    vslVoyState.data = res.map((item: any) => ({
      label: item.vieVoy,
      value: item.vieVoy,
    }));
  }

  vslVoyState.value = {
    label: '',
    value: '',
  };
  gridApi.formApi.form.setFieldValue('vslVoy', '');
  vslVoyState.fetching = false;
};

const vslNameChange = async () => {
  gridApi.formApi.form.setFieldValue('vslName', '');
  gridApi.formApi.form.setFieldValue('vslVoy', '');
  vslVoyState.value = {
    label: '',
    value: '',
  };
  vslVoyState.data = [];
  selectKey.value++;
};
const handleVoyageSearch = async (value: string) => {
  vslVoyState.value = {
    value: value.toUpperCase(),
    label: value.toUpperCase(),
  };
  gridApi.formApi.form.setFieldValue('vslVoy', value.toUpperCase());
};
const vslVoySelect = async (value: any) => {
  gridApi.formApi.form.setFieldValue('vslVoy', value.label.toUpperCase());
};
const vslVoyChange = async () => {
  gridApi.formApi.form.setFieldValue('vslVoy', '');
};
const changeNameFilter = (option: any, column: any, index: number) => {
  option.data = option.data.toUpperCase();
  let $grid;
  if (index === 1) {
    $grid = gridApi.grid;
  } else if (index === 2) {
    $grid = boxGridApi.grid;
  } else {
    $grid = machineSpreaderChangeRecordGridApi.grid;
  }
  if ($grid) {
    $grid.updateFilterOptionStatus(option, !!option.data);
    $grid.saveFilter(column);
  }
};
const boxFloatingFilterColumns = ref<string[]>([
  'contOperationNode',
  'contNo',
  'contSize',
  'contType',
  'contCargoWeight',
  'contTotalWeight',
  // 'contCargoSize',
  // 'contOogDetails',
  'isSystemRateGate',
  'priceGate',
  'isSystemRateSea',
  'priceSea',
]);
const oogFloatingFilterColumns = ref<string[]>([
  'cheWorkChangeType',
  'vslName',
  'vslVoy',
  'contNo',
  'operationSource',
  'changeReason',
  'cheWorkType',
  'machNo',
  'isOnSiteWork',
  'operationPosition',
  'cheType',
  'startTime',
  'endTime',
  'remark',
  'creatorName',
  'createTime',
]);
const acceptanceFloatingFilterColumns = ref<string[]>([
  'acptPlnNo',
  'planStatus',
  'approvalWorkflowCurrentNode',
  'acptPlnWebNo',
  'applicantCompanyName',
  'handlingPerson',
  'vslName',
  'vslVoy',
  'category',
  'vslCode',
  'billNo',
  'cargoName',
  'payerNameSea',
  'paymentTypeSea',
  'payerNameGate',
  'paymentTypeGate',
  'isSystemRate',
  'plannedMachryType',
  'createTime',
  'priceGate',
  'priceSea',
  'isAllowedStacking',
  'conclusionTime',
  'createTime',
]);
function showIconAlert(content: string, icon: string) {
  alert({
    content,
    icon,
  });
}
</script>

<template>
  <Page auto-content-height>
    <FormModal class="w-1/2" @success="handleRefresh" />
    <AdvancedQueryModal class="w-2/5" title="高级查询">
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
        <template #form-vslName>
          <Select
            v-model:value="vslNameState.value"
            mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
            label-in-value
            placeholder="请输入作业船名"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="vslNameState.fetching ? undefined : null"
            :options="vslNameState.data"
            @search="handleVesselSearch"
            allow-clear
            @select="vslNameSelect"
            @change="vslNameChange"
          />
        </template>

        <template #form-vslVoy>
          <Select
            v-model:value="vslVoyState.value"
            mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
            label-in-value
            placeholder="请输入船名航次"
            style="width: 100%"
            :filter-option="true"
            :not-found-content="vslVoyState.fetching ? undefined : null"
            :options="vslVoyState.data"
            allow-clear
            @select="vslVoySelect"
            @change="vslVoyChange"
            @search="handleVoyageSearch"
            :key="selectKey"
          />
        </template>
        <template #form-expand-before>
          <advancedButton @click="advancedQueryModalOpen" />
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
                auth: ['bpp:flow-acceptance-plan-over-operation:cancel'],
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
                    auth: ['bpp:flow-acceptance-plan-over-operation:process'],
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
        <template
          v-for="col in acceptanceFloatingFilterColumns"
          #[`${col}`]="{ option, column }"
          :key="col"
        >
          <Input
            v-model:value="option.data"
            clearable
            @change="changeNameFilter(option, column, 1)"
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
                  auth: [
                    'bpp:flow-acceptance-plan-over-operation-container:confirm',
                  ],
                  onClick: handleOnSiteOperation,
                },
                {
                  label: $t('cxmo.overOperation.actuallyNoOperation'),
                  type: 'primary',
                  auth: [
                    'bpp:flow-acceptance-plan-over-operation-container:no-operation',
                  ],
                  onClick:
                    handleAcceptancePlanOverOperationContainerNoOperation,
                },
                {
                  label: $t('cxmo.overOperation.stopSubSequentOperations'),
                  type: 'primary',
                  auth: [
                    'bpp:flow-acceptance-plan-over-operation-container:complete',
                  ],
                  onClick: handleAcceptancePlanOverOperationContainerComplete,
                },
              ]"
            />
          </template>
          <template
            v-for="col in boxFloatingFilterColumns"
            #[`${col}`]="{ option, column }"
            :key="col"
          >
            <Input
              v-model:value="option.data"
              clearable
              @change="changeNameFilter(option, column, 2)"
            />
          </template>

          <template #contCargoSize="{row}">
            <div class="flex items-center justify-center">
              <label>长：{{row.contCargoSize.contCargoLength || 0}}</label>
            </div>
            <div class="flex items-center justify-center">
              <label>宽：{{row.contCargoSize.contCargoWidth || 0}}</label>
            </div>
            <div class="flex items-center justify-center">
              <label>高：{{row.contCargoSize.contCargoHeight || 0}}</label>
            </div>
          </template>
          <template #contOogDetails="{row}">
            <div class="flex items-center justify-center">
              <label>前超：{{row.contOogDetails.oogFront || 0}}</label>
            </div>
            <div class="flex items-center justify-center">
              <label>后超：{{row.contOogDetails.oogBack || 0}}</label>
            </div>
            <div class="flex items-center justify-center">
              <label>左超：{{row.contOogDetails.oogLeft || 0}}</label>
            </div>
            <div class="flex items-center justify-center">
              <label>右超：{{row.contOogDetails.oogRight || 0}}</label>
            </div>
            <div class="flex items-center justify-center">
              <label>超高：{{row.contOogDetails.oogHeight || 0}}</label>
            </div>
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
                  auth: ['bpp:flow-machine-spreader-record:delete'],
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
                  auth: ['bpp:flow-machine-spreader-record:update'],
                  onClick: handleOnSiteEditOperation.bind(null, row),
                },
                {
                  label: $t('common.delete'),
                  type: 'link',
                  danger: true,
                  icon: ACTION_ICON.DELETE,
                  auth: ['bpp:flow-machine-spreader-record:delete'],
                  popConfirm: {
                    title: $t('ui.actionMessage.deleteConfirm'),
                    confirm: handleMachineSpreaderDelete.bind(null, row),
                  },
                },
              ]"
            />
          </template>
          <template
            v-for="col in oogFloatingFilterColumns"
            #[`${col}`]="{ option, column }"
            :key="col"
          >
            <Input
              v-model:value="option.data"
              clearable
              @change="changeNameFilter(option, column, 3)"
            />
          </template>
        </MachineSpreaderChangeRecordGrid>
      </div>
    </div>
  </Page>
</template>
<style scoped lang="scss"></style>
