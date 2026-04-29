<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

// import { Button, message, Select } from 'ant-design-vue';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { debounce } from '#/views/bpm/components/bpmn-process-designer/src/utils';

import { restrictionFormSchema } from '../data';

const emit = defineEmits(['success']);

const isSubmitting = ref(false);

const formData = reactive({
  vehicleCode: '',
  vehicleCnName: '',
  restrictionReason: '',
  restrictStartTime: '',
  restrictEndTime: '',
  lastRestrictTimeTotal: 0,
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

// 表单提交实现防抖
const debouncedConfirm = debounce(async () => {
  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;

  try {
    // 调用父组件传递的回调函数，将数据传递给父组件
    const submitData = {
      ...formValues,
    };

    // 调用父组件传递的回调函数
    modalData.onSubmit(submitData);

    // 关闭弹窗
    await modalApi.close();
    message.success('新增限制信息成功');
  } finally {
    isSubmitting.value = false;
  }
}, 300);

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  zIndex: 6000,
  onConfirm: debouncedConfirm,
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      Object.assign(formData, {
        vehicleCode: '',
        vehicleCnName: '',
        restrictionReason: '',
        restrictStartTime: '',
        restrictEndTime: '',
        lastRestrictTimeTotal: 0,
        createTime: '',
        releaseTime: '',
        restrictInfoSource: '',
        createAccount: '',
      });
    }
    const data = await modalApi.getData<any>();

    // 如果有传递车队数据，填充到表单中
    if (data && data.vehicleData) {
      formData.vehicleCode = data.vehicleData.vehicleCode || '';
      formData.vehicleCnName = data.vehicleData.vehicleCnName || '';
    }
  },
});
</script>

<template>
  <Modal title="新增限制信息">
    <Form />
  </Modal>
</template>
