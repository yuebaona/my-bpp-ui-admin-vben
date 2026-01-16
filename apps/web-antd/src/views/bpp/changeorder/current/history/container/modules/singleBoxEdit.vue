// 单箱修改
<script setup lang="ts">
import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { boxlistColumns } from '#/views/bpp/changeorder/current/history/container/data';
import BatchEdit from '#/views/bpp/changeorder/current/history/container/modules/batchEdit.vue';
import LadingBill from './ladingBill.vue';
// 定义接收选中箱信息的props
const props = defineProps<{
  selectedBoxes?: any[];
}>();
const emit = defineEmits(['removeFromEdit']);
// 存储已选择的箱信息
const modifyBoxes = ref<any[]>([]);
const showLadingBillModal = ref(false);
const currentRow = ref<any>(null);

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    floatingFilterConfig: {
      enabled: false,
    },
    filterConfig: {
      showIcon: false,
    },
    columns: boxlistColumns(),
    height: '300px',
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    editConfig: {
      mode: 'cell',
      showIcon: true,
      trigger: 'click',
    },
    toolbarConfig: {
      search: false,
      custom: false,
      import: false,
      refresh: false,
      zoom: false,
    },
    pagerConfig: {
      pageSize: 10,
      enabled: true,
      pageSizes: [
        {
          label: '10',
          value: 10,
        },
        {
          label: '25',
          value: 25,
        },
        {
          label: '50',
          value: 50,
        },
        {
          label: '100',
          value: 100,
        },
        {
          label: '1000',
          value: 1000,
        },
        {
          label: '10000',
          value: 10_000,
        },
        {
          label: '全部',
          value: -1,
        },
      ],
    },
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async () => {
          return {
            total: modifyBoxes.value.length,
            list: modifyBoxes.value,
          };
        },
      },
    },
  },
});

// 批量编辑
const [BatchEditModal, batchEditModalApi] = useVbenModal({
  connectedComponent: BatchEdit,
  destroyOnClose: true,
});

// 提单号选择成功回调
const handleLadingBillSuccess = (data: any) => {
  showLadingBillModal.value = false;
  message.success('提单信息操作成功');
  currentRow.value = null;
};

// 刷新列表
function handleRefresh() {
  gridApi.query();
}

watch(
  () => props.selectedBoxes,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      newVal.forEach((box) => {
        const existingIndex = modifyBoxes.value.findIndex(
          (item) => item.id === box.id,
        );
        if (existingIndex === -1) {
          modifyBoxes.value.push(box);
        }
      });
      gridApi.query();
    }
  },
  { deep: true },
);

// 定义同步装卸船选项
const syncOptions = ref({
  loadingList: false, // 同步装船清单
  unloadingList: false, // 同步卸船清单
});

// 监听同步装船/卸船清单
watch(
  syncOptions,
  (newVal, oldVal) => {
    // sendToBackend(newVal);
  },
  { deep: true },
);

// 从修改列表中移除
function handleRemove() {
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning('请至少选择一条箱信息');
    return;
  }
  const selectedIds = selectedRows.map((row: any) => row.id);
  modifyBoxes.value = modifyBoxes.value.filter(
    (box) => !selectedIds.includes(box.id),
  );
  emit('removeFromEdit', selectedIds);

  // 重新加载列表数据
  gridApi.query();
  message.success(`已从修改列表中移除 ${selectedRows.length} 条箱信息`);
}

// 批量修改
function handleBatchEdit() {
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning('请至少选择一条箱信息');
    return;
  }
  const selectedIds = selectedRows.map((row) => row.id);
  batchEditModalApi.setData(selectedIds).open();
  console.log('批量修改选中的ID:', selectedIds);
}

const handleClickPickupNo = (row: any) => {
  currentRow.value = row;
  showLadingBillModal.value = true;
};

defineExpose({
  gridApi,
  modifyBoxes,
});
</script>
<template>
  <BatchEditModal class="w-3/4" @success="handleRefresh" />
  <LadingBill
    v-model:visible="showLadingBillModal"
    :current-row="currentRow"
    @success="handleLadingBillSuccess"
  />
  <Grid table-title="单箱修改">
    <template #pickupNo="{ row }">
      <span
        class="text-blue-500 cursor-pointer"
        @click="handleClickPickupNo(row)"
      >
        {{ row.pickupNo }}
      </span>
    </template>
    <template #toolbar-tools>
      <div class="flex items-center space-x-2">
        <div class="flex items-center">
          <input
            type="checkbox"
            id="syncLoadingList"
            v-model="syncOptions.loadingList"
            class="mr-1"
          />
          <label for="syncLoadingList" class="text-sm">同步装船清单</label>
        </div>

        <div class="flex items-center">
          <input
            type="checkbox"
            id="syncUnloadingList"
            v-model="syncOptions.unloadingList"
            class="mr-1"
          />
          <label for="syncUnloadingList" class="text-sm">同步卸船清单</label>
        </div>
        <TableAction
          :actions="[
            {
              label: '从修改列表中移除',
              type: 'primary',
              icon: ACTION_ICON.DELETE,
              auth: ['system:user:delete'],
              onClick: handleRemove,
            },
            {
              label: '批量修改',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['system:user:create'],
              onClick: handleBatchEdit,
            },
          ]"
        />
      </div>
    </template>
  </Grid>
</template>
