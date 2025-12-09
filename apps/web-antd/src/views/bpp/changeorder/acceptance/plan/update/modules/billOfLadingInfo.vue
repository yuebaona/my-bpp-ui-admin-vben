// 提单信息组件
<script setup lang="ts">
import { Card } from "ant-design-vue";
import { useVbenForm } from '#/adapter/form';
import { pickupBoxInfoFormSchema } from '#/views/bpp/changeorder/acceptance/plan/update/data';

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  schema: pickupBoxInfoFormSchema(),
});
</script>

<template>
  <Card title="提箱信息">
    <Form />
  </Card>
</template>
