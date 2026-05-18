<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { createMainPlan } from '#/api/bpp/empty/container/control';
import * as FleetManagementApi from '#/api/bpp/base/gate/fleet';
import { $t } from '#/locales';
import { debounce } from '#/views/bpm/components/bpmn-process-designer/src/utils';
import RestrictionInfo from '#/views/bpp/gate/fleet/management/modules/restrictionInfo.vue';

import { editFormSchema, restrictionColumns } from '../data';

const emit = defineEmits(['success']);

const isSubmitting = ref(false);

const containerAreaData = reactive<any[]>([]);

const formData = reactive<FleetManagementApi.fleetVO>({
  id: '',
  fleetCode: '',
  fleetCnName: '',
  fleetPhone: '',
  fleetShortName: '',
  fleetAddress: '',
  restrictedCount: undefined,
  isRestricted: undefined,
  restrictionReason: '',
  restrictInfoSource: '',
  restrictStartTime: '',
  restrictEndTime: '',
  lastRestrictTimeTotal: undefined,
  legalPersonName: '',
  legalPersonPhone: '',
  safetyPersonName: '',
  safetyPerson: '',
  safetyPersonPhone: '',
  businessPersonName: '',
  responsiblePerson: '',
  outerTruckAnnualReviewNo: '',
  wharfRemark: '',
  createSource: '',
  createTime: '',
  updateTime: '',
  isValid: '',
});

// 解除限制
const handleReleaseRestriction = async (row: any) => {
  const $grid = gridApi.grid;
  if ($grid) {
    const currentGridData = $grid.getTableData().fullData;

    containerAreaData.splice(0);
    const dataIndex = currentGridData.findIndex(
      (item) => item.yardPosition === row.yardPosition,
    );
    if (dataIndex !== -1) {
      currentGridData.splice(dataIndex, 1);
    }

    containerAreaData.push(...currentGridData);
    $grid.reloadData(containerAreaData);
    formData.bayRangeList = containerAreaData.map((item) => ({
      yardBay: item.yardPosition,
      yardRaw:
        item.yardRaw || (item.yardColumns ? item.yardColumns.join(',') : ''),
      ...item,
    }));

    $grid.clearFilter();
  }
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
  schema: editFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values, changedValues) => {
    Object.assign(formData, values);

    // if (
    //   (isChangeContIso || isChangeOwner || isChangeTradeType) &&
    //   !formData.id
    // ) {
    //   containerAreaData.splice(0);
    //   formData.bayRangeList = [];
    //   const $grid = gridApi.grid;
    //   if ($grid) {
    //     $grid.reloadData([]);
    //   }
    // }
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: restrictionColumns(),
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

// 表单提交实现防抖
const debouncedConfirm = debounce(async () => {
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;

  try {
    // 表单验证
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    // 提交逻辑...
    // 获取表单值并同步到formData
    const formValues = await formApi.getValues();
    Object.assign(formData, formValues);

    // 处理限制信息数据
    const $grid = gridApi.grid;
    if ($grid) {
      const gridData = $grid.getTableData().fullData;
      // 这里可以根据实际需要处理表格数据
      // 例如将表格数据转换为后端需要的格式
      formData.restrictionInfoList = gridData.map((row: any) => ({
        id: row.id,
        restrictionReason: row.restrictionReason || '',
        restrictStartTime: row.restrictStartTime || '',
        restrictEndTime: row.restrictEndTime || '',
        restrictInfoSource: row.restrictInfoSource || '',
        createAccount: row.createAccount || '',
        lastRestrictTimeTotal: row.lastRestrictTimeTotal || '',
      }));
    }

    // 提交数据
    await createMainPlan(formData);
    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  } catch (error) {
    message.error('提交失败，请重试');
    console.error('Submit error:', error);
  } finally {
    isSubmitting.value = false;
  }
}, 300);

const [RestrictionInfoFormModal, restrictionInfoFormModalApi] = useVbenModal({
  connectedComponent: RestrictionInfo,
  destroyOnClose: true,
  draggable: true,
  zIndex: 6000,
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onConfirm: debouncedConfirm,
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        id: undefined,
        fleetCode: '',
        fleetCnName: '',
        fleetPhone: '',
        fleetShortName: '',
        fleetAddress: '',
        restrictedCount: 0,
        isRestricted: false,
        restrictionReason: '',
        restrictInfoSource: '',
        restrictStartTime: '',
        restrictEndTime: '',
        lastRestrictTimeTotal: 0,
        legalPersonName: '',
        legalPersonPhone: '',
        safetyPersonName: '',
        safetyPerson: '',
        safetyPersonPhone: '',
        businessPersonName: '',
        responsiblePerson: '',
        outerTruckAnnualReviewNo: '',
        wharfRemark: '',
        createSource: '',
        createTime: '',
        updateTime: '',
        isValid: '1',
      });
    }
  },
});

/** 新增线下限制 */
const handleRestriction = async (row: FleetManagementApi.fleetVO) => {
  // 打开新增线下限制弹窗，传递一个回调函数用于接收新增的限制数据
  restrictionInfoFormModalApi
    .setData({
      onSubmit: (restrictionData: any) => {
        // 将新增的限制信息添加到表格中
        const $grid = gridApi.grid;
        if ($grid) {
          const newRow = {
            id: `new_${Date.now()}`,
            yardPosition: restrictionData.yardPosition || '',
            yardColumns: restrictionData.yardColumns || [],
            totalCount: restrictionData.totalCount || '',
            minDays: restrictionData.minDays || '',
            maxDays: restrictionData.maxDays || '',
            isNew: true,
            restrictionReason: restrictionData.restrictionReason || '',
            restrictStartTime: restrictionData.restrictStartTime || '',
            restrictEndTime: restrictionData.restrictEndTime || '',
            restrictInfoSource: restrictionData.restrictInfoSource || '',
            createAccount: restrictionData.createAccount || '',
            lastRestrictTimeTotal: restrictionData.lastRestrictTimeTotal || '',
          };
          containerAreaData.push(newRow);
          $grid.reloadData(containerAreaData);
        }
      },
    })
    .open();
};
</script>

<template>
  <div>
    <RestrictionInfoFormModal />
    <Modal title="编辑车队信息">
      <Form>
        <template #restrictionDetail>
          <div class="mt-4 w-full">
            <div class="mb-2 flex items-center gap-2">
              <span class="font-small">已限制明细</span>
              <Button type="primary" @click="handleRestriction">
                新增线下限制
              </Button>
            </div>
            <div class="table-container">
              <Grid>
                <template #actions="{ row }">
                  <TableAction
                    :actions="[
                      {
                        label: '解除限制',
                        type: 'link',
                        onClick: handleReleaseRestriction.bind(null, row),
                      },
                    ]"
                  />
                </template>
              </Grid>
            </div>
          </div>
        </template>
      </Form>
    </Modal>
  </div>
</template>
