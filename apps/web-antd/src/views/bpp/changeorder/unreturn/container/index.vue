<script lang="ts" setup>

import { onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Select, Input } from 'ant-design-vue';

import { bppBaseDictStore } from '#/store/bpp/base/dict';

import PlanInfoForm from "#/views/bpp/changeorder/unreturn/container/modules/planInfoForm.vue";
import PayInfoForm from "#/views/bpp/changeorder/unreturn/container/modules/payInfoForm.vue";
import AcceptancePlanForm
  from "#/views/bpp/changeorder/unreturn/container/modules/acceptancePlanForm.vue";

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

// 按钮点击事件
const handleDeleteModifyPlan = () => {
  // 删除改单计划逻辑
  console.log('删除改单计划');
};

const handleSaveDraft = () => {
  // 暂存逻辑
  console.log('暂存');
};

const handleSubmitAudit = () => {
  // 提交审核逻辑
  console.log('提交审核');
};

const handleExecuteModify = () => {
  // 执行改单逻辑
  console.log('执行改单');
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
                class="w-40"
                :value="selectedBusinessType"
                :options="businessTypes"
                @change="handleBusinessTypeChange"
              />
            </div>

            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">状态：</label>
              <div class="rounded-full px-2 py-0.5 text-xs font-medium text-blue-600">
                {{ statusText }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">受理计划号：</label>
              <Input
                v-model:value="acceptancePlanNo"
                placeholder="请输入受理计划号"
                class="w-60"
              />
            </div>

            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">审核说明：</label>
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
          <Button
            v-if="buttonDisplay?.saveDraft"
            @click="handleSaveDraft"
          >
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
  <Page auto-content-height>
    <div class="my-3 flex h-[22%]">
      <!--      改单计划信息-->
      <div class="h-full w-1/2">
        <div class="flex h-full flex-col rounded-lg">
          <PlanInfoForm class="h-full flex-1" />
        </div>
      </div>
      <!-- 改单付费信息-->
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
  </Page>
</template>
