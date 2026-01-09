<script setup lang="ts">
import { onActivated, ref } from 'vue';

import { Affix } from 'ant-design-vue';
import { Page } from '@vben/common-ui';
import BoxInfo from '#/views/bpp/changeorder/current/history/container/modules/boxInfo.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPlanInfo.vue';
import HeaderInfo from '#/views/bpp/changeorder/current/history/container/modules/headerInfo.vue';
import boxList from '#/views/bpp/changeorder/current/history/container/modules/singleBoxEdit .vue';

const affix = ref(0);
const selectedBoxes = ref<any[]>([]);

// 加入修改列表
function handleAddToEdit(boxes: any[]) {
  selectedBoxes.value = boxes;
}

// 从修改列表中移除
function handleRemoveFromEdit(boxIds: string[]) {
  selectedBoxes.value = selectedBoxes.value.filter(
    (box) => !boxIds.includes(box.id),
  );
}

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
    <div class="mb-2 w-screen">
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
          <BoxInfo @add-to-edit="handleAddToEdit" />
        </div>
      </div>
    </div>
    <boxList
      :selected-boxes="selectedBoxes"
      @remove-from-edit="handleRemoveFromEdit"
    />
  </Page>
</template>
