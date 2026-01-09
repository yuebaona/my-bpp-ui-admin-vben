<script setup lang="ts">
import { Page } from '@vben/common-ui';

import BillOfLadingInfo from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/modules/billOfLadingInfo.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/modules/changeOrderPlanInfo.vue';
import InboxInfo from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/modules/inboxInfo.vue';
import OriginalPlanPaymentInfo from '#/views/bpp/flow/custom/config/form/changeorder/acceptance/plan/update/modules/originalPlanPaymentInfo.vue';
import { Affix,Select } from "ant-design-vue";
import { onActivated, onMounted, ref, watch } from "vue";
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import { getDictDataPage } from '#/api/bpp/base/dict/data';
const affix = ref(0);
const value = ref('BCNNNN');
// 使用字典 store
const bppBaseDict = bppBaseDictStore();
const loadDictData = async (dictTypes: string[]) => {
  for (const dictType of dictTypes) {
    bppBaseDict.setBppBaseDictCacheByData(
      (
        await getDictDataPage({
          dictType,
          pageNo: 1,
          pageSize: 100,
        })
      ).list,
      dictType,
    );
  }
};
/** 获取字典数据 */
const getDictDataList = async () => {
  await loadDictData([
    'acceptance_plan_type',
  ]);
};
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};
onActivated(async() => {
  // 强制更新Affix组件，使组件重新渲染
  affix.value++;
  await getDictDataList();
});
onMounted(()=>{
})
watch(value, (newVal) => {
}, { deep: true});
</script>

<template>
  <Page auto-content-height>
    <div class="w-full">
      <Affix>
        <div class="bg-white flex items-center p-5 mb-2">
          <div>受理计划类型：</div>
          <Select
            v-model:value="value"
            style="width: 100%;flex:1"
            placeholder="请选择受理计划类型"
            :options="bppBaseDict.getBppBaseDictOptions('acceptance_plan_type')"
            :show-search="true"
            :filter-option="filterOption"
            allow-clear
            defaultActiveFirstOption
          ></Select>
        </div>
      </Affix>
      <div class="mb-2 flex">
        <div class="flex w-1/2 flex-col">
          <div>
            <ChangeOrderPlanInfo :plan-type="value"/>
          </div>
          <div class="mt-2">
            <ChangeOrderPaymentInfo :plan-type="value"/>
          </div>
        </div>
        <div class="ml-2 w-1/2">
          <OriginalPlanPaymentInfo :plan-type="value"/>
        </div>
      </div>
      <!-- 提单信息 -->
      <div>
        <BillOfLadingInfo :plan-type="value"/>
      </div>
      <!-- 进箱信息 -->
      <div class="mt-2">
        <InboxInfo :plan-type="value"/>
      </div>
    </div>
  </Page>
</template>
