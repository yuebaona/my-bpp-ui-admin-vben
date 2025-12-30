<script setup lang="ts">

// 改单计划信息表单
import { useVbenForm } from "#/adapter/form";
import { planInfoFormSchema } from "#/views/bpp/changeorder/unreturn/container/data";

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 100,
  },
  schema: planInfoFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  actionWrapperClass: 'col-span-2 text-right',
});

</script>

<template>
  <ACard title="改单计划信息">
    <Form />
  </ACard>
</template>
