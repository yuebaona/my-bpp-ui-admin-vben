<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';

import { Button, Input, Modal, Select } from 'ant-design-vue';

import { bppBaseDictStore } from '#/store/bpp/base/dict';
import AcceptancePlanForm from '#/views/bpp/changeorder/unreturn/container/modules/acceptancePlanForm.vue';
import PayInfoForm from '#/views/bpp/changeorder/unreturn/container/modules/payInfoForm.vue';
import PlanInfoForm from '#/views/bpp/changeorder/unreturn/container/modules/planInfoForm.vue';

// 使用字典 store
const bppBaseDict = bppBaseDictStore();

const initiationTypeValue = ref<null | string>(null);

// 头部相关数据
const businessTypes = ref([
  { label: '未回箱信息修改', value: 'unreturn_info_modify' },
]);
const selectedBusinessType = ref('unreturn_info_modify');
const statusText = ref('待提交');
const acceptancePlanNo = ref('');
const auditRemark = ref('');

// 按钮显示控制
const buttonDisplay = ref({
  deleteModifyPlan: true,
  saveDraft: true,
  submitAudit: true,
  executeModify: true,
});

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
// 处理业务类型变更
const handleBusinessTypeChange = (value: string) => {
  selectedBusinessType.value = value;
};

/** 删除改单计划按钮 */
const handleDeleteModifyPlan = () => {
  Modal.confirm({
    content: '是否确认删除改单计划？',
    onOk() {
      // 用户确认删除后执行的逻辑
      console.log('删除改单计划');
      // 这里可以添加实际的删除API调用
    },
    onCancel() {
      // 用户取消删除后执行的逻辑
      console.log('取消删除改单计划');
    },
  });
};
/** 暂存按钮 */
const handleSaveDraft = () => {
  // 暂存逻辑
  console.log('暂存');
};
/** 提交审核按钮 */
const handleSubmitAudit = () => {
  Modal.confirm({
    content: '本次修改需要收费20元，是否确认进行信息修改？',
    onOk() {
      // 用户确认删除后执行的逻辑
      console.log('删除改单计划');
      // 这里可以添加实际的删除API调用
    },
    onCancel() {
      // 用户取消删除后执行的逻辑
      console.log('取消删除改单计划');
    },
  });
};
/** 执行改单按钮 */
const handleExecuteModify = () => {
  Modal.confirm({
    content: '是否确认执行改单？',
    onOk() {
      // 用户确认删除后执行的逻辑
      console.log('删除改单计划');
      // 这里可以添加实际的删除API调用
    },
    onCancel() {
      // 用户取消删除后执行的逻辑
      console.log('取消删除改单计划');
    },
  });
};
</script>

<template>
  <div
    class="mb-2 flex flex-col gap-2 border-b-stone-300 bg-white p-3 dark:bg-[#1c1e23]"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-[#d2d2d3]">业务类型：</label>
            <Select
              class="w-40"
              :value="selectedBusinessType"
              :options="businessTypes"
              @change="handleBusinessTypeChange"
            />
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-[#d2d2d3]">状态：</label>
            <div
              class="rounded-full px-2 py-0.5 text-xs font-medium text-blue-600"
            >
              {{ statusText }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-[#d2d2d3]">受理计划号：</label>
            <Input
              v-model:value="acceptancePlanNo"
              placeholder="请输入受理计划号"
              class="w-60"
            />
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-[#d2d2d3]">审核说明：</label>
            <Input
              v-model:value="auditRemark"
              placeholder="请输入审核说明"
              class="w-60"
            />
          </div>
        </div>
      </div>

      <div class="mt-2 flex justify-end gap-2">
        <!-- 条件渲染按钮 -->
        <Button
          v-if="buttonDisplay?.deleteModifyPlan"
          @click="handleDeleteModifyPlan"
        >
          删除改单计划
        </Button>
        <Button v-if="buttonDisplay?.saveDraft" @click="handleSaveDraft">
          暂存
        </Button>
        <Button
          v-if="buttonDisplay?.submitAudit"
          type="primary"
          @click="handleSubmitAudit"
        >
          提交审核
        </Button>
        <Button
          v-if="buttonDisplay?.executeModify"
          type="primary"
          @click="handleExecuteModify"
        >
          执行改单
        </Button>
      </div>
    </div>
  </div>
  <div class="px-4">
    <div class="my-3 flex" style="height: 250px">
      <!-- 改单计划信息 -->
      <div class="h-full w-1/2">
        <div class="flex h-full flex-col rounded-lg">
          <PlanInfoForm class="h-full flex-1" />
        </div>
      </div>
      <!-- 改单付费信息 -->
      <div class="ml-3 h-full w-1/2">
        <div class="flex h-full flex-col rounded-lg">
          <PayInfoForm class="h-full flex-1" />
        </div>
      </div>
    </div>
    <!-- 受理计划列表 -->
    <div class="h-[62%] w-full">
      <AcceptancePlanForm />
    </div>
  </div>
</template>
