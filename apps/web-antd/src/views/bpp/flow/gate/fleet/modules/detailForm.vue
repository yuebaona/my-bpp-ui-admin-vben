<script lang="ts" setup>
import type { FleetViewApi } from '#/api/bpp/flow/gate/fleet';

import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {saveFleet, getFleetDetail} from '#/api/bpp/flow/gate/fleet'

import { getRestrictionCodeList } from '#/api/bpp/flow/gate/truck/rstr';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';

import { detailFormSchema } from '../data';
import RestrictionInfo from './restrictionInfo.vue';

type FormMode = 'create' | 'edit' | 'view';

const props = defineProps<{
  fleetId?: string;
  mode?: FormMode;
  rowData?: FleetViewApi.fleetVO | null;
}>();

const emit = defineEmits(['success']);

const currentMode = computed<FormMode>(() => props.mode || 'view');

const isSubmitting = ref(false);
const loading = ref(false);

const dataBeforeEdit = ref<Record<string, any>>({});
const changedFields = ref<Set<string>>(new Set());

let checkTimer: ReturnType<typeof setInterval> | null = null;

const initFormData = () => ({
  id: '',
  fltCd: '',
  fltNm: '',
  fltShortNm: '',
  fltAddr: '',
  enableFlg: 1,
  rstrCnt: 0,
  isRstr: 0,
  rstrReason: '',
  rstrDataSrc: '',
  rstrStartDt: '',
  rstrEndDt: '',
  lastRstrDt: '',
  legalNm: '',
  legalPh: '',
  safetyNm: '',
  safetyPh: '',
  bizNm: '',
  bizPh: '',
  bizRegNo: '',
  otrAuditNo: '',
  portRm: '',
  dataSrc: '业务处理平台',
  createTime: '',
  updateTime: '',
});

const formData = reactive<FleetViewApi.fleetVO>(initFormData());

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

const [RestrictionInfoFormModal, restrictionInfoFormModalApi] = useVbenModal({
  connectedComponent: RestrictionInfo,
  destroyOnClose: true,
  draggable: true,
  zIndex: 2000,
});

const {
  state: rstrReasonState,
  search: rstrReasonSearch,
  handleInput: handleRstrReasonInput,
  handleCompositionStart: handleRstrReasonCompositionStart,
  handleCompositionEnd: handleRstrReasonCompositionEnd,
} = useSearchSelect({
  searchApi: async () => {
    return await getRestrictionCodeList();
  },
  labelField: 'rstrRsn',
  valueField: 'rstrRsn',
  errorMessage: '获取限制代码失败',
  toUpperCase: true,
  filterRegex: /[^A-Z0-9]/g,
});

const handleRstrReasonChange = async (value: any) => {
  rstrReasonState.value = value;
  (formData as any).rstrReason = value;
  await formApi.setFieldValue('rstrReason', value);
  await formApi.validateField('rstrReason');
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
  dataBeforeEdit.value = { ...formData, rstrReason: rstrReasonState.value };
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
  if (rstrReasonState.value != before.rstrReason) {
    fields.add('rstrReason');
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

const formatTimestamps = (rowData: any) => {
  if (!rowData) return rowData;
  const data = { ...rowData };
  if (data.rstrStartDt)
    data.rstrStartDt = dayjs(data.rstrStartDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrEndDt)
    data.rstrEndDt = dayjs(data.rstrEndDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrLastDt)
    data.rstrLastDt = dayjs(data.rstrLastDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.createTime)
    data.createTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss');
  if (data.updateTime)
    data.updateTime = dayjs(data.updateTime).format('YYYY-MM-DD HH:mm:ss');
  return data;
};

watch(
  () => props.mode,
  async (newMode) => {
    try {
      if (newMode === 'create') {
        stopChecking();
        rstrReasonState.value = '';
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
        rstrReasonState.value = (rowData as any).rstrReason ?? '';
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
  { immediate: true },
);

const loadFleetDetail = async (id: number) => {
  loading.value = true;
  stopChecking();
  try {
    const res = await getFleetDetail(id);
    const formatted = formatTimestamps(res);
    rstrReasonState.value = (formatted as any).rstrReason ?? '';
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

watch(
  () => props.fleetId,
  async (newId, oldId) => {
    if (!newId || newId === oldId) {
      return;
    }
    await loadFleetDetail(newId);
  },
  { immediate: true },
);

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
      await saveFleet(formData);
      message.success('新增成功');
    } else if (currentMode.value === 'edit') {
      await saveFleet(formData);
      message.success('更新成功');
    }

    emit('success');
    resetForm();
    clearChangedFields();
    stopChecking();
    await formApi.setValues({});
  } catch (error) {
    message.error('保存失败，请重试');
    console.error('Save error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleRestriction = async () => {
  restrictionInfoFormModalApi
    .setData({
      fleetData: formData,
      onSubmit: async () => {
        message.success('新增限制信息成功');
      },
    })
    .open();
};

const loadDetail = async (id: number) => {
  await loadFleetDetail(id);
};

const clearForm = () => {
  stopChecking();
  rstrReasonState.value = '';
  Object.assign(formData, initFormData());
  clearChangedFields();
  formApi.setValues(formData);
};

const resetForm = () => {
  Object.assign(formData, initFormData());
};

defineExpose({ handleSave, loadDetail, clearForm, hasUnsavedChanges });
</script>

<template>
  <div class="max-h-[450px] overflow-y-auto bg-white p-4">
    <RestrictionInfoFormModal />

    <div v-if="loading" class="flex items-center justify-center py-4">
      <div class="ant-spin ant-spin-sm"></div>
    </div>

    <Form>
      <template #isRstr>
        <div class="flex items-center gap-2">
          <span class="text-gray-800">
            {{ String(formData?.isRstr) === '1' ? 'Y' : String(formData?.isRstr) === '0' ? 'N' : '-' }}
          </span>
          <Button type="primary" size="small" @click="handleRestriction">
            已限制明细
          </Button>
        </div>
      </template>
      <template #rstrCnt>
        <span class="text-gray-800">
          {{ formData?.rstrCnt == null || formData?.rstrCnt === '' ? '-' : formData.rstrCnt }}
        </span>
      </template>
      <template #rstrDataSrc>
        <span class="text-gray-800">
          {{ formData?.rstrDataSrc == null || formData?.rstrDataSrc === '' ? '-' : formData.rstrDataSrc }}
        </span>
      </template>
      <template #dataSrc>
        <span class="text-gray-800">
          {{ formData?.dataSrc == null || formData?.dataSrc === '' ? '-' : formData.dataSrc }}
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
      <template #rstrReason>
        <a-select
          v-model:value="rstrReasonState.value"
          :disabled="currentMode === 'view'"
          placeholder="请输入限制代码"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="rstrReasonState.fetching ? undefined : null"
          :options="rstrReasonState.data"
          allow-clear
          show-search
          @change="handleRstrReasonChange"
          @input="handleRstrReasonInput"
          @search="rstrReasonSearch"
          @focus="rstrReasonSearch('')"
          @compositionstart="handleRstrReasonCompositionStart"
          @compositionend="handleRstrReasonCompositionEnd"
        />
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
