<script lang="ts" setup>
import type { EdiReceiptDetailRecord, EdiReceiptRecord } from '../data';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { downloadFileFromBlobPart } from '@vben/utils';

import { Button, Input } from 'ant-design-vue';

import { ACTION_ICON, useVbenVxeGrid } from '#/adapter/vxe-table';

import { MOCK_EDI_RECEIPT_DETAIL, useEdiReceiptDetailColumns } from '../data';

const containerNo = ref('');
const currentRows = ref<EdiReceiptDetailRecord[]>([...MOCK_EDI_RECEIPT_DETAIL]);
const currentReceipt = ref<EdiReceiptRecord>();

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    align: 'left',
    border: true,
    columns: useEdiReceiptDetailColumns(),
    data: currentRows.value,
    keepSource: false,
    maxHeight: 420,
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      isHover: true,
      keyField: 'id',
    },
    stripe: true,
    toolbarConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions<EdiReceiptDetailRecord>,
});

function updateGrid(rows: EdiReceiptDetailRecord[]) {
  currentRows.value = rows;
  gridApi.setGridOptions({ data: rows });
}

/** 按箱号筛选当前回执详情 */
function handleSearch() {
  const keyword = containerNo.value.trim().toUpperCase();
  updateGrid(
    keyword
      ? MOCK_EDI_RECEIPT_DETAIL.filter((item) =>
          item.containerNo.toUpperCase().includes(keyword),
        )
      : [...MOCK_EDI_RECEIPT_DETAIL],
  );
}

/** 清空筛选并恢复全部详情 */
function handleReset() {
  containerNo.value = '';
  updateGrid([...MOCK_EDI_RECEIPT_DETAIL]);
}

function escapeCsvCell(value: unknown) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

/** 导出当前筛选结果 */
function handleExport() {
  const lines = [
    ['箱号', '报错详情', '报错位置'],
    ...currentRows.value.map((item) => [
      item.containerNo,
      item.errorDetail,
      item.errorPosition,
    ]),
  ];
  const csv = lines
    .map((line) => line.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\r\n');
  const receiptId = currentReceipt.value?.ediFileId ?? 'detail';

  downloadFileFromBlobPart({
    fileName: `卸船EDI回执详情-${receiptId}.csv`,
    source: new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }),
  });
}

const [Modal, modalApi] = useVbenModal({
  cancelText: '关闭',
  showConfirmButton: false,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    currentReceipt.value = modalApi.getData<EdiReceiptRecord>();
    handleReset();
  },
});
</script>

<template>
  <Modal title="卸船EDI回执详情" class="w-1/2">
    <div class="receipt-detail-search">
      <label class="mb-1 block text-sm text-gray-600" for="edi-container-no">
        箱号
      </label>
      <div class="flex items-center gap-3">
        <Input
          id="edi-container-no"
          v-model:value="containerNo"
          allow-clear
          class="min-w-0 flex-1"
          placeholder="请输入箱号搜索"
          @press-enter="handleSearch"
        >
          <template #prefix>
            <IconifyIcon class="text-gray-400" :icon="ACTION_ICON.SEARCH" />
          </template>
        </Input>
        <div class="flex shrink-0 items-center">
          <Button type="primary" @click="handleSearch">
            <template #icon>
              <IconifyIcon :icon="ACTION_ICON.SEARCH" />
            </template>
            查询
          </Button>
          <Button @click="handleReset">
            <template #icon>
              <IconifyIcon :icon="ACTION_ICON.REFRESH" />
            </template>
            重置
          </Button>
          <Button @click="handleExport">
            <template #icon>
              <IconifyIcon :icon="ACTION_ICON.DOWNLOAD" />
            </template>
            导出
          </Button>
        </div>
      </div>
    </div>

    <Grid class="mt-2" />
  </Modal>
</template>

<style scoped>
.receipt-detail-search {
  padding: 10px;
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
}
</style>
