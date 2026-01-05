<script lang="ts" setup>
import type {
  VxeGridDefines,
  VxeGridInstance,
  VxeGridListeners,
  VxeGridPropTypes,
  VxeGridProps as VxeTableGridProps,
  VxeToolbarPropTypes,
} from 'vxe-table';

import type { SetupContext } from 'vue';

import type { VbenFormProps } from '@vben-core/form-ui';

import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  toRaw,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue';

import { usePriorityValues } from '@vben/hooks';
import { EmptyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';
import {
  cloneDeep,
  cn,
  isBoolean,
  isEqual,
  mergeWithArrayOverride,
} from '@vben/utils';

import { VbenHelpTooltip, VbenLoading } from '@vben-core/shadcn-ui';

import { VxeButton } from 'vxe-pc-ui';
import { VxeGrid, VxeUI } from 'vxe-table';

import { extendProxyOptions } from './extends';
import { useTableForm } from './init';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import './style.css';

interface Props extends VxeGridProps {
  api: ExtendedVxeGridApi;
  resizeable?:
    | boolean
    | {
        enabled?: boolean;
        enableDoubleClickReset?: boolean;
        handleSize?: number;
        initialHeight?: number;
        initialWidth?: number;
        maxHeight?: number;
        maxWidth?: number;
        minHeight?: number;
        minWidth?: number;
      };
}

const props = withDefaults(defineProps<Props>(), {});

const FORM_SLOT_PREFIX = 'form-';
const TOOLBAR_ACTIONS = 'toolbar-actions';
const TOOLBAR_TOOLS = 'toolbar-tools';
const TABLE_TITLE = 'table-title';

const gridRef = useTemplateRef<VxeGridInstance>('gridRef');
const state = props.api?.useStore?.();

const {
  gridOptions,
  class: className,
  gridClass,
  gridEvents,
  formOptions,
  tableTitle,
  tableTitleHelp,
  showSearchForm,
  separator,
} = usePriorityValues(props, state);

const { isMobile } = usePreferences();
const isSeparator = computed(() => {
  if (
    !formOptions.value ||
    showSearchForm.value === false ||
    separator.value === false
  )
    return false;
  if (separator.value === true || separator.value === undefined) return true;
  return separator.value.show !== false;
});
const separatorBg = computed(() => {
  return !separator.value ||
    isBoolean(separator.value) ||
    !separator.value.backgroundColor
    ? undefined
    : separator.value.backgroundColor;
});
const slots: SetupContext['slots'] = useSlots();

// ✅ 拖动状态重构：移除无效的left/top偏移，只保留核心尺寸状态，提升性能
const resizeState = reactive({
  isResizing: false,
  resizeDir: '', // left/right/bottom/right-bottom
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  minWidth: 300,
  minHeight: 200,
  maxWidth: 0,
  maxHeight: 0,
});

// 尺寸状态
const dimensions = reactive({
  width: 0,
  height: 0,
});

// 双击重置标记
const resizeFlag = reactive({
  isManuallyResized: false,
  enableDoubleClickReset: true,
});

// 是否启用拖动缩放
const enableResize = computed(() => {
  return (
    props.resizeable &&
    (props.resizeable === true || props.resizeable?.enabled !== false)
  );
});

// 拖动缩放配置
const resizeConfig = computed(() => {
  const defaultConfig = {
    enabled: true,
    minWidth: 300,
    minHeight: 200,
    maxWidth: 0,
    maxHeight: 0,
    handleSize: 4,
    enableDoubleClickReset: true,
    initialWidth: 0,
    initialHeight: 0,
  };
  if (props.resizeable === true) return defaultConfig;
  if (props.resizeable === false) return { ...defaultConfig, enabled: false };

  const mergeConfig = mergeWithArrayOverride(
    defaultConfig,
    props.resizeable || {},
  );
  resizeFlag.enableDoubleClickReset = mergeConfig.enableDoubleClickReset;
  return mergeConfig;
});

// 拖动条尺寸：细条（左/右/底） + 粗把手（右下）
const resizeStyle = computed(() => {
  const cfg = resizeConfig.value;
  return {
    thinSize: cfg.handleSize || 4,
    thickSize: cfg.handleSize * 3 || 12,
  };
});

// 容器样式
const containerStyle = computed(() => {
  const style: Record<string, string> = { position: 'relative' };
  if (dimensions.width > 0) style.width = `${dimensions.width}px`;
  if (dimensions.height > 0) style.height = `${dimensions.height}px`;
  return style;
});
const showResizeHandle = computed(() => enableResize.value);

// 初始化尺寸
function initDimensions() {
  if (!enableResize.value) return;
  const config = resizeConfig.value;
  resizeState.minWidth = config.minWidth || 300;
  resizeState.minHeight = config.minHeight || 200;
  resizeState.maxWidth = config.maxWidth || 0;
  resizeState.maxHeight = config.maxHeight || 0;

  if (props.resizeable && typeof props.resizeable === 'object') {
    dimensions.width = props.resizeable.initialWidth || 0;
    dimensions.height = props.resizeable.initialHeight || 0;
    const container = gridRef.value?.$el?.parentElement;
    if (container) {
      if (dimensions.width > 0) container.style.width = `${dimensions.width}px`;
      if (dimensions.height > 0)
        container.style.height = `${dimensions.height}px`;
    }
  }
}

// ✅ 统一开始拖动：极简初始化，只存核心值，无冗余计算
function startResize(e: MouseEvent, dir: string) {
  if (!enableResize.value) return;
  e.preventDefault();
  e.stopPropagation();

  const container = (e.currentTarget as HTMLElement).closest(
    '.bg-card',
  ) as HTMLElement;
  if (!container) return;

  // 仅初始化核心状态，无DOM查询，极致流畅
  resizeState.isResizing = true;
  resizeState.resizeDir = dir;
  resizeState.startX = e.clientX;
  resizeState.startY = e.clientY;
  resizeState.startWidth = container.offsetWidth;
  resizeState.startHeight = container.offsetHeight;

  // 绑定事件 + 全局样式
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = getResizeCursor(dir);
}

// ✅ 核心重构：拖动逻辑极致优化【彻底解决左侧卡顿】
function handleResize(e: MouseEvent) {
  if (!resizeState.isResizing || !resizeState.resizeDir) return;
  const container = gridRef.value?.$el?.parentElement as HTMLElement;
  if (!container) return;

  let newWidth = resizeState.startWidth;
  let newHeight = resizeState.startHeight;
  const { resizeDir, startX, startY, startWidth, startHeight } = resizeState;
  const dx = e.clientX - startX; // X轴偏移量
  const dy = e.clientY - startY; // Y轴偏移量

  // ✅ 分方向精准计算【左侧拖动逻辑完全重构，0卡顿】
  switch (resizeDir) {
    // ✅ 底部拖动：鼠标向下 → 高度增加，基础逻辑不变
    case 'bottom': {
      newHeight = startHeight + dy;
      break;
    }
    // ✅ 左侧拖动：仅修改宽度，无偏移、无重排，丝滑到底
    // 鼠标向左 → 宽度增加 | 鼠标向右 → 宽度减小，符合视觉直觉
    case 'left': {
      newWidth = startWidth - dx;
      break;
    }
    // ✅ 右侧拖动：鼠标向右 → 宽度增加，基础逻辑不变
    case 'right': {
      newWidth = startWidth + dx;
      break;
    }
    // ✅ 右下拖动：宽高同时增加，基础逻辑不变
    case 'right-bottom': {
      newWidth = startWidth + dx;
      newHeight = startHeight + dy;
      break;
    }
  }

  // ✅ 尺寸边界限制（全局统一，防止超限）
  newWidth = Math.max(newWidth, resizeState.minWidth);
  newHeight = Math.max(newHeight, resizeState.minHeight);
  if (resizeState.maxWidth > 0)
    newWidth = Math.min(newWidth, resizeState.maxWidth);
  if (resizeState.maxHeight > 0)
    newHeight = Math.min(newHeight, resizeState.maxHeight);

  // ✅ 仅更新宽高样式，无其他DOM操作，避免重排阻塞
  dimensions.width = newWidth;
  dimensions.height = newHeight;
  resizeFlag.isManuallyResized = true;

  container.style.width = `${newWidth}px`;
  container.style.height = `${newHeight}px`;

  // 派发缩放事件
  props.api?.emit?.('resize', {
    width: newWidth,
    height: newHeight,
    dir: resizeDir,
  });
}

// 停止拖动：统一解绑事件，还原样式
function stopResize() {
  if (!resizeState.isResizing) return;
  resizeState.isResizing = false;
  resizeState.resizeDir = '';

  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.userSelect = '';
  document.body.style.cursor = '';

  props.api?.emit?.('resizeend', {
    width: dimensions.width,
    height: dimensions.height,
  });
}

// 双击重置尺寸
function handleDoubleClickReset(e: MouseEvent) {
  if (!enableResize.value || !resizeFlag.enableDoubleClickReset) return;
  e.preventDefault();
  e.stopPropagation();
  if (!resizeFlag.isManuallyResized) return;
  resetDimensions();
}

// 重置尺寸：还原所有样式和状态
function resetDimensions() {
  dimensions.width = 0;
  dimensions.height = 0;
  resizeFlag.isManuallyResized = false;

  const container = gridRef.value?.$el?.parentElement as HTMLElement;
  if (container) {
    container.style.width = '';
    container.style.height = '';
  }
  props.api?.emit?.('reset-size');
}

// 设置尺寸API
function setDimensions(width: number, height: number) {
  dimensions.width = width;
  dimensions.height = height;
  resizeFlag.isManuallyResized = width > 0 || height > 0;

  const container = gridRef.value?.$el?.parentElement;
  if (container) {
    container.style.width = width > 0 ? `${width}px` : '';
    container.style.height = height > 0 ? `${height}px` : '';
  }
}

// 暴露API
props.api.setDimensions = setDimensions;
props.api.resetDimensions = resetDimensions;
props.api.getDimensions = () => ({
  width: dimensions.width,
  height: dimensions.height,
  isManuallyResized: resizeFlag.isManuallyResized,
});

// 鼠标样式映射
function getResizeCursor(dir: string) {
  const cursorMap = {
    left: 'w-resize',
    right: 'w-resize',
    bottom: 's-resize',
    'right-bottom': 'se-resize',
  };
  return cursorMap[dir as keyof typeof cursorMap] || 'default';
}

// ======== 原有表格逻辑（无改动） ========
const [Form, formApi] = useTableForm({
  compact: true,
  handleSubmit: async () => {
    const formValues = await formApi.getValues();
    formApi.setLatestSubmissionValues(toRaw(formValues));
    props.api.reload(formValues);
  },
  handleReset: async () => {
    const prevValues = await formApi.getValues();
    await formApi.resetForm();
    const formValues = await formApi.getValues();
    formApi.setLatestSubmissionValues(formValues);
    if (isEqual(prevValues, formValues) || !formOptions.value?.submitOnChange) {
      props.api.reload(formValues);
    }
  },
  commonConfig: { componentProps: { class: 'w-full' } },
  showCollapseButton: true,
  submitButtonOptions: { content: computed(() => $t('common.search')) },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

const showTableTitle = computed(
  () => !!slots[TABLE_TITLE]?.() || tableTitle.value,
);
const showToolbar = computed(
  () =>
    !!slots[TOOLBAR_ACTIONS]?.() ||
    !!slots[TOOLBAR_TOOLS]?.() ||
    showTableTitle.value,
);

const toolbarOptions = computed(() => {
  const slotActions = slots[TOOLBAR_ACTIONS]?.();
  const slotTools = slots[TOOLBAR_TOOLS]?.();
  const searchBtn: VxeToolbarPropTypes.ToolConfig = {
    code: 'search',
    icon: 'vxe-icon-search',
    circle: true,
    status: showSearchForm.value ? 'primary' : undefined,
    title: showSearchForm.value
      ? $t('common.hideSearchPanel')
      : $t('common.showSearchPanel'),
  };
  const toolbarConfig: VxeGridPropTypes.ToolbarConfig = {
    tools: (gridOptions.value?.toolbarConfig?.tools ??
      []) as VxeToolbarPropTypes.ToolConfig[],
  };
  if (gridOptions.value?.toolbarConfig?.search && !!formOptions.value) {
    toolbarConfig.tools = Array.isArray(toolbarConfig.tools)
      ? [...toolbarConfig.tools, searchBtn]
      : [searchBtn];
  }
  if (!showToolbar.value) return { toolbarConfig };
  toolbarConfig.slots = {
    ...(slotActions || showTableTitle.value
      ? { buttons: TOOLBAR_ACTIONS }
      : {}),
    ...(slotTools ? { tools: TOOLBAR_TOOLS } : {}),
  };
  return { toolbarConfig };
});

const options = computed(() => {
  const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};
  const mergedOptions: VxeTableGridProps = cloneDeep(
    mergeWithArrayOverride(
      {},
      toRaw(toolbarOptions.value),
      toRaw(gridOptions.value),
      globalGridConfig,
    ),
  );
  if (mergedOptions.proxyConfig) {
    mergedOptions.proxyConfig.enabled = !!mergedOptions.proxyConfig.ajax;
    mergedOptions.proxyConfig.autoLoad = false;
  }
  if (mergedOptions.pagerConfig) {
    const mobileLayouts = [
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
    ] as any;
    const layouts = [
      'Total',
      'Sizes',
      'Home',
      ...mobileLayouts,
      'End',
    ] as readonly string[];
    mergedOptions.pagerConfig = mergeWithArrayOverride(
      {},
      mergedOptions.pagerConfig,
      {
        pageSize: 20,
        background: true,
        pageSizes: [10, 20, 30, 50, 100, 200],
        className: 'mt-2 w-full',
        layouts: isMobile.value ? mobileLayouts : layouts,
        size: 'mini' as const,
      },
    );
  }
  if (mergedOptions.formConfig) mergedOptions.formConfig.enabled = false;
  return mergedOptions;
});

function onToolbarToolClick(event: VxeGridDefines.ToolbarToolClickEventParams) {
  if (event.code === 'search') onSearchBtnClick();
  (
    gridEvents.value?.toolbarToolClick as VxeGridListeners['toolbarToolClick']
  )?.();
}
function onSearchBtnClick() {
  props.api?.toggleSearchForm?.();
}
const events = computed(() => ({
  ...gridEvents.value,
  toolbarToolClick: onToolbarToolClick,
}));

const delegatedSlots = computed(() => {
  return Object.keys(slots).filter(
    (key) =>
      !['empty', 'form', 'loading', TOOLBAR_ACTIONS, TOOLBAR_TOOLS].includes(
        key,
      ),
  );
});
const delegatedFormSlots = computed(() => {
  return Object.keys(slots)
    .filter((key) => key.startsWith(FORM_SLOT_PREFIX))
    .map((key) => key.replace(FORM_SLOT_PREFIX, ''));
});
const showDefaultEmpty = computed(
  () => !options.value.emptyText && !options.value.emptyRender,
);

async function init() {
  await nextTick();
  const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};
  const defaultGridOptions: VxeTableGridProps = mergeWithArrayOverride(
    {},
    toRaw(gridOptions.value),
    toRaw(globalGridConfig),
  );
  const autoLoad = defaultGridOptions.proxyConfig?.autoLoad;
  const enableProxyConfig = options.value.proxyConfig?.enabled;
  if (enableProxyConfig && autoLoad) {
    await props.api.grid.commitProxy?.(
      'query',
      formOptions.value ? ((await formApi.getValues()) ?? {}) : {},
    );
  }
  if (gridOptions.value?.formConfig?.enabled) {
    console.warn(
      '[Vben Vxe Table]: formConfig is not supported, use formOptions instead',
    );
  }
  props.api?.setState?.({ gridOptions: defaultGridOptions });
  extendProxyOptions(props.api, defaultGridOptions, () =>
    formApi.getLatestSubmissionValues(),
  );
  initDimensions();
}

watch(
  formOptions,
  () => {
    formApi.setState((prev) => {
      const finalFormOptions: VbenFormProps = mergeWithArrayOverride(
        {},
        formOptions.value,
        prev,
      );
      return {
        ...finalFormOptions,
        collapseTriggerResize: !!finalFormOptions.showCollapseButton,
      };
    });
  },
  { immediate: true },
);

const isCompactForm = computed(() => formApi.getState()?.compact);
onMounted(() => {
  props.api?.mount?.(gridRef.value, formApi);
  init();
});
onUnmounted(() => {
  formApi?.unmount?.();
  props.api?.unmount?.();
});
</script>

<template>
  <div
    :class="cn('bg-card h-full rounded-md', className)"
    :style="containerStyle"
  >
    <VxeGrid
      ref="gridRef"
      :class="
        cn('h-full p-2', { 'pt-0': showToolbar && !formOptions }, gridClass)
      "
      style="overflow: auto"
      v-bind="options"
      v-on="events"
    >
      <!-- 表格原有插槽 -->
      <template v-if="showToolbar" #toolbar-actions="slotProps">
        <slot v-if="showTableTitle" name="table-title">
          <div class="mr-1 pl-1 text-[1rem]">
            {{ tableTitle }}
            <VbenHelpTooltip v-if="tableTitleHelp" trigger-class="pb-1">
              {{ tableTitleHelp }}
            </VbenHelpTooltip>
          </div>
        </slot>
        <slot name="toolbar-actions" v-bind="slotProps"></slot>
      </template>
      <template
        v-for="slotName in delegatedSlots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
      <template #toolbar-tools="slotProps">
        <slot name="toolbar-tools" v-bind="slotProps"></slot>
        <VxeButton
          icon="vxe-icon-search"
          circle
          class="ml-2"
          v-if="gridOptions?.toolbarConfig?.search && !!formOptions"
          :status="showSearchForm ? 'primary' : undefined"
          @click="onSearchBtnClick"
        />
      </template>
      <template #form>
        <div
          v-if="formOptions"
          v-show="showSearchForm !== false"
          :class="
            cn(
              'relative rounded py-3',
              isCompactForm
                ? isSeparator
                  ? 'pb-8'
                  : 'pb-4'
                : isSeparator
                  ? 'pb-4'
                  : 'pb-0',
            )
          "
        >
          <slot name="form">
            <Form>
              <template
                v-for="slotName in delegatedFormSlots"
                :key="slotName"
                #[slotName]="slotProps"
              >
                <slot
                  :name="`${FORM_SLOT_PREFIX}${slotName}`"
                  v-bind="slotProps"
                ></slot>
              </template>
              <template #reset-before="slotProps">
                <slot name="reset-before" v-bind="slotProps"></slot>
              </template>
              <template #submit-before="slotProps">
                <slot name="submit-before" v-bind="slotProps"></slot>
              </template>
            </Form>
          </slot>
          <div
            v-if="isSeparator"
            :style="{ backgroundColor: separatorBg }"
            class="bg-background-deep z-100 absolute -left-2 bottom-1 h-2 w-[calc(100%+1rem)] overflow-hidden md:bottom-2 md:h-3"
          ></div>
        </div>
      </template>
      <template #loading>
        <slot name="loading"><VbenLoading :spinning="true" /></slot>
      </template>
      <template v-if="showDefaultEmpty" #empty>
        <slot name="empty">
          <EmptyIcon class="mx-auto" />
          <div class="mt-2">{{ $t('common.noData') }}</div>
        </slot>
      </template>
    </VxeGrid>

    <div
      v-if="showResizeHandle"
      class="absolute left-0 top-0 z-50 h-full select-none"
      :style="{ width: `${resizeStyle.thinSize}px`, cursor: 'w-resize' }"
      @mousedown="startResize($event, 'left')"
    ></div>
    <!-- 右侧宽度拖动条 -->
    <div
      v-if="showResizeHandle"
      class="absolute right-0 top-0 h-full select-none"
      :style="{ width: `${resizeStyle.thinSize}px`, cursor: 'w-resize' }"
      @mousedown="startResize($event, 'right')"
    ></div>
    <!-- 底部高度拖动条 -->
    <div
      v-if="showResizeHandle"
      class="absolute bottom-0 left-0 w-full select-none"
      :style="{ height: `${resizeStyle.thinSize}px`, cursor: 's-resize' }"
      @mousedown="startResize($event, 'bottom')"
    ></div>
    <!-- 右下整体缩放+双击重置把手 -->
    <div
      v-if="showResizeHandle"
      class="absolute bottom-0 right-0 select-none"
      :style="{
        width: `${resizeStyle.thickSize}px`,
        height: `${resizeStyle.thickSize}px`,
        cursor: 'se-resize',
      }"
      @mousedown="startResize($event, 'right-bottom')"
      @dblclick="handleDoubleClickReset"
      title="拖动缩放表格 | 双击恢复默认尺寸"
    ></div>
  </div>
</template>

<style scoped>
:global(body) {
  transition: cursor 0.1s ease;
}
:global(body) * {
  user-select: none !important;
}
</style>
