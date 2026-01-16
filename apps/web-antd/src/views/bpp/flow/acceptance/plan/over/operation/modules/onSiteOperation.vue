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
const vslCode = ref<string>();
interface LabelInValueType {
  value: number | string;
  label: string;
}
const vslNameState = reactive<{
  data: any[];
  fetching: boolean;
  value: LabelInValueType;
}>({
  value: { value: '', label: '' },
  fetching: false,
  data: [],
});
const vslVoyState = reactive<{
  data: any[];
  fetching: boolean;
  value: LabelInValueType;
}>({
  value: { value: '', label: '' },
  fetching: false,
  data: [],
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
  plannedCheType: '',
  spreaderType: '',
  isOnSiteWork: '',
  endTimeBack: 0,
  id: '',
  operationType: '',
  operationSource: '',
  changeReason: '',
  vslCode: '',
  vslVoy: '',
  operationNo: '',
  operationPosition: '',
  cheWorkChangeType: '',
  cheWorkType: '',
  machNo: '',
  cheType: '',
  startTime: '',
  endTime: '',
  operationFile: '',
  remark: '',
  creator: '',
  createTime: '',
  operationRecordStatus: '',
  acptPlnNo: '',
  operationContainerId: 0,
  stopCode: '',
  stopType: '',
  stopStartTime: '',
  stopEndTime: '',
  stopRemark: '',
  oogContIds: [],
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
    const acptPlnNo = formData.value?.acptPlnNo;
    const data =
      (await formApi.getValues()) as FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO;
    Object.assign(formData.value, data);
    formData.value.acptPlnNo = acptPlnNo;
    formData.value.vslCode = vslCode?.value || '';
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
    formData.value.acptPlnNo = data.value?.acptPlnNo;
    if (data?.id) {
      formData.value.endTime = data?.endTime?.toString();
      formData.value.endTimeBack = data?.endTimeBack?.toString();
      formData.value.startTime = data?.startTime?.toString();
      formData.value.startTimeBack = data?.startTimeBack?.toString();
      await formApi.setValues(formData.value);
      await formApi.setFieldValue('endTime', data?.endTime?.toString() || null);
      await formApi.setFieldValue(
        'endTimeBack',
        data?.endTimeBack?.toString() || null,
      );
      const fileList = JSON.parse(formData.value.operationFile)?.map((file) => {
        const parts = file.split('?');
        return parts[0]; // 返回问号之前的部分
      });
      await formApi.setFieldValue('operationFile', fileList);
    }
    if (data?.vslName || data.value?.vslName) {
      vslNameState.value = {
        label: data?.vslName || data.value?.vslName,
        value: data?.vslName || data.value?.vslName,
      };

      // 同时查询对应的航次列表
      const voyageRes = await getVVd({
        condition: data?.vslName || data.value?.vslName,
        queryType: 'VOYAGE',
      });
      if (voyageRes) {
        vslVoyState.data = voyageRes.map((item: any) => ({
          label: item.vieVoy,
          value: item.vieVoy,
        }));
      }
      await formApi.setFieldValue(
        'vslCode',
        data.value?.vslCode || data?.vslCode,
      );
      await formApi.setFieldValue(
        'vslName',
        data.value?.vslName || data?.vslName,
      );
    }
    if (data?.vslVoy || data.value?.vslVoy) {
      vslVoyState.value = {
        label: data?.vslVoy || data.value?.vslVoy,
        value: data?.vslVoy || data.value?.vslVoy,
      };
      await formApi.setFieldValue('vslVoy', data.value?.vslVoy || data?.vslVoy);
    }
    if (data?.vslCode || data.value?.vslCode) {
      vslCode.value = data?.vslCode || data.value?.vslCode;
    }
    // 数据回显
    await setFieldAndDisable('contNo', data.value?.contNo || data?.contNo);
    await setFieldAndDisable(
      'operationSource',
      data.value?.initiationType || data?.operationSource,
    );
    await setFieldAndDisable(
      'cheWorkChangeType',
      data.value?.cheWorkChangeType || data?.cheWorkChangeType,
    );
    await setFieldAndDisable('oogContIds', data.value?.oogContIds);
    if (data.value?.cheType || data?.cheType) {
      await formApi.setFieldValue(
        'cheType',
        data.value?.cheType || data?.cheType,
      );
    }
    const newSchema = onSiteOperationConfirmFormSchema(disabledFields.value);
    formApi.updateSchema(newSchema);
    modalApi.unlock();
  },
});

const modalTitle = ref<string>('现场操作确认');
const handleVesselSearch = async (value: any) => {
  vslNameState.value = {
    label: value.toUpperCase(),
    value: value.toUpperCase(),
  };
  if (!value) return;
  vslNameState.data = [];
  vslNameState.fetching = true;
  const res = await getVVd({
    condition: value,
  });
  if (res) {
    vslNameState.data = res.map((item: any) => ({
      label: item.vieVslName,
      value: item.vieVslName,
      data: item,
    }));
    vslNameState.fetching = false;
  }
};
const vslNameSelect = async (value: any, option: any) => {
  // 赋值到表单
  await formApi.setFieldValue('vslName', value.label);
  vslCode.value = option?.data?.vieVslCd;

  vslVoyState.fetching = true;

  // 查航次列表
  const res = await getVVd({
    condition: value.label,
    queryType: 'VOYAGE',
  });

  if (res) {
    vslVoyState.data = res.map((item: any) => ({
      label: item.vieVoy,
      value: item.vieVoy,
    }));
    vslVoyState.fetching = false;

    // 重要：在数据加载完成后再清空当前选择的航次值
    vslVoyState.value = {
      label: '',
      value: '',
    };
    await formApi.setFieldValue('vslVoy', '');
  }
};

const vslNameChange = async () => {
  await formApi.setFieldValue('vslName', '');
  await formApi.setFieldValue('vslVoy', '');

  // 清空航次数据
  vslVoyState.value = {
    label: '',
    value: '',
  };
  vslVoyState.data = [];
  selectKey.value++;
};
// 赋值到表单
const vslVoySelect = async (value: any) => {
  await formApi.setFieldValue('vslVoy', value.label);
};
const vslVoyChange = async () => {
  await formApi.setFieldValue('vslVoy', '');
};
const handleVoyageSearch = async (value: string) => {
  vslVoyState.value = {
    label: value.toUpperCase(),
    value: value.toUpperCase(),
  };
};
watch(vslNameState.value, () => {
  vslNameState.data = [];
  vslNameState.fetching = false;
});
watch(vslVoyState.value, () => {
  vslVoyState.data = [];
  vslVoyState.fetching = false;
});
const selectKey = ref(0);
</script>
<template>
  <Modal :title="modalTitle">
    <Form>
      <template #vslName>
        <Select
          v-model:value="vslNameState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入作业船名"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="vslNameState.fetching ? undefined : null"
          :options="vslNameState.data"
          @search="handleVesselSearch"
          allow-clear
          @select="vslNameSelect"
          @change="vslNameChange"
        />
      </template>
      <template #vslVoy>
        <Select
          v-model:value="vslVoyState.value"
          mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
          label-in-value
          placeholder="请输入船名航次"
          style="width: 100%"
          :filter-option="true"
          :not-found-content="vslVoyState.fetching ? undefined : null"
          :options="vslVoyState.data"
          allow-clear
          @select="vslVoySelect"
          @change="vslVoyChange"
          @search="handleVoyageSearch"
          :key="selectKey"
        />
      </template>
    </Form>
  </Modal>
</template>
