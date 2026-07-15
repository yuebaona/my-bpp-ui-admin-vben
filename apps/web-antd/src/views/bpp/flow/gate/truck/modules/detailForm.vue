<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { TruckViewApi } from '#/api/bpp/flow/gate/truck/index.ts';

import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createTruck,
  getTruck,
  updateTruck,
} from '#/api/bpp/flow/gate/truck/index.ts';

import { detailFormSchema, restrictionColumns } from '../data';
import RestrictionInfo from './restrictionInfo.vue';

// 定义表单模式
type FormMode = 'create' | 'edit' | 'view';

const props = defineProps<{
  mode?: FormMode;
  rowData?: null | TruckViewApi.Truck;
  truckId?: string;
}>();

const emit = defineEmits(['success']);

// 当前表单模式
const currentMode = computed<FormMode>(() => props.mode || 'view');

const isSubmitting = ref(false);
const loading = ref(false);

const dataBeforeEdit = ref<Record<string, any>>({});
const changedFields = ref<Set<string>>(new Set());

let checkTimer: ReturnType<typeof setInterval> | null = null;

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

const formData = reactive<TruckViewApi.Truck>(initFormData());

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

const applyFormState = (disabled: boolean) => {
  const schema = detailFormSchema();
  const updated = schema
    .filter((field) => field.fieldName)
    .map((field) => ({
      ...field,
      formItemClass: [field.formItemClass, changedFields.value.has(field.fieldName!) ? 'field-changed' : '']
        .filter(Boolean)
        .join(' '),
      componentProps: {
        ...field.componentProps,
        disabled: disabled ? true : (field.componentProps?.disabled ?? false),
      },
    }));
  formApi.updateSchema(updated);
};

const saveDataBeforeEdit = () => {
  dataBeforeEdit.value = { ...formData };
  changedFields.value = new Set();
};

const hasUnsavedChanges = () => changedFields.value.size > 0;

const clearChangedFields = () => {
  changedFields.value = new Set();
  dataBeforeEdit.value = {};
};

const checkHighlight = async () => {
  if (currentMode.value !== 'edit' && currentMode.value !== 'create') return;
  let vals: any;
  try {
    vals = await formApi.getValues();
  } catch {
    return;
  }
  const before = dataBeforeEdit.value;
  const fields = new Set<string>();
  for (const key of Object.keys(vals)) {
    if (vals[key] != before[key]) {
      fields.add(key);
    }
  }
  const prev = [...changedFields.value].sort().join(',');
  const next = [...fields].sort().join(',');
  if (prev === next) return;
  changedFields.value = fields;

  if (currentMode.value === 'edit') {
    const schema = detailFormSchema();
    const updated = schema
      .filter((f) => f.fieldName)
      .map((f) => ({
        ...f,
        formItemClass: [f.formItemClass, fields.has(f.fieldName!) ? 'field-changed' : '']
          .filter(Boolean)
          .join(' '),
        componentProps: {
          ...f.componentProps,
          disabled: false,
        },
      }));
    formApi.updateSchema(updated);
  }
};

const doCheck = () => {
  checkHighlight().finally(() => {
    if (checkTimer !== null) {
      checkTimer = setTimeout(doCheck, 150);
    }
  });
};

const startChecking = () => {
  stopChecking();
  checkTimer = setTimeout(doCheck, 0);
};

const stopChecking = () => {
  if (checkTimer) {
    clearTimeout(checkTimer);
    checkTimer = null;
  }
};

onBeforeUnmount(stopChecking);

/** 模式切换 */
watch(
  () => props.mode,
  async (newMode) => {
    try {
      if (newMode === 'create') {
        stopChecking();
        Object.assign(formData, initFormData());
        if (formApi) {
          await formApi.setValues(formData);
        }
        saveDataBeforeEdit();
        applyFormState(false);
        startChecking();
      } else if ((newMode === 'edit' || newMode === 'view') && props.rowData) {
        stopChecking();
        const rowData = formatTimestamps(props.rowData);
        Object.assign(formData, rowData);
        if (formApi) {
          await formApi.setValues(formData);
        }
        if (newMode === 'edit') {
          saveDataBeforeEdit();
          applyFormState(false);
          startChecking();
        } else {
          clearChangedFields();
          applyFormState(true);
        }
      }
    } catch (error) {
      console.error('DetailForm mode watcher error:', error);
    }
  },
);

/** 监听行数据 */
watch(
  () => props.rowData,
  async (newRow) => {
    if (!newRow || currentMode.value === 'create') return;
    stopChecking();
    const rowData = formatTimestamps(newRow);
    Object.assign(formData, rowData);
    if (formApi) {
      await formApi.setValues(formData);
    }
    clearChangedFields();
    applyFormState(true);
  },
);

/** 加载车辆信息详情（新增后） */
const loadTruckDetail = async (id: string) => {
  loading.value = true;
  stopChecking();
  try {
    const res = await getTruck(Number(id));
    const formatted = formatTimestamps(res);
    Object.assign(formData, formatted);
    await formApi.setValues(formData);
    clearChangedFields();
    applyFormState(true);
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
      const result = await createTruck(formData);
      const newId = result?.id ?? (formData as any).id ?? '';
      message.success('新增成功');
      emit('success', newId);
    } else if (currentMode.value === 'edit') {
      await updateTruck(formData);
      message.success('更新成功');
      emit('success', formData.id);
    }
  } catch (error) {
    message.error('保存失败，请重试');
    console.error('Save error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

/** 新增限制 */
const handleRestriction = async (row: TruckViewApi.Truck) => {
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

/** 清空表单 */
const clearForm = () => {
  stopChecking();
  Object.assign(formData, initFormData());
  clearChangedFields();
  formApi.setValues(formData);
};

defineExpose({ handleSave, clearForm, hasUnsavedChanges, loadTruckDetail });
</script>

<template>
  <div class="max-h-[450px] overflow-y-auto bg-white p-4">
    <RestrictionInfoFormModal />

    <!-- 加载中 -->
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div class="ant-spin ant-spin-sm"></div>
    </div>

    <Form>
      <template #fltIsRstr>
        <span class="text-gray-800">
          {{
            String(formData?.fltIsRstr) === '1'
              ? 'Y'
              : String(formData?.fltIsRstr) === '0'
                ? 'N'
                : '-'
          }}
        </span>
      </template>
      <template #rstrCnt>
        <span class="text-gray-800">
          {{ formData?.rstrCnt == null || formData?.rstrCnt === '' ? '-' : formData.rstrCnt }}
        </span>
      </template>
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
      <template #rstrDataSrc>
        <span class="text-gray-800">
          {{ formData?.rstrDataSrc == null || formData?.rstrDataSrc === '' ? '-' : formData.rstrDataSrc }}
        </span>
      </template>
      <template #rstrStartDt>
        <span class="text-gray-800">
          {{ formData?.rstrStartDt == null || formData?.rstrStartDt === '' ? '-' : formData.rstrStartDt }}
        </span>
      </template>
      <template #rstrEndDt>
        <span class="text-gray-800">
          {{ formData?.rstrEndDt == null || formData?.rstrEndDt === '' ? '-' : formData.rstrEndDt }}
        </span>
      </template>
      <template #lastRstrDt>
        <span class="text-gray-800">
          {{ formData?.lastRstrDt == null || formData?.lastRstrDt === '' ? '-' : formData.lastRstrDt }}
        </span>
      </template>
      <template #rstrRsn>
        <span class="text-gray-800">
          {{ formData?.rstrRsn == null || formData?.rstrRsn === '' ? '-' : formData.rstrRsn }}
        </span>
      </template>
      <template #dataSrc>
        <span class="text-gray-800">
          {{ formData?.dataSrc == null || formData?.dataSrc === '' ? '-' : formData.dataSrc }}
        </span>
      </template>
      <template #createTime>
        <span class="text-gray-800">
          {{ formData?.createTime == null || formData?.createTime === '' ? '-' : formData.createTime }}
        </span>
      </template>
      <template #updateTime>
        <span class="text-gray-800">
          {{ formData?.updateTime == null || formData?.updateTime === '' ? '-' : formData.updateTime }}
        </span>
      </template>
    </Form>
  </div>
</template>

<style scoped>
:deep(.field-changed) .ant-input,
:deep(.field-changed) .ant-picker,
:deep(.field-changed) .ant-input-affix-wrapper {
  background-color: rgba(253, 230, 138, 0.3) !important;
  border-color: #fbbf24 !important;
}
:deep(.field-changed) .ant-select-selector {
  background-color: rgba(253, 230, 138, 0.3) !important;
  border-color: #fbbf24 !important;
}
</style>
