<script lang="ts" setup>
import type { fileVo } from '../data.ts';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FlowOverLimitWorkApi } from '#/api/bpp/flow/acceptance/plan/over/operation';

import { computed, reactive, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Image, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAcceptancePlanOverOperation } from '#/api/bpp/flow/acceptance/plan/over/operation';
import { useDescription } from '#/components/description';
import { handlePreview } from '#/utils/filePreview';

import {
  acceptancePlanOvrOprDetailSchema,
  attachmentDetailColumns,
  contInfoDetailColumns,
} from '../data.ts';

/**
 * 参数
 */
const props = defineProps({
  // 业务ID
  id: {
    type: String,
    default: '1',
  },
});
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
// 强制刷新，用于刷新表格，否则vxetable表格合并失败
const gridKey = ref(0);
// 图片后缀列表
const imageExts = new Set([
  'bmp',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
]);

const isImageFile = (filePath: string): boolean => {
  // 处理空值情况
  if (!filePath) return false;
  // 提取文件后缀并转小写（兼容大小写后缀，如 PNG/png）
  const ext = filePath?.split('.').pop().toLowerCase();
  return imageExts.has(ext);
};
const formattedContainerTypes = computed(() => {
  const typeCountMap = new Map();

  // 统计每种箱型的数量
  containerData.forEach((item) => {
    if (item.containerType) {
      const count = typeCountMap.get(item.containerType) || 0;
      typeCountMap.set(item.containerType, count + 1);
    }
  });

  // 按照图片格式生成显示文本
  const result = [];
  for (const [type, count] of typeCountMap.entries()) {
    result.push(`${count}×${type}`);
  }
  return result.join('\n'); // 用换行符连接
});
const handleDownload = async (row: any) => {
  // 判断如果是图片文件，则进行预览
  if (isImageFile(row.filePath)) {
    await handlePreview(row);
    return;
  }
  try {
    // 下载文件
    const a = document.createElement('a');
    a.href = row.filePath;
    a.download = row.fileName || 'download';
    document.body.append(a);
    a.click();
    a.remove();
    message.success('下载完成！');
  } catch (error) {
    message.error(`下载失败：${error.message}`);
  } finally {}
};
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
  schema: acceptancePlanOvrOprDetailSchema(),
});
const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: contInfoDetailColumns(),
    height: '250px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: false,
      search: false,
      zoom: false,
      custom: false,
    },
    pagerConfig: {
      enabled: false,
    },
    data: containerData,
    showFooter: true,
    // 重点：完善合并规则
    mergeFooterItems: [
      { row: 0, col: 0, rowspan: 1, colspan: 2 },
      { row: 0, col: 2, rowspan: 1, colspan: 7 },
    ],
    footerData: [
      {
        serialNumber: '箱量 x 箱型', // 前两列合并区域的内容
        containerNo: '', // 被合并，留空
        containerSize: formattedContainerTypes, // 剩余6列合并区域的内容（第2列字段）
        containerType: '',
        cargoWeight: '',
        totalWeight: '',
        cargoSize: '',
        overLimitDetail: '',
      },
    ],
  } as VxeTableGridOptions<FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO>,
});
const [FileGrid] = useVbenVxeGrid({
  gridOptions: {
    cellConfig:{
      height: '180px'
    },
    columns: attachmentDetailColumns(),
    height: '50px',
    keepSource: true,
    border: true,
    showOverflow: false,
    autoWidth: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: false,
      search: false,
      zoom: false,
      custom: false,
    },
    pagerConfig: {
      enabled: false,
    },
    data: fileList.value,
    showFooter: true,
  } as VxeTableGridOptions,
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
        console.log('fileName', item);
        fileList.value.push({
          fileName: fileName.split('.')[0],
          filePath: item?.split('?')[0],
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
// 初始化数据
async function getById(id) {
  // 加载数据
  const data = await getAcceptancePlanOverOperation(id);
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
      filePath: item?.split('?')[0],
    });
  });
  // 箱信息
  for (const item of data.acceptancePlanOverOperationContainerRespVOS) {
    containerData.push(item);
  }
  gridKey.value++;
}
// 监听 businessKey 变化
watch(
  () => props.id,
  async (newVal, oldVal) => {
    // 执行业务逻辑（如接口请求、状态更新等）
    if (newVal !== oldVal) {
      await getById(newVal);
    }
  },
  { immediate: true }, // 可选：初始值时立即执行一次
);
</script>
<template>
  <Descriptions :data="formData" />
  <div>
    <div class="ant-descriptions-title my-5">箱货信息</div>
    <div class="flex flex-col justify-start">
      <div class="flex justify-normal font-serif text-base">
        <div class="mx-5">提单号：{{ acceptancePlanBillMessageVO.billNo }}</div>
        <div class="mx-20">
          货名：{{ acceptancePlanBillMessageVO.cargoName }}
        </div>
      </div>

      <Grid :key="gridKey">
        <template #serialNumber="{ row }">
          <span v-if="row.serialNumber !== 'BUTTON'">箱量 x 箱型</span>
        </template>
        <template #contCargoSizeDefault="{row}">
          <div class="flex items-center justify-center">
            <label>长：{{row.contCargoSize.contCargoLength || 0}}</label>
          </div>
          <div class="flex items-center justify-center">
            <label>宽：{{row.contCargoSize.contCargoWidth || 0}}</label>
          </div>
          <div class="flex items-center justify-center">
            <label>高：{{row.contCargoSize.contCargoHeight || 0}}</label>
          </div>
        </template>
        <template #contOogDetailsDefault="{row}">
          <div class="flex items-center justify-center">
            <label>前超：{{row.contOogDetails.oogFront || 0}}</label>
          </div>
          <div class="flex items-center justify-center">
            <label>后超：{{row.contOogDetails.oogBack || 0}}</label>
          </div>
          <div class="flex items-center justify-center">
            <label>左超：{{row.contOogDetails.oogLeft || 0}}</label>
          </div>
          <div class="flex items-center justify-center">
            <label>右超：{{row.contOogDetails.oogRight || 0}}</label>
          </div>
          <div class="flex items-center justify-center">
            <label>超高：{{row.contOogDetails.oogHeight || 0}}</label>
          </div>
        </template>
      </Grid>
    </div>
  </div>
  <div>
    <div class="ant-descriptions-title my-5">附件列表</div>
    <FileGrid>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '下载',
              type: 'link',
              onClick: handleDownload.bind(null, row),
            },
            {
              label: '预览',
              type: 'link',
              onClick: handlePreview.bind(null, row),
            },
          ]"
        />
      </template>
      <template #filePath="{ row }">
        <!-- 判断是否为图片类型：是则展示Image组件，否则显示路径文本 -->
        <template v-if="isImageFile(row.filePath)">
          <Image
            :width="100"
            :src="row.filePath"
            fit="cover"
            preview
            alt="图片预览"
          />
        </template>
        <template v-else>
          <!-- 非图片类型：显示路径地址（可加样式优化显示） -->
          <span class="file-path-text">{{ row.filePath }}</span>
        </template>
      </template>
    </FileGrid>
  </div>
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
/* 标题样式 */
.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}
</style>
