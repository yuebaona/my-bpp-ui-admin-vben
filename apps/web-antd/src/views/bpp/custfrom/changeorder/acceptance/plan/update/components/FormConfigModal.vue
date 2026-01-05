<script lang="ts" setup>
/**
 * 字段配置弹窗
 * 用途：让用户在弹窗表格里快速调整每个字段的“是否可见 / 是否可编辑 / 是否必填”
 * 设计要点：
 * 1. 仅做“配置”层面修改，不直接改原始 schema；关闭弹窗时把结果抛给父组件
 * 2. 本地维护一份带 UI 辅助字段（serialNumber、editable）的副本，避免污染原始数据
 * 3. 所有交互通过 switch 完成，实时写入副本，确认时一次性 emit
 */

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Table } from 'ant-design-vue';

/* -------------------- 类型声明 -------------------- */

/** 后端/父组件传入的原始字段结构 */
interface RawFormField {
  /** 字段唯一标识 */
  fieldName: string;
  /** 字段中文名 */
  label: string;
  /** 组件类型，如 Input、Select */
  component: string;
  /** 透传到组件的 props */
  componentProps?: any;
  /** 字段级联依赖配置 */
  dependencies?: { show: () => boolean };
  /** 校验规则，空串或 undefined 表示非必填 */
  rules?: string;
  /** 是否禁用录入（默认可编辑） */
  disabled?: boolean;
}

/** 本地表格需要展示的字段结构（在原始结构基础上追加 3 个 UI 字段） */
interface TableRow extends RawFormField {
  /** 表格序号，从 1 开始 */
  serialNumber: number;
  /** 是否可见（用于 switch） */
  visible: boolean;
  /** 是否可编辑（用于 switch，与 disabled 相反） */
  editable: boolean;
}

/* -------------------- 组件入参与出参 -------------------- */

const emit = defineEmits<{
  /** 点击“确认”后回传处理后的字段列表（已剔除 UI 辅助字段） */
  success: [fields: RawFormField[]];
}>();

/* -------------------- 弹窗控制 -------------------- */

/** 弹窗实例：Modal 为组件，modalApi 为控制句柄 */
const [Modal, modalApi] = useVbenModal({
  /** 禁止拖拽，避免 dragHandle 插槽被意外调用 */
  draggable: false,
  /** 点击“取消”或蒙层关闭 */
  onCancel: () => modalApi.close(),
  /** 点击“确认”：把本地副本净化后抛给父组件 */
  onConfirm: () => {
    const cleaned: RawFormField[] = localRows.value.map(
      // 去掉 UI 专用字段，其余原样返回
      ({ serialNumber: _, visible: __, editable: ___, ...raw }) => raw,
    );
    emit('success', cleaned);
    modalApi.close();
  },
  /** 弹窗打开时：把父组件传来的 schema 加工成表格数据 */
  onOpenChange: (open: boolean) => {
    if (!open) return;
    const src = modalApi.getData<RawFormField[]>();
    localRows.value = buildTableRows(src);
  },
});

/* -------------------- 表格列配置 -------------------- */

const columns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    width: '8%',
    align: 'center',
  },
  { title: '字段名称', dataIndex: 'label', key: 'label', width: '25%' },
  {
    title: '是否可见',
    dataIndex: 'visible',
    key: 'visible',
    width: '15%',
    align: 'center',
  },
  {
    title: '是否可编辑',
    dataIndex: 'editable',
    key: 'editable',
    width: '15%',
    align: 'center',
  },
  {
    title: '是否必填',
    dataIndex: 'rules',
    key: 'rules',
    width: '15%',
    align: 'center',
  },
];

/* -------------------- 本地数据 -------------------- */

/** 表格展示用的行数据（含 UI 辅助字段） */
const localRows = ref<TableRow[]>([]);

/* -------------------- 逻辑函数 -------------------- */

/**
 * 把父组件原始字段列表转换成表格行数据
 * 规则：
 * 1. 非数组直接返回空表
 * 2. 根据 rules 有无计算“是否必填”
 * 3. 根据 dependencies?.show() 计算“是否可见”
 * 4. 根据 disabled 计算“是否可编辑”（editable = !disabled）
 * 5. 追加自增序号
 */
function buildTableRows(list?: RawFormField[]): TableRow[] {
  if (!Array.isArray(list)) return [];
  return list.map((raw, idx) => {
    const visible = raw.dependencies ? !!raw.dependencies.show() : true;
    const disabled = Boolean(raw.disabled);
    return {
      ...raw,
      serialNumber: idx + 1,
      visible,
      editable: !disabled,
    };
  });
}

/**
 * 同步“可见”开关
 * 实现：把结果写回 dependencies.show 函数，保持与原始结构一致/
 */
function syncVisible(row: TableRow, checked: boolean) {
  row.visible = checked;
  row.dependencies = { triggerFields: [''], show: () => checked };
}

/**
 * 同步“可编辑”开关
 * 实现：直接改 disabled，同时同步 editable 缓存
 */
function syncEditable(row: TableRow, checked: boolean) {
  row.disabled = !checked;
  row.editable = checked;
}

/**
 * 同步“必填”开关
 * 实现：根据组件类型写 rules 或清空
 */
function syncRequired(row: TableRow, checked: boolean) {
  if (checked) {
    row.rules = row.component === 'Select' ? 'selectRequired' : 'required';
  } else {
    delete row.rules;
  }
}
</script>

<template>
  <Modal title="字段配置">
    <!-- 表格：关闭分页，使用 fieldName 做行 key -->
    <Table
      :columns="columns"
      :data-source="localRows"
      :pagination="false"
      row-key="fieldName"
    >
      <template #bodyCell="{ column, record }">
        <!-- 纯展示列 -->
        <template
          v-if="column.key === 'serialNumber' || column.key === 'label'"
        >
          {{ record[column.key as 'serialNumber' | 'label'] }}
        </template>

        <!-- 是否可见 -->
        <template v-if="column.key === 'visible'">
          <a-switch
            v-model:checked="record.visible"
            checked-children="Y"
            un-checked-children="N"
            @change="syncVisible(record as TableRow, $event)"
          />
        </template>

        <!-- 是否可编辑 -->
        <template v-if="column.key === 'editable'">
          <a-switch
            v-model:checked="record.editable"
            checked-children="Y"
            un-checked-children="N"
            @change="syncEditable(record as TableRow, $event)"
          />
        </template>

        <!-- 是否必填（用 rules 字段渲染） -->
        <template v-if="column.key === 'rules'">
          <a-switch
            :checked="!!record.rules"
            checked-children="Y"
            un-checked-children="N"
            @change="syncRequired(record as TableRow, $event)"
          />
        </template>
      </template>
    </Table>
  </Modal>
</template>

<style scoped>
/* 表头置灰，字体加粗 */
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 500;
}
</style>
