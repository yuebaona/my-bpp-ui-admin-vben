<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import {computed, reactive, ref} from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getContainerIsoList, getContainerOwnerList } from '#/api/bpp/common';
import {
  createMainPlan,
  updateMainPlan,
  getStorageQuantity,
} from '#/api/bpp/empty/container/control';
import { $t } from '#/locales';

import { containerAreaRangeColumns, mainPlanFormSchema } from '../data';
import ContainerArea from './containerAreaSelect.vue';

const emit = defineEmits(['success']);

const containerAreaModalVisible = ref(false);

const containerAreaParams = reactive({
  ownerCodeList: [],
  containerIsoList: [],
  tradeType: '',
  selectedPositions: [],
});

const isoState = reactive({
  data: [],
  value: [],
  fetching: false,
});

const ownerState = reactive({
  data: [],
  value: [],
  fetching: false,
});

const containerAreaData = reactive<any[]>([]);

const formData = reactive<EmptyContainerControlApi.mainPlanVO>({
  id: '',
  ownerCodeList: [],
  containerIsoList: [],
  isRelease: undefined,
  pickupPlanNo: '',
  dischargeVesselSchedule: '',
  tradeType: '',
  planQuantity: '',
  completedReleaseQuantity: '',
  bayRangeList: [],
  planType: '',
  mainId: '',
  planNo: '',
});

// 将字符串转为数组
const transformStringToArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.map(item => item?.toString().trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(/[,，]/).map((item: string) => item.trim()).filter(Boolean);
  }
  return [];
};

const selectContainerArea = async () => {
  // 获取表单值
  const formValues = await formApi.getValues();

  const selectedPositions: string[] = [];
  if (formData.bayRangeList && Array.isArray(formData.bayRangeList)) {
    formData.bayRangeList.forEach((item) => {
      if (item.yardBay) {
        selectedPositions.push(item.yardBay);
      }
    });
  }
  containerAreaParams.ownerCodeList = Array.isArray(formValues.ownerCodeList)
    ? formValues.ownerCodeList
    : [formValues.ownerCodeList];
  containerAreaParams.containerIsoList = Array.isArray(
    formValues.containerIsoList,
  )
    ? formValues.containerIsoList
    : [formValues.containerIsoList];
  containerAreaParams.tradeType = formValues.tradeType || '';
  containerAreaParams.selectedPositions = selectedPositions;
  containerAreaModalVisible.value = true;
};

const handleContainerAreaConfirm = (positions: string[]) => {
  const $grid = gridApi.grid;
  if ($grid) {
    const existingRowsMap = new Map<string, any>();
    const currentGridData = $grid.getTableData();

    currentGridData.fullData.forEach((row) => {
      if (row.yardPosition) {
        existingRowsMap.set(row.yardPosition, row);
      }
    });
    containerAreaData.splice(0);
    const newRows = positions.map((pos) => {
      const yardPosition = `${pos}`;

      if (existingRowsMap.has(yardPosition)) {
        return existingRowsMap.get(yardPosition);
      }
      // 新行数据
      return {
        yardPosition,
        yardColumns: [],
        totalCount: '',
        minStorageDays: '',
        maxStorageDays: '',
      };
    });

    containerAreaData.push(...newRows);
    $grid.reloadData(containerAreaData);
    formData.bayRangeList = containerAreaData.map(item => ({
      yardBay: item.yardPosition,
      yardRaw: item.yardRaw || (item.yardColumns ? item.yardColumns.join(',') : ''),
      ...item
    }));
  }
};

// 删除行方法
const deleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  if ($grid) {
    const currentGridData = $grid.getTableData().fullData;

    containerAreaData.splice(0);
    const dataIndex = currentGridData.findIndex(item => item.yardPosition === row.yardPosition);
    if (dataIndex !== -1) {
      currentGridData.splice(dataIndex, 1);
    }

    containerAreaData.push(...currentGridData);
    $grid.reloadData(containerAreaData);
    formData.bayRangeList = containerAreaData.map(item => ({
      yardBay: item.yardPosition,
      yardRaw: item.yardRaw || (item.yardColumns ? item.yardColumns.join(',') : ''),
      ...item
    }));

    $grid.clearFilter();
  }
};

// ISO搜索函数
const isoSearch = async (value: string) => {
  isoState.fetching = true;
  try {
    const res = await getContainerIsoList({
      pageNo: 1,
      pageSize: 10,
      containerIso: value,
      queryType: 'ISO',
    });

    if (res) {
      isoState.data = res.map((item: any) => ({
        label: item.containerIso,
        value: item.containerIso,
        data: item,
      }));
    }
  } catch {
    message.error('获取ISO数据失败');
  } finally {
    isoState.fetching = false;
  }
};

// 初始化ISO数据
const initIsoData = async () => {
  await isoSearch('');
};

// 持箱人搜索函数
const ownerSearch = async (value: string) => {
  ownerState.fetching = true;
  try {
    const res = await getContainerOwnerList({
      pageNo: 1,
      pageSize: 10,
      ownerCode: value,
    });

    if (res) {
      ownerState.data = res.map((item: any) => ({
        label: item.ownerCode,
        value: item.ownerCode,
        data: item,
      }));
    }
  } catch {
    message.error('获取持箱人数据失败');
  } finally {
    ownerState.fetching = false;
  }
};

// 初始化持箱人数据
const initOwnerData = async () => {
  await ownerSearch('');
};

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: mainPlanFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values) => {
    Object.assign(formData, values);
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: containerAreaRangeColumns(),
    height: '300px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    editConfig: {
      mode: 'row',
      showIcon: false,
      trigger: 'manual',
    },
    editRules: {
      // yardPosition: [{ required: true, message: '必须填写' }],
      // yardColumns: [{ required: true, message: '必须选择堆场列' }],
      // totalCount: [{ required: true, message: '必须填写' }],
    },
    toolbarConfig: {
      refresh: false,
      search: false,
      zoom: false,
      custom: false,
    },
    pagerConfig: {
      enabled: false,
    },
    data: containerAreaData,
  } as VxeTableGridOptions<any>,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {

    // if (containerAreaData.length === 0) {
    //   message.warning('请至少添加一条箱区范围数据');
    //   return;
    // }

    const { valid } = await formApi.validate();
    const gridValid: boolean = await gridApi.grid.validate(true);

    if (!valid || gridValid) {
      return;
    }

    // Object.assign(formData, await formApi.getValues());
    const formValues = await formApi.getValues();
    Object.assign(formData, formValues);
    if (!formData.planType) {
      formData.planType = 'MAIN';
    }

    if (!Array.isArray(formData.ownerCodeList)) {
      formData.ownerCodeList = [formData.ownerCodeList];
    }
    if (!Array.isArray(formData.containerIsoList)) {
      formData.containerIsoList = [formData.containerIsoList];
    }

    const $grid = gridApi.grid;
    const gridData = $grid ? $grid.getTableData().fullData : containerAreaData;
    const bayRangeList = gridData.map((row: any) => ({
      yardBay: row.yardPosition || '',
      yardRaw: row.yardColumns ? row.yardColumns.join(',') : '',
    }));

    const data: EmptyContainerControlApi.mainPlanVO = {
      ...formData,
      bayRangeList,
    } as EmptyContainerControlApi.mainPlanVO;

    await (formData?.id ? updateMainPlan(data) : createMainPlan(data));

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      Object.assign(formData, {
        id: '',
        ownerCodeList: [],
        containerIsoList: [],
        isRelease: undefined,
        pickupPlanNo: '',
        tradeType: '',
        planQuantity: '',
        completedReleaseQuantity: '',
        dischargeVesselSchedule: '',
        bayRangeList: [],
        planType: '',
        mainId: '',
        planNo: '',
      });
      containerAreaData.splice(0);
      initIsoData();
      initOwnerData();
    }
    const data = await modalApi.getData<any>();

    if (data) {
      // 清空现有数据
      containerAreaData.splice(0);

      const mainPlanData = data.acceptancePlanRespVO || data;
      Object.assign(formData, mainPlanData);

      if (data.planType) {
        formData.planType = data.planType;
      }
      if (data.mainId) {
        formData.mainId = data.mainId;
      }

      if (mainPlanData?.id) {
        modalApi.lock();
        try {
          await formApi.setValues(mainPlanData);
          if (mainPlanData.ownerCodeList) {
            ownerState.value = mainPlanData.ownerCodeList;
          }

          // 设置ISO选择值
          if (mainPlanData.containerIsoList) {
            isoState.value = mainPlanData.containerIsoList;
          }
          const $grid = gridApi.grid;
          if ($grid) {
            // 设置箱区范围数据
            if (data.yardPositionResp) {
              for (const item of data.yardPositionResp) {
                await $grid.insertAt(
                  {
                    ...item,
                  },
                  -1,
                );
              }
            } else if (mainPlanData.bayRangeList) {
              // 如果是数组格式
              if (Array.isArray(mainPlanData.bayRangeList)) {
                for (const bayRange of mainPlanData.bayRangeList) {
                  await $grid.insertAt(
                    {
                      yardPosition: bayRange.yardBay || '',
                      yardColumns: bayRange.yardRaw
                        ? bayRange.yardRaw.split(',')
                        : [],
                      totalCount: '',
                      minStorageDays: '',
                      maxStorageDays: '',
                    },
                    -1,
                  );
                }
              } else {
                await $grid.insertAt(
                  {
                    yardPosition: mainPlanData.bayRangeList.yardBay || '',
                    yardColumns: mainPlanData.bayRangeList.yardRaw
                      ? mainPlanData.bayRangeList.yardRaw.split(',')
                      : [],
                    totalCount: '',
                    minStorageDays: '',
                    maxStorageDays: '',
                  },
                  -1,
                );
              }
            }
          }
        } finally {
          modalApi.unlock();
        }
      } else {
        // 新创建的主计划，确保planType为MAIN
        formData.planType = 'MAIN';
      }
    }
  },
});

// 查询堆存情况
const getStorageConditionSearch = async (row: any) => {
  try {
    // 清空上次查询结果
    row.totalCount = undefined;
    row.minDays = undefined;
    row.maxDays = undefined;

    if (!row.yardPosition) {
      message.warning('请先填写堆场位置');
      return;
    }
    if (!row.yardColumns || row.yardColumns.length === 0) {
      message.warning('请至少选择一个堆场列');
      return;
    }

    // 构建接口请求参数
    const requestData = {
      yardBayList: [
        {
          yardBay: row.yardPosition,
          yardRaw: row.yardColumns.join(','),
        },
      ],
      baseInfo: {
        containerIsoList: transformStringToArray(formData.containerIsoList),
        ownerCodeList: transformStringToArray(formData.ownerCodeList),
        tradeType: formData.tradeType,
        dischargeVesselSchedule: formData.dischargeVesselSchedule,
      },

    };

    const response = await getStorageQuantity(requestData);
    if (response.length > 0) {
      row.totalCount = response[0].totalCount || 0;
      row.minDays = response[0].minDays || 0;
      row.maxDays = response[0].maxDays || 0;
    } else {
      message.warning(`无可用量`);
    }
  } catch (error) {
    console.log(error)
    message.warning('堆存查询失败或异常，请重试');
  }
};

const modalTitle = computed(() => {
  return formData.id
    ? $t('ui.actionTitle.edit', ['主计划'])
    : $t('ui.actionTitle.create', ['主计划']);
});
</script>

<template>
  <Modal :title="modalTitle">
    <Form>
      <template #containerIsoList>
        <Select
          v-model:value="isoState.value"
          mode="multiple"
          placeholder="请输入ISO"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="isoState.fetching ? undefined : null"
          :options="isoState.data"
          @search="isoSearch"
          allow-clear
          @change="(value) => formApi.setFieldValue('containerIsoList', value)"
        />
      </template>
      <template #ownerCodeList>
        <Select
          v-model:value="ownerState.value"
          mode="multiple"
          placeholder="请输入持箱人"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="ownerState.fetching ? undefined : null"
          :options="ownerState.data"
          @search="ownerSearch"
          allow-clear
          @change="(value) => formApi.setFieldValue('ownerCodeList', value)"
        />
      </template>
      <!-- 箱区范围表格部分 -->
      <template #containerAreaRange>
        <div class="mt-4 w-full">
          <div class="mb-2 flex items-center gap-2">
            <span class="font-medium">箱区范围</span>
            <Button type="primary" @click="selectContainerArea">
              选择箱区范围
            </Button>
          </div>
          <div class="table-container">
            <Grid>
              <!-- 堆场列下拉多选组件 -->
              <template #yardColumns="{ row }">
                <Select
                  v-model:value="row.yardColumns"
                  mode="multiple"
                  placeholder="请选择堆场列"
                  :options="[
                    { label: 'A', value: 'A' },
                    { label: 'B', value: 'B' },
                    { label: 'C', value: 'C' },
                    { label: 'D', value: 'D' },
                    { label: 'E', value: 'E' },
                    { label: 'F', value: 'F' },
                    { label: 'G', value: 'G' },
                    { label: 'H', value: 'H' },
                    { label: 'I', value: 'I' },
                    { label: 'J', value: 'J' },
                  ]"
                  style="width: 100%"
                  :max-tag-count="3"
                  :show-search="false"
                  @change="getStorageConditionSearch(row)"
                />
              </template>
              <template #actions="{ row }">
                <TableAction
                  :actions="[
                    {
                      label: '删除',
                      type: 'link',
                      danger: true,
                      onClick: () => deleteRow(row),
                    },
                  ]"
                />
              </template>
            </Grid>
          </div>
        </div>
      </template>
    </Form>
    <!-- 添加箱区选择弹窗组件 -->
    <ContainerArea
      v-model:visible="containerAreaModalVisible"
      :owner-code-list="containerAreaParams.ownerCodeList"
      :container-iso-list="containerAreaParams.containerIsoList"
      :trade-type="containerAreaParams.tradeType"
      :selected-positions="containerAreaParams.selectedPositions"
      @confirm="handleContainerAreaConfirm"
    />
  </Modal>
</template>
