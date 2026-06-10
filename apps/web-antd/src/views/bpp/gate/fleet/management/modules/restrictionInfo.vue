<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { restrictionFormSchema, restrictionColumns } from '../data';
import {
  getFleetRstr,
  createFleetRstr,
  updateFleetRstr,
} from '#/api/bpp/flow/gate/fleet/rstr';
import * as GateFleetRstrApi from '#/api/bpp/flow/gate/fleet/rstr';
const emit = defineEmits(['success']);

const isSubmitting = ref(false);
const formMode = ref<'view' | 'edit' | 'create'>('view');
const selectedRowData = ref<GateFleetRstrApi.FleetRstr | null>(null);

const formData = reactive<GateFleetRstrApi.FleetRstr>({
  id: 0,
  fltGkey: '',
  rstrRsn: '',
  rstrStartDt: '',
  rstrEndDt: '',
  manualRelFlg: 0,
  remark: '',
  dataSrc: '',
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
      enabled: true,
    },
    checkboxConfig: {
      enabled: true,
    },
    editConfig: {
      mode: 'cell',
      showIcon: false,
      autoClear: false,
    },
    dropdownConfig: {
      transfer: true,
    },
    proxyConfig: {
      autoLoad: true,
      page: true,
      response: {
        result: 'list',
        total: 'total',
      },
      ajax: {
        query: async ({ page }) => {
          // const res = await getFleetRstrPage({
          //   pageNo: page.currentPage,
          //   pageSize: page.pageSize,
          // });
          // return res;
        },
      },
    },
    events: {
      click: ({ row }: { row: GateFleetRstrApi.FleetRstr }) => {
        handleRowClick(row);
      },
    },
  } as VxeTableGridOptions<GateFleetRstrApi.FleetRstr>,
});

const resetFormData = () => {
  Object.assign(formData, {
    id: 0,
    fltGkey: '',
    rstrRsn: '',
    rstrStartDt: '',
    rstrEndDt: '',
    manualRelFlg: 0,
    remark: '',
    dataSrc: '',
  });
  formApi.setValues(formData);
};

const handleRowClick = async (row: GateFleetRstrApi.FleetRstr) => {
  selectedRowData.value = row;
  formMode.value = 'view';

  // 获取详情
  try {
    const res = await getFleetRstr(row.id);
    if (res.code === 0 && res.data) {
      Object.assign(formData, res.data);
      formApi.setValues(formData);
    }
  } catch (error) {
    message.error('获取详情失败');
  }
};

const handleCreate = () => {
  formMode.value = 'create';
  selectedRowData.value = null;
  resetFormData();

  const $grid = gridApi.grid;
  if ($grid) {
    const newRow: any = {
      id: `row_${Date.now()}`,
      fltGkey: '',
      rstrRsn: '',
      rstrStartDt: '',
      rstrEndDt: '',
      manualRelFlg: 0,
      remark: '',
      dataSrc: '',
    };
    const currentData = $grid.getRecords();
    currentData.push(newRow);
    $grid.reloadData(currentData);
  }
};

const handleEdit = () => {
  const $grid = gridApi.grid;
  if ($grid) {
    const selectedRows = $grid.getCheckboxRecords();
    if (selectedRows.length !== 1) {
      message.warning('请选择一条记录进行编辑');
      return;
    }

    // 进入编辑模式
    formMode.value = 'edit';
    selectedRowData.value = selectedRows[0];

    // 展示详情
    getFleetRstr(selectedRows[0].id)
      .then((res) => {
        if (res.code === 0 && res.data) {
          Object.assign(formData, res.data);
          formApi.setValues(formData);
        }
      })
      .catch(() => {
        message.error('获取详情失败');
      });
  }
};

// 保存
const handleSave = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const { valid, errors } = await formApi.validate();
    if (!valid) {
      console.error('表单验证失败:', errors);
      message.error('请填写必填项');
      return;
    }

    let formValues = await formApi.getValues();

    // 转换时间格式为字符串
    if (formValues.rstrStartDt && typeof formValues.rstrStartDt === 'object') {
      formValues = {
        ...formValues,
        rstrStartDt: formValues.rstrStartDt.format('YYYY-MM-DD HH:mm:ss'),
      };
    }
    if (formValues.rstrEndDt && typeof formValues.rstrEndDt === 'object') {
      formValues = {
        ...formValues,
        rstrEndDt: formValues.rstrEndDt.format('YYYY-MM-DD HH:mm:ss'),
      };
    }

    if (formMode.value === 'create') {
      // 新增
      await createFleetRstr(formValues);
      message.success('新增成功');
      const $grid = gridApi.grid;
      if ($grid) {
        await $grid.reloadData();
      }
      emit('success');
    } else if (formMode.value === 'edit') {
      // 编辑
      await updateFleetRstr(formValues);
      message.success('保存成功');
      const $grid = gridApi.grid;
      if ($grid) {
        await $grid.reloadData();
      }
      emit('success');
    }

    selectedRowData.value = null;
    resetFormData();
    formMode.value = 'view';
  } catch (error) {
    console.error('保存错误:', error);
    message.error('保存失败，请重试');
  } finally {
    isSubmitting.value = false;
  }
};

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  resizable: true,
  zIndex: 1000,
  width: 1200,
  header: true,
  modal: false,
  showCancelButton: true,
  closeOnClickModal: false,
  submitting: true,
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // 重置表单
      resetFormData();
      formMode.value = 'view';
      selectedRowData.value = null;
    }
    if (!isOpen) {
      selectedRowData.value = null;
      resetFormData();
    }
    const data = await modalApi.getData<any>();
    if (data && data.fleetData) {
      formData.fltGkey = data.fleetData.fltGkey || '';
    }
  },
});
</script>

<template>
  <Modal title="已限制明细" class="!w-2/3">
    <Grid />
    <Form />
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button @click="handleCreate">新增</Button>
        <Button @click="handleEdit">编辑</Button>
        <Button type="primary" :loading="isSubmitting" @click="handleSave">保存</Button>
      </div>
    </template>
  </Modal>
</template>
