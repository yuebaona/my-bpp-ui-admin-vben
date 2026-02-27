<script setup lang="ts">
import type { SizeType } from 'ant-design-vue/es/config-provider';

import type {
  AdvancedButtonEmits,
  AdvancedButtonProps,
  ButtonTypeConfig,
} from './types';

import { ref, withDefaults } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, Popover } from 'ant-design-vue';

const props = withDefaults(defineProps<AdvancedButtonProps>(), {
  buttonType: () => [
    {
      text: '高级查询',
    },
  ],
});
const emit = defineEmits<AdvancedButtonEmits>();

const size = ref<SizeType>('large');

const buttonType = ref<ButtonTypeConfig[]>([...props.buttonType]);
// 选中的按钮类型
const click = () => {
  emit('click');
};
const change = (index: number) => {
  emit('change', index);
};
</script>

<template>
  <div>
    <Button type="default" :size="size" @click="click">
      <template #icon>
        <IconifyIcon icon="majesticons:filter-line" style="font-size: 25px" />
      </template>
    </Button>
    <Popover placement="bottomRight" trigger="click">
      <template #content>
        <p
          class="border-b-2 py-1 hover:text-sky-500"
          v-for="(item, index) in buttonType"
          :key="index"
        >
          <span  @click="change(index)">{{ item.text }}</span>
        </p>
      </template>
      <Button type="default" :size="size">
        <template #icon>
          <IconifyIcon icon="mdi-light:chevron-down" style="font-size: 25px" />
        </template>
      </Button>
    </Popover>
  </div>
</template>
<style scoped lang="less"></style>
