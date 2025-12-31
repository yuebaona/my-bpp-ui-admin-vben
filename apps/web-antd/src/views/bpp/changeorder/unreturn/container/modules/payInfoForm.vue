<script setup lang="ts">

// 改单计划信息表单
import { useVbenForm } from "#/adapter/form";
import {
  payInfoFormSchema
} from "#/views/bpp/changeorder/unreturn/container/data";

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  schema: payInfoFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  actionWrapperClass: 'col-span-2 text-right',
});

</script>

<template>
  <ACard title="改单付费信息">
    <Form />
  </ACard>
</template>
