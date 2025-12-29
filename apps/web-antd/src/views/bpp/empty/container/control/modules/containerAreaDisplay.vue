<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmptyContainerControlApi } from '#/api/bpp/empty/container/control';

import { watch } from 'vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { containerAreaDisplayColumns } from '#/views/bpp/empty/container/control/data';

interface Props {
  tableBaseData?: EmptyContainerControlApi.containerAreaDisplayVO[];
  ownerCodeList?: [];
  contIsoList?: [];
  bayRangeList?: [];
  bayRanges?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tableBaseData: () => [],
  ownerCodeList: () => [],
  contIsoList: () => [],
  bayRangeList: () => [],
  bayRanges: '',
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: containerAreaDisplayColumns(),
    height: 'auto',
    keepSource: false,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      search: false,
      custom: false,
      export: false,
      import: false,
      refresh: false,
      zoom: false,
    },
    pagerConfig: {
      enabled: false,
    },
    data:
      props.bayRangeList?.map((item) => ({
        yardBay: item.yardBay,
        yardRaw: item.yardRaw,
        totalCount: item.totalCount,
        minDays: item.minDays,
        maxDays: item.maxDays,
      })) || [],
  } as VxeTableGridOptions<EmptyContainerControlApi.containerAreaDisplayVO>,
});

watch(() => props, { deep: true, immediate: true });
</script>

<template>
  <Grid style="height: 300px; width: 600px" />
</template>
