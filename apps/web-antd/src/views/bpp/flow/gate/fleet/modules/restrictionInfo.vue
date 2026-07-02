<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onBeforeUnmount, reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createFleetRstr,
  getFleetRstr,
  getRstrReason,
} from '#/api/bpp/flow/gate/fleet/';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';

import { restrictionColumns, restrictionFormSchema } from '../data';

const emit = defineEmits(['success']);

type FormMode = 'create' | 'edit' | 'view';

const formMode = ref<FormMode>('view');
const isDisabled = ref(true);

const selectedRstrId = ref<string>('');
const selectedRowData = ref<any>(null);

const fleetData = ref<any>(null);

let isFirstLoad = true;

const isSubmitting = ref(false);

const dataBeforeEdit = ref<Record<string, any>>({});
const changedFields = ref<Set<string>>(new Set());
let checkTimer: null | ReturnType<typeof setInterval> = null;

const initFormData = () => ({
  id: 0,
  fltGkey: '',
  fltCd: '',
  rstrRsn: '',
  rstrStartDt: '',
  rstrEndDt: '',
  lastRstrDt: 0,
  createTime: '',
  releaseTime: '',
  manualRelFlg: 0,
  remark: '',
  dataSrc: '业务处理平台',
  createAccount: '',
});

const formData = reactive(initFormData());

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: restrictionFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
  handleValuesChange: (values: any, changedFields: string[]) => {
    const days = currentRstrDays.value;
    if (days <= 0) return;

    if (changedFields.includes('rstrStartDt') && values.rstrStartDt) {
      const end = dayjs(values.rstrStartDt).add(days, 'day').format('YYYY-MM-DD HH:mm:ss');
      formApi.setFieldValue('rstrEndDt', end);
    } else if (changedFields.includes('rstrEndDt') && values.rstrEndDt) {
      const start = dayjs(values.rstrEndDt).subtract(days, 'day').format('YYYY-MM-DD HH:mm:ss');
      formApi.setFieldValue('rstrStartDt', start);
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    border: true,
    resizableConfig: {
      isDblclickAutoWidth: true,
      isAllColumnDrag: true,
    },
    checkboxConfig: {
      highlight: true,
      isShiftKey: true,
    },
    columns: restrictionColumns(),
    height: '350px',
    keepSource: true,
    mouseConfig: {
      selected: true,
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
      isCurrent: true,
    },
    editConfig: {
      mode: 'row',
      showIcon: false,
      trigger: 'manual',
    },
    filterConfig: {
      trigger: 'cell',
      mode: 'row',
      enabled: true,
    },
    floatingFilterConfig: {
      enabled: true,
    },
    toolbarConfig: {
      search: true,
      custom: true,
      refresh: true,
      zoom: true,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
    },
    proxyConfig: {
      autoLoad: true,
      ajax: {
        query: async ({ page }, formValues) => {
          // todo 这里接口输入参数是fltId，就是车队信息表的id，返回的虽然是分页形式的但是后端已经处理了是全部限制记录

          // const res = await getFleetRstr({
          //   pageNo: page.currentPage,
          //   pageSize: page.pageSize,
          //   ...formValues,
          // });
          // todo 改了一下
          const res = await getFleetRstr(fleetData.value.id);
          if (isFirstLoad && res?.list?.length > 0) {
            handleRowClick(res.list[0]);
            isFirstLoad = false;
          }
          return res;
        },
      },
    },
  } as VxeTableGridOptions<any>,
  gridEvents: {
    cellClick: ({ row }: { row: any }) => {
      handleRowClick(row);
    },
  },
});

const loadRstrDetail = (row: any) => {
  const formatted = formatTimestamps(row);
  if (formatted.rstrRsn) {
    rstrReasonState.value = formatted.rstrRsn;
  }
  Object.assign(formData, formatted);
  formApi.setValues(formData);
};

const formatTimestamps = (rowData: any) => {
  if (!rowData) return rowData;
  const data = { ...rowData };
  if (data.rstrStartDt)
    data.rstrStartDt = dayjs(data.rstrStartDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrEndDt)
    data.rstrEndDt = dayjs(data.rstrEndDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.createTime)
    data.createTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss');
  if (data.releaseTime)
    data.releaseTime = dayjs(data.releaseTime).format('YYYY-MM-DD HH:mm:ss');
  return data;
};

const applyFormState = (disabled: boolean) => {
  isDisabled.value = disabled;
  const schema = restrictionFormSchema();
  const updated = schema
    .filter((field) => field.fieldName)
    .map((field) => ({
      ...field,
      formItemClass: [
        field.formItemClass,
        changedFields.value.has(field.fieldName!) ? 'field-changed' : '',
      ]
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
  dataBeforeEdit.value = { ...formData, rstrRsn: rstrReasonState.value };
  changedFields.value = new Set();
};

const hasUnsavedChanges = () => changedFields.value.size > 0;

const clearChangedFields = () => {
  changedFields.value = new Set();
  dataBeforeEdit.value = {};
};

const checkHighlight = async () => {
  if (formMode.value !== 'edit') return;
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
  if (rstrReasonState.value != before.rstrRsn) {
    fields.add('rstrRsn');
  }
  const prev = [...changedFields.value].sort().join(',');
  const next = [...fields].sort().join(',');
  if (prev === next) return;
  changedFields.value = fields;
  const schema = restrictionFormSchema();
  const updated = schema
    .filter((f) => f.fieldName)
    .map((f) => ({
      ...f,
      formItemClass: [
        f.formItemClass,
        fields.has(f.fieldName!) ? 'field-changed' : '',
      ]
        .filter(Boolean)
        .join(' '),
      componentProps: {
        ...f.componentProps,
        disabled: false,
      },
    }));
  formApi.updateSchema(updated);
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

watch(
  formMode,
  async (newMode) => {
    switch (newMode) {
      case 'create': {
        stopChecking();
        rstrReasonState.value = '';
        Object.assign(formData, initFormData());
        formData.fltCd = fleetData.value?.fltCd || '';
        await formApi.setValues(formData);
        clearChangedFields();
        await applyFormState(false);
        startChecking();

        break;
      }
      case 'edit': {
        stopChecking();
        saveDataBeforeEdit();
        await applyFormState(false);
        startChecking();

        break;
      }
      case 'view': {
        stopChecking();
        clearChangedFields();
        await applyFormState(true);

        break;
      }
      // No default
    }
  },
  { immediate: true },
);

const handleRowClick = (row: any) => {
  if (formMode.value === 'edit' && hasUnsavedChanges()) {
    Modal.confirm({
      title: '提示',
      content: '当前有未保存的更改，是否放弃更改？',
      okText: '确认放弃',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        selectedRowData.value = row;
        selectedRstrId.value = String(row.id);
        formMode.value = 'view';
        loadRstrDetail(row);
      },
    });
    return;
  }
  selectedRowData.value = row;
  selectedRstrId.value = String(row.id);
  formMode.value = 'view';
  loadRstrDetail(row);
};

const handleCreate = () => {
  if (formMode.value === 'edit' && hasUnsavedChanges()) {
    Modal.confirm({
      title: '提示',
      content: '当前有未保存的更改，是否放弃更改？',
      okText: '确认放弃',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        selectedRowData.value = null;
        selectedRstrId.value = '';
        formMode.value = 'create';
      },
    });
    return;
  }
  selectedRowData.value = null;
  selectedRstrId.value = '';
  formMode.value = 'create';
};

const handleEdit = () => {
  if (!selectedRstrId.value || !selectedRowData.value) {
    message.warning('请先点击选择一行数据');
    return;
  }
  formMode.value = 'edit';
};

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

    if (formMode.value === 'create') {
      await createFleetRstr(formData);
      message.success('新增成功');
    } else if (formMode.value === 'edit') {
      await createFleetRstr(formData);
      message.success('更新成功');
    }

    await gridApi.query();
    rstrReasonState.value = '';
    Object.assign(formData, initFormData());
    await formApi.setValues(formData);
    formMode.value = 'view';
  } catch {
    message.error('保存失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  modalApi.close();
};

const {
  state: rstrReasonState,
  search: rstrReasonSearch,
  handleInput: handleRstrReasonInput,
  handleCompositionStart: handleRstrReasonCompositionStart,
  handleCompositionEnd: handleRstrReasonCompositionEnd,
} = useSearchSelect({
  searchApi: async () => {
    const res = await getRstrReason(fleetData.value.id);
    const rawData = res.data || res;
    return rawData.map((item: any) => ({
      ...item,
      _label: `${item.ruleCd}/${item.ruleDesc}`,
      _value: item.id,
    }));
  },
  labelField: '_label' as any,
  valueField: '_value' as any,
  errorMessage: '获取限制代码失败',
  toUpperCase: false,
  filterRegex: /[^A-Z0-9\u4e00-\u9fa5/]/g,
});

/** 当前限制代码的天数 */
const currentRstrDays = ref<number>(0);

const handleRstrReasonChange = async (value: any) => {
  rstrReasonState.value = value;
  await formApi.setFieldValue('rstrRsn', value);
  await formApi.validateField('rstrRsn');

  const selected: any = (rstrReasonState.data as any[]).find(
    (item: any) => item.value === value,
  );
  if (selected?.data?.rstrDays) {
    const rstrDays = selected.data.rstrDays;
    currentRstrDays.value = rstrDays;
    const startDate = dayjs();
    await formApi.setFieldValue('rstrStartDt', startDate.format('YYYY-MM-DD HH:mm:ss'));
    await formApi.setFieldValue('rstrEndDt', startDate.add(rstrDays, 'day').format('YYYY-MM-DD HH:mm:ss'));
  } else {
    currentRstrDays.value = 0;
  }
};

onBeforeUnmount(stopChecking);

const [RstrModal, modalApi] = useVbenModal({
  header: true,
  modal: false,
  draggable: true,
  resizeable: {
    minWidth: 600,
    minHeight: 400,
  },
  showCancelButton: true,
  closeOnClickModal: false,
  isSubmit: true,
  zIndex: 1000,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      isFirstLoad = true;
      const data = await modalApi.getData<any>();
      if (data && data.fleetData) {
        fleetData.value = data.fleetData;
      }
    } else {
      Object.assign(formData, initFormData());
      await formApi.setValues(formData);
      formMode.value = 'view';
      selectedRowData.value = null;
      selectedRstrId.value = '';
    }
  },
});
</script>

<template>
  <RstrModal title="已限制明细" class="w-[60vw] max-w-[1800px]">
    <div class="flex flex-col gap-2" style="min-height: 500px">
      <div class="overflow-hidden" style="min-height: 300px">
        <Grid />
      </div>
      <Form>
        <template #rstrRsn>
          <a-select
            v-model:value="rstrReasonState.value"
            :disabled="isDisabled"
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
        <template #lastRstrDt>
          <span class="text-gray-800">
            {{
              formData?.lastRstrDt == null || formData?.lastRstrDt === ''
                ? '-'
                : formData.lastRstrDt
            }}
          </span>
        </template>
        <template #createTime>
          <span class="text-gray-800">
            {{
              formData?.createTime == null || formData?.createTime === ''
                ? '-'
                : formData.createTime
            }}
          </span>
        </template>
        <template #dataSrc>
          <span class="text-gray-800">
            {{
              formData?.dataSrc == null || formData?.dataSrc === ''
                ? '-'
                : formData.dataSrc
            }}
          </span>
        </template>
        <template #createAccount>
          <span class="text-gray-800">
            {{
              formData?.createAccount == null || formData?.createAccount === ''
                ? '-'
                : formData.createAccount
            }}
          </span>
        </template>
      </Form>
    </div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button @click="handleCancel">取消</Button>
        <Button type="primary" @click="handleCreate">新增</Button>
        <Button type="primary" @click="handleEdit">编辑</Button>
        <Button type="primary" :loading="isSubmitting" @click="handleSave">
          保存
        </Button>
      </div>
    </template>
  </RstrModal>
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
