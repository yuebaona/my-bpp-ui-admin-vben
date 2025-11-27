<script setup lang="ts">
import type { FlowOverLimitWorkApi } from '#/api/bpp/flowoverlimitwork';
import { reactive, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import dayjs from 'dayjs';
import { useDescription } from '#/components/description';
import {
  mainPlanDetailSchema,
} from '../data.ts';
// 箱信息数据
const containerData = reactive<
  FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO[]
>([]);
const formData = ref<FlowOverLimitWorkApi.AcceptancePlanVO>();
const fileList = ref<fileVo>([]);
const acceptancePlanBillMessageVO =
  reactive<FlowOverLimitWorkApi.AcceptancePlanBillMessageVO>({
    id: 0,
    acceptancePlanNo: '',
    billNo: '',
    cargoType: '',
    cargoName: '',
    cargoCount: 0,
    billType: '',
  });
const [Descriptions] = useDescription({
  componentProps: {
    bordered: true,
    column: 2,
    class: 'm-10',
    size: 'small',
    title: '基础信息',
  },
  labelStyle: {
    textAlign: 'right',
  },
  contentStyle: {
    textAlign: 'left',
  },
  schema: mainPlanDetailSchema(),
});

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    // 加载数据
    const data =
      await modalApi.getData<FlowOverLimitWorkApi.AcceptancePlanVO>();
    if (!data || !data.acceptancePlanRespVO.id) {
      return;
    }
    modalApi.lock();
    try {
      // 基础信息
      Object.assign(
        acceptancePlanBillMessageVO,
        data.acceptancePlanBillMessageRespVO,
      );
      formData.value = data.acceptancePlanRespVO;
      formData.value.plannedOperationTime = dayjs(
        formData.value.plannedOperationTime,
      ).format('YYYY-MM-DD HH:mm:ss');
      const arr = JSON.parse(data.acceptancePlanRespVO.attachmentFile);
      arr.forEach((item: fileVo) => {
        const lastSlashIndex = item.lastIndexOf('/');
        const fileName =
          lastSlashIndex === -1 ? item : item.slice(lastSlashIndex + 1);
        fileList.value.push({
          fileName: fileName.split('.')[0],
          filePath: item,
        });
      });
      // 箱信息
      for (const item of data.acceptancePlanOverOperationContainerRespVOS) {
        containerData.push(item);
      }
    } finally {
      modalApi.unlock();
    }
  },
});
</script>
<template>
  <Modal title="主计划详情" class="w-1/2">
    <Descriptions :data="formData" />
  </Modal>
</template>
<style scoped lang="scss">
.ant-descriptions-title {
  flex: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: rgb(50 54 57 / 88%);
  white-space: nowrap;
}
</style>
