<script lang="ts" setup>
import type { DriverApi } from '#/api/bpp/flow/gate/driver/manager';

import { computed, reactive, ref, watch } from 'vue';

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

// 定义表单模式
type FormMode = 'create' | 'edit' | 'view';

const props = defineProps<{
  driverId?: string;
  mode?: FormMode;
  rowData?: DriverApi.driverVO | null;
}>();

const emit = defineEmits(['success']);

// 当前表单模式
const currentMode = computed<FormMode>(() => props.mode || 'view');

const isSubmitting = ref(false);
const loading = ref(false);

// 初始化表单
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

// 限制代码搜索选择器
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

// 限制代码选择器值变化处理
const handleRstrReasonChange = async (value: any) => {
  rstrReasonState.value = value;
  await formApi.setFieldValue('rstrRsn', value);
  await formApi.validateField('rstrRsn');
};

// 根据模式更新表单字段是否可编辑
const updateFormDisabled = (disabled: boolean) => {
  const schema = detailFormSchema();
  const updated = schema
    .filter((field) => field.fieldName)
    .map((field) => ({
      ...field,
      componentProps: {
        ...field.componentProps,
        disabled: disabled ? true : (field.componentProps?.disabled ?? false),
      },
    }));
  formApi.updateSchema(updated);
};

// 时间戳转换为日期
const formatTimestamps = (rowData: any) => {
  if (!rowData) return rowData;
  const data = { ...rowData };
  if (data.rstrStartDt)
    data.rstrStartDt = dayjs(data.rstrStartDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrEndDt)
    data.rstrEndDt = dayjs(data.rstrEndDt).format('YYYY-MM-DD HH:mm:ss');
  return data;
};

// 监听表单模式
watch(
  () => props.mode,
  async (newMode) => {
    try {
      if (newMode === 'create') {
        // 新增模式
        rstrReasonState.value = '';
        Object.assign(formData, initFormData());
        await updateFormDisabled(false);
        if (formApi) {
          await formApi.setValues(formData);
        }
      } else if ((newMode === 'edit' || newMode === 'view') && props.rowData) {
        // 编辑或查看模式
        const rowData = formatTimestamps(props.rowData);
        if ((rowData as any).rstrRsn) {
          rstrReasonState.value = (rowData as any).rstrRsn;
        }
        Object.assign(formData, rowData);
        if (formApi) {
          await formApi.setValues(formData);
        }
        await (newMode === 'view'
          ? updateFormDisabled(true)
          : updateFormDisabled(false));
      }
    } catch (error) {
      console.error('DetailForm mode watcher error:', error);
    }
  },
  { immediate: true },
);

// 加载司机信息详情
const loadDriverDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await getDriver(Number(id));
    const formatted = formatTimestamps(res);
    if ((formatted as any).rstrRsn) {
      rstrReasonState.value = (formatted as any).rstrRsn;
    }
    Object.assign(formData, formatted);
    await updateFormDisabled(true);
    await formApi.setValues(formData);
  } catch {
    message.error('获取详情失败');
  } finally {
    loading.value = false;
  }
};

// 监听司机ID，用于加载详情
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
      await createDriver(formData);
      message.success('新增成功');
    } else if (currentMode.value === 'edit') {
      await updateDriver(formData);
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
  rstrReasonState.value = '';
  Object.assign(formData, initFormData());
  formApi.setValues(formData);
};

const resetForm = () => {
  Object.assign(formData, initFormData());
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
      <template #enableFlg>
        <a-select
          v-model:value="formData.enableFlg"
          :disabled="currentMode === 'view'"
          :options="[{ label: '是', value: 1 }, { label: '否', value: 0 }]"
          placeholder="请选择"
          allow-clear
          style="width: 100%"
        />
      </template>
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
