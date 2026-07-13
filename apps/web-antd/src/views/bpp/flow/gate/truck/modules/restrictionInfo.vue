<script lang="ts" setup>
import type { PageParam } from '@vben/request';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { GateTruckRstrApi } from '#/api/bpp/flow/gate/truck/rstr';

import { reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createTruckRstr,
  getRestrictionCodeList,
  getTruckRstr,
  getTruckRstrPage,
  updateTruckRstr,
} from '#/api/bpp/flow/gate/truck/rstr';
import { useSearchSelect } from '#/components/form-create/components/use-search-select';

import { restrictionColumns, restrictionFormSchema } from '../data';

// 表单模式
type FormMode = 'create' | 'edit' | 'view';

// 当前表单模式
const formMode = ref<FormMode>('view');
const isDisabled = ref(true);

// const emit = defineEmits(['success']);

// 选中的限制记录ID
const selectedRstrId = ref<string>('');

// 选中的行数据
const selectedRowData = ref<GateTruckRstrApi.TruckRstr | null>(null);

// 车辆数据
const truckData = ref<any>(null);

let isFirstLoad = true;

const isSubmitting = ref(false);

// 初始化表单
const initFormData = () => ({
  id: 0,
  fltCd: '',
  rstrRsn: '',
  trkNo: '',
  driverNm: '',
  rstrStartDt: '',
  rstrEndDt: '',
  lastRstrDt: 0,
  createTime: '',
  unrelDt: '',
  rstrDataSrc: '业务处理平台',
  createUser: '',
  relDriverFlg: 0,
});

const formData = reactive<GateTruckRstrApi.TruckRstr>(initFormData());

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
          const queryParam: PageParam = {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          };
          const res = await getTruckRstrPage(queryParam);
          // 默认加载第一条数据
          if (isFirstLoad && res?.list?.length > 0) {
            handleRowClick(res.list[0]);
            isFirstLoad = false;
          }
          return res;
        },
      },
    },
  } as VxeTableGridOptions<GateTruckRstrApi.TruckRstr>,
  gridEvents: {
    cellClick: ({ row }: { row: GateTruckRstrApi.TruckRstr }) => {
      handleRowClick(row);
    },
  },
});

// 点击表格行查看数据
const handleRowClick = (row: GateTruckRstrApi.TruckRstr) => {
  selectedRowData.value = row;
  selectedRstrId.value = String(row.id);
  formMode.value = 'view';
  loadRstrDetail(row.id);
};

// 加载限制记录详情
const loadRstrDetail = async (id: number) => {
  try {
    const res = await getTruckRstr(id);
    const formatted = formatTimestamps(res);
    Object.assign(formData, formatted);
    await formApi.setValues(formData);
    // 同步更新限制代码选择器的数据
    if (formatted.rstrRsn) {
      rstrReasonState.value = formatted.rstrRsn;
    }
  } catch {
    message.error('获取详情失败');
  }
};

// 时间格式化
const formatTimestamps = (rowData: any) => {
  if (!rowData) return rowData;
  const data = { ...rowData };
  if (data.rstrStartDt)
    data.rstrStartDt = dayjs(data.rstrStartDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrEndDt)
    data.rstrEndDt = dayjs(data.rstrEndDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.createTime)
    data.createTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss');
  if (data.unrelDt)
    data.unrelDt = dayjs(data.unrelDt).format('YYYY-MM-DD HH:mm:ss');
  return data;
};

// 更新表单禁用状态
const updateFormDisabled = (disabled: boolean) => {
  isDisabled.value = disabled;
  const schema = restrictionFormSchema();
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

// 监听表单模式
watch(
  formMode,
  async (newMode) => {
    if (newMode === 'create' || newMode === 'edit') {
      await updateFormDisabled(false);
    } else if (newMode === 'view') {
      await updateFormDisabled(true);
    }
  },
  { immediate: true },
);

// 点击新增
const handleCreate = () => {
  formMode.value = 'create';
  selectedRowData.value = null;
  selectedRstrId.value = '';
  Object.assign(formData, initFormData());
  formData.trkGkey = truckData.value?.trkGkey || '';
  formApi.setValues(formData);
};

// 点击编辑
const handleEdit = () => {
  if (!selectedRstrId.value || !selectedRowData.value) {
    message.warning('请先点击选择一行数据');
    return;
  }
  formMode.value = 'edit';
};

// 点击保存
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
      await createTruckRstr(formData);
      message.success('新增成功');
    } else if (formMode.value === 'edit') {
      await updateTruckRstr(formData);
      message.success('更新成功');
    }

    await gridApi.query();
    Object.assign(formData, initFormData());
    await formApi.setValues({});
    formMode.value = 'view';
  } catch {
    message.error('保存失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

// 点击取消
const handleCancel = () => {
  modalApi.close();
};

const [Modal, modalApi] = useVbenModal({
  header: true,
  modal: false,
  draggable: true,
  resizable: true,
  showCancelButton: true,
  closeOnClickModal: false,
  isSubmit: true,
  zIndex: 1000,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      isFirstLoad = true;
      const data = await modalApi.getData<any>();
      if (data && data.truckData) {
        truckData.value = data.truckData;
      }
      if ($grid) {
        await gridApi.query();
      }
    } else {
      Object.assign(formData, initFormData());
      await formApi.setValues({});
      formMode.value = 'view';
      selectedRowData.value = null;
      selectedRstrId.value = '';
    }
  },
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
</script>

<template>
  <Modal title="已限制明细" style="width: 150%">
    <div class="flex flex-col gap-4" style="min-height: 500px">
      <div class="flex-1" style="min-height: 300px">
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
  </Modal>
</template>
