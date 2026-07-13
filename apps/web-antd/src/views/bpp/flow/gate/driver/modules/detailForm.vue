<script lang="ts" setup>
import type { DriverApi } from '#/api/bpp/flow/gate/driver/manager';

import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createDriver,
  getDriver,
  updateDriver,
} from '#/api/bpp/flow/gate/driver/manager';
import { getRestrictionCodeList } from '#/api/bpp/flow/gate/driver/rstr';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';

import { detailFormSchema } from '../data';
import RestrictionInfo from './restrictionInfo.vue';

/** 定义表单模式 */
type FormMode = 'create' | 'edit' | 'view';

const props = defineProps<{
  driverId?: string;
  mode?: FormMode;
  rowData?: DriverApi.driverVO | null;
}>();

const emit = defineEmits(['success']);

/** 当前表单模式 */
const currentMode = computed<FormMode>(() => props.mode || 'view');

const isSubmitting = ref(false);
const loading = ref(false);

/** 编辑前的数据 */
const dataBeforeEdit = ref<Record<string, any>>({});

/** 编辑过的字段 */
const changedFields = ref<Set<string>>(new Set());

let checkTimer: ReturnType<typeof setInterval> | null = null;

/** 初始化表单 */
const initFormData = () => ({
  id: '',
  dvrCd: '',
  dvrNm: '',
  dvrPh: '',
  enableFlg: 1,
  idNo: '',
  dvrLicNo: '',
  fltCd: '',
  fltNm: '',
  fltRstrFlg: 0,
  trkNo: '',
  trkRstrFlg: 0,
  isRstr: 0,
  rstrCnt: 0,
  rstrRsn: '',
  dataSrc: '',
  rstrStartDt: '',
  rstrEndDt: '',
  lastRstrDt: 0,
  remark: '',
});

const formData = reactive<DriverApi.driverVO>(initFormData());

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

/** 限制代码搜索选择器 */
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

/** 限制代码选择器值变化处理 */
const handleRstrReasonChange = async (value: any) => {
  rstrReasonState.value = value;
  (formData as any).rstrRsn = value;
  await formApi.setFieldValue('rstrRsn', value);
  await formApi.validateField('rstrRsn');
};

/** 更新表单禁用状态与变更标黄 */
const applyFormState = (disabled: boolean) => {
  const schema = detailFormSchema();
  const updated = schema
    .filter((field) => field.fieldName)
    .map((field) => ({
      ...field,
      formItemClass: [field.formItemClass, changedFields.value.has(field.fieldName!) ? 'field-changed' : ''].filter(Boolean).join(' '),
      componentProps: {
        ...field.componentProps,
        disabled: disabled ? true : (field.componentProps?.disabled ?? false),
      },
    }));
  formApi.updateSchema(updated);
};

/** 保存编辑前的数据，用于对比标黄 */
const saveDataBeforeEdit = () => {
  dataBeforeEdit.value = { ...formData, rstrRsn: rstrReasonState.value };
  changedFields.value = new Set();
};

/** 是否有未保存的更改 */
const hasUnsavedChanges = () => changedFields.value.size > 0;

/** 清除编辑记录 */
const clearChangedFields = () => {
  changedFields.value = new Set();
  dataBeforeEdit.value = {};
};

/** 定时检查字段变化并标黄 */
const checkHighlight = async () => {
  if (currentMode.value !== 'edit' && currentMode.value !== 'create') return;
  let vals: any;
  try {
    vals = await formApi.getValues();
  } catch (e) {
    return;
  }
  const before = dataBeforeEdit.value;
  const fields = new Set<string>();
  for (const key of Object.keys(vals)) {
    if (vals[key] != before[key]) {
      fields.add(key);
    }
  }
  if (rstrReasonState.value != before.rstrRsn) {
    fields.add('rstrRsn');
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
        formItemClass: [f.formItemClass, fields.has(f.fieldName!) ? 'field-changed' : ''].filter(Boolean).join(' '),
        componentProps: {
          ...f.componentProps,
          disabled: false,
        },
      }));
    formApi.updateSchema(updated);
  }
};

/** 定时执行检查 */
const doCheck = () => {
  checkHighlight().finally(() => {
    if (checkTimer !== null) {
      checkTimer = setTimeout(doCheck, 150);
    }
  });
};

/** 启动定时检查 */
const startChecking = () => {
  stopChecking();
  checkTimer = setTimeout(doCheck, 0);
};

/** 停止定时检查 */
const stopChecking = () => {
  if (checkTimer) {
    clearTimeout(checkTimer);
    checkTimer = null;
  }
};

onBeforeUnmount(stopChecking);

/** 格式化时间戳字段 */
const formatTimestamps = (rowData: any) => {
  if (!rowData) return rowData;
  const data = { ...rowData };
  if (data.rstrStartDt)
    data.rstrStartDt = dayjs(data.rstrStartDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrEndDt)
    data.rstrEndDt = dayjs(data.rstrEndDt).format('YYYY-MM-DD HH:mm:ss');
  return data;
};

/** 监听表单模式 */
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
        rstrReasonState.value = (rowData as any).rstrRsn ?? '';
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

/** 加载司机信息详情 */
const loadDriverDetail = async (id: string) => {
  loading.value = true;
  stopChecking();
  try {
    const res = await getDriver(Number(id));
    const formatted = formatTimestamps(res);
    rstrReasonState.value = (formatted as any).rstrRsn ?? '';
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

/** 监听司机ID，用于加载详情 */
watch(
  () => props.driverId,
  async (newId, oldId) => {
    if (!newId || newId === oldId) {
      return;
    }
    await loadDriverDetail(newId);
  },
  { immediate: true },
);

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
      const result = await createDriver(formData);
      const newId = result?.id ?? (formData as any).id ?? '';
      message.success('新增成功');
      emit('success', newId);
    } else if (currentMode.value === 'edit') {
      await updateDriver(formData);
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
const handleRestriction = async () => {
  restrictionInfoFormModalApi
    .setData({
      driverData: formData,
      onSubmit: async () => {
        message.success('新增限制信息成功');
      },
    })
    .open();
};

/** 加载详情 */
const loadDetail = async (id: string) => {
  await loadDriverDetail(id);
};

/** 清空表单 */
const clearForm = () => {
  stopChecking();
  rstrReasonState.value = '';
  Object.assign(formData, initFormData());
  clearChangedFields();
  formApi.setValues(formData);
};

/** 重置表单数据为初始值 */
const resetForm = () => {
  Object.assign(formData, initFormData());
};

defineExpose({ handleSave, loadDetail, clearForm, hasUnsavedChanges });
</script>

<template>
  <div class="max-h-[450px] overflow-y-auto bg-white p-4">
<!--  <div class="bg-white p-4">-->
    <RestrictionInfoFormModal />

    <!-- 加载中 -->
    <div v-if="loading" class="flex items-center justify-center py-4">
      <div class="ant-spin ant-spin-sm"></div>
    </div>

    <Form>
      <template #isRstr>
        <div class="flex items-center gap-2">
          <span class="text-gray-800">
            {{ formData?.isRstr == null ? '-' : (formData.isRstr ? 'Y' : 'N') }}
          </span>
          <Button type="primary" size="small" @click="handleRestriction">
            已限制明细
          </Button>
        </div>
      </template>
      <template #fltRstrFlg>
        <span class="text-gray-800">
          {{ formData?.fltRstrFlg == null ? '-' : (formData.fltRstrFlg ? '是' : '否') }}
        </span>
      </template>
      <template #trkRstrFlg>
        <span class="text-gray-800">
          {{ formData?.trkRstrFlg == null ? '-' : (formData.trkRstrFlg ? '是' : '否') }}
        </span>
      </template>
      <template #rstrCnt>
        <span class="text-gray-800">
          {{ formData?.rstrCnt == null || formData?.rstrCnt === '' ? '-' : formData.rstrCnt }}
        </span>
      </template>
      <template #rstrInfoSrc>
        <span class="text-gray-800">
          {{ formData?.rstrInfoSrc == null || formData?.rstrInfoSrc === '' ? '-' : formData.rstrInfoSrc }}
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
<!--      <template #enableFlg>-->
<!--        <a-select-->
<!--          v-model:value="formData.enableFlg"-->
<!--          :disabled="currentMode === 'view'"-->
<!--          :options="[{ label: '是', value: 1 }, { label: '否', value: 0 }]"-->
<!--          placeholder="请选择"-->
<!--          allow-clear-->
<!--          style="width: 100%"-->
<!--        />-->
<!--      </template>-->
      <template #rstrRsn>
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
