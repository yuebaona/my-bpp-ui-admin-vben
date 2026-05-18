<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createFleet } from '#/api/bpp/base/gate/fleet/manager';
import { $t } from '#/locales';
import { debounce } from '#/views/bpm/components/bpmn-process-designer/src/utils';

import { newFormSchema } from '../data';

const emit = defineEmits(['success']);

const isSubmitting = ref(false);

const initFormData = () => ({
  id: undefined,
  fleetCode: '',
  fleetCnName: '',
  fleetPhone: '',
  fleetShortName: '',
  fleetAddress: '',
  restrictedCount: 0,
  isRestricted: false,
  restrictionReason: '',
  restrictInfoSource: '',
  restrictStartTime: '',
  restrictEndTime: '',
  lastRestrictTimeTotal: 0,
  legalPersonName: '',
  legalPersonPhone: '',
  safetyPersonName: '',
  safetyPerson: '',
  safetyPersonPhone: '',
  businessPersonName: '',
  responsiblePerson: '',
  outerTruckAnnualReviewNo: '',
  wharfRemark: '',
  createSource: '业务处理平台',
  createTime: '',
  updateTime: '',
  isValid: '1', // 常用默认值：1=有效 0=无效
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
  schema: newFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

// 表单提交防抖
const debouncedConfirm = debounce(async () => {
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;

  try {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const formValues = await formApi.getValues();
    Object.assign(formData, formValues);

    const currentTimestamp = Date.now();
    formData.createTime = currentTimestamp;
    formData.updateTime = currentTimestamp;

    // 提交新增
    await createFleet(formData);

    await modalApi.close();
    emit('success');
    message.success($t('ui.actionMessage.operationSuccess'));
  } catch (error) {
    message.error('提交失败，请重试');
    console.error('Submit error:', error);
  } finally {
    isSubmitting.value = false;
  }
}, 300);

const [Modal, modalApi] = useVbenModal({
  title: '新增车队信息',
  draggable: true,
  zIndex: 2000,
  onConfirm: debouncedConfirm,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const currentTime = new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      formData.createSource = '业务处理平台';
      formData.createTime = currentTime;
      formData.updateTime = currentTime;

      // 同步给表单显示
      await formApi.setValues(formData);
    }

    if (!isOpen) {
      Object.assign(formData, initFormData());
    }
  },
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
