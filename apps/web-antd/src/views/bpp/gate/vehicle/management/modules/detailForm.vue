<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import * as VehicleManagementApi from '#/api/bpp/vehicle/management';
import { useDescription } from '#/components/description';
import { detailBasicSchema } from '#/views/bpp/gate/vehicle/management/data';
import RestrictionInfo from '#/views/bpp/gate/vehicle/management/modules/restrictionInfo.vue';

import { detailRestrictionSchema, restrictionColumns } from '../data';
const restrictionDetailData = reactive<any[]>([]);

const formData = reactive<VehicleManagementApi.vehicleVO>({
  id: '',
  vehicleCode: '',
  vehicleCnName: '',
  vehiclePhone: '',
  vehicleShortName: '',
  vehicleAddress: '',
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

const [BasicDescriptions] = useDescription({
  componentProps: {
    bordered: true,
    column: 2,
    size: 'small',
    // title: '基础信息',
  },
  // labelStyle: {
  //   textAlign: 'right',
  // },
  // contentStyle: {
  //   textAlign: 'left',
  // },
  schema: detailBasicSchema(),
});

const [RestrictionDescriptions] = useDescription({
  componentProps: {
    bordered: true,
    column: 2,
    size: 'small',
  },
  // labelStyle: {
  //   textAlign: 'right',
  // },
  // contentStyle: {
  //   textAlign: 'left',
  // },
  schema: detailRestrictionSchema(),
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
    // data: containerAreaData,
  } as VxeTableGridOptions<any>,
});

const [RestrictionInfoFormModal, restrictionInfoFormModalApi] = useVbenModal({
  connectedComponent: RestrictionInfo,
  destroyOnClose: true,
  draggable: true,
  width: 900,
  zIndex: 2000,
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  width: 900,  // 添加宽度配置
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        id: '',
        vehicleCode: '',
        vehicleCnName: '',
        vehiclePhone: '',
        vehicleShortName: '',
        vehicleAddress: '',
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
    }
    const data = await modalApi.getData<any>();

    if (data) {
      const vehicleData = data.vehicleVO || data;
      Object.assign(formData, vehicleData);

      if (vehicleData?.id) {
        modalApi.lock();
        try {
          const $grid = gridApi.grid;
          if (
            $grid &&
            vehicleData.restrictionInfoList &&
            Array.isArray(vehicleData.restrictionInfoList)
          ) {
            const tableData = vehicleData.restrictionInfoList.map(
              (item: any, index: number) => ({
                id: item.id || `item_${index}`,
                vehicleName: item.vehicleName || formData.vehicleCnName || '',
                vehicleNumber: item.vehicleNumber || '',
                driver: item.driver || '',
                restrictionReason: item.restrictionReason || '',
                restrictStartTime: item.restrictStartTime || '',
                restrictEndTime: item.restrictEndTime || '',
                lastRestrictTimeTotal: item.lastRestrictTimeTotal || '',
                createTime: item.createTime || '',
                removeRestrictTime: item.removeRestrictTime || '',
              }),
            );
            await $grid.reloadData(tableData);
          }
        } finally {
          modalApi.unlock();
        }
      } else {
        message.error('请重试');
      }
    }
  },
});

/** 新增线下限制 */
// const handleRestriction = async (row: VehicleManagementApi.vehicleVO) => {
//   // const res = await getVehicleById(row.id);
//   // restrictionInfoFormModalApi.setData(res).open();
//   restrictionInfoFormModalApi.setData(null).open();
// };

const handleRestriction = async (row: VehicleManagementApi.vehicleVO) => {
  restrictionInfoFormModalApi
    .setData({
      vehicleData: formData,
      onSubmit: async () => {
        const $grid = gridApi.grid;
        if ($grid) {
          await $grid.reloadData(restrictionDetailData);
          message.success('新增限制信息成功');
        }
      },
    })
    .open();
};
</script>

<template>
  <div>
    <RestrictionInfoFormModal />
    <Modal title="车辆信息详情">
      <div class="ant-descriptions-title my-5">基础信息</div>
      <BasicDescriptions :data="formData" :column="2" />
      <div>
        <div class="ant-descriptions-title my-5">限制信息</div>
        <RestrictionDescriptions :data="formData" :column="2" />
        <div class="flex items-center gap-2">
          <div class="ant-descriptions-title my-5">已限制明细</div>
          <Button type="primary" @click="handleRestriction">
            新增线下限制
          </Button>
        </div>
        <Grid />
      </div>
    </Modal>
  </div>
</template>
