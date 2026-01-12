<script setup lang="ts">
import { defineEmits, defineProps, ref, watch, withDefaults } from "vue";
import { Button, Select } from 'ant-design-vue';

interface BusinessTypeOption {
  label: string;
  value: string;
}
interface ButtonDisplay {
  deleteOriginalPlan?: boolean;
  deleteModifyPlan?: boolean;
  saveDraft?: boolean;
  submitAudit?: boolean;
  executeModify?: boolean;
  executeModifyTos?: boolean;
}
interface Props {
  businessTypes: BusinessTypeOption[];
  selectedBusinessType: string;
  statusText: string;
  originalAcceptancePlanNo?: string;
  originalAcceptancePlanType: string;
  buttonDisplay?: ButtonDisplay;
}

// 保留 props 默认值
const props = withDefaults(defineProps<Props>(), {
  originalAcceptancePlanNo: '',
  selectedBusinessType: '',
  buttonDisplay: () => ({
    deleteOriginalPlan: true,
    deleteModifyPlan: true,
    saveDraft: true,
    submitAudit: true,
    executeModify: true,
    executeModifyTos: true,
  }),
});

// 定义事件
const emit = defineEmits([
  'update:selectedBusinessType',
  'update:originalAcceptancePlanNo',
  'deleteOriginalPlan',
  'deleteModifyPlan',
  'saveDraft',
  'submitAudit',
  'executeModify',
  'executeModifyTos',
]);

const localSelectedValue = ref(props.selectedBusinessType);

watch(
  () => props.selectedBusinessType,
  (newVal) => {
    localSelectedValue.value = newVal;
  },
  { immediate: true }
);
const handleBusinessTypeChange = (newValue: string) => {
  localSelectedValue.value = newValue;
  emit('update:selectedBusinessType', newValue);
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
            <Select
              v-model:value="localSelectedValue"
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
        <!-- 按钮部分代码不变 -->
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
