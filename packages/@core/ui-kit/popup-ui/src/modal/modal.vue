<script lang="ts" setup>
import type { ExtendedModalApi, ModalProps } from './modal';

import {
  computed,
  nextTick,
  onDeactivated,
  onUnmounted,
  provide,
  reactive,
  ref,
  unref,
  useId,
  watch,
} from 'vue';

import {
  useIsMobile,
  usePriorityValues,
  useSimpleLocale,
} from '@vben-core/composables';
import { Expand, Shrink } from '@vben-core/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  VbenButton,
  VbenHelpTooltip,
  VbenIconButton,
  VbenLoading,
  VisuallyHidden,
} from '@vben-core/shadcn-ui';
import { ELEMENT_ID_MAIN_CONTENT } from '@vben-core/shared/constants';
import { globalShareState } from '@vben-core/shared/global-state';
import { cn } from '@vben-core/shared/utils';

import { useModalDraggable } from './use-modal-draggable';

// 添加缩放配置接口
interface ResizeConfig {
  enabled?: boolean;
  enableDoubleClickReset?: boolean;
  handleSize?: number;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
}

interface Props extends ModalProps {
  modalApi?: ExtendedModalApi;
  // 添加缩放配置
  resizeable?: boolean | ResizeConfig;
}

const props = withDefaults(defineProps<Props>(), {
  appendToMain: false,
  destroyOnClose: false,
  modalApi: undefined,
  resizeable: undefined,
});

const components = globalShareState.getComponents();

const contentRef = ref();
const wrapperRef = ref<HTMLElement>();
const dialogRef = ref();
const headerRef = ref();
const footerRef = ref();

const id = useId();

provide('DISMISSABLE_MODAL_ID', id);

const { $t } = useSimpleLocale();
const { isMobile } = useIsMobile();
const state = props.modalApi?.useStore?.();
const {
  appendToMain,
  bordered,
  cancelText,
  centered,
  class: modalClass,
  closable,
  closeOnClickModal,
  closeOnPressEscape,
  confirmDisabled,
  confirmLoading,
  confirmText,
  contentClass,
  description,
  destroyOnClose,
  draggable,
  footer: showFooter,
  footerClass,
  fullscreen,
  fullscreenButton,
  header,
  headerClass,
  loading: showLoading,
  modal,
  openAutoFocus,
  overlayBlur,
  showCancelButton,
  showConfirmButton,
  submitting,
  title,
  titleTooltip,
  animationType,
  zIndex,
  resizeable,
} = usePriorityValues(props, state);

// 拖动缩放相关状态
const resizeState = reactive({
  isResizing: false,
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  minWidth: 400,
  minHeight: 300,
  maxWidth: 0,
  maxHeight: 0,
});

// 尺寸状态
const dimensions = reactive({
  width: 0,
  height: 0,
});

// 记录原始尺寸 + 新增：标记是否已解除最大高度限制
const originalDimensions = reactive({
  width: 0,
  height: 0,
  hasRecorded: false,
  isMaxHeightRemoved: false,
});

// 是否启用拖动缩放
const enableResize = computed(() => {
  if (fullscreen.value || isMobile.value) return false;
  return (
    resizeable.value !== false &&
    (resizeable.value === true || resizeable.value?.enabled !== false)
  );
});

// 缩放配置
const resizeConfig = computed(() => {
  const defaultConfig = {
    enabled: true,
    minWidth: 400,
    minHeight: 300,
    maxWidth: 0,
    maxHeight: 0,
    handleSize: 12,
    enableDoubleClickReset: true,
  };

  if (resizeable.value === true) return defaultConfig;
  if (resizeable.value === false) return { ...defaultConfig, enabled: false };
  return { ...defaultConfig, ...resizeable.value };
});

const enableDoubleClickReset = computed(
  () => resizeConfig.value.enableDoubleClickReset !== false,
);
const handleSize = computed(() => resizeConfig.value.handleSize || 12);
const showResizeHandle = computed(
  () => enableResize.value && !shouldFullscreen.value,
);
const shouldFullscreen = computed(() => fullscreen.value || isMobile.value);
const shouldDraggable = computed(
  () => draggable.value && !shouldFullscreen.value && header.value,
);
const shouldCentered = computed(
  () => centered.value && !shouldFullscreen.value,
);

const getAppendTo = computed(() => {
  return appendToMain.value
    ? `#${ELEMENT_ID_MAIN_CONTENT}>div:not(.absolute)>div`
    : undefined;
});

const { dragging, transform } = useModalDraggable(
  dialogRef,
  headerRef,
  shouldDraggable,
  getAppendTo,
  shouldCentered,
);

const firstOpened = ref(false);
const isClosed = ref(true);

// 记录原始尺寸
function recordOriginalDimensions() {
  if (originalDimensions.hasRecorded || !dialogRef.value) return;
  const dialog = dialogRef.value as HTMLElement;
  const tempWidth = dialog.style.width;
  const tempHeight = dialog.style.height;

  dialog.style.width = '';
  dialog.style.height = '';
  void dialog.offsetHeight;

  originalDimensions.width = dialog.offsetWidth;
  originalDimensions.height = dialog.offsetHeight;
  originalDimensions.hasRecorded = true;

  if (tempWidth) dialog.style.width = tempWidth;
  if (tempHeight) dialog.style.height = tempHeight;
}

// 初始化缩放配置
function initResizeConfig() {
  if (!enableResize.value) return;
  const config = resizeConfig.value;
  resizeState.minWidth = config.minWidth || 400;
  resizeState.minHeight = config.minHeight || 300;
  resizeState.maxWidth = config.maxWidth || 0;
  resizeState.maxHeight = config.maxHeight || 0;
  setTimeout(() => recordOriginalDimensions(), 100);
}

// 开始拖动缩放（右下角）
function startResize(e: MouseEvent) {
  if (!enableResize.value) return;
  e.preventDefault();
  e.stopPropagation();
  const dialog = dialogRef.value as HTMLElement;
  if (!dialog) return;

  resizeState.isResizing = true;
  resizeState.startX = e.clientX;
  resizeState.startY = e.clientY;
  resizeState.startWidth = dialog.offsetWidth;
  resizeState.startHeight = dialog.offsetHeight;

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'se-resize';
}

// 处理拖动缩放
function handleResize(e: MouseEvent) {
  if (!resizeState.isResizing || !dialogRef.value) return;
  const dx = e.clientX - resizeState.startX;
  const dy = e.clientY - resizeState.startY;
  const newWidth = Math.max(resizeState.startWidth + dx, resizeState.minWidth);
  const newHeight = Math.max(
    resizeState.startHeight + dy,
    resizeState.minHeight,
  );

  dimensions.width = newWidth;
  dimensions.height = newHeight;
  const dialog = dialogRef.value as HTMLElement;
  dialog.style.maxHeight = 'none';
  originalDimensions.isMaxHeightRemoved = true; // 标记永久解除
  dialog.style.width = `${newWidth}px`;
  dialog.style.height = `${newHeight}px`;

  if (wrapperRef.value) {
    const headerHeight = headerRef.value?.offsetHeight || 0;
    const footerHeight = footerRef.value?.offsetHeight || 0;
    const padding = 24;
    const contentHeight = Math.max(
      newHeight - headerHeight - footerHeight - padding,
      100,
    );
    wrapperRef.value.style.height = `${contentHeight}px`;
    wrapperRef.value.style.maxHeight = 'none';
  }
}

// 开始垂直调整高度（底部）
function startVerticalResize(e: MouseEvent) {
  if (!enableResize.value) return;
  e.preventDefault();
  e.stopPropagation();
  const dialog = dialogRef.value as HTMLElement;
  if (!dialog) return;

  resizeState.isResizing = true;
  resizeState.startY = e.clientY;
  resizeState.startHeight = dialog.offsetHeight;

  document.addEventListener('mousemove', handleVerticalResizeMove);
  document.addEventListener('mouseup', stopResize);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 's-resize';
}

// 处理垂直调整移动（底部）
function handleVerticalResizeMove(e: MouseEvent) {
  if (!resizeState.isResizing || !dialogRef.value) return;
  const dy = e.clientY - resizeState.startY;
  const newHeight = Math.max(
    resizeState.startHeight + dy,
    resizeState.minHeight,
  );

  dimensions.height = newHeight;
  const dialog = dialogRef.value as HTMLElement;
  dialog.style.maxHeight = 'none';
  originalDimensions.isMaxHeightRemoved = true;
  dialog.style.height = `${newHeight}px`;
}

// 开始水平调整宽度（右侧）
function startHorizontalResize(e: MouseEvent) {
  if (!enableResize.value) return;
  e.preventDefault();
  e.stopPropagation();
  const dialog = dialogRef.value as HTMLElement;
  if (!dialog) return;

  resizeState.isResizing = true;
  resizeState.startX = e.clientX;
  resizeState.startWidth = dialog.offsetWidth;

  document.addEventListener('mousemove', handleHorizontalResizeMove);
  document.addEventListener('mouseup', stopResize);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'e-resize';
}

// 处理水平调整移动（右侧）
function handleHorizontalResizeMove(e: MouseEvent) {
  if (!resizeState.isResizing || !dialogRef.value) return;
  const dx = e.clientX - resizeState.startX;
  const newWidth = Math.max(resizeState.startWidth + dx, resizeState.minWidth);

  dimensions.width = newWidth;
  const dialog = dialogRef.value as HTMLElement;
  dialog.style.width = `${newWidth}px`;
}

// 左侧水平缩放 - 核心方法
function startLeftResize(e: MouseEvent) {
  if (!enableResize.value) return;
  e.preventDefault();
  e.stopPropagation();
  const dialog = dialogRef.value as HTMLElement;
  if (!dialog) return;

  resizeState.isResizing = true;
  resizeState.startX = e.clientX;
  resizeState.startWidth = dialog.offsetWidth;

  document.addEventListener('mousemove', handleLeftResizeMove);
  document.addEventListener('mouseup', stopResize);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'w-resize';
}
// 左侧缩放移动 - 反向偏移适配，保证手感
function handleLeftResizeMove(e: MouseEvent) {
  if (!resizeState.isResizing || !dialogRef.value) return;
  const dx = resizeState.startX - e.clientX; // 反向计算偏移量
  const newWidth = Math.max(resizeState.startWidth + dx, resizeState.minWidth);

  dimensions.width = newWidth;
  const dialog = dialogRef.value as HTMLElement;
  dialog.style.width = `${newWidth}px`;
}
function stopResize() {
  if (!resizeState.isResizing) return;
  resizeState.isResizing = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mousemove', handleVerticalResizeMove);
  document.removeEventListener('mousemove', handleHorizontalResizeMove);
  document.removeEventListener('mousemove', handleLeftResizeMove);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
}
// 双击重置
function handleDoubleClick(e: MouseEvent) {
  if (!enableResize.value || !enableDoubleClickReset.value) return;
  e.preventDefault();
  e.stopPropagation();
  resetToOriginalDimensions();
}

function resetToOriginalDimensions() {
  if (!originalDimensions.hasRecorded || !dialogRef.value) return;
  dimensions.width = 0;
  dimensions.height = 0;
  const dialog = dialogRef.value as HTMLElement;
  if (dialog) {
    dialog.classList.add('double-click-reset');
    dialog.style.width = '';
    dialog.style.height = '';
    dialog.style.maxHeight = '';
    originalDimensions.isMaxHeightRemoved = false; // 重置标记

    if (wrapperRef.value) {
      wrapperRef.value.style.height = '';
      wrapperRef.value.style.maxHeight = '';
    }
    setTimeout(() => dialog.classList.remove('double-click-reset'), 300);
  }
}

watch(
  () => state?.value?.isOpen,
  async (v) => {
    if (v) {
      isClosed.value = false;
      if (!firstOpened.value) firstOpened.value = true;
      await nextTick();
      if (!contentRef.value) return;
      const innerContentRef = contentRef.value.getContentRef();
      dialogRef.value = innerContentRef.$el;
      const { offsetX, offsetY } = transform;
      dialogRef.value.style.transform = shouldCentered.value
        ? `translate(${offsetX}px, calc(-50% + ${offsetY}px))`
        : `translate(${offsetX}px, ${offsetY}px)`;
      initResizeConfig();
    }
  },
  { immediate: true },
);

watch(shouldFullscreen, (v) => {
  if (v && dialogRef.value && dimensions.width > 0) resetToOriginalDimensions();
});

onDeactivated(() => {
  if (!appendToMain.value) props.modalApi?.close();
});

onUnmounted(() => {
  if (resizeState.isResizing) {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mousemove', handleVerticalResizeMove);
    document.removeEventListener('mousemove', handleHorizontalResizeMove);
    document.removeEventListener('mousemove', handleLeftResizeMove);
    document.removeEventListener('mouseup', stopResize);
  }
});

const handleFullscreen = () =>
  props.modalApi?.setState((prev) => ({
    ...prev,
    fullscreen: !fullscreen.value,
  }));
const interactOutside = (e: Event) => {
  if (!closeOnClickModal.value || submitting.value) {
    e.preventDefault();
    e.stopPropagation();
  }
};
const escapeKeyDown = (e: KeyboardEvent) => {
  if (!closeOnPressEscape.value || submitting.value) e.preventDefault();
};
const handleOpenAutoFocus = (e: Event) => {
  if (!openAutoFocus.value) e?.preventDefault();
};
const pointerDownOutside = (e: Event) => {
  const target = e.target as HTMLElement;
  const isDismissableModal = target?.dataset.dismissableModal;
  if (
    !closeOnClickModal.value ||
    isDismissableModal !== id ||
    submitting.value
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
};
const handleFocusOutside = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};
const getForceMount = computed(
  () => !unref(destroyOnClose) && unref(firstOpened),
);
const handleOpened = () =>
  requestAnimationFrame(() => props.modalApi?.onOpened());
const handleClosed = () => {
  isClosed.value = true;
  props.modalApi?.onClosed();
};
</script>

<template>
  <Dialog
    :modal="false"
    :open="state?.isOpen"
    @update:open="() => (!submitting ? modalApi?.close() : undefined)"
  >
    <DialogContent
      ref="contentRef"
      :append-to="getAppendTo"
      :class="
        cn(
          'left-0 right-0 top-[10vh] mx-auto flex max-h-[80%] w-[520px] flex-col p-0',
          shouldFullscreen ? 'sm:rounded-none' : 'sm:rounded-[var(--radius)]',
          modalClass,
          {
            'border border-border': bordered,
            'shadow-3xl': !bordered,
            'left-0 top-0 size-full max-h-full !translate-x-0 !translate-y-0':
              shouldFullscreen,
            'top-1/2': centered && !shouldFullscreen,
            'duration-300': !dragging,
            hidden: isClosed,
          },
        )
      "
      :force-mount="getForceMount"
      :modal="modal"
      :open="state?.isOpen"
      :show-close="closable"
      :animation-type="animationType"
      :z-index="zIndex"
      :overlay-blur="overlayBlur"
      close-class="top-3"
      @close-auto-focus="handleFocusOutside"
      @closed="handleClosed"
      :close-disabled="submitting"
      @escape-key-down="escapeKeyDown"
      @focus-outside="handleFocusOutside"
      @interact-outside="interactOutside"
      @open-auto-focus="handleOpenAutoFocus"
      @opened="handleOpened"
      @pointer-down-outside="pointerDownOutside"
    >
      <DialogHeader
        ref="headerRef"
        :class="
          cn(
            'px-5 py-4',
            {
              'border-b': bordered,
              hidden: !header,
              'cursor-move select-none': shouldDraggable,
            },
            headerClass,
          )
        "
      >
        <DialogTitle v-if="title" class="text-left">
          <slot name="title">
            {{ title }}
            <slot v-if="titleTooltip" name="titleTooltip">
              <VbenHelpTooltip trigger-class="pb-1">
                {{ titleTooltip }}
              </VbenHelpTooltip>
            </slot>
          </slot>
        </DialogTitle>
        <DialogDescription v-if="description">
          <slot name="description">{{ description }}</slot>
        </DialogDescription>
        <VisuallyHidden v-if="!title || !description">
          <DialogTitle v-if="!title" />
          <DialogDescription v-if="!description" />
        </VisuallyHidden>
      </DialogHeader>
      <div
        ref="wrapperRef"
        :class="
          cn('relative min-h-40 flex-1 overflow-y-auto p-3', contentClass, {
            'pointer-events-none': showLoading || submitting,
          })
        "
      >
        <slot></slot>
      </div>
      <VbenLoading v-if="showLoading || submitting" spinning />
      <VbenIconButton
        v-if="fullscreenButton"
        class="flex-center absolute right-10 top-3 hidden size-6 rounded-full px-1 text-lg text-foreground/80 opacity-70 transition-opacity hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus:outline-none disabled:pointer-events-none sm:block"
        @click="handleFullscreen"
      >
        <Shrink v-if="fullscreen" class="size-3.5" />
        <Expand v-else class="size-3.5" />
      </VbenIconButton>

      <!-- 底部拖动条 -->
      <div
        v-if="showResizeHandle"
        class="resize-bar bottom-bar absolute bottom-0 left-4 right-4 h-2 cursor-s-resize hover:bg-border/20"
        @mousedown="startVerticalResize"
        title="拖动缩放高度"
      ></div>

      <!-- 右侧拖动条 -->
      <div
        v-if="showResizeHandle"
        class="resize-bar right-bar absolute bottom-4 right-0 top-4 w-2 cursor-e-resize hover:bg-border/20"
        @mousedown="startHorizontalResize"
        title="拖动缩放宽度"
      ></div>

      <!-- 左侧拖动条（垂直） -->
      <div
        v-if="showResizeHandle"
        class="resize-bar left-bar absolute bottom-4 left-0 top-4 w-2 cursor-w-resize hover:bg-border/20"
        @mousedown="startLeftResize"
        title="拖动缩放宽度"
      ></div>

      <!-- 右下角缩放把手 -->
      <div
        v-if="showResizeHandle"
        :style="{ width: `${handleSize}px`, height: `${handleSize}px` }"
        class="resize-handle absolute bottom-0 right-0 z-50 cursor-se-resize select-none hover:opacity-80"
        @mousedown="startResize"
        @dblclick="handleDoubleClick"
        title="拖动缩放/双击重置"
      ></div>

      <DialogFooter
        v-if="showFooter"
        ref="footerRef"
        :class="
          cn(
            'flex-row items-center justify-end p-2',
            { 'border-t': bordered },
            footerClass,
          )
        "
      >
        <slot name="prepend-footer"></slot>
        <slot name="footer">
          <component
            :is="components.DefaultButton || VbenButton"
            v-if="showCancelButton"
            variant="ghost"
            :disabled="submitting"
            @click="() => modalApi?.onCancel()"
          >
            <slot name="cancelText">{{ cancelText || $t('cancel') }}</slot>
          </component>
          <slot name="center-footer"></slot>
          <component
            :is="components.PrimaryButton || VbenButton"
            v-if="showConfirmButton"
            :disabled="confirmDisabled"
            :loading="confirmLoading || submitting"
            @click="() => modalApi?.onConfirm()"
          >
            <slot name="confirmText">{{ confirmText || $t('confirm') }}</slot>
          </component>
        </slot>
        <slot name="append-footer"></slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
@keyframes resetAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
.double-click-reset {
  animation: resetAnimation 0.3s ease;
}

.resize-handle {
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 50%,
    #e5e7eb 50%,
    #e5e7eb 100%
  );
  border-radius: 4px 0 4px 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}
.resize-handle:hover {
  transform: scale(1.1);
  opacity: 1;
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 50%,
    #e4e4e7 50%,
    #e4e4e7 100%
  );
}

.resize-bar {
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 40;
}
.resize-bar:hover {
  opacity: 1;
  background-color: #e4e4e7;
}
.bottom-bar, .top-bar {
  height: 6px;
  border-radius: 3px;
}
.bottom-bar {
  bottom: -3px;
  left: 4px;
  right: 4px;
}
.top-bar {
  top: -3px;
  left: 4px;
  right: 4px;
}
.left-bar, .right-bar {
  width: 6px;
  border-radius: 3px;
}
.right-bar {
  right: -3px;
  top: 4px;
  bottom: 4px;
}
.left-bar {
  left: -3px;
  top: 4px;
  bottom: 4px;
}
</style>
