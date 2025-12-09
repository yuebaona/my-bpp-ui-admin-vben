// 改单计划信息
<script setup lang="ts">
import { Card } from "ant-design-vue";

import { useVbenForm } from '#/adapter/form';
import { changeOrderPlanInfoFormSchema } from '#/views/bpp/changeorder/acceptance/plan/update/data';

const [Form, formApi] = useVbenForm({
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
</script>

<template>
  <Card title="改单计划信息">
    <Form />
  </Card>
</template>
