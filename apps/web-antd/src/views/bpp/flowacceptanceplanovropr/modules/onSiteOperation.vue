<script lang="ts" setup>
import { ref } from 'vue';
import type {
  FlowOverLimitWorkApi
} from "#/api/bpp/flowoverlimitwork";

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { onSiteOperationConfirmFormSchema } from '#/views/bpp/flowacceptanceplanovropr/data';
import { confirmMachineSpreaderChangeRecord } from '#/api/bpp/flowoverlimitwork';
import { message } from "ant-design-vue";
import { $t } from "@vben/locales";
const emit = defineEmits(['success']);
const disabledFields = ref<string[]>([]);
async function setFieldAndDisable(fieldName: string, value: any) {
  if (value) {
    await formApi.setFieldValue(fieldName, value);
    if (!disabledFields.value.includes(fieldName)) {
      disabledFields.value.push(fieldName);
    }
  }
}
const formData = ref<FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO>({
  id: 0,
  operationType: '',
  operationSource: '',
  changeReason: '',
  vesselCode: '',
  vesselVoyage:'',
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
  overOperationContainerIds:[]
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
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    //提交表单
    const acceptancePlanNo = formData.value.acceptancePlanNo;
    const data = (await formApi.getValues()) as FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO;
    Object.assign(formData.value, data);
    formData.value.acceptancePlanNo = acceptancePlanNo;
    formData.value.vesselCode = 'TEST';
    await confirmMachineSpreaderChangeRecord(formData.value);
    // 关闭并提示
    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  },
  async onOpenChange(isOpen: boolean){
    if(!isOpen){
      return;
    }
    // 加载数据
    const data = modalApi.getData();
    // 数据回显
    await setFieldAndDisable('containerNo', data.value?.containerNo);
    await setFieldAndDisable('operationSource', data.value?.initiationType);
    await setFieldAndDisable('operationType', data.value?.operationType);
    await setFieldAndDisable('overOperationContainerIds', data.value?.overOperationContainerIds);
    formData.value.acceptancePlanNo = data.value.acceptancePlanNo;
    const newSchema = onSiteOperationConfirmFormSchema(disabledFields.value);
    formApi.updateSchema(newSchema);
  }
});

const modalTitle = ref<string>('现场操作确认');
</script>
<template>
  <Modal :title="modalTitle">
    <Form />
  </Modal>
</template>
