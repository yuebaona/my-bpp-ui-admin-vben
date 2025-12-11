// 单箱修改
<script setup lang="ts">

import {ACTION_ICON, TableAction, useVbenVxeGrid} from '#/adapter/vxe-table';
import { boxlistColumns } from '#/views/bpp/changeorder/current/history/container/data';
import {ref, watch} from "vue";

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
    columns: boxlistColumns(),
    height: '300px',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
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
    },
    proxyConfig: {
      autoLoad: false,
    },
  },
});

// 定义同步装卸船选项
const syncOptions = ref({
  loadingList: false,  // 同步装船清单
  unloadingList: false // 同步卸船清单
});

// 监听同步装船/卸船清单
watch(syncOptions, (newVal, oldVal) => {
  // sendToBackend(newVal);
}, { deep: true });

//从修改列表中移除
function handleRemove() {}

//批量修改
function handleBatchEdit() {}

</script>
<template>
  <Grid table-title="单箱修改">
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
