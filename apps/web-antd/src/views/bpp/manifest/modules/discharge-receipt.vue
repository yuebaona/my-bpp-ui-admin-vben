<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';

import {
  MOCK_RECEIPT,
  RECEIPT_RESULT_COLOR,
  RECEIPT_RESULT_TEXT,
  type ReceiptRecord,
  useReceiptColumns,
} from '../data';

/** 占位提示（本轮无接口） */
function todo(name: string) {
  message.info(`${name}：功能待接入`);
}

/** 下载回执 */
function handleDownload(row: ReceiptRecord) {
  todo(`下载回执(${row.receiptNo})`);
}

/** 失败回执继续处理 */
function handleContinue(row: ReceiptRecord) {
  todo(`继续(${row.receiptNo})`);
}

/** 回执列表表格（本轮使用本地假数据，暂不接入接口） */
const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: useReceiptColumns(),
    maxHeight: 500,
    keepSource: false,
    data: MOCK_RECEIPT,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions<ReceiptRecord>,
});

/** 弹窗：仅展示回执信息，底部只保留“关闭” */
const [Modal] = useVbenModal({
  showConfirmButton: false,
  cancelText: '关闭',
});
</script>

<template>
  <Modal title="卸船清单回执" class="w-4/5">
    <Grid>
      <!-- 回执状态：成功(绿)/失败(红) 文字 -->
      <template #resultStatus="{ row }">
        <span :style="{ color: RECEIPT_RESULT_COLOR[row.resultStatus] }">
          {{ RECEIPT_RESULT_TEXT[row.resultStatus] }}
        </span>
      </template>

      <!-- 回执内容：长文本自动换行展示 -->
      <template #content="{ row }">
        <div class="receipt-content">{{ row.content }}</div>
      </template>

      <!-- 操作：下载回执；失败回执额外提供“继续” -->
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '下载回执',
              type: 'link',
              icon: ACTION_ICON.DOWNLOAD,
              onClick: handleDownload.bind(null, row),
            },
            {
              label: '继续',
              type: 'link',
              icon: 'lucide:play',
              ifShow: row.resultStatus === 'error',
              onClick: handleContinue.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Modal>
</template>

<style scoped>
.receipt-content {
  padding: 4px 0;
  line-height: 1.6;
  word-break: break-all;
  white-space: normal;
}
</style>
