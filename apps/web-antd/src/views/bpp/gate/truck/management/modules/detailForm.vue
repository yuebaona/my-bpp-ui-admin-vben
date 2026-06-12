<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TruckApi } from '#/api/bpp/flow/gate/truck/management';

import { computed, reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createTruck,
  getTruck,
  updateTruck,
} from '#/api/bpp/flow/gate/truck/management';

import { detailFormSchema, restrictionColumns } from '../data';
import RestrictionInfo from './restrictionInfo.vue';

// 定义表单模式
type FormMode = 'create' | 'edit' | 'view';

const props = defineProps<{
  mode?: FormMode;
  rowData?: null | TruckApi.Truck;
  truckId?: string;
}>();

const emit = defineEmits(['success']);

// 当前表单模式
const currentMode = computed<FormMode>(() => props.mode || 'view');

const isSubmitting = ref(false);
const loading = ref(false);

// 初始化表单
const initFormData = () => ({
  id: '',
  trkGkey: '',
  fltCd: '',
  trkNo: '',
  trkLicNo: '',
  engNo: '',
  licExpDt: '',
  trailerNo: '',
  trailerLicNo: '',
  trkWtKg: 0,
  maxLoadWtKg: 0,
  trkLenM: 0,
  trkWidM: 0,
  trkColor: '',
  trkOwnrNm: '',
  trkOwnrPh: '',
  trkOwnrId: '',
  hazLic: '',
  attachDt: '',
  autoFlg: 1,
  rfidNo: '',
  etcNo: '',
  inspDt: '',
  inspBy: '',
  remark: '',
  enableFlg: 1,
  dataSrc: '业务处理平台',
  createTime: '',
  updateTime: '',
});

const formData = reactive<TruckApi.Truck>(initFormData());

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: detailFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-4',
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: restrictionColumns(),
    height: '150px',
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
  } as VxeTableGridOptions<any>,
});

const [RestrictionInfoFormModal, restrictionInfoFormModalApi] = useVbenModal({
  connectedComponent: RestrictionInfo,
  destroyOnClose: true,
  draggable: true,
  zIndex: 2000,
});

// 时间戳转换为日期
const formatTimestamps = (rowData: any) => {
  if (!rowData) return rowData;
  const data = { ...rowData };
  if (data.licExpDt)
    data.licExpDt = dayjs(data.licExpDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.attachDt)
    data.attachDt = dayjs(data.attachDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.inspDt)
    data.inspDt = dayjs(data.inspDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.createTime)
    data.createTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss');
  if (data.updateTime)
    data.updateTime = dayjs(data.updateTime).format('YYYY-MM-DD HH:mm:ss');
  return data;
};

// 根据模式更新表单字段是否可编辑
const updateFormDisabled = (disabled: boolean) => {
  const schema = detailFormSchema();
  const updated = schema
    .filter((field) => field.fieldName)
    .map((field) => ({
      fieldName: field.fieldName!,
      componentProps: {
        disabled: disabled ? true : (field.componentProps?.disabled ?? false),
      },
    }));
  formApi.updateSchema(updated);
};

// 监听模式
watch(
  () => props.mode,
  async (newMode) => {
    try {
      switch (newMode) {
        case 'create': {
          Object.assign(formData, initFormData());
          await updateFormDisabled(false);
          if (formApi) {
            await formApi.setValues(formData);
          }
          break;
        }
        case 'edit': {
          await updateFormDisabled(false);
          break;
        }
        case 'view': {
          await updateFormDisabled(true);
          break;
        }
      }
    } catch (error) {
      console.error('DetailForm mode watcher error:', error);
    }
  },
);

// 监听行数据
watch(
  () => props.rowData,
  async (newRow) => {
    if (currentMode.value === 'edit' && newRow) {
      Object.assign(formData, newRow);
      await formApi.setValues(formData);
    }
  },
);

// 监听车辆ID，加载详情
watch(
  () => props.truckId,
  async (newId, oldId) => {
    if (!newId || newId === oldId) {
      return;
    }
    await loadTruckDetail(newId);
  },
  { immediate: false },
);

// 加载车辆信息详情
const loadTruckDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await getTruck(Number(id));
    const formatted = formatTimestamps(res);
    Object.assign(formData, formatted);
    await updateFormDisabled(true);
    await formApi.setValues(formData);

    if (res?.id) {
      const $grid = gridApi.grid;
      if (
        $grid &&
        res.restrictionInfoList &&
        Array.isArray(res.restrictionInfoList)
      ) {
        const tableData = res.restrictionInfoList.map(
          (item: any, index: number) => ({
            id: item.id || `item_${index}`,
            fleetName: item.fleetName || formData.fltCd || '',
            licensePlate: item.licensePlate || '',
            driverName: item.driverName || '',
            restrictionReason: item.restrictionReason || '',
            restrictStartTime: item.restrictStartTime || '',
            restrictEndTime: item.restrictEndTime || '',
            lastRestrictTimeTotal: item.lastRestrictTimeTotal || '',
            createTime: item.createTime || '',
            restrictReleaseTime: item.restrictReleaseTime || '',
          }),
        );
        await $grid.reloadData(tableData);
      }
    }
  } catch {
    message.error('获取详情失败');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, initFormData());
};

/** 保存 */
const handleSave = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const formValues = await formApi.getValues();
    Object.assign(formData, formValues);

    if (currentMode.value === 'create') {
      await createTruck(formData);
      message.success('新增成功');
    } else if (currentMode.value === 'edit') {
      await updateTruck(formData);
      message.success('更新成功');
    }

    emit('success');
    resetForm();
    await formApi.setValues({});
  } catch (error) {
    message.error('保存失败，请重试');
    console.error('Save error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

/** 新增限制 */
const handleRestriction = async (row: TruckApi.Truck) => {
  restrictionInfoFormModalApi
    .setData({
      truckData: formData,
      onSubmit: async () => {
        const $grid = gridApi.grid;
        if ($grid) {
          await $grid.reloadData([]);
          message.success('新增限制信息成功');
        }
      },
    })
    .open();
};

/** 加载详情 */
const loadDetail = async (id: string) => {
  await loadTruckDetail(id);
};

/** 清空表单 */
const clearForm = () => {
  Object.assign(formData, initFormData());
  formApi.setValues({});
};

defineExpose({ handleSave, loadDetail, clearForm });
</script>

<template>
  <div class="max-h-[450px] overflow-y-auto bg-white p-4">
    <RestrictionInfoFormModal />

    <!-- 加载中 -->
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div class="ant-spin ant-spin-sm"></div>
    </div>

    <Form>
      <template #isRstr>
        <div class="flex items-center gap-2">
          <span class="text-gray-800">
            {{
              String(formData?.isRstr) === '1'
                ? 'Y'
                : String(formData?.isRstr) === '0'
                  ? 'N'
                  : '-'
            }}
          </span>
          <Button type="primary" size="small" @click="handleRestriction">
            已限制明细
          </Button>
        </div>
      </template>
    </Form>
  </div>
</template>
