<script setup lang="ts">
import { useVbenModal, VbenButton } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';
import FormConfigModal from '#/views/bpp/custfrom/changeorder/acceptance/plan/update/components/FormConfigModal.vue';
import { changeOrderPlanInfoFormSchema } from '#/views/bpp/custfrom/changeorder/acceptance/plan/update/data';

const [Form, FormApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: changeOrderPlanInfoFormSchema(),
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: FormConfigModal,
});


const openModal = () => {
  modalApi.setData(FormApi.getState()?.schema).open();
};

const handleSuccess = (resultData: []) => {
  FormApi.setState({ schema: resultData });
  message.success($t('ui.actionMessage.operationSuccess'));
};
</script>

<template>
  <Card title="改单计划信息">
    <template #extra>
      <VbenButton @click="openModal">配置字段</VbenButton>
    </template>
    <Form />
  </Card>
  <Modal @success="handleSuccess" />
</template>
