<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { onMounted, reactive, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getContainerIsoListPage,
  getContainerOwnerListPage,
} from '#/api/bpp/common';
import {
  deleteMainPlan,
  deleteSubPlan,
  forceComplete,
  getMainPlan,
  getMainPlanPage,
  getSubPlan,
  getSubPlanPage,
  getVesselAndVoyage,
} from '#/api/bpp/empty/container/control';
// import { advancedButton } from '#/components/advanced-button';
// import { AdvancedQuery } from '#/components/advanced-query';
import ChooseContainer from '#/views/bpp/empty/container/control/modules/chooseContainer.vue';
import ContainerAreaDisplay from '#/views/bpp/empty/container/control/modules/containerAreaDisplay.vue';
import ContainerAreaSelect from '#/views/bpp/empty/container/control/modules/containerAreaSelect.vue';
import LogQuery from '#/views/bpp/empty/container/control/modules/logQuery.vue';
import MainForm from '#/views/bpp/empty/container/control/modules/mainForm.vue';
import SubForm from '#/views/bpp/empty/container/control/modules/subForm.vue';

import { mainPlanColumns, PlanSearchFormSchema, subPlanColumns } from './data';

const checkedMainIds = ref<number[]>([]);
const planNo = ref<string[]>([]);
const selectedMainId = ref<null | string>(null);
const hasSelectedMainPlan = ref(false);
const mainIdList = ref<string[]>([]);
const checkedSubIds = ref<number[]>([]);
const subPlanNo = ref<string[]>([]);
const containerAreaClickRow =
  ref<EmptyContainerControlApi.containerAreaDisplayVO | null>(null);
const popoverVisible = ref({});
const bayRangeListValue = ref('');

// 传给箱区选择组件的已选箱区
const selectedPositions = ref<Array<{ yardBay: string; yardRaw?: string }>>([]);

// const [AdvancedQueryModal, AdvancedQueryModalApi] = useVbenModal({
//   showCancelButton: false,
//   showConfirmButton: false,
// });

const [SubFormModal, subFormModalApi] = useVbenModal({
  connectedComponent: SubForm,
  destroyOnClose: true,
  closeOnClickModal: false,
});

const [LogQueryModal, logQueryModalApi] = useVbenModal({
  connectedComponent: LogQuery,
  destroyOnClose: true,
  footer: false,
  closeOnClickModal: false,
});

const [ChooseContainerModal, chooseContainerModalApi] = useVbenModal({
  connectedComponent: ChooseContainer,
  destroyOnClose: true,
  closeOnClickModal: false,
});

// 控制箱区选择组件显隐藏
const containerAreaVisible = ref(false);

// 箱区选择确认
const handleContainerAreaConfirm = async (
  positions: Array<{ yardBay: string; yardRaw?: string }>,
) => {
  selectedPositions.value = positions;
  const value =
    positions && positions.length > 0
      ? positions.map((pos) => pos.yardBay).join(',')
      : '';
  bayRangeListValue.value = value;
  const currentValues = await mainGridApi.formApi.getValues();
  await mainGridApi.formApi.setValues({
    ...currentValues,
    bayRangeList: value,
  });
  containerAreaVisible.value = false;
};

const [SubGrid, subGridApi] = useVbenVxeGrid({
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
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const mainFormValues = await mainGridApi.formApi.getValues();
          const noFilterConditions =
            !hasSelectedMainPlan.value &&
            !mainFormValues.tradeType &&
            !mainFormValues.pickupPlanNo &&
            !mainFormValues.bayRangeList &&
            !mainFormValues.createTime &&
            ownerCodeList.value.length === 0 &&
            contIsoList.value.length === 0 &&
            !dischargeVslSchedule.value;

          if (noFilterConditions) {
            return { total: 0, list: [] };
          }
          if (selectedMainId.value) {
            formValues.mainId = selectedMainId.value;
          }
          if (mainFormValues.planNo) {
            formValues.planNo = mainFormValues.planNo;
          }
          if (mainFormValues.tradeType) {
            formValues.tradeType = mainFormValues.tradeType;
          }
          if (mainFormValues.pickupPlanNo) {
            formValues.pickupPlanNo = mainFormValues.pickupPlanNo;
          }
          if (mainFormValues.bayRangeList) {
            const bayRangeInput = mainFormValues.bayRangeList;
            if (bayRangeInput.trim() === '') {
              formValues.bayRangeList = [];
            } else if (bayRangeInput.includes(',')) {
              const positions = bayRangeInput
                .split(',')
                .map((item) => item.trim().toUpperCase());
              formValues.bayRangeList = positions
                .map((position) => {
                  if (position) {
                    return {
                      yardBay: position,
                      yardRaw: '',
                    };
                  }
                  return null;
                })
                .filter(Boolean);
            } else {
              // 处理单个箱区的情况
              const upperCaseInput = bayRangeInput.toUpperCase();
              if (upperCaseInput) {
                formValues.bayRangeList = [
                  {
                    yardBay: upperCaseInput,
                    yardRaw: '',
                  },
                ];
              } else {
                formValues.bayRangeList = [];
              }
            }
          } else {
            formValues.bayRangeList = [];
          }
          if (ownerCodeList.value) {
            formValues.ownerCodeList = ownerCodeList.value;
          }
          if (contIsoList.value) {
            formValues.contIsoList = contIsoList.value;
          }
          if (dischargeVslSchedule.value) {
            formValues.dischargeVslSchedule = dischargeVslSchedule.value;
          }
          if (mainFormValues.createTime && mainFormValues.createTime.length > 0) {
            formValues.createTime = mainFormValues.createTime
              .map((time: string) => {
                return time ? new Date(time).getTime() : null;
              })
              .filter(Boolean);
          }
          const result = await getSubPlanPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return result;
        },
      },
    },
  } as VxeTableGridOptions<EmptyContainerControlApi.subPlanVO>,
  gridEvents: {
    checkboxAll: handleSubRowCheckboxChange,
    checkboxChange: handleSubRowCheckboxChange,
  },
});

// 主计划行点击事件处理函数
function handleRowClick({ row }: { row: EmptyContainerControlApi.mainPlanVO }) {
  checkedSubIds.value = [];
  subPlanNo.value = [];
  selectedMainId.value = row.id.toString();
  hasSelectedMainPlan.value = true;
  subGridApi.query();
}

// 子计划勾选事件处理函数
function handleSubRowCheckboxChange({
  records,
}: {
  records: EmptyContainerControlApi.subPlanVO[];
}) {
  // 检查是否已勾选主计划
  if (checkedMainIds.value.length > 0) {
    checkedSubIds.value = [];
    subPlanNo.value = [];
    mainGridApi.grid.setAllCheckboxRow(false);
    message.warning('主计划和子计划不能同时勾选');
    return false;
  }
  checkedSubIds.value = records.map((item) => item.id);
  subPlanNo.value = records.map((item) => item.planNo);
}

function handleRowCheckboxChange({
  records,
}: {
  records: EmptyContainerControlApi.mainPlanVO[];
}) {
  if (checkedSubIds.value.length > 0) {
    checkedSubIds.value = [];
    subPlanNo.value = [];
    subGridApi.grid.setAllCheckboxRow(false);
    message.warning('主计划和子计划不能同时勾选');
  }
  checkedMainIds.value = records.map((item) => item.id);
  mainIdList.value = [...checkedMainIds.value];
  planNo.value = records.map((item) => item.planNo);
  if (checkedMainIds.value.length > 0 && hasSelectedMainPlan.value) {
    checkedSubIds.value = [];
    subPlanNo.value = [];
    subGridApi.grid.setAllCheckboxRow(false);
  }
  if (records.length > 0) {
    // 获取最后一个勾选的主计划
    const lastSelectedRecord = records[records.length - 1];
    handleRowClick({ row: lastSelectedRecord });
  } else {
    // 如果没有勾选任何主计划，清空子计划查询
    hasSelectedMainPlan.value = false;
    selectedMainId.value = null;
    subGridApi.query();
  }
}
const [MainFormModal, mainFormModalApi] = useVbenModal({
  connectedComponent: MainForm,
  destroyOnClose: true,
  closeOnClickModal: false,
});

const [MainGrid, mainGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: PlanSearchFormSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
    submitOnEnter: true,
    resetButtonOptions: {
      onClick: async () => {
        ownerCodeList.value = [];
        contIsoList.value = [];
        dischargeVslSchedule.value = undefined;
        bayRangeListValue.value = '';
        selectedPositions.value = [];
        await mainGridApi.formApi.setValues({ bayRangeList: '' });
        await mainGridApi.formApi.resetForm();
        checkedMainIds.value = [];
        selectedMainId.value = null;
        hasSelectedMainPlan.value = false;
        subGridApi.query();
      },
      onValuesChange: async (changedValues, allValues) => {
        if (changedValues.bayRangeList !== undefined) {
          bayRangeListValue.value = changedValues.bayRangeList;
        }
      },
    },
  },
  gridOptions: {
    columns: mainPlanColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: false,
      custom: true,
      export: false,
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
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          checkedSubIds.value = [];
          subPlanNo.value = [];
          hasSelectedMainPlan.value = false;
          selectedMainId.value = null;
          subGridApi.query();
          const queryParams = { ...formValues };

          // 将时间范围转换为时间戳
          if (queryParams.createTime) {
            if (queryParams.createTime.length > 0) {
              queryParams.createTime = queryParams.createTime
                .map((time: string) => {
                  return time ? new Date(time).getTime() : null;
                })
                .filter(Boolean);
            } else {
              delete queryParams.createTime;
            }
          }
          if (queryParams.bayRangeList) {
            const bayRangeInput = queryParams.bayRangeList;
            if (bayRangeInput.trim() === '') {
              // 空字符串时，传递空数组
              queryParams.bayRangeList = [];
            } else if (bayRangeInput.includes(',')) {
              const positions = bayRangeInput
                .split(',')
                .map((item) => item.trim().toUpperCase());
              queryParams.bayRangeList = positions
                .map((position) => {
                  if (position) {
                    return {
                      yardBay: position,
                      yardRaw: '',
                    };
                  }
                  return null;
                })
                .filter(Boolean);
            } else {
              // 处理单个箱区的情况
              const upperCaseInput = bayRangeInput.toUpperCase();
              if (upperCaseInput) {
                queryParams.bayRangeList = [
                  {
                    yardBay: upperCaseInput,
                    yardRaw: '',
                  },
                ];
              } else {
                queryParams.bayRangeList = [];
              }
            }
          } else {
            queryParams.bayRangeList = [];
          }
          const result = await getMainPlanPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            planType: 'MAIN',
            ...queryParams,
            ownerCodeList: ownerCodeList.value,
            contIsoList: contIsoList.value,
            dischargeVslSchedule: dischargeVslSchedule.value,
          });
          checkedSubIds.value = [];
          subPlanNo.value = [];
          hasSelectedMainPlan.value = false;
          selectedMainId.value = null;

          if (formValues.planNo && result.list && result.list.length > 0) {
            const firstMainPlan = result.list[0];
            if (
              firstMainPlan.planNo &&
              formValues.planNo !== firstMainPlan.planNo
            ) {
              selectedMainId.value = firstMainPlan.id.toString();
              hasSelectedMainPlan.value = true;
              subGridApi.query();
            }
          }
          return result;
        },
      },
    },
  } as VxeTableGridOptions<EmptyContainerControlApi.mainPlanVO>,
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
    cellClick: handleRowClick,
  },
});

// 高级查询处理函数
/** 刷新表格 */
function handleRefresh() {
  mainGridApi.query();
  subGridApi.query();
}

/** 只刷新子计划表格 */
function handleSubPlanRefresh() {
  subGridApi.query();
}

/** 创建主计划新申请 */
function handleCreateMainPlan() {
  mainFormModalApi.setData(null).open();
}

/** 闸口模拟选箱 */
async function handleChooseContainer() {
  try {
    if (!ownerCodeList.value || ownerCodeList.value.length === 0) {
      message.warning('请选择持箱人');
      return;
    }

    if (!contIsoList.value || contIsoList.value.length === 0) {
      message.warning('请选择ISO');
      return;
    }
    if (ownerCodeList.value && ownerCodeList.value.length > 1) {
      message.warning('持箱人只能选择一个');
      return;
    }
    if (contIsoList.value && contIsoList.value.length > 1) {
      message.warning('ISO只能选择一个');
      return;
    }
    const formValues = await mainGridApi.formApi.getValues();
    const searchParams = {
      ...formValues,
      ownerCodeList: ownerCodeList.value,
      contIsoList: contIsoList.value,
      dischargeVslSchedule: dischargeVslSchedule.value,
    };
    chooseContainerModalApi.setData(searchParams).open();
  } catch (error) {
    console.error('获取表单值失败:', error);
  }
}

/** 新建子计划 */
function handleCreateSubPlan() {
  if (checkedMainIds.value.length === 0) {
    message.warning('请勾选一个主计划');
    return;
  } else if (checkedMainIds.value.length > 1) {
    message.warning('已勾选多个主计划，请只勾选一个主计划');
    return;
  }
  const selectedMainPlans = mainGridApi.grid.getCheckboxRecords();
  if (selectedMainPlans.length > 0) {
    const mainPlan = selectedMainPlans[0];
    subFormModalApi
      .setData({
        mainId: mainPlan.id,
        planType: 'SUB',
        mainPlanIsRelease: mainPlan.isRelease,
        mainPlanTradeType: mainPlan.tradeType,
        pickupPlanNo: mainPlan.pickupPlanNo,
      })
      .open();
  }
}

/** 导出数据 */
// function handleMainExport() {}

// function handleSubExport() {
//   message.info('导出功能');
// }

/** 强制完成 */
const handleForceComplete = async () => {
  try {
    // 获取选中的主计划记录
    const selectedMainRecords = mainGridApi.grid.getCheckboxRecords();
    // 获取选中的子计划记录
    const selectedSubRecords = subGridApi.grid.getCheckboxRecords();

    // 检查是否同时选中了主计划和子计划
    if (selectedMainRecords.length > 0 && selectedSubRecords.length > 0) {
      message.warning('主计划和子计划只能同时选一个');
      return;
    }

    // 检查是否没有选中任何记录
    if (selectedMainRecords.length === 0 && selectedSubRecords.length === 0) {
      message.warning('请至少选中一条记录！');
      return;
    }

    let forceList = [];

    // 处理选中的主计划
    if (selectedMainRecords.length > 0) {
      forceList = selectedMainRecords.map((record) => ({
        mainId: record.id.toString(),
        mainGateReleaseQuantity: record.mainGateReleaseQuantity,
      }));
    }

    // 处理选中的子计划
    if (selectedSubRecords.length > 0) {
      forceList = selectedSubRecords.map((record) => ({
        mainId: record.id.toString(),
        mainGateReleaseQuantity: record.mainGateReleaseQuantity || '',
      }));
    }

    const res = await forceComplete({ forceList });
    if (res) {
      message.success('成功强制完成！');

      // 刷新主计划和子计划表格
      await mainGridApi.query();
      await subGridApi.query();

      // 清空选中状态
      mainIdList.value = [];
      checkedMainIds.value = [];
      checkedSubIds.value = [];

      // 取消所有行勾选
      if (mainGridApi?.grid) {
        await mainGridApi.grid.setAllCheckboxRow(false);
      }
      if (subGridApi?.grid) {
        await subGridApi.grid.setAllCheckboxRow(false);
      }
    } else {
      const errorMsg = res?.msg || '强制完成失败，请重试';
      message.error(errorMsg);
    }
  } catch (error) {
    console.error('强制完成接口调用异常：', error);
  }
};

/** 编辑主计划申请 */
const handleMainPlanEdit = async (row: EmptyContainerControlApi.mainPlanVO) => {
  const res = await getMainPlan(row.id);
  mainFormModalApi.setData(res).open();
};

/** 编辑子计划申请 */
const handleSubEdit = async (row: EmptyContainerControlApi.subPlanVO) => {
  const res = await getSubPlan(row.id);
  const mainPlanRes = await getMainPlan(row.mainId);
  subFormModalApi
    .setData({
      ...res,
      mainId: row.mainId,
      planType: 'SUB',
      mainPlanTradeType: mainPlanRes.tradeType,
    })
    .open();
};

/** 删除主计划 */
const handleMainPlanDelete = async (
  row: EmptyContainerControlApi.mainPlanVO,
) => {
  await deleteMainPlan(row.id);
  message.success('删除成功');
  handleRefresh();
};

/** 删除子计划 */
const handleSubDelete = async (row: EmptyContainerControlApi.subPlanVO) => {
  await deleteSubPlan(row.id);
  message.success('删除成功');
  handleSubPlanRefresh();
};

/** 日志查询 */
function handleLogQuery() {
  logQueryModalApi.open();
}

// const adcancedQueryModalOpen = () => {
//   AdvancedQueryModalApi.open();
// };

const ownerCodeList = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false,
});

const handleOwnerInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (ownerCodeList.isComposing) return;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  fetchOwnerCodeList(target.value);
};

// 处理持箱人中文输入法组合开始
const handleOwnerCompositionStart = () => {
  ownerCodeList.isComposing = true;
};

// 处理持箱人中文输入法组合结束
const handleOwnerCompositionEnd = (e: CompositionEvent) => {
  ownerCodeList.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  fetchOwnerCodeList(target.value);
};

const contIsoList = reactive({
  data: [],
  value: [],
  fetching: false,
  isComposing: false,
});

// 处理ISO输入，将小写字母转换为大写
const handleIsoInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (contIsoList.isComposing) return;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  fetchContIsoList(target.value);
};

// 处理ISO中文输入法组合开始
const handleIsoCompositionStart = () => {
  contIsoList.isComposing = true;
};

// 处理ISO中文输入法组合结束
const handleIsoCompositionEnd = (e: CompositionEvent) => {
  contIsoList.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, '');
  fetchContIsoList(target.value);
};

const dischargeVslSchedule = reactive({
  data: [],
  value: undefined,
  fetching: false,
  isComposing: false, // 标记是否在中文输入法组合状态
});

// 处理卸船船期输入，将英文部分转为大写，同时允许中文
const handleDischargeVslScheduleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (dischargeVslSchedule.isComposing) {
    return;
  }
  target.value = target.value.toUpperCase();
  fetchDischargeVslSchedule(target.value);
};

// 处理卸船船期中文输入法组合开始
const handleDischargeVslScheduleCompositionStart = () => {
  dischargeVslSchedule.isComposing = true;
};

// 处理卸船船期中文输入法组合结束
const handleDischargeVslScheduleCompositionEnd = (e: CompositionEvent) => {
  dischargeVslSchedule.isComposing = false;
  const target = e.target as HTMLInputElement;
  target.value = target.value.toUpperCase();
  fetchDischargeVslSchedule(target.value);
};

// 获取卸船船期
const fetchDischargeVslSchedule = async (searchText: string) => {
  dischargeVslSchedule.fetching = true;
  try {
    if (!searchText || searchText.length < 2) {
      return;
    }
    const upperCaseValue = searchText.toUpperCase();
    const result = await getVesselAndVoyage({ condition: upperCaseValue });
    dischargeVslSchedule.data = result.map((item) => ({
      label: item,
      value: item,
    }));
  } catch {
    dischargeVslSchedule.data = [];
  } finally {
    dischargeVslSchedule.fetching = false;
  }
};

// 获取持箱者列表
const fetchOwnerCodeList = async (searchText: string) => {
  ownerCodeList.fetching = true;
  try {
    const upperCaseValue = searchText.toUpperCase();
    const result = await getContainerOwnerListPage({
      ownerCode: upperCaseValue,
      pageNo: 1,
      pageSize: 100,
    });
    if (result) {
      ownerCodeList.data = result.map((item) => ({
        label: item.ownerCode,
        value: item.ownerCode,
        data: item,
      }));
    }
  } catch {
    ownerCodeList.data = [];
  } finally {
    ownerCodeList.fetching = false;
  }
};

// 获取ISO列表
const fetchContIsoList = async (searchText: string) => {
  contIsoList.fetching = true;
  try {
    const upperCaseValue = searchText.toUpperCase();
    const result = await getContainerIsoListPage({
      contIso: upperCaseValue,
      pageNo: 1,
      pageSize: 100,
      queryType: 'VESSEL',
    });

    if (result) {
      contIsoList.data = result.map((item) => ({
        label: item.contIso,
        value: item.contIso,
        data: item,
      }));
    }
  } catch {
    contIsoList.data = [];
  } finally {
    contIsoList.fetching = false;
  }
};

// 控制箱区范围浮窗显隐藏
const openContainerAreaWindow = (
  row: EmptyContainerControlApi.containerAreaDisplayVO,
) => {
  containerAreaClickRow.value = JSON.parse(JSON.stringify(row));
  popoverVisible.value[row.id] = true;
};

onMounted(async () => {
  try {
    const formValues = await mainGridApi.formApi.getValues();
    if (formValues.bayRangeList) {
      bayRangeListValue.value = formValues.bayRangeList;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});
</script>

<template>
  <Page auto-content-height>
    <SubFormModal class="w-3/5" @success="handleSubPlanRefresh" />
    <MainFormModal class="w-3/5" @success="handleRefresh" />
    <!--    <AdvancedQueryModal class="w-2/5">-->
    <!--      <AdvancedQuery />-->
    <!--    </AdvancedQueryModal>-->
    <LogQueryModal />
    <ChooseContainerModal class="w-3/5" />
    <ContainerAreaSelect
      v-model:visible="containerAreaVisible"
      trade-type=""
      :selected-positions="selectedPositions"
      @confirm="handleContainerAreaConfirm"
    />
    <!-- 主计划列表 -->
    <div class="h-3/5 w-full">
      <MainGrid table-title="主计划">
        <template #form-ownerCodeList>
          <Select
            :options="ownerCodeList.data"
            mode="multiple"
            v-model:value="ownerCodeList.value"
            style="width: 100%"
            placeholder="请输入持箱人"
            :show-search="true"
            :filter-option="false"
            :list-height="150"
            allow-clear
            show-arrow
            @search="fetchOwnerCodeList"
            @focus="fetchOwnerCodeList('')"
            @input="handleOwnerInput"
            @compositionstart="handleOwnerCompositionStart"
            @compositionend="handleOwnerCompositionEnd"
          />
        </template>
        <template #form-contIsoList>
          <Select
            :options="contIsoList.data"
            mode="multiple"
            v-model:value="contIsoList.value"
            style="width: 100%"
            placeholder="请输入ISO"
            :show-search="true"
            :filter-option="false"
            :list-height="150"
            allow-clear
            show-arrow
            @search="fetchContIsoList"
            @input="handleIsoInput"
            @focus="fetchContIsoList('')"
            @compositionstart="handleIsoCompositionStart"
            @compositionend="handleIsoCompositionEnd"
          />
        </template>
        <template #form-dischargeVslSchedule>
          <Select
            :options="dischargeVslSchedule.data"
            v-model:value="dischargeVslSchedule.value"
            style="width: 100%"
            placeholder="请输入船名或航次"
            :show-search="true"
            :filter-option="true"
            :list-height="150"
            allow-clear
            @change="
              (value) =>
                mainGridApi.formApi.setFieldValue('dischargeVslSchedule', value)
            "
            @input="handleDischargeVslScheduleInput"
            @compositionstart="handleDischargeVslScheduleCompositionStart"
            @compositionend="handleDischargeVslScheduleCompositionEnd"
          />
        </template>
        <template #form-bayRangeList>
          <div class="flex w-full items-center">
            <Button
              type="default"
              style="width: 100%"
              @click="containerAreaVisible = true"
              :disabled="false"
              :title="bayRangeListValue || '选择箱区'"
            >
              {{ bayRangeListValue || '选择箱区' }}
            </Button>
            <Button
              v-if="bayRangeListValue"
              type="link"
              danger
              @click="
                bayRangeListValue = '';
                mainGridApi.formApi.setValues({
                  bayRangeList: '',
                });
              "
            />
          </div>
        </template>
        <template #bayRanges="{ row }">
          <a-popover
            v-model:open="popoverVisible[row.id]"
            trigger="click"
            :key="row.id"
          >
            <template #content>
              <ContainerAreaDisplay
                :bay-range-list="containerAreaClickRow?.bayRangeList || []"
                :bay-ranges="containerAreaClickRow?.bayRanges || ''"
              />
              <div
                @click.stop="
                  () => {
                    popoverVisible[row.id] = false;
                    containerAreaClickRow.value = null;
                  }
                "
              ></div>
            </template>
            <text
              @click="openContainerAreaWindow(row)"
              style="color: #1890ff; cursor: pointer"
            >
              {{ row.bayRanges }}
            </text>
          </a-popover>
        </template>
        <!--        <template #form-expand-before>-->
        <!--          <advancedButton @click="adcancedQueryModalOpen" />-->
        <!--        </template>-->
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '新增',
                type: 'primary',
                icon: ACTION_ICON.ADD,
                auth: ['empty:container-control-main:create'],
                onClick: handleCreateMainPlan,
              },
              {
                label: '强制完成',
                type: 'primary',
                icon: ACTION_ICON.AUDIT,
                onClick: handleForceComplete,
              },
              {
                label: '闸口模拟选箱',
                type: 'primary',
                icon: ACTION_ICON.GRID,
                onClick: handleChooseContainer,
              },
              {
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.VIEW,
                onClick: handleLogQuery,
                auth: ['empty:container-control-main-log:query'],
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
                auth: ['empty:container-control-main:update'],
                onClick: handleMainPlanEdit.bind(null, row),
                disabled: row.planStatus === 'COMPLETED',
              },
              // 当状态不是'已完成'时才显示删除按钮
              ...(row.planStatus !== 'COMPLETED'
                ? [
                    {
                      label: '删除',
                      type: 'link',
                      icon: ACTION_ICON.DELETE,
                      auth: ['empty:container-control-main:delete'],
                      popConfirm: {
                        title: '确定删除该条记录吗？',
                        onConfirm: handleMainPlanDelete.bind(null, row),
                        placement: 'topRight',
                      },
                      danger: true,
                    },
                  ]
                : []),
            ]"
          />
        </template>
      </MainGrid>
    </div>
    <!-- 子计划列表 -->
    <div class="h-2/5 w-full">
      <SubGrid table-title="子计划">
        <template #bayRanges="{ row }">
          <a-popover
            v-model:open="popoverVisible[row.id]"
            trigger="click"
            :key="row.id"
          >
            <template #content>
              <ContainerAreaDisplay
                :bay-range-list="containerAreaClickRow?.bayRangeList || []"
                :bay-ranges="containerAreaClickRow?.bayRanges || ''"
              />
              <div
                @click.stop="
                  () => {
                    popoverVisible[row.id] = false;
                    containerAreaClickRow.value = null;
                  }
                "
              ></div>
            </template>
            <text
              @click="openContainerAreaWindow(row)"
              style="color: #1890ff; cursor: pointer"
            >
              {{ row.bayRanges }}
            </text>
          </a-popover>
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
              // {
              //   label: '导出',
              //   type: 'primary',
              //   icon: ACTION_ICON.DOWNLOAD,
              //   onClick: handleSubExport,
              // },
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
                disabled: row.planStatus === 'COMPLETED',
              },
              ...(row.planStatus !== 'COMPLETED'
                ? [
                    {
                      label: '删除',
                      type: 'link',
                      icon: ACTION_ICON.DELETE,
                      auth: ['system:user:delete'],
                      popConfirm: {
                        title: '确定删除该条记录吗？',
                        onConfirm: handleSubDelete.bind(null, row),
                        placement: 'topRight',
                      },
                      danger: true,
                    },
                  ]
                : []),
            ]"
          />
        </template>
      </SubGrid>
    </div>
  </Page>
</template>
