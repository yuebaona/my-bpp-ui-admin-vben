<script lang="ts" setup>
import { $t } from '@vben/locales';
import { openWindow } from '@vben/utils';

import { useVbenModal } from '@vben-core/popup-ui';
import { Badge, VbenButton } from '@vben-core/shadcn-ui';

import { useMagicKeys, whenever } from '@vueuse/core';

defineOptions({
  name: 'ContainerSystemHelp',
});

const keys = useMagicKeys();
whenever(keys['Alt+KeyH']!, () => {
  modalApi.open();
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  overlayBlur: 5,
  footer: false,
  onCancel() {
    modalApi.close();
  },
});

// 集装箱业务系统相关帮助信息
const helpCategories = [
  {
    title: $t('help.categories.operation'),
    items: [
      { name: $t('help.items.containerManage'), url: '#container-manage' },
      { name: $t('help.items.loadingUnloading'), url: '#loading-unloading' },
      { name: $t('help.items.vesselBerthing'), url: '#vessel-berthing' },
    ],
  },
  {
    title: $t('help.categories.features'),
    items: [
      { name: $t('help.items.dataAnalysis'), url: '#data-analysis' },
      { name: $t('help.items.workflowConfig'), url: '#workflow-config' },
      { name: $t('help.items.systemSettings'), url: '#system-settings' },
    ],
  },
  {
    title: $t('help.categories.support'),
    items: [
      { name: $t('help.items.techSupport'), url: '#tech-support' },
      {
        name: $t('help.items.businessConsulting'),
        url: '#business-consulting',
      },
      { name: $t('help.items.emergencyReport'), url: '#emergency-report' },
    ],
  },
];
</script>
<template>
  <Modal class="w-1/3" :title="$t('help.title')">
    <div class="mt-2 flex flex-col">
      <!-- 系统简介 -->
      <div class="mb-4 rounded-md bg-blue-50 p-3">
        <p class="text-sm text-blue-800">
          {{ $t('help.systemDesc') }}
        </p>
      </div>

      <!-- 帮助分类内容 -->
      <div
        v-for="category in helpCategories"
        :key="category.title"
        class="mb-4"
      >
        <h4 class="mb-2 text-sm font-medium text-gray-700">
          {{ category.title }}
        </h4>
        <div class="flex flex-wrap gap-2">
          <VbenButton
            v-for="item in category.items"
            :key="item.name"
            variant="link"
            size="sm"
            @click="openWindow(item.url)"
          >
            {{ item.name }}
          </VbenButton>
        </div>
      </div>

      <!-- 快捷键提示 -->
      <div class="mt-4 rounded-md bg-gray-50 p-3">
        <p class="text-xs text-gray-600">
          <span class="font-medium">{{ $t('help.shortcut') }}</span>
          {{ $t('help.shortcutHint') }}
        </p>
      </div>

      <!-- 联系方式 -->
      <div class="mt-4">
        <h4 class="mb-2 text-sm font-medium text-gray-700">
          {{ $t('help.contact') }}
        </h4>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>{{ $t('help.techSupportPhone') }}</div>
          <div>{{ $t('help.email') }}</div>
        </div>
      </div>

      <p class="mt-4 flex justify-center pt-2 text-xs text-gray-500">
        {{ $t('help.systemInfo') }} |
        <Badge variant="secondary">{{ $t('help.enterpriseEdition') }}</Badge>
      </p>
    </div>
  </Modal>
</template>
