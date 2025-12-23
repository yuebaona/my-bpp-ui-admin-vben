<script lang="ts" setup>
// 导入 Vue 核心模块
import { ref } from 'vue';

// 导入外部组件和工具
import { useVbenModal } from '@vben/common-ui';

import { Table } from 'ant-design-vue';

/**
 * 表单字段配置接口
 * 定义了表单字段的所有属性
 */
interface FormFieldConfig {
  // 字段名称（唯一标识）
  fieldName: string;
  // 显示标签
  label: string;
  // 组件类型（如 Input, Select 等）
  component: string;
  // 组件属性
  componentProps?: any;
  // 依赖关系配置
  dependencies?: any;
  // 验证规则
  rules?: string;
  // 是否禁用编辑（默认为 false）
  disabled?: boolean;
  // 序号
  serialNumber?: number;
  // 是否必填
  isRequired?: boolean;
  // 是否可见
  visible?: boolean;
}

const emit = defineEmits(['success']);

// 本地维护的字段数据，确保始终为数组
const localFields = ref<FormFieldConfig[]>([]);

const formSchema = ref<FormFieldConfig[]>([]);

// 创建模态框实例
const [Modal, modalApi] = useVbenModal({
  // 明确设置draggable属性为false，避免dragHandle插槽被调用
  draggable: false,
  // 模态框取消事件处理
  onCancel() {
    modalApi.close();
  },
  // 模态框确认事件处理
  onConfirm() {
    // 触发成功事件，将处理后的表单字段数据传递给父组件
    // 克隆并剔除 UI 辅助字段，避免污染原始数据
    const resultData = localFields.value.map(
      ({ serialNumber: _, visible: __, isRequired: ___, ...rest }) => rest,
    );
    emit('success', resultData);
    modalApi.close();
  },
  // 模态框开关状态变化事件处理
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // 当模态框打开时，获取并处理表单字段数据
      formSchema.value = modalApi.getData<FormFieldConfig[]>();
      updateLocalFields(formSchema.value);
    }
  },
});

/**
 * 表格列配置
 * 定义了字段配置列表的列结构
 */
const columns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    width: '8%',
    align: 'center',
  },
  {
    title: '字段名称',
    dataIndex: 'label',
    key: 'label',
    width: '25%',
  },
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
    dataIndex: 'isRequired',
    key: 'isRequired',
    width: '15%',
    align: 'center',
  },
];

/**
 * 更新本地字段数据
 * @param formSchema 表单字段配置数据
 */
const updateLocalFields = (formSchema: FormFieldConfig[]) => {
  // 确保 formSchema 是数组，避免空值问题
  if (!Array.isArray(formSchema)) {
    localFields.value = [];
    return;
  }

  // 处理表单字段数据，添加序号并初始化默认值
  localFields.value = formSchema.map((field, index) => {
    // 计算是否必填（基于是否有验证规则）
    const isRequired = field.rules !== undefined;
    // 计算是否禁用（默认可见时不禁用，不可见时禁用）
    let visible = true;
    let disabled = false;
    if (field.disabled !== undefined) {
      disabled = field.disabled;
    }
    if (field.dependencies !== undefined) {
      visible = !!field.dependencies.show();
    }

    return {
      ...field,
      serialNumber: index + 1,
      isRequired,
      visible,
      disabled,
      // 可编辑状态：与禁用状态相反
      editable: !disabled,
    };
  });
};

/**
 * 处理字段可见性变化
 * @param checked 是否可见
 * @param record 当前字段配置
 */
const handleVisibleChange = (checked: boolean, record: FormFieldConfig) => {
  // 使用三元表达式替换if-else语句，修复ESLint错误
  record.dependencies = {
    triggerFields: [''],
    show: () => checked,
  };
};

/**
 * 处理字段必填性变化
 * @param checked 是否必填
 * @param record 当前字段配置
 */
const handleRequiredChange = (checked: boolean, record: FormFieldConfig) => {
  if (checked) {
    // 如果必填，根据组件类型设置相应的验证规则
    record.rules =
      record.component === 'Select' ? 'selectRequired' : 'required';
  } else {
    // 如果不必填，移除验证规则
    delete record.rules;
  }
};

/**
 * 处理字段可编辑性变化
 * @param checked 是否可编辑
 * @param record 当前字段配置
 */
const handleEditableChange = (checked: boolean, record: FormFieldConfig) => {
  // 可编辑状态与禁用状态相反
  record.disabled = !checked;
};
</script>

<template>
  <!-- 模态框组件 -->
  <Modal title="字段配置">
    <!-- 表格组件，用于展示字段配置列表 -->
    <Table
      :columns="columns"
      :data-source="localFields"
      :pagination="false"
      :row-key="(record) => record.fieldName"
    >
      <!-- 自定义表格单元格内容 -->
      <template #bodyCell="{ column, record }">
        <!-- 序号列 -->
        <template v-if="column.key === 'serialNumber'">
          {{ record.serialNumber }}
        </template>
        <!-- 字段名称列 -->
        <template v-else-if="column.key === 'label'">
          {{ record.label }}
        </template>
        <!-- 是否可见列 -->
        <template v-else-if="column.key === 'visible'">
          <a-switch
            v-model:checked="record.visible"
            @change="handleVisibleChange($event, record as FormFieldConfig)"
            checked-children="Y"
            un-checked-children="N"
          />
        </template>
        <!-- 是否可编辑列 -->
        <template v-else-if="column.key === 'editable'">
          <a-switch
            v-model:checked="record.editable"
            @change="handleEditableChange($event, record as FormFieldConfig)"
            checked-children="Y"
            un-checked-children="N"
          />
        </template>
        <!-- 是否必填列 -->
        <template v-else-if="column.key === 'isRequired'">
          <a-switch
            v-model:checked="record.isRequired"
            @change="handleRequiredChange($event, record as FormFieldConfig)"
            checked-children="Y"
            un-checked-children="N"
          />
        </template>
      </template>
    </Table>
  </Modal>
</template>

<style scoped>
/* 表格表头样式 */
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 500;
}
</style>
