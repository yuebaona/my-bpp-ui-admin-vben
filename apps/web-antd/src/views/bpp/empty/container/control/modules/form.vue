<script lang="ts" setup>
// import type { UploadProps } from 'ant-design-vue';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createSubPlan,
  updateSubPlan,
} from '#/api/bpp/empty/container/control';
import { $t } from '#/locales';

import { containerAreaRangeColumns, subPlanFormSchema } from '../data';
import ContainerArea from './containerArea.vue';

const emit = defineEmits(['success']);
// const fileList = ref<UploadProps['fileList']>([]);

const containerAreaModalVisible = ref(false);

const containerAreaData = reactive<any[]>([
  {
    id: 'row_1',
    yardPosition: 'A01-01-01',
    yardColumns: ['A', 'B'],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
  {
    id: 'row_2',
    yardPosition: 'A02-01-01',
    yardColumns: [],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
  {
    id: 'row_3',
    yardPosition: 'B01-01-01',
    yardColumns: ['A', 'B', 'H'],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
  {
    id: 'row_4',
    yardPosition: 'B02-01-01',
    yardColumns: [],
    totalCount: '',
    minStorageDays: '',
    maxStorageDays: '',
  },
]);

const formData = reactive<EmptyContainerControlApi.subPlanVO>({
  id: null,
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

const selectContainerArea = () => {
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
  schema: subPlanFormSchema(),
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

    if (!formData.planType) {
      formData.planType = 'SUB';
    }

    const ownerList = formValues.owners
      ? formValues.owners
          .split(/[,，]/)
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

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

    // 构建符合接口格式的数据
    const data: EmptyContainerControlApi.subPlanVO = {
      ...formData,
      ownerList,
      isoNoList,
      bayRangeList,
    } as EmptyContainerControlApi.subPlanVO;

    await (formData?.id ? updateSubPlan(data) : createSubPlan(data));

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

      const subPlanData = data.acceptancePlanRespVO || data;
      Object.assign(formData, subPlanData);

      if (data.planType) {
        formData.planType = data.planType;
      }
      if (data.mainId) {
        formData.mainId = data.mainId;
      }

      if (subPlanData?.id) {
        modalApi.lock();
        try {
          await formApi.setValues(subPlanData);
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
            } else if (subPlanData.bayRangeList) {
              // 如果是数组格式
              if (Array.isArray(subPlanData.bayRangeList)) {
                for (const bayRange of subPlanData.bayRangeList) {
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
                // 兼容单个对象格式
                await $grid.insertAt(
                  {
                    yardPosition: subPlanData.bayRangeList.yardBay || '',
                    yardColumns: subPlanData.bayRangeList.yardRaw
                      ? subPlanData.bayRangeList.yardRaw.split(',')
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
        // 新创建的子计划，确保planType为SUB
        formData.planType = 'SUB';
      }
    }
  },
});

const modalTitle = computed(() => {
  return formData.id
    ? $t('ui.actionTitle.edit', ['子计划'])
    : $t('ui.actionTitle.create', ['子计划']);
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
      @confirm="handleContainerAreaConfirm"
    />
  </Modal>
</template>
