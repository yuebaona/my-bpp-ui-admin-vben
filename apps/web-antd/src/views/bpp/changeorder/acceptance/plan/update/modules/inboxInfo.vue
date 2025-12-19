// 进箱信息组件
<script setup lang="ts">
import { Button, Card } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { inboxInfoFormSchema } from '#/views/bpp/changeorder/acceptance/plan/update/data';

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  schema: inboxInfoFormSchema(),
});
</script>

<template>
  <Card title="进箱信息">
    <Form>
      <template #billNo>
        <Button type="primary">提单信息管理</Button>
      </template>
    </Form>
  </Card>
</template>
