<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { reactive, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Select } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getContainerIsoList, getContainerOwnerList } from '#/api/bpp/common';
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
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';
import ChooseContainer from '#/views/bpp/empty/container/control/modules/chooseContainer.vue';
import ContainerAreaDisplay from '#/views/bpp/empty/container/control/modules/containerAreaDisplay.vue';
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

const [AdvancedQueryModal, AdvancedQueryModalApi] = useVbenModal({
  showCancelButton: false,
  showConfirmButton: false,
});

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
          if (!hasSelectedMainPlan.value) {
            return { total: 0, list: [] };
          }
          if (selectedMainId.value) {
            formValues.mainId = selectedMainId.value;
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
  // 检查是否已勾选子计划
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
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
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

          const result = await getMainPlanPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ownerCodeList: ownerCodeList.value,
            contIsoList: contIsoList.value,
            dischargeVslSchedule: dischargeVslSchedule.value,
            planType: 'MAIN',
            ...queryParams,
          });
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

/** 创建主计划新申请 */
function handleCreateMainPlan() {
  mainFormModalApi.setData(null).open();
}

/** 闸口模拟选箱 */
async function handleChooseContainer() {
  try {
    const formValues = await gridApi2.formApi.getValues();
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
      })
      .open();
  }
}

/** 导出数据 */
// function handleMainExport() {}

function handleSubExport() {
  message.info('导出功能');
}

/** 强制完成 */
const handleForceComplete = async () => {
  try {
    const res = await forceComplete({ mainIdList: mainIdList.value });
    if (res) {
      message.success('成功强制完成！');
      await mainGridApi.query();
      mainIdList.value = [];
      checkedMainIds.value = [];

      if (mainGridApi?.grid) {
        // 取消所有行勾选
        await mainGridApi.grid.setAllCheckboxRow(false);
      }
    } else {
      const errorMsg = res?.msg || '强制完成失败，请重试';
      message.error(errorMsg);
    }
  } catch (error) {
    console.error('强制完成接口调用异常：', error);
    message.error('网络异常或接口报错，强制完成操作失败！');
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
  subFormModalApi.setData(res).open();
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
  handleRefresh();
};

/** 日志查询 */
function handleLogQuery() {
  logQueryModalApi.open();
}

const adcancedQueryModalOpen = () => {
  AdvancedQueryModalApi.open();
};

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
  value: '',
  fetching: false,
});

// 获取卸船船期
const fetchdischargeVslSchedule = async (searchText) => {
  try {
    dischargeVslSchedule.fetching = true;
    const result = await getVesselAndVoyage({ condition: searchText });
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
    const result = await getContainerOwnerList({
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
    const result = await getContainerIsoList({
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
</script>

<template>
  <Page auto-content-height>
    <SubFormModal class="w-3/5" @success="handleRefresh" />
    <MainFormModal class="w-3/5" @success="handleRefresh" />
    <AdvancedQueryModal class="w-2/5">
      <AdvancedQuery />
    </AdvancedQueryModal>
    <LogQueryModal />
    <ChooseContainerModal class="w-3/5" @success="handleRefresh" />
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
            @search="fetchOwnerCodeList"
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
            @search="fetchContIsoList"
            @input="handleIsoInput"
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
            @search="fetchdischargeVslSchedule"
          />
        </template>
        <template #bayRanges="{ row }">
          <a-popover
            v-model:open="popoverVisible[row.id]"
            trigger="click"
            :key="row.id"
          >
            <template #content>
              <ContainerAreaDisplay
                :owner-code-list="containerAreaClickRow?.ownerCodeList || []"
                :cont-iso-list="containerAreaClickRow?.contIsoList || []"
                :bay-range-list="containerAreaClickRow?.bayRangeList || []"
                :bay-ranges="containerAreaClickRow?.bayRanges || ''"
                @click="
                  () => {
                    popoverVisible[row.id] = false;
                    containerAreaClickRow.value = null;
                  }
                "
              >
                Close
              </ContainerAreaDisplay>
            </template>
            <a-text
              @click="openContainerAreaWindow(row)"
              style="color: #1890ff; cursor: pointer"
            >
              {{ row.bayRanges }}
            </a-text>
          </a-popover>
        </template>
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
                onClick: handleMainPlanEdit.bind(null, row),
              },
              {
                label: '删除',
                type: 'link',
                icon: ACTION_ICON.DELETE,
                auth: ['system:user:delete'],
                popConfirm: {
                  title: '确定删除该条记录吗？',
                  onConfirm: handleMainPlanDelete.bind(null, row),
                  placement: 'topRight',
                },
                danger: true,
              },
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
                :owner-code-list="containerAreaClickRow?.ownerCodeList || []"
                :cont-iso-list="containerAreaClickRow?.contIsoList || []"
                :bay-range-list="containerAreaClickRow?.bayRangeList || []"
                :bay-ranges="containerAreaClickRow?.bayRanges || ''"
                @click="
                  () => {
                    popoverVisible[row.id] = false;
                    containerAreaClickRow.value = null;
                  }
                "
              >
                Close
              </ContainerAreaDisplay>
            </template>
            <a-text
              @click="openContainerAreaWindow(row)"
              style="color: #1890ff; cursor: pointer"
            >
              {{ row.bayRanges }}
            </a-text>
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
            ]"
          />
        </template>
      </SubGrid>
    </div>
  </Page>
</template>
