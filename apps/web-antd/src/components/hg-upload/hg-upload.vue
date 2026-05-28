<script lang="ts" setup>
import type { UploadFile, UploadProps } from 'ant-design-vue';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { Icon } from '@iconify/vue';
import { Button, message, Upload } from 'ant-design-vue';

import { $t } from '#/locales';

// 定义 Props 接口
interface Props {
  /** 接受的文件类型，如 '.xls,.xlsx' 或 'image/png,image/jpeg' */
  accept?: string;
  /** 文件类型描述，如 'Excel 文件' */
  fileTypeLabel?: string;
  /** 是否支持粘贴上传 */
  enablePaste?: boolean;
  /** 上传 API 函数 */
  uploadApi?: (file: File, ...args: any[]) => Promise<any>;
  /** 下载模板 API 函数 */
  downloadTemplateApi?: () => Promise<any>;
  /** 模板文件名 */
  templateFileName?: string;
  maxCount?: number;
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  accept: '',
  fileTypeLabel: '所有类型文件',
  enablePaste: true,
  uploadApi: undefined,
  downloadTemplateApi: undefined,
  templateFileName: '导入模板.xls',
  maxCount: 1,
});

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const fileList = ref<UploadFile[]>([]);
const isDragOver = ref(false);
const isUploading = ref(false);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (fileList.value.length === 0) {
      message.error('请选择文件');
      return;
    }
    isUploading.value = true;
    modalApi.lock();
    try {
      const file = fileList.value[0].originFileObj as File;
      await props.uploadApi(file, false);
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } catch (error) {
      message.error('上传失败，请重试');
    } finally {
      isUploading.value = false;
      modalApi.unlock();
      resetForm();
    }
  },
});

const uploadDisabled = computed(() => isUploading.value);

// 解析 accept 字符串为数组
const acceptFileTypes = computed(() => {
  return props.accept
    .split(',')
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean);
});

// 判断是否为图片类型
const isImageType = computed(() => {
  return acceptFileTypes.value.some(type => type.startsWith('image/') || type.includes('jpg') || type.includes('png') || type.includes('jpeg'));
});

// 获取文件图标
function getFileIcon(fileName: string): string {
  if (isImageType.value) {
    return 'ant-design:file-image-filled';
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    xls: 'ant-design:file-excel-filled',
    xlsx: 'ant-design:file-excel-filled',
    pdf: 'ant-design:file-pdf-filled',
    doc: 'ant-design:file-word-filled',
    docx: 'ant-design:file-word-filled',
    txt: 'ant-design:file-text-filled',
    zip: 'ant-design:file-zip-filled',
    rar: 'ant-design:file-zip-filled',
  };

  return iconMap[ext || ''] || 'ant-design:file-filled';
}

/** 验证文件类型 */
function isValidFileType(file: File): boolean {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return acceptFileTypes.value.some(type => {
    // MIME 类型匹配
    if (type.includes('/')) {
      return (
        fileType === type ||
        (type.endsWith('/*') && fileType.startsWith(type.replace('/*', '')))
      );
    }
    // 扩展名匹配
    return fileName.endsWith(type);
  });
}

/** 上传前验证 */
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!isValidFileType(file)) {
    message.error(`请上传 ${props.fileTypeLabel}（${props.accept}）`);
    return Upload.LIST_IGNORE;
  }

  fileList.value = [{
      uid: file.uid,
      name: file.name,
      size: file.size,
      type: file.type,
      originFileObj: file,
      status: 'done',
  }];

  return false;
};

/** 处理拖拽 */
function handleDragOver(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = true;
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;

  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!isValidFileType(file)) {
    message.error(`请拖拽 ${props.fileTypeLabel}（${props.accept}）`);
    return;
  }

  fileList.value = [{
      uid: file.name,
      name: file.name,
      size: file.size,
      type: file.type,
      originFileObj: file,
      status: 'done',
    },
  ];
}

/** 处理粘贴 */
function handlePaste(e: ClipboardEvent) {
  if (!props.enablePaste) return;

  const items = e.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file && isValidFileType(file)) {
        fileList.value = [{
            uid: file.name,
            name: file.name,
            size: file.size,
            type: file.type,
            originFileObj: file,
            status: 'done',
          },
        ];
        message.success(`已粘贴文件: ${file.name}`);
      } else if (file) {
        message.error(`粘贴的文件不是有效的${props.fileTypeLabel}`);
      }
      break;
    }
  }
}

/** 下载模板 */
async function handleDownload() {
  if (!props.downloadTemplateApi) {
    message.warning('未配置下载模板功能');
    return;
  }

  try {
    const data = await props.downloadTemplateApi();
    downloadFileFromBlobPart({
      fileName: props.templateFileName,
      source: data,
    });
  } catch {
    message.error('下载模板失败');
  }
}

/** 重置表单 */
function resetForm() {
  fileList.value = [];
}
/** 移除文件 */
function handleRemove() {
  fileList.value = [];
}
</script>

<template>
  <Modal title="自定义上传" :confirm-loading="isUploading">
    <div
      class="upload-container flex min-h-[400px] flex-col items-center justify-center p-6"
      @paste="handlePaste"
    >
      <p class="mb-4 text-sm text-gray-500">
        {{
          enablePaste
            ? '提示：支持点击选择、拖拽文件到下方区域或粘贴文件上传'
            : '提示：支持点击选择或拖拽文件到下方区域上传'
        }}
      </p>

      <div class="flex w-full justify-center">
        <Upload
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          :disabled="uploadDisabled"
          :max-count="maxCount"
          :multiple="false"
          :show-upload-list="true"
          :accept="accept"
          name="file"
        >
          <div
            class="upload-area cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-all"
            style="max-width: 360px"
            :class="[
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
              uploadDisabled ? 'cursor-not-allowed opacity-50' : '',
            ]"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <Icon
              icon="ant-design:cloud-upload-outlined"
              class="mb-4 text-5xl text-gray-400"
            />
            <p class="mb-2 text-lg text-gray-700">拖拽文件到此处上传</p>
            <p class="mb-4 text-sm text-gray-500">或者点击选择文件</p>
            <div class="mt-4 text-xs text-gray-400">支持格式：{{ accept }}</div>
          </div>
        </Upload>
      </div>

      <div v-if="fileList.length > 0" class="mt-4 w-full max-w-md">
        <div
          v-for="file in fileList"
          :key="file.uid"
          class="file-item flex items-center justify-between rounded border bg-gray-50 p-3"
        >
          <div class="flex items-center">
            <Icon
              :icon="getFileIcon(file.name)"
              class="mr-2 text-xl text-green-600"
            />
            <span class="text-sm font-medium">{{ file.name }}</span>
            <span class="ml-2 text-xs text-gray-400">
              ({{ (file.size! / 1024).toFixed(2) }} KB)
            </span>
          </div>
          <Button
            type="link"
            size="small"
            @click="handleRemove"
          >
            移除
          </Button>
        </div>
      </div>
    </div>
    <template #prepend-footer>
      <div class="flex flex-auto items-center">
        <Button v-if="downloadTemplateApi" @click="handleDownload">
          <Icon icon="ant-design:download-outlined" class="mr-1" />
          下载导入模板
        </Button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.upload-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.upload-area {
  position: relative;
  overflow: hidden;
  width: 100%;
  /* max-width: 360px; */ /* 注释掉，用内联样式替代 */
  margin: 0 auto; /* ✅ 关键：强制居中 */
}

.upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-area:hover::before {
  opacity: 1;
}
</style>
