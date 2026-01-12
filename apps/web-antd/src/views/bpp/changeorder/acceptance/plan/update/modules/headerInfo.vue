<script setup lang="ts">
import { defineEmits, defineProps, ref, withDefaults } from "vue";

import { Button, Select } from 'ant-design-vue';

// 定义接收的 props 类型
interface BusinessTypeOption {
  label: string;
  value: string;
}

// 定义按钮显示控制的类型
interface ButtonDisplay {
  deleteOriginalPlan?: boolean; // 删除原受理计划
  deleteModifyPlan?: boolean; // 删除改单计划
  saveDraft?: boolean; // 暂存
  submitAudit?: boolean; // 提交审核
  executeModify?: boolean; // 执行改单
  executeModifyTos?: boolean; // 提交TOS修改
}

// 仅使用 TypeScript 接口定义 props 类型
interface Props {
  // 业务类型列表
  businessTypes: BusinessTypeOption[];
  // 当前选中的业务类型值
  selectedBusinessType: string;
  // 状态文本（如：待提交）
  statusText: string;
  // 原受理计划号
  originalAcceptancePlanNo?: string;
  // 原受理计划类型文本
  originalAcceptancePlanType: string;
  // 按钮显示控制配置
  buttonDisplay?: ButtonDisplay;
}

withDefaults(defineProps<Props>(), {
  originalAcceptancePlanNo: '',
  buttonDisplay: () => ({
    // 默认所有按钮都显示
    deleteOriginalPlan: true,
    deleteModifyPlan: true,
    saveDraft: true,
    submitAudit: true,
    executeModify: true,
    executeModifyTos: true,
  }),
});

// 定义组件触发的事件
const emit = defineEmits([
  'update:selectedBusinessType', // 业务类型选择变更
  'update:originalAcceptancePlanNo', // 原受理计划号输入变更
  'deleteOriginalPlan', // 删除原受理计划
  'deleteModifyPlan', // 删除改单计划
  'saveDraft', // 暂存
  'submitAudit', // 提交审核
  'executeModify', // 执行改单
  'executeModifyTos', // 提交TOS修改
]);
const selectedBusinessType = ref('BCNNNN');

// 处理业务类型变更
const handleBusinessTypeChange = (value: string) => {
  emit('update:selectedBusinessType', value);
};
const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
};
</script>

<template>
  <div class="mb-2 flex flex-col gap-2 border-b-stone-300 bg-white p-3">
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">业务类型：</label>
<!--            <Select-->
<!--              class="w-40"-->
<!--              :value="selectedBusinessType"-->
<!--              :options="businessTypes"-->
<!--              @change="handleBusinessTypeChange"-->
<!--            />-->
            <Select
              v-model:value="selectedBusinessType"
              style="width: 100%;flex:1"
              placeholder="请选择受理计划类型"
              :options="businessTypes"
              :show-search="true"
              :filter-option="filterOption"
              @change="handleBusinessTypeChange"
              allow-clear
            ></Select>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">状态：</label>
            <div class="rounded-full px-2 py-0.5 text-xs font-medium">
              {{ statusText }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">原受理计划号：</label>
            <label>{{ originalAcceptancePlanNo }}</label>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">原受理计划类型：</label>
            <div class="text-sm font-medium text-blue-600">
              {{ originalAcceptancePlanType }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">审核说明：</label>
          </div>
        </div>
      </div>

      <div class="mt-2 flex justify-end gap-2">
        <!-- 条件渲染按钮 -->
        <Button
          v-if="buttonDisplay?.deleteOriginalPlan"
          @click="emit('deleteOriginalPlan')"
        >
          删除原受理计划
        </Button>
        <Button
          v-if="buttonDisplay?.deleteModifyPlan"
          @click="emit('deleteModifyPlan')"
        >
          删除改单计划
        </Button>
        <Button
          v-if="buttonDisplay?.saveDraft"
          type="primary"
          @click="emit('saveDraft')"
        >
          暂存
        </Button>
        <Button
          v-if="buttonDisplay?.submitAudit"
          type="primary"
          @click="emit('submitAudit')"
        >
          提交审核
        </Button>
        <Button
          v-if="buttonDisplay?.executeModify"
          type="primary"
          @click="emit('executeModify')"
        >
          执行改单
        </Button>
        <Button
          v-if="buttonDisplay?.executeModifyTos"
          type="primary"
          @click="emit('executeModifyTos')"
        >
          提交TOS修改
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以在这里添加额外的样式 */
</style>
