<script lang="ts" setup>
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';

import { message, Select } from 'ant-design-vue';
import { useVbenForm } from '#/adapter/form';
import { getVVd } from '#/api/bpp/common';
import {
  confirmMachineSpreaderChangeRecord,
  updateMachineSpreaderRecord,
} from '#/api/bpp/flow/acceptance/plan/over/operation';
import { onSiteOperationConfirmFormSchema } from '#/views/bpp/flow/acceptance/plan/over/operation/data';

const emit = defineEmits(['success']);
const disabledFields = ref<string[]>([]);
const vesselCode = ref<string>();
const vesselNameState = reactive({
  data: [],
  value: [],
  fetching: false,
});
const vesselVoyageState = reactive({
  data: [],
  value: [],
  fetching: false,
});

async function setFieldAndDisable(fieldName: string, value: any) {
  if (value) {
    await formApi.setFieldValue(fieldName, value);
    if (!disabledFields.value.includes(fieldName)) {
      disabledFields.value.push(fieldName);
    }
  }
}

const formData = ref<FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO>({
  isOnSiteWork: '',
  endTimeBack: 0,
  id: '',
  operationType: '',
  operationSource: '',
  changeReason: '',
  vesselCode: '',
  vesselVoyage: '',
  operationNo: '',
  operationPosition: '',
  machineSpreaderChangeType: '',
  machineSpreaderType: '',
  machineType: '',
  machineNo: '',
  spreaderType: '',
  startTime: '',
  endTime: '',
  operationFile: '',
  remark: '',
  creator: '',
  createTime: '',
  operationRecordStatus: '',
  acceptancePlanNo: '',
  operationContainerId: 0,
  stopCode: '',
  stopType: '',
  stopStartTime: '',
  stopEndTime: '',
  stopRemark: '',
  overOperationContainerIds: [],
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
  schema: onSiteOperationConfirmFormSchema(disabledFields.value),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

const submitCoreLogic = async () => {
  modalApi.lock();
  try {
    // 提交表单
    const acceptancePlanNo = formData.value?.acceptancePlanNo;
    const data =
      (await formApi.getValues()) as FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO;
    Object.assign(formData.value, data);
    formData.value.acceptancePlanNo = acceptancePlanNo;
    formData.value.vesselCode = vesselCode.value;
    formData.value.operationFile = JSON.stringify(data.operationFile);

    // 调用接口提交
    await (formData.value?.id
      ? updateMachineSpreaderRecord(formData.value)
      : confirmMachineSpreaderChangeRecord(formData.value));

    // 关闭并提示
    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  } catch (error: any) {
    message.error(`操作失败：${error.message || '未知错误'}`);
    console.error('提交失败详情：', error);
  } finally {
    modalApi.unlock();
  }
};
const debouncedSubmit = useDebounceFn(submitCoreLogic, 200);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    // 触发防抖提交
    await debouncedSubmit();
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    // 加载数据
    modalApi.lock();
    const data = modalApi.getData();
    Object.assign(formData.value, data);
    formData.value.acceptancePlanNo = data.value?.acceptancePlanNo;
    if (data?.id) {
      await formApi.setValues(data);
      await formApi.setFieldValue('endTime', data?.endTime?.toString()||null);
      await formApi.setFieldValue(
        'endTimeBack',
        data?.endTimeBack?.toString() || null,
      );
    }
    if (data?.vesselName || data.value?.vesselName) {
      vesselNameState.value = {
        label: data?.vesselName || data.value?.vesselName,
        value: data?.vesselName || data.value?.vesselName,
      };

      // 同时查询对应的航次列表
      const voyageRes = await getVVd({
        condition: data?.vesselName || data.value?.vesselName,
        queryType: 'VOYAGE',
      });
      if (voyageRes) {
        vesselVoyageState.data = voyageRes.map((item: any) => ({
          label: item.vieVoy,
          value: item.vieVoy,
        }));
      }
      await formApi.setFieldValue(
        'vesselCode',
        data.value?.vesselCode || data?.vesselCode,
      );
      await formApi.setFieldValue(
        'vesselName',
        data.value?.vesselName || data?.vesselName,
      );
    }
    if (data?.vesselVoyage || data.value?.vesselVoyage) {
      vesselVoyageState.value = {
        label: data?.vesselVoyage || data.value?.vesselVoyage,
        value: data?.vesselVoyage || data.value?.vesselVoyage,
      };
      await formApi.setFieldValue(
        'vesselVoyage',
        data.value?.vesselVoyage || data?.vesselVoyage,
      );
    }
    if (data?.vesselCode || data.value?.vesselCode) {
      vesselCode.value = data?.vesselCode || data.value?.vesselCode;
    }
    // 数据回显
    await setFieldAndDisable(
      'containerNo',
      data.value?.containerNo || data?.containerNo,
    );
    await setFieldAndDisable(
      'operationSource',
      data.value?.initiationType || data?.operationSource,
    );
    await setFieldAndDisable(
      'machineSpreaderChangeType',
      data.value?.machineSpreaderChangeType || data?.machineSpreaderChangeType,
    );
    await setFieldAndDisable(
      'overOperationContainerIds',
      data.value?.overOperationContainerIds,
    );
    if (data.value?.spreaderType || data?.spreaderType) {
      await formApi.setFieldValue(
        'spreaderType',
        data.value?.spreaderType || data?.spreaderType,
      );
    }
    const newSchema = onSiteOperationConfirmFormSchema(disabledFields.value);
    formApi.updateSchema(newSchema);
    modalApi.unlock();
  },
});

const modalTitle = ref<string>('现场操作确认');
const handleVesselSearch = async (value: any) => {
  if (!value) return;
  vesselNameState.data = [];
  vesselNameState.fetching = true;
  const res = await getVVd({
    condition: value,
  });
  if (res) {
    vesselNameState.data = res.map((item: any) => ({
      label: item.vieVslName,
      value: item.vieVslName,
      data: item,
    }));
    vesselNameState.fetching = false;
  }
};
const vesselNameSelect = async (value: any, option: any) => {
  // 赋值到表单
  await formApi.setFieldValue('vesselName', value.label);
  vesselCode.value = option?.data?.vieVslCd;

  vesselVoyageState.fetching = true;

  // 查航次列表
  const res = await getVVd({
    condition: value.label,
    queryType: 'VOYAGE',
  });

  if (res) {
    vesselVoyageState.data = res.map((item: any) => ({
      label: item.vieVoy,
      value: item.vieVoy,
    }));
    vesselVoyageState.fetching = false;

    // 重要：在数据加载完成后再清空当前选择的航次值
    vesselVoyageState.value = [];
    await formApi.setFieldValue('vesselVoyage', '');
  }
};

const vesselNameChange = async () => {
  await formApi.setFieldValue('vesselName', '');
  await formApi.setFieldValue('vesselVoyage', '');

  // 清空航次数据
  vesselVoyageState.value = [];
  vesselVoyageState.data = [];
  selectKey.value++;
};
// 赋值到表单
const vesselVoyageSelect = async (value: any) => {
  await formApi.setFieldValue('vesselVoyage', value.label);
};
const vesselVoyageChange = async () => {
  await formApi.setFieldValue('vesselVoyage', '');
};
watch(vesselNameState.value, () => {
  vesselNameState.data = [];
  vesselNameState.fetching = false;
});
watch(vesselVoyageState.value, () => {
  vesselVoyageState.data = [];
  vesselVoyageState.fetching = false;
});
const selectKey = ref(0);
</script>
<template>
  <Modal :title="modalTitle">
    <Form>
      <template #vesselName>
        <Select
          v-model:value="vesselNameState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入作业船名"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="vesselNameState.fetching ? undefined : null"
          :options="vesselNameState.data"
          @search="handleVesselSearch"
          allow-clear
          @select="vesselNameSelect"
          @change="vesselNameChange"
        />
      </template>
      <template #vesselVoyage>
        <Select
          v-model:value="vesselVoyageState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入船名航次"
          style="width: 100%"
          :filter-option="true"
          :not-found-content="vesselVoyageState.fetching ? undefined : null"
          :options="vesselVoyageState.data"
          allow-clear
          @select="vesselVoyageSelect"
          @change="vesselVoyageChange"
          :key="selectKey"
        />
      </template>
    </Form>
  </Modal>
</template>
