<script setup lang="ts">
import { useVbenForm } from '#/adapter/form';
import { businessTypeInfoFormSchema } from '#/views/bpp/changeorder/current/history/container/data';
import BoxInfo from '#/views/bpp/changeorder/current/history/container/modules/boxInfo.vue';
import boxList from '#/views/bpp/changeorder/current/history/container/modules/boxList.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPlanInfo.vue';

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-1/2' },
    labelWidth: 150,
  },
  scrollToFirstError: true,
  layout: 'horizontal',
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  schema: businessTypeInfoFormSchema(),
});
</script>

<template>
  <div class="mb-2 w-3/4">
    <Form />
  </div>
  <Page auto-content-height>
    <div class="w-screen">
      <div class="mb-2 flex">
        <div class="flex w-1/2 flex-col">
          <div>
            <ChangeOrderPlanInfo />
          </div>
          <div class="mt-2">
            <ChangeOrderPaymentInfo />
          </div>
        </div>
        <!-- 箱信息 -->
        <div class="ml-2 w-1/2">
          <BoxInfo />
        </div>
      </div>
    </div>
    <boxList />
  </Page>
</template>
