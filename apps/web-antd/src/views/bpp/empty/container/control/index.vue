<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { reactive, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Select } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteMainPlan,
  deleteSubPlan,
  forceComplete,
  getIsoList,
  getMainPlan,
  getMainPlanPage,
  getOwnerList,
  getSubPlan,
  getSubPlanPage,
  getVesselAndVoyage,
} from '#/api/bpp/empty/container/control';
import { advancedButton } from '#/components/advanced-button';
import { AdvancedQuery } from '#/components/advanced-query';
import ContainerAreaDisplay from '#/views/bpp/empty/container/control/modules/containerAreaDisplay.vue';
import LogQuery from '#/views/bpp/empty/container/control/modules/logQuery.vue';
import MainDetail from '#/views/bpp/empty/container/control/modules/mainDetail.vue';
import MainForm from '#/views/bpp/empty/container/control/modules/mainForm.vue';
import SubDetail from '#/views/bpp/empty/container/control/modules/subDetail.vue';
import SubForm from '#/views/bpp/empty/container/control/modules/subForm.vue';

import { mainPlanColumns, PlanSearchFormSchema, subPlanColumns } from './data';

const checkedMainIds = ref<number[]>([]);
const planNo = ref<string[]>([]);
const selectedMainId = ref<null | string>(null);
const hasSelectedMainPlan = ref(false);
const mainIdList = ref<string[]>([]);
const checkedSubIds = ref<number[]>([]);
const subPlanNo = ref<string[]>([]);
const loading = ref(false);
const containerAreaClickRow = ref<EmptyContainerControlApi.mainPlanVO | null>(
  null,
);
const popoverVisible = ref({});

const [AdvancedQueryModal, AdvancedQueryModalApi] = useVbenModal({
  showCancelButton: false,
  showConfirmButton: false,
});

const [SubFormModal, subFormModalApi] = useVbenModal({
  connectedComponent: SubForm,
  destroyOnClose: true,
});

const [SubDetailModal, subDetailModalApi] = useVbenModal({
  connectedComponent: SubDetail,
  destroyOnClose: true,
});

const [LogQueryModal, logQueryModalApi] = useVbenModal({
  connectedComponent: LogQuery,
  destroyOnClose: true,
  footer: false,
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
          const transformedParams = transformFormToRequest(formValues);
          if (selectedMainId.value) {
            transformedParams.planType = 'SUB';
            transformedParams.mainId = selectedMainId.value;
          }
          const result = await getSubPlanPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...transformedParams,
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
}
const [MainFormModal, mainFormModalApi] = useVbenModal({
  connectedComponent: MainForm,
  destroyOnClose: true,
});

const [MainDetailModal, mainDetailModalApi] = useVbenModal({
  connectedComponent: MainDetail,
  destroyOnClose: true,
});

const [MainGrid, mainGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: PlanSearchFormSchema(),
    submitButtonOptions: {
      content: '查询',
    },
    wrapperClass: 'grid-cols-4 md:grid-cols-4',
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

/**
 * 转换表单值为接口请求参数格式
 */
const transformFormToRequest = (
  formValues: Record<string, any>,
): Record<string, any> => {
  const params = JSON.parse(JSON.stringify(formValues || {}));
  delete params.pageNo;
  delete params.pageSize;

  if (params.bayRangeList) {
    const [yardBay, yardRaw] = params.bayRangeList
      .split('-')
      .map((item: string) => item.trim());
    params.bayRangeList = [
      {
        yardBay: yardBay || '',
        yardRaw: yardRaw || '',
      },
    ];
  } else {
    delete params.bayRangeList;
  }

  if (params.ownerCodeList) {
    params.ownerCodeList = params.ownerCodeList
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  } else {
    delete params.ownerCodeList;
  }

  if (params.contIsoList) {
    params.contIsoList = params.contIsoList
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  } else {
    delete params.contIsoList;
  }

  if (params.createTime) {
    if (params.createTime.length === 0) {
      delete params.createTime;
    }
  } else {
    delete params.createTime;
  }

  // 主计划号 planNo：空值删除
  if (
    params.planNo === '' ||
    params.planNo === undefined ||
    params.planNo === null
  ) {
    delete params.planNo;
  }

  // 进口航次 importVoyageNo：空值删除
  if (
    params.importVoyageNo === '' ||
    params.importVoyageNo === undefined ||
    params.importVoyageNo === null
  ) {
    delete params.importVoyageNo;
  }

  // 贸易类型 tradeType：空值删除
  if (
    params.tradeType === '' ||
    params.tradeType === undefined ||
    params.tradeType === null
  ) {
    delete params.tradeType;
  }

  // 受理提箱计划号 pickupPlanNo：空值删除
  if (
    params.pickupPlanNo === '' ||
    params.pickupPlanNo === undefined ||
    params.pickupPlanNo === null
  ) {
    delete params.pickupPlanNo;
  }

  params.planType = 'MAIN';
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value === '' || value === undefined || value === null) {
      delete params[key];
    }
  });
  const finalParams = JSON.parse(JSON.stringify(params));
  return finalParams;
};

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
        mainId: selectedMainId.value,
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

/** 查看主计划详情 */
const handleMainPlanDetail = async (
  row: EmptyContainerControlApi.mainPlanVO,
) => {
  const res = await getMainPlan(row.id);
  mainDetailModalApi.setData(res).open();
};

/** 查看子计划详情 */
const handleSubDetail = async (row: EmptyContainerControlApi.subPlanVO) => {
  const res = await getSubPlan(row.id);
  subDetailModalApi.setData(res).open();
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
});

const contIsoList = reactive({
  data: [],
  value: [],
  fetching: false,
});

const dischargeVslSchedule = reactive({
  data: [],
  value: [],
  fetching: false,
});

// 获取持箱者列表
const fetchOwnerCodeList = async (searchText) => {
  try {
    ownerCodeList.fetching = true;
    const result = await getOwnerList({
      ownerCode: searchText,
      pageNo: 1,
      pageSize: 100,
    });
    ownerCodeList.data = result.map((item) => ({
      label: item.ownerCode,
      value: item.ownerCode,
    }));
  } catch {
    ownerCodeList.data = [];
  } finally {
    ownerCodeList.fetching = false;
  }
};

// 获取ISO列表
const fetchcontIsoList = async (searchText) => {
  try {
    contIsoList.fetching = true;
    const result = await getIsoList({
      contIso: searchText,
      pageNo: 1,
      pageSize: 100,
      queryType: 'VESSEL',
    });
    contIsoList.data = result.map((item) => ({
      label: item.contIso,
      value: item.contIso,
    }));
  } catch {
    contIsoList.data = [];
  } finally {
    contIsoList.fetching = false;
  }
};

// 获取卸船船期
const fetchDischargeVslSchedule = async (searchText) => {
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
    <MainFormModal class="w-1/2" @success="handleRefresh" />
    <AdvancedQueryModal class="w-2/5">
      <AdvancedQuery />
    </AdvancedQueryModal>
    <SubDetailModal class="w-3/5" />
    <MainDetailModal />
    <LogQueryModal />
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
            :filter-option="true"
            :list-height="100"
            @search="fetchOwnerCodeList"
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
            :filter-option="true"
            :list-height="100"
            @search="fetchcontIsoList"
          />
        </template>
        <template #form-vesselUnloadDate>
          <Select
            :options="dischargeVslSchedule.data"
            mode="multiple"
            v-model:value="dischargeVslSchedule.value"
            style="width: 100%"
            placeholder="请输入船名或航次"
            :show-search="true"
            :filter-option="true"
            :list-height="100"
            @search="fetchDischargeVslSchedule"
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
                :container-iso-list="containerAreaClickRow?.contIsoList || []"
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
                label: '日志查询',
                type: 'primary',
                icon: ACTION_ICON.VIEW,
                onClick: handleMainExport,
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
              // {
              //   label: '详情',
              //   type: 'link',
              //   icon: ACTION_ICON.VIEW,
              //   onClick: handleMainPlanDetail.bind(null, row),
              // },
              {
                label: '删除',
                type: 'link',
                icon: ACTION_ICON.DELETE,
                auth: ['system:user:delete'],
                onClick: handleMainPlanDelete.bind(null, row),
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
                :container-iso-list="
                  containerAreaClickRow?.containerIsoList || []
                "
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
              // {
              //   label: '详情',
              //   type: 'link',
              //   icon: ACTION_ICON.VIEW,
              //   onClick: handleSubDetail.bind(null, row),
              // },
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
