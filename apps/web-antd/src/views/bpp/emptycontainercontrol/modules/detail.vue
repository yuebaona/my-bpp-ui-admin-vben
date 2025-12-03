<script lang="ts" setup>
// import type { UploadProps } from 'ant-design-vue';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/emptycontainercontrol';

import { computed, reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Select } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { containerAreaRangeColumns, subPlanDetailSchema } from '../data';

// const emit = defineEmits(['success']);
// const fileList = ref<UploadProps['fileList']>([]);

// const containerAreaModalVisible = ref(false);

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
  id: '',
  ownerList: [],
  isoNoList: [],
  isRelease: false,
  pickupPlanNo: '',
  tradeType: '',
  planQuantity: '',
  completedReleaseQuantity: '',
  bayRangeList: {
    emptyContainerControlId: 0,
    id: 0,
    yardBay: '',
    yardRaw: '',
  },
  // bayRangeList: [],
  planType: '',
  mainId: '',
  planNo: '',
});

// const selectContainerArea = () => {
//   containerAreaModalVisible.value = true;
// };
//
// const handleContainerAreaConfirm = (positions: string[]) => {
//   const $grid = gridApi.grid;
//   if ($grid) {
//     // 清空现有数据
//     containerAreaData.splice(0);
//
//     // 添加新选择的数据
//     const newRows = positions.map((pos, index) => ({
//       id: `row_${Date.now()}_${index}`,
//       yardPosition: `${pos}-01`, // 假设默认层号为01
//       yardColumns: [],
//       totalCount: '',
//       minStorageDays: '',
//       maxStorageDays: '',
//     }));
//
//     containerAreaData.push(...newRows);
//     $grid.reloadData(containerAreaData);
//   }
// };

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
  schema: subPlanDetailSchema(),
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
  showConfirmButton: false,
  showCancelButton: false,
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
        // bayRangeList: {
        //   emptyContainerControlId: 0,
        //   yardBay: '',
        //   yardRaw: '',
        // },
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

          // 设置箱区范围数据
          if (data.yardPositionResp) {
            const $grid = gridApi.grid;
            if ($grid) {
              for (const item of data.yardPositionResp) {
                await $grid.insertAt(
                  {
                    ...item,
                    id: `row_${item.id}`, // 确保ID格式正确
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
  return '子计划详情';
});
</script>

<template>
  <Modal :title="modalTitle">
    <Form>
      <!-- 箱区范围表格部分 -->
      <template #containerAreaRange>
        <div class="mt-4 w-full">
          <div class="mb-2 flex items-center gap-2">
            <!--            <span class="font-medium">箱区范围</span>-->
            <!--            <Button type="primary" @click="selectContainerArea">-->
            <!--              选择箱区范围-->
            <!--            </Button>-->
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
              <!--              <template #actions="{ row }">-->
              <!--                <TableAction-->
              <!--                  :actions="[-->
              <!--                    {-->
              <!--                      label: '删除',-->
              <!--                      type: 'link',-->
              <!--                      danger: true,-->
              <!--                      onClick: () => deleteRow(row),-->
              <!--                    },-->
              <!--                  ]"-->
              <!--                />-->
              <!--              </template>-->
            </Grid>
          </div>
        </div>
      </template>
    </Form>
    <!-- 添加箱区选择弹窗组件 -->
    <!--    <ContainerArea-->
    <!--      v-model:visible="containerAreaModalVisible"-->
    <!--      @confirm="handleContainerAreaConfirm"-->
    <!--    />-->
  </Modal>
</template>
