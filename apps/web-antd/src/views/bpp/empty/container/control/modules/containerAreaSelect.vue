<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';

import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, ref, watch } from 'vue';

import { Button, message, Modal, Spin, Tag, Tree } from 'ant-design-vue';

import { getYardRange } from '#/api/bpp/empty/container/control';

interface Props {
  visible: boolean;
  ownerCodeList?: [];
  contIsoList?: [];
  tradeType?: string;
  selectedPositions?: Array<{ yardBay: string; yardRaw?: string }>;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', positions: Array<{ yardBay: string }>): void;
}

const props = withDefaults(defineProps<Props>(), {
  ownerCodeList: () => [],
  contIsoList: () => [],
  tradeType: '',
  selectedPositions: () => [],
});
const emit = defineEmits<Emits>();

const selectedYardPositions = ref<Array<{ yardBay: string; yardRaw?: string }>>(
  [],
);

const loading = ref(false);

const yardPositionTreeData = ref<TreeProps['treeData']>([]);

const expandedKeys = ref<string[]>([]);

// 获取堆场范围数据
const fetchYardRange = async () => {
  loading.value = true;
  try {
    const ownerCodeList = props.ownerCodeList;
    const contIsoList = props.contIsoList;
    const tradeType = props.tradeType || '';

    const data: EmptyContainerControlApi.yardRangeVO = {};

    if (ownerCodeList && ownerCodeList.length > 0) {
      data.ownerCodeList = ownerCodeList;
    }
    if (contIsoList && contIsoList.length > 0) {
      data.contIsoList = contIsoList;
    }
    if (tradeType) {
      data.tradeType = tradeType;
    }

    const response = await getYardRange(data);
    yardPositionTreeData.value = [];

    if (response.length > 0) {
      yardPositionTreeData.value = response
        .map((item: any) => {
          if (
            !item ||
            !item.yard ||
            !Array.isArray(item.yardBayList) ||
            item.yardBayList.length === 0
          ) {
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
    // message.error('获取箱区范围失败，请稍后重试');
    console.error('获取箱区范围失败:', error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      fetchYardRange();
    } else {
      // 模态框关闭时，重置展开状态
      expandedKeys.value = [];
    }
  },
  { immediate: false },
);

// 获取已选贝位的yardBay列表，用于Tree组件的checkedKeys
const checkedKeys = computed(() => {
  return selectedYardPositions.value.map((item) => item.yardBay);
});

watch(
  () => props.selectedPositions,
  (newValue) => {
    if (Array.isArray(newValue)) {
      selectedYardPositions.value = [...newValue];
    } else if (newValue) {
      selectedYardPositions.value = [newValue];
    } else {
      selectedYardPositions.value = [];
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

const onTreeCheck = (checkedKeys: any) => {
  const leafKeys = checkedKeys.filter((key: string) => key.includes('-'));
  // 构建新的selectedYardPositions数组，保留已有的yardRaw数据
  const newSelectedPositions: Array<{ yardBay: string; yardRaw?: string }> = [];

  leafKeys.forEach((yardBay: string) => {
    // 查找是否已存在该yardBay的记录
    const existingItem = selectedYardPositions.value.find(
      (item) => item.yardBay === yardBay,
    );
    if (existingItem) {
      // 保留已有的yardRaw数据
      newSelectedPositions.push(existingItem);
    } else {
      // 新建记录，yardRaw默认为空
      newSelectedPositions.push({ yardBay, yardRaw: '' });
    }
  });

  selectedYardPositions.value = newSelectedPositions;
};

const removeSelectedPosition = (position: {
  yardBay: string;
  yardRaw?: string;
}) => {
  selectedYardPositions.value = selectedYardPositions.value.filter(
    (item) => item.yardBay !== position.yardBay,
  );
};

const clearSelectedPositions = () => {
  selectedYardPositions.value = [];
};

const handleConfirm = () => {
  // emit('confirm', selectedYardPositions.value);
  // emit('update:visible', false); // 立即关闭，不等待
  emit('update:visible', false);
  // 然后再发出确认事件，执行数据处理逻辑
  setTimeout(() => {
    emit('confirm', selectedYardPositions.value);
  }, 100);
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
        <!--        <Input v-model:value="searchValue" placeholder="搜索" class="mb-2" />-->
        <div style="max-height: 350px; overflow-y: auto">
          <Spin :spinning="loading">
            <Tree
              v-model:checked-keys="checkedKeys"
              v-model:expanded-keys="expandedKeys"
              checkable
              :tree-data="yardPositionTreeData"
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
            :key="position.yardBay"
            closable
            color="blue"
            @close="removeSelectedPosition(position)"
          >
            {{ position.yardBay }}
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
