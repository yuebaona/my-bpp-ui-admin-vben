<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { reactive, ref, watch, computed, nextTick } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import * as FleetManagementApi from '#/api/bpp/flow/gate/fleet/manager';
import { detailFormSchema } from '#/views/bpp/gate/fleet/management/data';
import RestrictionInfo from '#/views/bpp/gate/fleet/management/modules/restrictionInfo.vue';

import { detailRestrictionSchema, restrictionColumns } from '../data';
import { getFleetById, createFleet, updateFleet } from '#/api/bpp/flow/gate/fleet/manager';

const restrictionDetailData = reactive<any[]>([]);

// 定义表单模式（查看/编辑/新增）
type FormMode = 'view' | 'edit' | 'create';

// 接收传入的车队ID和表单模式
const props = defineProps<{
  fleetId?: string;
  mode?: FormMode;
  rowData?: FleetManagementApi.fleetVO;
}>();

// 当前表单模式
const currentMode = computed<FormMode>(() => props.mode || 'view');

const emit = defineEmits(['success']);

const loading = ref(false);
const isSubmitting = ref(false);

const initFormData = () => ({
  id: '',
  fltCd: '',
  fltNm: '',
  fltShortNm: '',
  fltAddr: '',
  rstrCnt: 0,
  isRstr: 0,
  rstrReason: '',
  rstrDataSrc: '',
  rstrStarDt: '',
  rstrEndDt: '',
  rstrLastDt: '',
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
  enableFlg: 1,
});

const formData = reactive<FleetManagementApi.fleetVO>(initFormData());

// 表单组件
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

// 根据模式更新表单字段是否可编辑
const updateFormDisabled = async (disabled: boolean) => {
  const schema = detailFormSchema();
  schema.forEach((field) => {
    if (!field.fieldName) return;
    formApi.setProps(field.fieldName, {
      componentProps: {
        ...field.componentProps,
        disabled: disabled ? true : (field.componentProps?.disabled ?? false),
      },
    } as any);
  });
};

// 时间戳转换为日期
const formatTimestamps = (rowData: any) => {
  if (!rowData) return rowData;
  const data = { ...rowData };
  if (data.rstrStarDt) data.rstrStarDt = dayjs(data.rstrStarDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrEndDt) data.rstrEndDt = dayjs(data.rstrEndDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.rstrLastDt) data.rstrLastDt = dayjs(data.rstrLastDt).format('YYYY-MM-DD HH:mm:ss');
  if (data.createTime) data.createTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss');
  if (data.updateTime) data.updateTime = dayjs(data.updateTime).format('YYYY-MM-DD HH:mm:ss');
  return data;
};

// 监听模式
watch(
  () => props.mode,
  async (newMode) => {
    try {
      if (newMode === 'create') {
        // 新增模式
        Object.assign(formData, initFormData());
        if (formApi) {
          await formApi.setValues(formData);
        }
      } else if ((newMode === 'edit' || newMode === 'view') && props.rowData) {
        // 编辑或查看模式
        const rowData = formatTimestamps(props.rowData);
        Object.assign(formData, rowData);
        if (formApi) {
          await formApi.setValues(formData);
        }
      }
    } catch (error) {
      console.error('DetailForm mode watcher error:', error);
    }
  }
);

// 监听行数据
watch(
  () => props.rowData,
  async (newRow) => {
    if (currentMode.value === 'edit' && newRow) {
      Object.assign(formData, newRow);
      await formApi.setValues(formData);
    }
  }
);

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
  } as VxeTableGridOptions<any>,
});

const [RestrictionInfoFormModal, restrictionInfoFormModalApi] = useVbenModal({
  connectedComponent: RestrictionInfo,
  destroyOnClose: true,
  draggable: true,
  zIndex: 2000,
});

// 监听车队ID，加载详情
watch(
  () => props.fleetId,
  async (newId, oldId) => {
    if (!newId || newId === oldId) {
      return;
    }
    await loadFleetDetail(newId);
  },
  { immediate: false }
);

const loadFleetDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await getFleetById(id);
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
            fleetName: item.fleetName || formData.fleetCnName || '',
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
    }
  } catch (error) {
    message.error('获取详情失败');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, initFormData());
};

// 保存表单
const handleSave = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    // 表单验证
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }

    const formValues = await formApi.getValues();
    Object.assign(formData, formValues);

    if (currentMode.value === 'create') {
      // 新增
      await createFleet(formData);
      message.success('新增成功');
    } else if (currentMode.value === 'edit') {
      // 编辑
      await updateFleet(formData);
      message.success('更新成功');
    }

    emit('success');
    // 重置表单
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
const handleRestriction = async (row: FleetManagementApi.fleetVO) => {
  restrictionInfoFormModalApi
    .setData({
      fleetData: formData,
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

defineExpose({
  handleSave,
});
</script>


<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 max-h-[500px] overflow-auto">
    <RestrictionInfoFormModal />
    <div class="p-6">
      <!-- 加载中 -->
      <div v-if="loading" class="flex justify-center items-center py-10">
        <div class="ant-spin ant-spin-lg"></div>
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
      </Form>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-descriptions) {
  margin-bottom: 0;
}
</style>
