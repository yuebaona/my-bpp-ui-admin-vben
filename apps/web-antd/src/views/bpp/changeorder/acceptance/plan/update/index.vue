<script setup lang="ts">
import { ref } from 'vue';

import { Affix } from 'ant-design-vue';

import BillOfLadingInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/billOfLadingInfo.vue';
import boxList from '#/views/bpp/changeorder/acceptance/plan/update/modules/boxList.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/changeOrderPlanInfo.vue';
import HeaderInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/headerInfo.vue';
import InboxInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/inboxInfo.vue';
import OriginalPlanPaymentInfo from '#/views/bpp/changeorder/acceptance/plan/update/modules/originalPlanPaymentInfo.vue';
// 模拟父组件传递的参数
const businessTypes = ref([
  { label: '受理计划修改', value: 'acceptance_plan_modify' },
]);
const selectedBusinessType = ref('acceptance_plan_modify');
const originalAcceptancePlanNo = ref('');

const buttonDisplay = ref({
  deleteOriginalPlan: true,
  deleteModifyPlan: true,
  saveDraft: true,
  submitAudit: true,
  executeModify: true,
  executeModifyTos: false,
});
</script>

<template>
  <Page auto-content-height>
    <Affix :offset-top="89">
      <HeaderInfo
        :business-types="businessTypes"
        :selected-business-type="selectedBusinessType"
        status-text="待提交"
        :original-acceptance-plan-no="originalAcceptancePlanNo"
        original-acceptance-plan-type="提空返重"
        :button-display="buttonDisplay"
      />
    </Affix>
    <div class="w-screen">
      <div class="mb-2 mt-2 flex">
        <div class="flex w-1/2 flex-col">
          <!-- 改单计划信息 -->
          <div>
            <ChangeOrderPlanInfo />
          </div>
          <!-- 改单付费信息 -->
          <div class="mt-2">
            <ChangeOrderPaymentInfo />
          </div>
        </div>
        <!-- 原计划与付费信息 -->
        <div class="ml-2 w-1/2">
          <OriginalPlanPaymentInfo />
        </div>
      </div>
      <!-- 提单信息 -->
      <div>
        <BillOfLadingInfo />
      </div>
      <!-- 进箱信息 -->
      <div class="mt-2">
        <InboxInfo />
      </div>
    </div>
    <boxList />
  </Page>
</template>
