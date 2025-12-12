<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
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
  ownerList: [],
  isoNoList: [],
  tradeType: '',
});

const containerAreaData = reactive<any[]>([]);

const formData = reactive<EmptyContainerControlApi.mainPlanVO>({
  id: '',
  ownerList: [],
  isoNoList: [],
  isRelease: false,
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

  // 处理持箱人列表
  const ownerList = formValues.owners
    ? formValues.owners
      .split(/[,，]/)
      .map((item: string) => item.trim())
      .filter(Boolean)
    : [];

  // 处理ISO列表
  const isoNoList = formValues.isoNos
    ? formValues.isoNos
      .split(/[,，]/)
      .map((item: string) => item.trim())
      .filter(Boolean)
    : [];

  // 更新参数
  containerAreaParams.ownerList = ownerList;
  containerAreaParams.isoNoList = isoNoList;
  containerAreaParams.tradeType = formValues.tradeType || '';

  containerAreaModalVisible.value = true;
};

const handleContainerAreaConfirm = (positions: string[]) => {
  const $grid = gridApi.grid;
  if ($grid) {
    containerAreaData.splice(0);
    const newRows = positions.map((pos) => ({
      yardPosition: `${pos}`,
      yardColumns: [],
      totalCount: '',
      minStorageDays: '',
      maxStorageDays: '',
    }));

    containerAreaData.push(...newRows);
    $grid.reloadData(containerAreaData);
  }
};

// 删除行方法
const deleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  await $grid.remove(row);
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

    // if (containerAreaArray.length === 0) {
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
    // 确保planType和mainId被正确设置
    if (!formData.planType) {
      formData.planType = 'MAIN';
    }
    // 转换持箱人字符串为数组
    const ownerList = formValues.owners
      ? formValues.owners
          .split(/[,，]/)
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

    // 转换ISO字符串为数组
    const isoNoList = formValues.isoNos
      ? formValues.isoNos
          .split(/[,，]/)
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

    const $grid = gridApi.grid;
    const gridData = $grid ? $grid.getData() : containerAreaData;
    const bayRangeList = gridData.map((row: any) => ({
      // emptyContainerControlId: '',
      // id: '',
      yardBay: row.yardPosition || '',
      yardRaw: row.yardColumns ? row.yardColumns.join(',') : '',
    }));

    // 构建符合新接口格式的数据
    const data: EmptyContainerControlApi.mainPlanVO = {
      ...formData,
      ownerList,
      isoNoList,
      bayRangeList,
    } as EmptyContainerControlApi.mainPlanVO;

    await (formData?.id ? updateMainPlan(data) : createMainPlan(data));

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        id: '',
        ownerList: [],
        isoNoList: [],
        isRelease: false,
        pickupPlanNo: '',
        tradeType: '',
        planQuantity: '',
        completedReleaseQuantity: '',
        bayRangeList: [],
        planType: '',
        mainId: '',
        planNo: '',
      });
      containerAreaData.splice(0);
      return;
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

const modalTitle = computed(() => {
  return formData.id
    ? $t('ui.actionTitle.edit', ['主计划'])
    : $t('ui.actionTitle.create', ['主计划']);
});
</script>

<template>
  <Modal :title="modalTitle">
    <Form>
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
      :owner-list="containerAreaParams.ownerList"
      :iso-no-list="containerAreaParams.isoNoList"
      :trade-type="containerAreaParams.tradeType"
      @confirm="handleContainerAreaConfirm"
    />
  </Modal>
</template>
