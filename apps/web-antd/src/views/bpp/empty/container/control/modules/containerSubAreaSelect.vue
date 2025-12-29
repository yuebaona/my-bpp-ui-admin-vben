<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, ref, watch } from 'vue';

import { Button, Input, message, Modal, Spin, Tag, Tree } from 'ant-design-vue';

import { getSubPlanYardRange } from '#/api/bpp/empty/container/control';

interface Props {
  visible: boolean;
  ownerCodeList?: [];
  contIsoList?: [];
  tradeType?: string;
  selectedPositions?: string[];
  mainId?: string;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', positions: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  ownerCodeList: () => [],
  contIsoList: () => [],
  tradeType: '',
  selectedPositions: () => [],
  mainId: '',
});
const emit = defineEmits<Emits>();

const selectedYardPositions = ref<string[]>([]);
const searchValue = ref('');
const loading = ref(false);

const yardPositionTreeData = ref<TreeProps['treeData']>([]);

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      fetchYardRange();
    }
  },
  { immediate: true },
);

watch(
  () => props.selectedPositions,
  (newValue) => {
    if (props.visible && newValue) {
      selectedYardPositions.value = [...newValue];
    }
  },
  { immediate: true, deep: true },
);

watch(
  [() => props.ownerCodeList, () => props.contIsoList, () => props.tradeType],
  () => {
    if (props.visible) {
      fetchYardRange();
    }
  },
  { deep: true },
);

// 获取堆场范围数据
const fetchYardRange = async () => {
  loading.value = true;
  try {
    const response = await getSubPlanYardRange(props.mainId);
    yardPositionTreeData.value = [];

    if (response.length > 0) {
      const treeMap = new Map<string, any>();

      response.forEach((item: any) => {
        console.log('item:', item);
        console.log('item.yard:', item.yard);
        if (!item.yard) {
          return;
        }

        const yardParts = item.yard.split('-');

        if (yardParts.length === 0) {
          return;
        }

        const firstLevelKey = yardParts[0];
        if (!treeMap.has(firstLevelKey)) {
          treeMap.set(firstLevelKey, {
            title: firstLevelKey,
            key: firstLevelKey,
            children: [],
          });
        }

        if (yardParts.length > 1) {
          const firstLevelNode = treeMap.get(firstLevelKey);
          const fullKey = item.yard;
          const displayTitle = yardParts.slice(1).join('-');

          const existingChild = firstLevelNode.children.find(
            (child: any) => child.key === fullKey
          );

          if (!existingChild) {
            firstLevelNode.children.push({
              title: displayTitle,
              key: fullKey,
            });
          }
        }
      });

      // 转换 Map 为数组并过滤掉没有子节点的项（如果需要的话）
      yardPositionTreeData.value = Array.from(treeMap.values())
        .filter((item: any) => item.children.length > 0)
        .map((item: any) => ({
          ...item,
          // 如果只有一级，则作为叶子节点处理
          isLeaf: item.children.length === 0,
        }));

    } else {
      message.info('没有找到匹配的箱区数据');
    }
  } catch (error) {
    message.error('获取箱区范围失败，请稍后重试');
    console.error('获取箱区范围失败:', error);
  } finally {
    loading.value = false;
  }
};

const onTreeCheck = (checkedKeys: any) => {
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
          <Spin :spinning="loading">
            <Tree
              v-model:checked-keys="selectedYardPositions"
              checkable
              :tree-data="yardPositionTreeData"
              :default-expand-all="true"
              @check="onTreeCheck"
            />
          </Spin>
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
