<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import ContainerType from './modules/containerType.vue';

// 当前选中的模块
const activeModule = ref('containerType');

// 左侧菜单列表
const menuList = [
  { key: 'code', label: '系统基础代码定义'},
  { key: 'flow', label: '流向' },
  { key: 'containerType', label: '箱型' },
  { key: 'iso', label: 'ISO' },
  { key: 'containerOwner', label: '持箱人' },
  { key: 'ownerCheckConfig', label: '持箱人校验配置' },
  { key: 'portCode', label: '港口代码' },
  { key: 'containerStatus', label: '箱状态' },
  { key: 'dangerousCode', label: '危险品代码' },
  { key: 'icd', label: 'ICD' },
  { key: 'damageCode', label: '残损代码' },
  { key: 'damagePart', label: '残损部位' },
];

// 切换模块
const switchModule = (key: string) => {
  activeModule.value = key;
};
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full">
      <!-- 左侧菜单 -->
      <div class="flex w-48 flex-col border-r border-gray-200 bg-gray-50 p-2">
        <div class="flex-1 space-y-1">
          <button
            v-for="menu in menuList"
            :key="menu.key"
            @click="switchModule(menu.key)"
            class="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
            :class="[
              activeModule === menu.key
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-100',
            ]"
          >
            {{ menu.label }}
          </button>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="flex-1 overflow-auto">
        <!-- 箱型模块 -->
        <ContainerType v-if="activeModule === 'containerType'" />

        <!-- 其他模块占位 -->
        <div
          v-else
          class="flex h-full items-center justify-center text-gray-400"
        >
          <div class="text-center">
            <svg
              class="mx-auto mb-4 h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>暂无数据</p>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
