<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getContainerIsoList, getContainerOwnerList } from '#/api/bpp/common';
import {
  createMainPlan,
  updateMainPlan,
} from '#/api/bpp/empty/container/control';
import { $t } from '#/locales';

import { containerAreaRangeColumns, mainPlanFormSchema } from '../data';
import ContainerArea from './containerArea.vue';

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
  tradeType: '',
  planQuantity: '',
  completedReleaseQuantity: '',
  bayRangeList: [],
  planType: '',
  mainId: '',
  planNo: '',
});

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
  // 更新参数
  containerAreaParams.ownerCodeList = formValues.ownerCodeList;
  containerAreaParams.containerIsoList = formValues.containerIsoList;
  containerAreaParams.tradeType = formValues.tradeType || '';
  containerAreaParams.selectedPositions = selectedPositions;
  containerAreaModalVisible.value = true;
};

const handleContainerAreaConfirm = (positions: string[]) => {
  const $grid = gridApi.grid;
  if ($grid) {
    const existingRowsMap = new Map<string, any>();
    containerAreaData.forEach((row) => {
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
  }
};

// 删除行方法
const deleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  await $grid.remove(row);
};

// ISO搜索函数
const isoSearch = async (value: string) => {
  isoState.fetching = true;
  try {
    const res = await getContainerIsoList('all');

    let allData: any[] = [];
    if (res) {
      // 只提取containerIso字段
      allData = res.map((item: any) => item.containerIso);
      // 去重
      allData = [...new Set(allData)];
      // 过滤搜索
      if (value) {
        allData = allData.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase()),
        );
      }
    }
    isoState.data = allData.map((item) => ({ label: item, value: item }));
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
  isoState.fetching = true;
  try {
    const res = await getContainerOwnerList('all');

    let allData: any[] = [];
    if (res) {
      allData = res.map((item: any) => item.ownerCode);
      // 去重
      allData = [...new Set(allData)];
      // 过滤搜索
      if (value) {
        allData = allData.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase()),
        );
      }
    }
    ownerState.data = allData.map((item) => ({ label: item, value: item }));
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
    // const containerAreaArray = [...gridApi.grid.getInsertRecords()].map(
    //   (record) => toRaw(record),
    // );

    if (containerAreaData.length === 0) {
      message.warning('请至少添加一条箱区范围数据');
      return;
    }

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

    // const ownerCodeList = formValues.
    //   ? formValues.ownerCodeList
    //     .split(/[,，]/)
    //     .map((item: string) => item.trim())
    //     .filter(Boolean)
    //   : [];
    //
    // const isoNoList = formValues.isoNos
    //   ? formValues.isoNos
    //     .split(/[,，]/)
    //     .map((item: string) => item.trim())
    //     .filter(Boolean)
    //   : [];
    const $grid = gridApi.grid;
    const gridData = $grid ? $grid.getData() : containerAreaData;
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
      // 打开模态框时初始化ISO数据
      initIsoData();
      initOwnerData();

      // 如果是编辑模式，解析已有值
      if (formData.id && formData.containerIsoList) {
        const isoList = formData.containerIsoList;
        if (Array.isArray(isoList)) {
          isoState.value = isoList;
        } else if (typeof isoList === 'string') {
          isoState.value = isoList
            .split(/[,，]/)
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }
    } else {
      isoState.value = [];
      ownerState.value = [];
    }
  },
});

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
          @select="(value) => formApi.setFieldValue('containerIsoList', value)"
          @change="(value) => formApi.setFieldValue('containerIsoList', value)"
          :max-tag-count="3"
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
          @select="(value) => formApi.setFieldValue('ownerCodeList', value)"
          @change="(value) => formApi.setFieldValue('ownerCodeList', value)"
          :max-tag-count="3"
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
