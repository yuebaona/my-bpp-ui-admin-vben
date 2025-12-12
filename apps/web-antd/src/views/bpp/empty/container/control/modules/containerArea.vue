<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { computed, ref, watch } from 'vue';

import { Button, Input, Modal, Tag, Tree, Spin, message } from 'ant-design-vue';
import { getYardRange } from '#/api/bpp/empty/container/control';

interface Props {
  visible: boolean;
  ownerList?: [];
  isoNoList?: [];
  tradeType?: string;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', positions: string[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  ownerList: () => [],
  isoNoList: () => [],
  tradeType: '',
});
const emit = defineEmits<Emits>();

const selectedYardPositions = ref<string[]>([]);
const searchValue = ref('');
const loading = ref(false);

const yardPositionTreeData = ref<TreeProps['treeData']>([]);

// 监听visible变化，当显示时获取数据
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      fetchYardRange();
    }
  },
  { immediate: true }
);

// 监听参数变化，重新获取数据
watch(
  [() => props.ownerList, () => props.isoNoList, () => props.tradeType],
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
      ownerList: props.ownerList || [],
      isoNoList: props.isoNoList || [],
      tradeType: props.tradeType || '',
    };

    const response = await getYardRange(params);

    // 清空现有数据
    yardPositionTreeData.value = [];

    if (response?.data && response.data.length > 0) {
      // 转换API返回的数据为树结构
      const treeDataMap = new Map<string, any>();

      response.data.forEach((item: string) => {
        // 处理格式为 "A01-01" 或 "A01-01-01" 的箱区编码
        const parts = item.split('-');
        if (parts.length >= 2) {
          const bay = parts[0];
          const subBay = parts.slice(1).join('-');

          if (!treeDataMap.has(bay)) {
            treeDataMap.set(bay, {
              title: bay,
              key: bay,
              children: [],
            });
          }

          treeDataMap.get(bay).children.push({
            title: `${subBay}`,
            key: item,
          });
        }
      });

      yardPositionTreeData.value = Array.from(treeDataMap.values());

      if (yardPositionTreeData.value.length === 0) {
        message.info('没有找到匹配的箱区数据');
      }
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

// const yardPositionTreeData = ref<TreeProps['treeData']>([
//   {
//     title: 'A01',
//     key: 'A01',
//     children: [
//       { title: '01 (02)', key: 'A01-01' },
//       { title: '03 (04)', key: 'A01-03' },
//       { title: '05 (06)', key: 'A01-05' },
//       { title: '07 (08)', key: 'A01-07' },
//       { title: '09 (10)', key: 'A01-09' },
//     ],
//   },
//   {
//     title: 'A02',
//     key: 'A02',
//     children: [
//       { title: '01 (02)', key: 'A02-01' },
//       { title: '03 (04)', key: 'A02-03' },
//       { title: '05 (06)', key: 'A02-05' },
//       { title: '07 (08)', key: 'A02-07' },
//       { title: '09 (10)', key: 'A02-09' },
//     ],
//   },
//   {
//     title: 'B01',
//     key: 'B01',
//     children: [
//       { title: '01 (02)', key: 'B01-01' },
//       { title: '03 (04)', key: 'B01-03' },
//       { title: '05 (06)', key: 'B01-05' },
//       { title: '07 (08)', key: 'B01-07' },
//       { title: '09 (10)', key: 'B01-09' },
//     ],
//   },
//   {
//     title: 'B02',
//     key: 'B02',
//     children: [
//       { title: '01 (02)', key: 'B02-01' },
//       { title: '03 (04)', key: 'B02-03' },
//       { title: '05 (06)', key: 'B02-05' },
//       { title: '07 (08)', key: 'B02-07' },
//       { title: '09 (10)', key: 'B02-09' },
//     ],
//   },
// ]);

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
