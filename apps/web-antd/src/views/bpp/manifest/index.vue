<script lang="ts" setup>
import { ref } from "vue";

import { Page } from "@vben/common-ui";

import { Tabs } from "ant-design-vue";

import DischargeEdi from "./modules/discharge-edi.vue";
import DischargeList from "./modules/discharge-list.vue";
import LoadingList from "./modules/loading-list.vue";

// 当前选中的清单页签：discharge 卸船清单 / loading 装船清单 / edi 卸船EDI
const activeTab = ref("discharge");
</script>

<template>
  <Page auto-content-height>
    <Tabs v-model:active-key="activeTab" class="manifest-tabs h-full">
      <Tabs.TabPane key="discharge" tab="卸船清单">
        <DischargeList />
      </Tabs.TabPane>
      <Tabs.TabPane key="loading" tab="装船清单">
        <LoadingList />
      </Tabs.TabPane>
      <Tabs.TabPane key="edi" tab="卸船EDI">
        <DischargeEdi />
      </Tabs.TabPane>
    </Tabs>
  </Page>
</template>

<style scoped>
.manifest-tabs :deep(.ant-tabs-content),
.manifest-tabs :deep(.ant-tabs-tabpane) {
  height: 100%;
}
</style>
