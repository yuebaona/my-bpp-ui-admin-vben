<script setup lang="ts">
import { onActivated, ref } from 'vue';

import { Affix, message } from 'ant-design-vue';
import { Page } from '@vben/common-ui';
import BoxInfo from '#/views/bpp/changeorder/current/history/container/modules/boxInfo.vue';
import ChangeOrderPaymentInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPaymentInfo.vue';
import ChangeOrderPlanInfo from '#/views/bpp/changeorder/current/history/container/modules/changeOrderPlanInfo.vue';
import HeaderInfo from '#/views/bpp/changeorder/current/history/container/modules/headerInfo.vue';
import BoxList from '#/views/bpp/changeorder/current/history/container/modules/singleBoxEdit .vue';

const affix = ref(0);
const selectedBoxes = ref<any[]>([]);
// 提交审核时间记录
const submitAuditTime = ref<Date | null>(null);
// 子组件引用
const changeOrderPlanInfoRef = ref();
const changeOrderPaymentInfoRef = ref();
const boxListRef = ref();

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
  executeModifyTos: true,
});

// 收集所有子组件的数据
const collectAllData = () => {
  try {
    // 收集改单计划信息
    const planInfo = changeOrderPlanInfoRef.value?.formApi?.getValues() || {};

    // 收集改单付费信息
    const paymentInfo = changeOrderPaymentInfoRef.value?.formApi?.getValues() || {};

    // 收集修改的箱信息
    const modifiedBoxes = selectedBoxes.value;

    // 组合所有数据
    const allData = {
      planInfo,
      paymentInfo,
      modifiedBoxes,
      businessType: selectedBusinessType.value,
      originalAcceptancePlanNo: originalAcceptancePlanNo.value,
    };

    return allData;
  } catch (error) {
    console.error('收集数据失败:', error);
    return null;
  }
};

// 删除改单计划
const handleDeleteModifyPlan = () => {
  console.log('删除改单计划，收集的数据:', collectAllData());
  // 这里可以执行删除改单计划的逻辑
  message.warning('删除改单计划功能待实现');
};

// 暂存改单计划
const handleSaveDraft = () => {
  const data = collectAllData();
  if (data) {
    console.log('暂存数据:', data);
    // 这里可以执行暂存数据的逻辑
    message.success('数据暂存成功');
  } else {
    message.error('数据收集失败');
  }
};

// 提交审核
const handleSubmitAudit = () => {
  const data = collectAllData();
  if (data) {
    console.log('提交审核数据:', data);
    // 记录提交审核时间
    submitAuditTime.value = new Date();
    // 这里可以执行提交审核的逻辑
    message.success('提交审核成功，1分钟内可提交TOS修改');
  } else {
    message.error('数据收集失败');
  }
};

// 提交TOS修改
const handleExecuteModifyTos = () => {
  // 检查是否已提交审核
  if (!submitAuditTime.value) {
    message.warning('请先提交审核后再提交TOS修改');
    return;
  }

  // 检查是否在提交审核后10分钟内
  const now = new Date();
  const timeDiff = now.getTime() - submitAuditTime.value.getTime();
  const minutesDiff = timeDiff / (100 * 60);

  if (minutesDiff > 1) {
    message.warning('提交审核已超过1分钟，无法提交TOS修改，请重新提交审核');
    return;
  }

  const data = collectAllData();
  if (data) {
    console.log('提交TOS修改数据:', data);
    // 这里可以执行提交TOS修改的逻辑
    message.success('提交TOS修改成功');
  } else {
    message.error('数据收集失败');
  }
};

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
        @delete-modify-plan="handleDeleteModifyPlan"
        @save-draft="handleSaveDraft"
        @submit-audit="handleSubmitAudit"
        @execute-modify-tos="handleExecuteModifyTos"
      />
    </Affix>
    <div class="mb-2 ">
      <div class="mb-2 mt-2 flex flex-col md:flex-row">
        <div class="flex w-full md:w-2/5 flex-col mb-4 md:mb-0">
          <!-- 改单计划信息 -->
          <div>
            <ChangeOrderPlanInfo ref="changeOrderPlanInfoRef" />
          </div>
          <!-- 改单付费信息 -->
          <div class="mt-2">
            <ChangeOrderPaymentInfo ref="changeOrderPaymentInfoRef" />
          </div>
        </div>
        <!-- 箱信息 -->
        <div class="ml-0 md:ml-2 w-full md:w-3/5">
          <BoxInfo @add-to-edit="handleAddToEdit" />
        </div>
      </div>
      <div class="mb-2 mt-2 flex">
        <div class="w-full">
          <BoxList
            ref="boxListRef"
            :selected-boxes="selectedBoxes"
            @remove-from-edit="handleRemoveFromEdit"
          />
      </div>
      </div>
    </div>
  </Page>
</template>
