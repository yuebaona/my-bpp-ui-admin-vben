<script setup lang="ts">
import BoxInfo from '#/views/bpp/changeorder/current/history/container/modules/boxInfo.vue';
import boxList from '#/views/bpp/changeorder/current/history/container/modules/boxList.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPlanInfo.vue';
import HeaderInfo from "#/views/bpp/changeorder/current/history/container/modules/headerInfo.vue";
import {Affix} from "ant-design-vue";
import {onActivated, ref} from "vue";

const affix = ref(0);
// 模拟父组件传递的参数
const businessTypes = ref([
  { label: '受理计划修改', value: 'acceptance_plan_modify' },
  { label: '未回场箱信息修改', value: '2' },
  { label: '在场中转箱修改为进口箱', value: '3' },
]);
const selectedBusinessType = ref('3');
const originalAcceptancePlanNo = ref('');

const buttonDisplay = ref({
  deleteOriginalPlan: true,
  deleteModifyPlan: true,
  saveDraft: true,
  submitAudit: true,
  executeModify: true,
  executeModifyTos: false,
});
onActivated(() => {
  // 强制更新Affix组件，使组件重新渲染
  affix.value++;
});
</script>

<template>
  <Page auto-content-height>
    <Affix :offset-top="89" :key="affix">
      <HeaderInfo
        :business-types="businessTypes"
        :selected-business-type="selectedBusinessType"
        status-text="待提交"
        :original-acceptance-plan-no="originalAcceptancePlanNo"
        original-acceptance-plan-type="提空返重"
        :button-display="buttonDisplay"
      />
    </Affix>
    <div class="w-screen mb-2">
      <div class="mb-2 mt-2 flex">
        <div class="flex w-3/5 flex-col">
          <div>
            <ChangeOrderPlanInfo />
          </div>
          <div class="mt-2">
            <ChangeOrderPaymentInfo />
          </div>
        </div>
        <!-- 箱信息 -->
        <div class="ml-2 w-full">
          <BoxInfo />
        </div>
      </div>
    </div>
    <boxList />
  </Page>
</template>
