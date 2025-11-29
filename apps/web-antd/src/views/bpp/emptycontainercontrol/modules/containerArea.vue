<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

import { computed, ref } from 'vue';

import { Button, Input, Modal, Tag, Tree } from 'ant-design-vue';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', positions: string[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedYardPositions = ref<string[]>([
  'A01-01',
  'A02-01',
  'B01-01',
  'B02-01',
]);
const searchValue = ref('');

const yardPositionTreeData = ref<TreeProps['treeData']>([
  {
    title: 'A01',
    key: 'A01',
    children: [
      { title: '01 (02)', key: 'A01-01' },
      { title: '03 (04)', key: 'A01-03' },
      { title: '05 (06)', key: 'A01-05' },
      { title: '07 (08)', key: 'A01-07' },
      { title: '09 (10)', key: 'A01-09' },
    ],
  },
  {
    title: 'A02',
    key: 'A02',
    children: [
      { title: '01 (02)', key: 'A02-01' },
      { title: '03 (04)', key: 'A02-03' },
      { title: '05 (06)', key: 'A02-05' },
      { title: '07 (08)', key: 'A02-07' },
      { title: '09 (10)', key: 'A02-09' },
    ],
  },
  {
    title: 'B01',
    key: 'B01',
    children: [
      { title: '01 (02)', key: 'B01-01' },
      { title: '03 (04)', key: 'B01-03' },
      { title: '05 (06)', key: 'B01-05' },
      { title: '07 (08)', key: 'B01-07' },
      { title: '09 (10)', key: 'B01-09' },
    ],
  },
  {
    title: 'B02',
    key: 'B02',
    children: [
      { title: '01 (02)', key: 'B02-01' },
      { title: '03 (04)', key: 'B02-03' },
      { title: '05 (06)', key: 'B02-05' },
      { title: '07 (08)', key: 'B02-07' },
      { title: '09 (10)', key: 'B02-09' },
    ],
  },
]);

const onTreeCheck = (checkedKeys: any) => {
  // 只保留叶子节点（包含"-"的key）
  const leafKeys = checkedKeys.filter((key: string) => key.includes('-'));
  selectedYardPositions.value = leafKeys;
};

const removeSelectedPosition = (position: string) => {
  selectedYardPositions.value = selectedYardPositions.value.filter(
    (item) => item !== position,
  );
};

const clearSelectedPositions = () => {
  selectedYardPositions.value = [];
};

const handleConfirm = () => {
  emit('confirm', selectedYardPositions.value);
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('update:visible', false);
};

const modalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});
</script>

<template>
  <Modal
    v-model:open="modalVisible"
    title="选择箱区范围"
    :width="800"
    :mask-closable="false"
    :footer="null"
  >
    <div class="flex gap-4" style="min-height: 400px">
      <!-- 左侧：堆场贝位树 -->
      <div class="flex-1 border-r pr-4">
        <div class="mb-2 font-medium">堆场贝位</div>
        <Input v-model:value="searchValue" placeholder="搜索" class="mb-2" />
        <div style="max-height: 350px; overflow-y: auto">
          <Tree
            v-model:checked-keys="selectedYardPositions"
            checkable
            :tree-data="yardPositionTreeData"
            :default-expand-all="true"
            @check="onTreeCheck"
          />
        </div>
      </div>

      <!-- 右侧：已选列表 -->
      <div class="flex-1 pl-4">
        <div class="mb-2 flex items-center justify-between">
          <span class="font-medium">已选</span>
          <Button type="link" size="small" @click="clearSelectedPositions">
            清空
          </Button>
        </div>
        <div
          class="flex flex-wrap gap-2"
          style="max-height: 350px; overflow-y: auto"
        >
          <Tag
            v-for="position in selectedYardPositions"
            :key="position"
            closable
            color="blue"
            @close="removeSelectedPosition(position)"
          >
            {{ position }}
          </Tag>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="mt-4 flex justify-end gap-2">
      <Button @click="handleCancel">取消</Button>
      <Button type="primary" @click="handleConfirm">确定</Button>
    </div>
  </Modal>
</template>
