<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, ref, watch } from 'vue';

import { Button, Input, message, Modal, Spin, Tag, Tree } from 'ant-design-vue';
import { getYardRange } from '#/api/bpp/empty/container/control';

interface Props {
  visible: boolean;
  ownerCodeList?: [];
  containerIsoList?: [];
  tradeType?: string;
  selectedPositions?: string[];
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', positions: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  ownerCodeList: () => [],
  containerIsoList: () => [],
  tradeType: '',
  selectedPositions: () => [],
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
  { immediate: true }
);

watch(
  () => props.selectedPositions,
  (newValue) => {
    if (props.visible && newValue && newValue.length > 0) {
      selectedYardPositions.value = [...newValue];
    }
  },
  { immediate: true, deep: true }
);

watch(
  [() => props.ownerCodeList, () => props.containerIsoList, () => props.tradeType],
  () => {
    if (props.visible) {
      fetchYardRange();
    }
  },
  { deep: true }
);

// 获取堆场范围数据
const fetchYardRange = async () => {
  loading.value = true;
  try {
    const params: EmptyContainerControlApi.yardRangeVO = {
      ownerCodeList: props.ownerCodeList || [],
      containerIsoList: props.containerIsoList || [],
      tradeType: props.tradeType || '',
    };
    const response = await getYardRange(params);
    yardPositionTreeData.value = [];

    if (response.length > 0) {
      yardPositionTreeData.value = response
        .map((item: any) => {
          if (!item || !item.yard || !Array.isArray(item.yardBayList) || item.yardBayList.length === 0) {
            return null;
          }
          return {
            title: item.yard,
            key: item.yard,
            children: item.yardBayList.map((bay: string) => {
              return {
                title: bay,
                key: `${item.yard}-${bay}`,
              };
            }),
          };
        })
        .filter((item: any) => item !== null);
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
