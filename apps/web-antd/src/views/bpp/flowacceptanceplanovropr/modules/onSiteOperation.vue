<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { onSiteOperationConfirmFormSchema } from '#/views/bpp/flowacceptanceplanovropr/data';

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  schema: onSiteOperationConfirmFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  handleValuesChange: async (values) => {
    // 直接使用Object.assign合并值，避免创建新的响应式对象
    Object.assign(formData, values);
  },
});
const [Modal] = useVbenModal({
  async confirm() {
     await formApi.validate();
  },
});
const modalTitle = ref<string>('现场操作确认');
</script>
<template>
  <Modal :title="modalTitle">
    <Form />
  </Modal>
</template>
