// 集装箱列表
<script setup lang="ts">
import { ref } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { inboxInfoColumns } from '#/views/bpp/changeorder/acceptance/plan/update/data';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    floatingFilterConfig: {
      enabled: true,
    },
    filterConfig: {
      showIcon: false,
    },
    columns: inboxInfoColumns(),
    height: '300px',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: true,
      custom: true,
      // import: true,
      refresh: true,
      zoom: true,
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
const searchKeyword = ref('');

// 执行搜索的方法
const handleSearch = () => {};
</script>
<template>
    <Grid table-title="集装箱列表">
      <template #toolbar-tools>
        <div class="flex items-center">
          <label class="w-1/5">箱号</label>
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="请输入箱号支持多条"
            enter-button
            @search="handleSearch"
            @press-enter="handleSearch"
            allow-clear
          />
        </div>
      </template>
    </Grid>
</template>
