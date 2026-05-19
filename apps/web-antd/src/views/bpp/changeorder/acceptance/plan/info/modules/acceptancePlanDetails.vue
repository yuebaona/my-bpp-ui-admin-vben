<script setup lang="ts">
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { AcceptancePlanApi } from '#/api/bpp/changeorder/acceptance/plan/info';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { message } from 'ant-design-vue';

import { getPlan } from '#/api/bpp/changeorder/acceptance/plan/info';
import { useDescription } from '#/components/description';
import {
  acceptancePlanChangeRecordSchema,
  acceptancePlanRecordSchema,
} from '#/views/bpp/changeorder/acceptance/plan/info/data';

const baseData = ref<AcceptancePlanApi.RecordBase>();

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    const data = await getPlan(modalApi.getData());
    baseData.value = data;
  },
  cancelText: '关闭',
  showConfirmButton: false,
});

function download() {
  message.success($t('下载成功！'));
  modalApi.close();
}

function share() {
  message.success($t('分享成功！'));
  modalApi.close();
}

const [BaseDetail] = useDescription({
  column: 2,
  size: 'small',
  labelStyle: {
    textAlign: 'center',
    minWidth: '180',
  },
  contentStyle: {
    textAlign: 'left',
  },
  schema: acceptancePlanRecordSchema(),
});

const [ModifyRecord] = useVbenVxeGrid({
  gridOptions: {
    columns: acceptancePlanChangeRecordSchema(),
    toolbarConfig: {
      refresh: false,
      search: false,
      zoom: false,
      custom: false,
      export: false,
    },
    pagerConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions<AcceptancePlanApi.RecordBase>,
});
</script>
<template>
  <Modal title="查看改单详情" class="w-1/2">
    <div class="ant-descriptions-title my-5">基础信息</div>
    <BaseDetail :data="baseData" />
    <div class="ant-descriptions-title my-5">修改记录对比</div>
    <ModifyRecord />
    <template #center-footer>
      <a-button type="primary" @click="download()">下载</a-button>
      <a-button type="primary" @click="share()">分享</a-button>
    </template>
  </Modal>
</template>
