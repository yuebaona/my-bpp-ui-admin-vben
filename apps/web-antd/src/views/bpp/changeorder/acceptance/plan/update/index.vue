<script setup lang="ts">
import { onActivated, onMounted, ref, watch } from "vue";

import { Page } from '@vben/common-ui';

import { Affix,Card } from 'ant-design-vue';

import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';
import BillOfLadingInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/billOfLadingInfo.vue';
import BoxList from '#/views/bpp/changeorder/acceptance/plan/update/modules/boxList.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/changeOrderPlanInfo.vue';
import HeaderInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/headerInfo.vue';
import InboxInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/inboxInfo.vue';
import OriginalPlanPaymentInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/originalPlanPaymentInfo.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const affix = ref(0);
const selectedBusinessType = ref('');
const originalAcceptancePlanNo = ref('');
// 使用字典 store
const bppBaseDict = bppBaseDictStore();

const buttonDisplay = ref({
  deleteOriginalPlan: true,
  deleteModifyPlan: true,
  saveDraft: true,
  submitAudit: true,
  executeModify: true,
  executeModifyTos: false,
});
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
  await loadDictData(['acceptance_plan_type']);
};
const handleSelectedBusinessType = (value) => {
  selectedBusinessType.value = value;
};
onActivated(async () => {
  // 强制更新Affix组件，使组件重新渲染
  affix.value++;
  await getDictDataList();
});
onMounted(() => {
  const { planType } = route.query;
  if (planType){
    selectedBusinessType.value = planType;
  }
})
watch(selectedBusinessType, (newVal) => {}, { deep: true });
</script>

<template>
  <Affix :offset-top="89" :key="affix">
    <Card>
    <HeaderInfo
      :business-types="
          bppBaseDict.getBppBaseDictOptions('acceptance_plan_type')
        "
      :selected-business-type="selectedBusinessType"
      status-text="待提交"
      :original-acceptance-plan-no="originalAcceptancePlanNo"
      original-acceptance-plan-type="提空返重"
      :button-display="buttonDisplay"
      @update:selected-business-type="handleSelectedBusinessType"
    />
    </Card>
  </Affix>
  <Page auto-content-height>
    <div class="w-full">
      <div class="mb-2 mt-2 flex">
        <div class="flex w-1/2 flex-col">
          <!-- 改单计划信息 -->
          <div>
            <ChangeOrderPlanInfo :plan-type="selectedBusinessType" />
          </div>
          <!-- 改单付费信息 -->
          <div class="mt-2">
            <ChangeOrderPaymentInfo :plan-type="selectedBusinessType" />
          </div>
        </div>
        <!-- 原计划与付费信息 -->
        <div class="ml-2 w-1/2">
          <OriginalPlanPaymentInfo :plan-type="selectedBusinessType" />
        </div>
      </div>
      <!-- 提单信息 -->
      <div>
        <BillOfLadingInfo :plan-type="selectedBusinessType" />
      </div>
      <!-- 进箱信息 -->
      <div class="mt-2">
        <InboxInfo :plan-type="selectedBusinessType" />
      </div>
    </div>
    <div class="mt-2">
      <!-- 箱信息 -->
      <BoxList />
    </div>
  </Page>
</template>
