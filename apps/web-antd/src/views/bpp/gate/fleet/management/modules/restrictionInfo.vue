<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { restrictionFormSchema, restrictionColumns } from '../data';

const emit = defineEmits(['success']);

const isSubmitting = ref(false);
const formMode = ref<'edit' | 'create'>('create');

const selectedRowData = ref<any>(null);

const formData = reactive({
  id: '',
  fleetCode: '',
  fleetName: '',
  restrictionReason: '',
  restrictStartTime: '',
  restrictEndTime: '',
  lastRestrictTimeTotal: '',
  createTime: '',
  releaseTime: '',
  restrictInfoSource: '',
  createAccount: '',
});

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
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values) => {
    Object.assign(formData, values);
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: restrictionColumns(),
    height: '250px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
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
      refresh: false,
      search: false,
      zoom: false,
      custom: false,
    },
    pagerConfig: {
      enabled: false,
    },
    checkboxConfig: {
      enabled: false,
    },
    events: {
      click: ({ row }: { row: any }) => {
        handleRowClick(row);
      },
    },
    // 配置弹出层挂载到 body，避免被 modal 遮挡
    dropdownConfig: {
      transfer: true,
    },
  } as VxeTableGridOptions<any>,
});

const resetFormData = () => {
  Object.assign(formData, {
    id: '',
    fleetCode: '',
    fleetName: '',
    restrictionReason: '',
    restrictStartTime: '',
    restrictEndTime: '',
    lastRestrictTimeTotal: '',
    createTime: '',
    releaseTime: '',
    restrictInfoSource: '',
    createAccount: '',
  });
  formApi.setValues(formData);
};

const handleRowClick = (row: any) => {
  selectedRowData.value = row;
  formMode.value = 'edit';
  Object.assign(formData, row);
  formApi.setValues(formData);
};

const handleAdd = () => {
  formMode.value = 'create';
  selectedRowData.value = null;
  resetFormData();
};

// 保存
const handleSave = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const formValues = await formApi.getValues();

    if (formMode.value === 'create') {
      // 新增逻辑
      const newRow = {
        ...formValues,
        id: `row_${Date.now()}`,
        createTime: new Date().toLocaleString('zh-CN'),
      };

      const $grid = gridApi.grid;
      if ($grid) {
        const currentData = $grid.getRecords();
        currentData.push(newRow);
        await $grid.reloadData(currentData);
      }
      message.success('新增成功');
    } else {
      // 编辑逻辑
      const $grid = gridApi.grid;
      if ($grid) {
        const currentData = $grid.getRecords();
        const index = currentData.findIndex((item: any) => item.id === formValues.id);
        if (index !== -1) {
          currentData[index] = { ...formValues };
          await $grid.reloadData(currentData);
        }
      }
      message.success('保存成功');
    }

    emit('success');
    selectedRowData.value = null;
    resetFormData();
  } catch (error) {
    message.error('保存失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  // resizable: true,
  zIndex: 1000,
  header: true,
  modal: false,
  showCancelButton: true,
  closeOnClickModal: false,
  submitting: true,
  onCancel:() => {
    selectedRowData.value = null;
    resetFormData();
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      selectedRowData.value = null;
      resetFormData();
    }
    const data = await modalApi.getData<any>();
    if (data && data.fleetData) {
      formData.fleetCode = data.fleetData.fltCd || '';
      formData.fleetName = data.fleetData.fltNm || '';
    }
  },
});
</script>

<template>
  <Modal title="已限制明细" class="!min-w-2/3">
    <Grid />
    <Form />
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button @click="handleAdd">新增</Button>
        <Button type="primary" :loading="isSubmitting" @click="handleSave">保存</Button>
      </div>
    </template>
  </Modal>
</template>
