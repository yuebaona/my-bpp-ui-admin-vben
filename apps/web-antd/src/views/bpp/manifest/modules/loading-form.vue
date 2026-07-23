<script lang="ts" setup>
import type { UploadFile } from "ant-design-vue";

import type { VxeTableGridOptions } from "#/adapter/vxe-table";

import { ref } from "vue";

import { useVbenModal } from "@vben/common-ui";
import { IconifyIcon } from "@vben/icons";

import { Button, message, Tabs, Upload } from "ant-design-vue";

import { ACTION_ICON, TableAction, useVbenVxeGrid } from "#/adapter/vxe-table";

import {
  type CargoItem,
  MOCK_CARGO,
  MOCK_LOADING_SCHEDULE,
  type ShipSchedule,
  useCargoColumns,
  useCargoFormSchema,
  useLoadingScheduleFormSchema,
  useScheduleColumns,
} from "../data";

const emit = defineEmits(["success"]);

/** 当前弹窗内页签：ship 船舶信息 / cargo 装货信息 */
const activeTab = ref("ship");

/** ---------------- 船舶信息：船期查询 ---------------- */

/** 船期查询表格中当前单选行 */
const selectedRow = ref<null | ShipSchedule>(null);

const [ShipGrid, shipGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useLoadingScheduleFormSchema(),
    submitButtonOptions: {
      content: "查询",
    },
    wrapperClass: "grid-cols-3 md:grid-cols-3",
  },
  gridOptions: {
    columns: useScheduleColumns(),
    height: 420,
    keepSource: false,
    data: MOCK_LOADING_SCHEDULE,
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

/** ---------------- 装货信息：导入 Excel + 提单号查询 ---------------- */

/** 导入 Excel 已选文件（本轮无接口，仅 UI 外壳） */
const fileList = ref<UploadFile[]>([]);

/** 阻止自动上传，仅本地保留所选文件 */
function beforeUpload() {
  return false;
}

/** 提交导入（本轮无接口） */
function handleImportSubmit() {
  if (fileList.value.length === 0) {
    message.warning("请先选择文件");
    return;
  }
  message.success("导入成功");
}

/** 本地装货数据（支持删除后刷新） */
const cargoList = ref<CargoItem[]>([...MOCK_CARGO]);
/** 表格多选选中行 id */
const checkedCargoIds = ref<number[]>([]);

function handleCargoCheck({ records }: { records: CargoItem[] }) {
  checkedCargoIds.value = records.map((item) => item.id);
}

const [CargoGrid, cargoGridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useCargoFormSchema(),
    submitButtonOptions: {
      content: "查询",
    },
    wrapperClass: "grid-cols-2 md:grid-cols-2",
  },
  gridOptions: {
    columns: useCargoColumns(),
    height: 360,
    keepSource: false,
    pagerConfig: {
      enabled: true,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50],
    },
    toolbarConfig: {
      refresh: false,
      zoom: false,
      custom: false,
    },
    rowConfig: {
      keyField: "id",
      isHover: true,
    },
    checkboxConfig: {
      highlight: true,
    },
    // 本地假分页：按提单号过滤后分页返回
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          let list = cargoList.value;
          const billNo = formValues?.billNo?.trim();
          if (billNo) {
            list = list.filter((item) => item.billNo.includes(billNo));
          }
          const total = list.length;
          const start = (page.currentPage - 1) * page.pageSize;
          return { list: list.slice(start, start + page.pageSize), total };
        },
      },
    },
  } as VxeTableGridOptions<CargoItem>,
  gridEvents: {
    checkboxAll: handleCargoCheck,
    checkboxChange: handleCargoCheck,
  },
});

/** 刷新装货表格 */
function handleCargoRefresh() {
  cargoGridApi.query();
}

/** 删除选中的装货数据（本地假数据） */
function handleCargoDelete() {
  if (checkedCargoIds.value.length === 0) {
    message.warning("请选择要删除的数据");
    return;
  }
  cargoList.value = cargoList.value.filter(
    (item) => !checkedCargoIds.value.includes(item.id)
  );
  checkedCargoIds.value = [];
  cargoGridApi.query();
}

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
      shipGridApi.grid?.clearRadioRow?.();
      activeTab.value = "ship";
    }
  },
});
</script>

<template>
  <Modal title="装船清单-新增" class="loading-form-modal">
    <Tabs v-model:active-key="activeTab" class="loading-form-tabs">
      <Tabs.TabPane key="ship" tab="船舶信息">
        <div class="mb-2 text-sm font-medium text-gray-700">船期查询</div>
        <ShipGrid />
      </Tabs.TabPane>

      <Tabs.TabPane key="cargo" tab="装货信息">
        <!-- 导入 Excel -->
        <div class="import-excel mb-3 rounded border border-gray-200 p-3">
          <div class="mb-2 text-sm font-medium text-gray-700">导入Excel</div>
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
            <Button type="primary" @click="handleImportSubmit">
              <template #icon>
                <IconifyIcon icon="lucide:check" />
              </template>
              提交
            </Button>
          </div>
        </div>

        <!-- 提单号查询 + 装货表格 -->
        <CargoGrid>
          <template #toolbar-tools>
            <TableAction
              :actions="[
                {
                  label: '刷新',
                  type: 'default',
                  icon: ACTION_ICON.REFRESH,
                  onClick: handleCargoRefresh,
                },
                {
                  label: '删除',
                  type: 'primary',
                  danger: true,
                  icon: ACTION_ICON.DELETE,
                  onClick: handleCargoDelete,
                },
              ]"
            />
          </template>
        </CargoGrid>
      </Tabs.TabPane>
    </Tabs>
  </Modal>
</template>

<style scoped>
.loading-form-tabs :deep(.ant-tabs-content),
.loading-form-tabs :deep(.ant-tabs-tabpane) {
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
