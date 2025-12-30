<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { bppBaseDictStore } from '#/store/bpp/base/dict';

import PlanInfoForm from "#/views/bpp/changeorder/unreturn/container/modules/planInfoForm.vue";
import PayInfoForm from "#/views/bpp/changeorder/unreturn/container/modules/payInfoForm.vue";
import AcceptancePlanForm
  from "#/views/bpp/changeorder/unreturn/container/modules/acceptancePlanForm.vue";

// 使用字典 store
const bppBaseDict = bppBaseDictStore();

const initiationTypeValue = ref<null | string>(null);

onMounted(async () => {
  // await getDictDataList();
});
watch(
  () => bppBaseDict.getBppBaseDictOptions('initiation_type'),
  (options) => {
    if (options && options.length > 0 && !initiationTypeValue.value) {
      const customerInitiated = options.find(
        (item) => item.label === '客户发起',
      );
      if (customerInitiated) {
        initiationTypeValue.value = customerInitiated.value;
      }
    }
  },
  { immediate: true },
);


</script>

<template>
  <Page auto-content-height>
    <div class="my-3 flex" style="height: 50px">111</div>
    <div class="my-3 flex" style="height: 250px">
      <!--      改单计划信息-->
      <div class="h-full w-1/2">
        <div class="flex h-full flex-col rounded-lg">
          <PlanInfoForm class="h-full flex-1" />
        </div>
      </div>
      <div class="ml-3 h-full w-1/2">
        <div class="flex h-full flex-col rounded-lg">
          <PayInfoForm class="h-full flex-1" />
        </div>
      </div>
    </div>
    <div class="h-3/5 w-full">
      <AcceptancePlanForm />
    </div>
  </Page>
</template>
