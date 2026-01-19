<template>
  <div>
    <div class="rule" :class="{ 'is-multiple': rule.conditions.length > 1 }">
      <!-- 层级关系 -->
      <div v-show="rule.conditions.length > 1" class="rule-relation is-level">
        <a-button class="rule-relation-inner" @click="changeLevelRelation">
          {{ rule.relation === 'OR' ? '或' : '且' }}
        </a-button>
      </div>
      <!-- 层级内容 -->
      <div
        v-for="(level, idx_level) of rule.conditions"
        :key="idx_level"
        class="rule-level"
        :class="{ 'is-multiple': level.conditions.length > 1 }"
      >
        <!-- 列表关系 -->
        <div v-show="level.conditions.length > 1" class="rule-relation is-list">
          <a-button
            class="rule-relation-inner"
            @click="changeListRelation(idx_level)"
          >
            {{ level.relation === 'OR' ? '或' : '且' }}
          </a-button>
        </div>
        <div class="rule-level-inner">
          <!-- 列表 -->
          <div
            v-for="(list, idx_list) of level.conditions"
            :key="idx_list"
            class="rule-list"
            :class="{ 'is-multiple': list.conditions.length > 1 }"
          >
            <!-- 规则关系 -->
            <div v-show="list.conditions.length > 1" class="rule-relation is-item">
              <a-button
                class="rule-relation-inner"
                @click="changeItemRelation(idx_level, idx_list)"
              >
                {{ list.relation === 'OR' ? '或' : '且' }}
              </a-button>
            </div>
            <div class="rule-list-inner">
              <!-- 规则item -->
              <div v-for="(item, idx_item) of list.conditions" :key="item.id" class="rule-item" :class="{ 'is-multiple': list.conditions.length > 1 }">
                <!-- field -->
                <a-select
                  :value="item.field"
                  class="rule-item-field"
                  placeholder="请选择"
                  :filter-option="filterOption"
                  show-search
                  @change="(value) => handleFieldChange(value, idx_level, idx_list, idx_item)"
                >
                  <a-select-option v-for="field of fields" :key="field.fldName" :title="field.fldLabel">{{ field.fldLabel }}</a-select-option>
                </a-select>
                <!-- operator -->
                <a-select
                  :value="item.rule"
                  class="rule-item-operator"
                  placeholder="请选择"
                  @change="(value) => handleOperatorChange(value, idx_level, idx_list, idx_item)"
                >
                  <a-select-option v-for="operator of getOperators(item)" :key="operator.refCode" :value="operator.refCode">
                    {{ operator.refName }}
                  </a-select-option>
                </a-select>
                <!-- value -->
                <InputComponent
                  v-show="item.field && item.rule && !['null', 'notnull'].includes(item.rule)"
                  :item="item"
                  :option-list="optionList"
                  @change="(value) => handleValueChange(value, idx_level, idx_list, idx_item)"
                />
                <!-- add -->
                <div v-show="showItemAdd(idx_level, idx_list, idx_item)" class="rule-icon" @click="addItem(idx_level, idx_list)">
                  <IconifyIcon class="add" icon="mi:add" />
                </div>
                <!-- delete -->
                <div v-show="showItemDelete()" class="rule-icon" @click="deleteItem(idx_level, idx_list, idx_item)">
                  <IconifyIcon class="delete" icon="humbleicons:times" />
                </div>
              </div>
            </div>
            <!-- list add -->
            <div v-show="showListAdd(idx_level, idx_list)" class="rule-icon" @click="addList(idx_level)">
              <IconifyIcon class="add" icon="mi:add" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rule-handler flex" @click="addLevel">
      <IconifyIcon class="add" icon="mi:add" />
      <span>新增层级</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectProps } from 'ant-design-vue';
import { ref, reactive, computed, watch, toRaw } from 'vue';
import { IconifyIcon } from '@vben/icons';
import InputComponent from './InputComponent.vue';

// 导入类型定义
import type {
  Field,
  Operator,
  RuleItem,
  RuleList,
  RuleLevel,
  RuleData,
  RuleComponentProps,
  RuleComponentEmits
} from './types';

// 定义props和emits
const props = withDefaults(defineProps<RuleComponentProps>(), {
  fields: () => [],
  operators: () => [],
  ruleData: undefined,
});

const emit = defineEmits<RuleComponentEmits>();

// 使用props中的数据或默认值
const fields = computed(() => props.fields);
const operators = computed(() => props.operators);

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 辅助函数：将字段类型映射到 dbType
function getDbTypeFromFieldType(fieldType: string): string {
  const mapping: Record<string, string> = {
    'string': 'string',
    'number': 'integer',
    'date': 'date',
    'datetime': 'date',
    'select': 'select',
    'input': 'string',
    'textarea': 'string',
    'time': 'time',
  };
  return mapping[fieldType] || 'string';
}

// 获取默认item
const getDefaultItem = (): RuleItem => ({
  id: generateId(),
  field: '',
  rule: '',
  value: '',
  dbType: 'string',
  isEnum: '0'
});

// 获取默认list
const getDefaultList = (): RuleList => ({
  relation: 'AND',
  conditions: [getDefaultItem()],
});

// 获取默认level
const getDefaultLevel = (): RuleLevel => ({
  relation: 'AND',
  conditions: [getDefaultList()],
});

// 获取默认rule
const getDefaultRule = (): RuleData => ({
  relation: 'AND',
  conditions: [getDefaultLevel()],
});

// 数据格式转换函数 - 修复版本
const convertLevelDataToRuleData = (inputData: any): RuleData => {
  // 如果输入已经是 RuleData 格式
  if (inputData && inputData.relation && Array.isArray(inputData.conditions)) {
    // 检查是否已经是正确的结构
    if (inputData.conditions[0]?.conditions) {
      return { ...inputData };
    }
  }

  // 如果输入是数组（你的数据结构）
  if (Array.isArray(inputData) && inputData.length > 0) {
    const firstItem = inputData[0];

    // 处理你的数据结构
    if (firstItem.relation === 'AND' && Array.isArray(firstItem.conditions)) {

      const result: RuleData = {
        relation: firstItem.relation,
        conditions: []
      };

      // 遍历conditions
      firstItem.conditions.forEach((levelItem: any) => {
        if (levelItem.relation && Array.isArray(levelItem.conditions)) {
          const level: RuleLevel = {
            relation: levelItem.relation,
            conditions: []
          };

          // 遍历levelItem.conditions
          levelItem.conditions.forEach((listItem: any) => {
            if (listItem.relation && Array.isArray(listItem.conditions)) {
              const list: RuleList = {
                relation: listItem.relation,
                conditions: []
              };

              // 遍历listItem.conditions
              listItem.conditions.forEach((itemData: any) => {
                const field = fields.value.find(f => f.fldName === itemData.field);
                const dbType = field ? getDbTypeFromFieldType(field.fldType) : (itemData.dbType || 'string');
                const isEnum = field && field.fldType === 'select' ? '1' : (itemData.isEnum || '0');

                const item: RuleItem = {
                  id: itemData.id || generateId(),
                  field: itemData.field || '',
                  rule: itemData.rule || '',
                  value: itemData.value || '',
                  dbType: dbType,
                  isEnum: isEnum
                };

                list.conditions.push(item);
              });

              level.conditions.push(list);
            }
          });

          result.conditions.push(level);
        }
      });
      return result;
    }
  }

  return getDefaultRule();
};

// 初始化规则数据
const rule = reactive<RuleData>(convertLevelDataToRuleData(props.ruleData));

// 监听外部数据变化
watch(
  () => props.ruleData,
  (newValue) => {
    if (newValue) {
      const convertedData = convertLevelDataToRuleData(newValue);

      // 清空现有数据
      rule.conditions = [];
      Object.assign(rule, convertedData);
    }
  },
  { deep: true, immediate: true }
);

// 监听内部数据变化并通知父组件
watch(
  () => toRaw(rule),
  (newValue) => {
    emit('update:ruleData', { ...newValue });
    emit('change', { ...newValue });
  },
  { deep: true }
);

// 获取选项列表
const optionList = computed(() => {
  return fields.value
    .filter(field => field.options)
    .map(field => ({
      field: field.fldName,
      options: field.options || []
    }));
});

// 搜索过滤
const filterOption: SelectProps['filterOption'] = (input, option) => {
  if (option.children) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  return false;
};

// 获取字段类型
function getFieldType(fieldName: string): string {
  const field = fields.value.find((f) => f.fldName === fieldName);
  return field ? field.fldType : 'string';
}

// 获取支持的运算符
function getOperators(item: RuleItem): Operator[] {
  const fieldType = getFieldType(item.field);
  const data = operators.value.filter(operator => {
    return operator.supportedTypes && operator.supportedTypes.includes(fieldType);
  });
  return data;
}

// 处理字段变化
function handleFieldChange(value: string, idx_level: number, idx_list: number, idx_item: number) {
  const item = rule.conditions[idx_level].conditions[idx_list].conditions[idx_item];
  item.field = value;

  // 根据选择的字段设置对应的 dbType
  const field = fields.value.find(f => f.fldName === value);
  if (field) {
    item.dbType = getDbTypeFromFieldType(field.fldType);
    item.isEnum = field.fldType === 'select' ? '1' : '0';
  } else {
    item.dbType = 'string';
    item.isEnum = '0';
  }

  // 重置运算符和值
  item.rule = '';
  item.value = '';
}

// 处理运算符变化
function handleOperatorChange(value: string, idx_level: number, idx_list: number, idx_item: number) {
  const item = rule.conditions[idx_level].conditions[idx_list].conditions[idx_item];
  item.rule = value;

  // 如果是空值判断，清空值
  if (['null', 'notnull'].includes(value)) {
    item.value = '';
  }

  // 如果是 betweenAnd 运算符，将 dbType 设置为 dateRange
  if (value === 'betweenAnd') {
    const fieldType = getFieldType(item.field);
    if (fieldType === 'date' || fieldType === 'datetime') {
      item.dbType = 'dateRange';
    } else {
      item.dbType = getDbTypeFromFieldType(fieldType);
    }
  } else {
    const field = fields.value.find(f => f.fldName === item.field);
    if (field) {
      item.dbType = getDbTypeFromFieldType(field.fldType);
    }
  }
}

// 处理值变化
function handleValueChange(value: any, idx_level: number, idx_list: number, idx_item: number) {
  const item = rule.conditions[idx_level].conditions[idx_list].conditions[idx_item];
  item.value = value;
}

// 显示/隐藏添加按钮
function showItemAdd(idx_level: number, idx_list: number, idx_item: number): boolean {
  const list = rule.conditions[idx_level].conditions[idx_list];
  return idx_item === list.conditions.length - 1;
}

function showListAdd(idx_level: number, idx_list: number): boolean {
  const level = rule.conditions[idx_level];
  return idx_list === level.conditions.length - 1;
}

function showItemDelete(): boolean {
  return true;
}

// 添加规则项
function addItem(idx_level: number, idx_list: number) {
  const list = rule.conditions[idx_level].conditions[idx_list];
  list.conditions.push(getDefaultItem());
}

// 删除规则项
function deleteItem(idx_level: number, idx_list: number, idx_item: number) {
  const list = rule.conditions[idx_level].conditions[idx_list];
  list.conditions.splice(idx_item, 1);

  // 如果列表为空，删除整个列表
  if (list.conditions.length === 0) {
    deleteList(idx_level, idx_list);
  }
}

// 添加列表
function addList(idx_level: number) {
  const level = rule.conditions[idx_level];
  level.conditions.push(getDefaultList());
}

// 删除列表
function deleteList(idx_level: number, idx_list: number) {
  const level = rule.conditions[idx_level];
  level.conditions.splice(idx_list, 1);

  // 如果层级为空，删除整个层级
  if (level.conditions.length === 0) {
    deleteLevel(idx_level);
  }
}

// 添加层级
function addLevel() {
  rule.conditions.push(getDefaultLevel());
}

// 删除层级
function deleteLevel(idx_level: number) {
  rule.conditions.splice(idx_level, 1);
}

// 改变关系
function changeLevelRelation() {
  rule.relation = rule.relation === 'AND' ? 'OR' : 'AND';
}

function changeListRelation(idx_level: number) {
  const level = rule.conditions[idx_level];
  level.relation = level.relation === 'AND' ? 'OR' : 'AND';
}

function changeItemRelation(idx_level: number, idx_list: number) {
  const list = rule.conditions[idx_level].conditions[idx_list];
  list.relation = list.relation === 'AND' ? 'OR' : 'AND';
}

// 暴露方法，供父组件调用
defineExpose({
  getRuleData: () => ({ ...toRaw(rule) }),
  setRuleData: (data: RuleData) => {
    Object.keys(rule).forEach(key => delete (rule as any)[key]);
    Object.assign(rule, data);
  },
  validate: () => {
    for (const level of rule.conditions) {
      for (const list of level.conditions) {
        for (const item of list.conditions) {
          if (!item.field || !item.rule) {
            return false;
          }
          if (!['null', 'notnull'].includes(item.rule) && item.value === '') {
            return false;
          }
        }
      }
    }
    return true;
  }
});
</script>

<style scoped lang="less">
@import './rule.less';
</style>
