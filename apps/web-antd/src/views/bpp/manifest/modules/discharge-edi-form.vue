<script lang="ts" setup>
import type { UploadFile } from "ant-design-vue";

import type { VxeTableGridOptions } from "#/adapter/vxe-table";

import { ref } from "vue";

import { useVbenModal } from "@vben/common-ui";
import { IconifyIcon } from "@vben/icons";

import { Button, message, Tabs, Upload } from "ant-design-vue";

import { useVbenVxeGrid } from "#/adapter/vxe-table";

import {
  MOCK_EDI_SCHEDULE,
  type ShipSchedule,
  useEdiScheduleFormSchema,
  useScheduleColumns,
} from "../data";

const emit = defineEmits(["success"]);

/** 弹窗内页签：ship 船舶信息 */
const activeTab = ref("ship");

/** ---------------- 上传 EDI 舱单 ---------------- */

/** 已选 EDI 文件（本轮无接口，仅 UI 外壳） */
const fileList = ref<UploadFile[]>([]);

/** 阻止自动上传，仅本地保留所选文件 */
function beforeUpload() {
  return false;
}

/** 提交上传（本轮无接口） */
function handleUploadSubmit() {
  if (fileList.value.length === 0) {
    message.warning("请先选择文件");
    return;
  }
  message.success("上传成功");
}

/** ---------------- 船舶信息：船期查询 ---------------- */

/** 船期查询表格中当前单选行 */
const selectedRow = ref<null | ShipSchedule>(null);

const [ShipGrid, shipGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useEdiScheduleFormSchema(),
    submitButtonOptions: {
      content: "查询",
    },
    wrapperClass: "grid-cols-3 md:grid-cols-3",
  },
  gridOptions: {
    columns: useScheduleColumns(),
    height: 420,
    keepSource: false,
    data: MOCK_EDI_SCHEDULE,
    radioConfig: {
      highlight: true,
    },
    rowConfig: {
      keyField: "id",
      isHover: true,
    },
    toolbarConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions<ShipSchedule>,
  gridEvents: {
    radioChange: ({ row }: { row: ShipSchedule }) => {
      selectedRow.value = row;
    },
  },
});

/** ---------------- 弹窗 ---------------- */

const [Modal, modalApi] = useVbenModal({
  onConfirm() {
    // 兜底：直接向表格实例取单选行，避免事件未触发的场景
    const row =
      selectedRow.value ?? shipGridApi.grid?.getRadioRecord?.() ?? null;
    if (!row) {
      message.warning("请选择一条船期");
      return;
    }
    // 本轮无接口，仅做 UI 外壳：提示成功并关闭
    message.success("新增成功");
    emit("success");
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      selectedRow.value = null;
      fileList.value = [];
      shipGridApi.grid?.clearRadioRow?.();
      activeTab.value = "ship";
    }
  },
});
</script>

<template>
  <Modal title="卸船EDI-新增" class="discharge-form-modal">
    <Tabs v-model:active-key="activeTab" class="discharge-form-tabs">
      <Tabs.TabPane key="ship" tab="船舶信息">
        <!-- 上传 EDI 舱单 -->
        <div class="import-excel mb-3 rounded border border-gray-200 p-3">
          <div class="mb-2 text-sm font-medium text-gray-700">上传EDI舱单</div>
          <div class="flex items-center gap-3">
            <Upload
              v-model:file-list="fileList"
              :before-upload="beforeUpload"
              :max-count="1"
              accept=".xls,.xlsx"
              class="upload-inline"
            >
              <Button>选择文件...</Button>
            </Upload>
            <Button type="primary" @click="handleUploadSubmit">
              <template #icon>
                <IconifyIcon icon="lucide:check" />
              </template>
              提交
            </Button>
          </div>
        </div>

        <!-- 船期查询 -->
        <div class="mb-2 text-sm font-medium text-gray-700">船期查询</div>
        <ShipGrid />
      </Tabs.TabPane>
    </Tabs>
  </Modal>
</template>

<style scoped>
.discharge-form-tabs :deep(.ant-tabs-content),
.discharge-form-tabs :deep(.ant-tabs-tabpane) {
  height: 100%;
}

/* 让所选文件名与“选择文件”按钮横向排列 */
.upload-inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.upload-inline :deep(.ant-upload-list),
.upload-inline :deep(.ant-upload-list-text) {
  display: inline-flex;
  align-items: center;
}

.upload-inline :deep(.ant-upload-list-item-container),
.upload-inline :deep(.ant-upload-list-item) {
  margin-top: 0;
}
</style>
