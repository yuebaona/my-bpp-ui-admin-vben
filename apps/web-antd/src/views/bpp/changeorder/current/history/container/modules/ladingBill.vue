<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import { computed, reactive, withDefaults } from 'vue';
import { Button, message, Modal } from 'ant-design-vue';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { ladingBillColumns } from '../data';

interface Props {
  visible: boolean;
  currentRow?: any;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'success', data: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  currentRow: null,
});
const emit = defineEmits<Emits>();

const modalVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
});

// 模拟数据 - 实际项目中应该从API获取
const ladingBillData = reactive<any[]>([
  {
    position: '1',
    pickupNo: 'BL001',
    cargo: '电子产品',
    packageWeight: '50',
    quantity: '100',
    totalWeight: '5000',
    volume: '10',
  },
  {
    position: '2',
    pickupNo: 'BL002',
    cargo: '服装',
    packageWeight: '20',
    quantity: '200',
    totalWeight: '4000',
    volume: '15',
  },
  {
    position: '3',
    pickupNo: 'BL003',
    cargo: '机械零件',
    packageWeight: '100',
    quantity: '50',
    totalWeight: '5000',
    volume: '8',
  },
]);

// 表格配置
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: ladingBillColumns(),
    height: '400px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'position',
      isHover: true,
    },
    editConfig: {
      mode: 'cell',
      showIcon: false,
      trigger: 'click',
    },
    toolbarConfig: {
      enabled: false,
      // refresh: false,
      // search: false,
      // zoom: false,
      // custom: true,
      // slots: {
      //   custom: 'toolbar-custom',
      // },
    },
    pagerConfig: {
      enabled: false,
    },
    data: ladingBillData,
  } as VxeTableGridOptions<any>,
});

const handleConfirm = async () => {
  message.success('数据保存成功');
  emit('success',{});
  modalVisible.value = false;
};

const handleAddRow = () => {
  const newRow = {
    position: (ladingBillData.length + 1).toString(),
    pickupNo: '',
    cargo: '',
    packageWeight: '',
    quantity: '',
    totalWeight: '',
    volume: '',
  };
  ladingBillData.push(newRow);
};

const handleDeleteRow = async (row: any) => {
  const $grid = gridApi.grid;
  await $grid.remove(row);
};
</script>

<template>
  <Modal
    v-model:open="modalVisible"
    title="提单信息管理"
    :width="800"
    :mask-closable="false"
    @confirm="handleConfirm"
  >
    <Grid>
      <!-- 操作列模板 -->
      <template #operationAction="{ row }">
        <TableAction
          :actions="[
            {
              label: '删除',
              type: 'link',
              danger: true,
              onClick: () => handleDeleteRow(row),
            },
          ]"
        />
      </template>
    </Grid>
    <div class="mt-2">
      <Button type="dashed" block @click="handleAddRow">
        + 新增一行
      </Button>
    </div>
  </Modal>
</template>
