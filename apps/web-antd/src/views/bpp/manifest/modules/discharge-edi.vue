<script lang="ts" setup>
import type { VxeTableGridOptions } from "#/adapter/vxe-table";

import { useVbenModal } from "@vben/common-ui";

import { message } from "ant-design-vue";

import { ACTION_ICON, TableAction, useVbenVxeGrid } from "#/adapter/vxe-table";

import {
  type DischargeManifest,
  MOCK_EDI,
  RECEIPT_STATUS_COLOR,
  SUBMIT_STATUS_COLOR,
  useGridColumns,
  useGridFormSchema,
} from "../data";
import DischargeEdiForm from "./discharge-edi-form.vue";
import DischargeEdiReceipt from "./discharge-edi-receipt.vue";

/** 新增弹窗 */
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DischargeEdiForm,
  destroyOnClose: true,
});

/** 查看回执弹窗 */
const [ReceiptModal, receiptModalApi] = useVbenModal({
  connectedComponent: DischargeEdiReceipt,
  destroyOnClose: true,
});

/** 打开新增弹窗 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 新增成功回调（本轮无列表接口，暂作占位） */
function handleSuccess() {
  todo("刷新列表");
}

/** 回执状态文案 */
const RECEIPT_STATUS_TEXT: Record<string, string> = {
  success: "回执结果成功",
  error: "回执结果出错",
  none: "未回执",
};

/** 占位提示（本轮无接口） */
function todo(name: string) {
  message.info(`${name}：功能待接入`);
}

/** 查看回执 */
function handleViewReceipt(row: DischargeManifest) {
  receiptModalApi.setData(row).open();
}

/** 删除卸船EDI */
function handleDelete(row: DischargeManifest) {
  todo(`删除(${row.shipCallSign})`);
}

/** 卸船EDI表格（本轮使用本地假数据，暂不接入分页查询接口） */
const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitButtonOptions: {
      content: "查询",
    },
    wrapperClass: "grid-cols-4 md:grid-cols-4",
  },
  gridOptions: {
    columns: useGridColumns(),
    height: "auto",
    keepSource: false,
    data: MOCK_EDI,
    radioConfig: {
      highlight: true,
    },
    rowConfig: {
      keyField: "id",
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<DischargeManifest>,
});
</script>

<template>
  <FormModal class="w-4/5" @success="handleSuccess" />
  <ReceiptModal />
  <Grid table-title="卸船EDI">
    <template #toolbar-tools>
      <div class="flex items-center gap-4">
        <!-- 状态图例：说明表格中颜色块对应的提交/回执状态 -->
        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span class="flex items-center gap-1">
            提交状态：
            <span
              class="legend-block"
              :style="{ background: SUBMIT_STATUS_COLOR[1] }"
            />
            已提交
            <span
              class="legend-block"
              :style="{ background: SUBMIT_STATUS_COLOR[0] }"
            />
            未提交
          </span>
          <span class="flex items-center gap-1">
            回执状态：
            <span
              class="legend-block"
              :style="{ background: RECEIPT_STATUS_COLOR.error }"
            />
            回执结果出错
            <span
              class="legend-block"
              :style="{ background: RECEIPT_STATUS_COLOR.success }"
            />
            回执结果成功
            <span
              class="legend-block"
              :style="{ background: RECEIPT_STATUS_COLOR.none }"
            />
            未回执
          </span>
        </div>
        <TableAction
          :actions="[
            {
              label: 'Excel模板下载',
              type: 'default',
              icon: ACTION_ICON.DOWNLOAD,
              onClick: () => todo('Excel模板下载'),
            },
            {
              label: '新增',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
            {
              label: '修改',
              type: 'primary',
              icon: ACTION_ICON.EDIT,
              onClick: () => todo('修改'),
            },
            {
              label: '导出',
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              onClick: () => todo('导出'),
            },
          ]"
        />
      </div>
    </template>

    <!-- 提交状态：以颜色块展示 -->
    <template #submitStatus="{ row }">
      <span
        class="status-block"
        :style="{ background: SUBMIT_STATUS_COLOR[row.submitStatus] }"
        :title="row.submitStatus === 1 ? '已提交' : '未提交'"
      />
    </template>

    <!-- 回执状态：以颜色块展示 -->
    <template #receiptStatus="{ row }">
      <span
        class="status-block"
        :style="{ background: RECEIPT_STATUS_COLOR[row.receiptStatus] }"
        :title="RECEIPT_STATUS_TEXT[row.receiptStatus]"
      />
    </template>

    <template #actions="{ row }">
      <TableAction
        :actions="[
          {
            label: '查看回执',
            type: 'link',
            icon: ACTION_ICON.VIEW,
            onClick: handleViewReceipt.bind(null, row),
          },
          {
            label: '删除',
            type: 'link',
            danger: true,
            icon: ACTION_ICON.DELETE,
            popConfirm: {
              title: `确认删除【${row.shipCallSign}】吗？`,
              confirm: handleDelete.bind(null, row),
            },
          },
        ]"
      />
    </template>
  </Grid>
</template>

<style scoped>
.status-block {
  display: inline-block;
  width: 40px;
  height: 18px;
  border-radius: 4px;
}

.legend-block {
  display: inline-block;
  width: 22px;
  height: 12px;
  border-radius: 3px;
}
</style>
