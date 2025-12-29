<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { nextTick, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSimulationSelectContainer } from '#/api/bpp/empty/container/control';

import { gatePlanColumns } from '../data';

const emit = defineEmits(['success']);

const currentSearchParams = ref<any>(null);
const debugInfo = ref<any>(null);

const [Modal, modalApi] = useVbenModal({
  showConfirmButton: false,
  onConfirm() {
    modalApi.close();
  },
  onOpened() {
    try {
      if (typeof modalApi.getData === 'function') {
        const data = modalApi.getData();
        if (data && !currentSearchParams.value) {
          currentSearchParams.value = data;
        }
      }
    } catch (error) {
      console.error('获取 modal 数据失败:', error);
    }
    if (currentSearchParams.value) {
      nextTick(() => {
        setTimeout(() => {
          if (gridApi && typeof gridApi.query === 'function') {
            gridApi.query();
          }
        }, 500);
      });
    } else {
      console.warn('没有获取到搜索参数');
    }
  },
  onClosed() {
    currentSearchParams.value = null;
    debugInfo.value = null;
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: gatePlanColumns(),
    height: '400px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'position',
      isHover: true,
    },
    toolbarConfig: {
      enabled: false,
      refresh: false,
      search: false,
      zoom: false,
      custom: true,
    },
    pagerConfig: {
      enabled: true,
      pageSize: 10,
      pageSizes: [10, 20, 50],
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          if (!currentSearchParams.value) {
            console.warn('没有搜索参数，返回空数据');
            return { total: 0, list: [] };
          }

          try {
            // 调用模拟选箱API
            const result = await getSimulationSelectContainer({
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              ...currentSearchParams.value,
            });

            return {
              total:
                result.total || (Array.isArray(result) ? result.length : 0),
              list: result.list || result || [],
            };
          } catch (error) {
            console.error('接口调用失败:', error);
            return { total: 0, list: [] };
          }
        },
      },
    },
  } as VxeTableGridOptions<EmptyContainerControlApi.simulateContainerVO>,
});

onMounted(() => {
  debugInfo.value = {
    mountedAt: new Date().toLocaleTimeString(),
    hasModalApi: !!modalApi,
    modalApiKeys: Object.keys(modalApi || {}),
  };
});
</script>

<template>
  <Modal title="闸口计划" @success="emit('success')">
    <Grid />
  </Modal>
</template>
