<script lang="ts" setup>
import type { EdiReceiptRecord } from '../data';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useVbenModal } from '@vben/common-ui';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';

import {
  EDI_RECEIPT_STATUS_COLOR,
  EDI_RECEIPT_STATUS_TEXT,
  MOCK_EDI_RECEIPT,
  useEdiReceiptColumns,
} from '../data';
import DischargeEdiReceiptDetail from './discharge-edi-receipt-detail.vue';

/** 单次回执详情弹窗 */
const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: DischargeEdiReceiptDetail,
  destroyOnClose: true,
  // Keep the nested detail modal and its overlay above the receipt modal.
  zIndex: 2001,
});

/** 查看单次回执明细 */
function handleViewDetail(row: EdiReceiptRecord) {
  detailModalApi.setData(row).open();
}

/** 卸船 EDI 回执历史表格（本轮使用本地假数据，暂不接入接口） */
const [Grid] = useVbenVxeGrid({
  gridOptions: {
    align: 'left',
    border: true,
    columns: useEdiReceiptColumns(),
    data: MOCK_EDI_RECEIPT,
    keepSource: false,
    maxHeight: 500,
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
  } as VxeTableGridOptions<EdiReceiptRecord>,
});

const [Modal] = useVbenModal({
  showConfirmButton: false,
  cancelText: '关闭',
  zIndex: 2000,
});
</script>

<template>
  <DetailModal />
  <Modal title="卸船EDI回执" class="w-4/5">
    <Grid>
      <template #status="{ row }">
        <span
          class="font-medium"
          :style="{ color: EDI_RECEIPT_STATUS_COLOR[row.status] }"
        >
          {{ EDI_RECEIPT_STATUS_TEXT[row.status] }}
        </span>
      </template>

      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '查看详情',
              type: 'link',
              icon: ACTION_ICON.SEARCH,
              onClick: handleViewDetail.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Modal>
</template>
