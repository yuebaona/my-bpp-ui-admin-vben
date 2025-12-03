<script setup lang="ts">
import type {
  AdvancedQueryEmits,
  AdvancedQueryProps,
  DictItem,
  LevelData,
} from './types';

import { computed, ref, withDefaults } from 'vue';

import { Button } from 'ant-design-vue';

import rule from '#/components/rule/index.vue';

import type { RuleData } from '#/components/rule/types.ts'

// Props定义
const props = withDefaults(defineProps<AdvancedQueryProps>(), {
  fields: () => [],
  operatorsMap: () => ({
    default: [] as DictItem[],
  }),
  defaultLevels: () => [
    {
      relation: 'AND',
      conditions: [],
    },
  ],
});

// Emits定义
const emit = defineEmits<AdvancedQueryEmits>();

// 状态管理
const activeTab = ref<'advanced' | 'general'>('advanced');
const selectedTemplate = ref('');
const conditionLevels = ref<LevelData[]>([...props.defaultLevels]);

// 计算属性
const availableFields = computed(() => props.fields);

// 方法定义
const getOperators = (field: string) => {
  if (!field) {
    return props.operatorsMap.default || [];
  }
  return props.operatorsMap.default || [];
};
// 处理rule组件数据更新
const updateConditionLevels = (newRuleData: any) => {
  // 转换rule组件的数据格式到advanced-query的格式
  if (Array.isArray(newRuleData)) {
    conditionLevels.value = newRuleData;
  }
};
const ruleData = ref<RuleData>([]);
// 处理rule组件变化事件
const handleRuleChange = (data: any) => {
  // 可以在这里添加额外的处理逻辑
  ruleData.value = data;
};

// 模板管理和操作按钮方法（保持原有逻辑）
const saveAsTemplate = () => {
  emit('saveTemplate', conditionLevels.value);
};

const saveTemplate = () => {
  emit('saveTemplate', selectedTemplate.value);
};

const resetRules = () => {
  conditionLevels.value = [...props.defaultLevels];
  emit('reset');
};

const resetAll = () => {
  resetRules();
  selectedTemplate.value = '';
};

const handleQuery = () => {
  emit('query', ruleData.value);
};
</script>

<template>
  <div class="advanced-query">
    <!-- 选项卡区域 -->
    <div class="query-tabs">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'general' }"
        @click="activeTab = 'general'"
      >
        通用查询
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'advanced' }"
        @click="activeTab = 'advanced'"
      >
        高级查询
      </div>
    </div>

    <!-- 高级查询内容 -->
    <div v-if="activeTab === 'advanced'" class="query-content">
      <div class="content-wrapper">
        <!-- 左侧过滤模板 -->
        <div class="filter-templates">
          <div class="template-title">过滤模板</div>
          <div class="template-list">
            <div
              v-for="template in templates"
              :key="template.id"
              class="template-item"
              :class="{ active: selectedTemplate === template.id }"
              @click="selectTemplate(template)"
            >
              {{ template.name }}
            </div>
          </div>
        </div>

        <!-- 右侧查询条件 -->
        <div class="rule-area">
          <rule
            :fields="availableFields"
            :operators="getOperators('')"
            :rule-data="conditionLevels"
            @update:rule-data="updateConditionLevels"
            @change="handleRuleChange"
          />
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="action-buttons">
        <Button @click="resetRules">重置规则</Button>
        <Button @click="saveAsTemplate">另存为</Button>
        <Button @click="saveTemplate">保存</Button>
        <Button @click="resetAll">重置</Button>
        <Button type="primary" @click="handleQuery">查询</Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.advanced-query {
  width: 100%;
}

.query-tabs {
  display: flex;
}

.tab-item {
  padding: 12px 24px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
  background: white;
}

.query-content {
  padding: 20px;
}

.content-wrapper {
  display: flex;
  min-height: 400px;
}

.filter-templates {
  width: 200px;
  border-right: 1px solid #e8e8e8;
  padding-right: 20px;
}

.template-title {
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 1px solid #e8e8e8;
}

.template-item:hover {
  background-color: #f5f5f5;
}

.template-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
  border-color: #91d5ff;
}

.rule-area {
  flex: 1;
  padding-left: 20px;
}

.rule {
  position: relative;
  margin-bottom: 20px;
  padding-left: 40px;
}

.rule.is-multiple {
  border: 1px solid #d9d9d9;
  padding: 15px;
  border-radius: 4px;
  margin-left: 0;
}

.rule-relation {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f2f4f6;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
}

.rule-relation.is-level {
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
}

.rule-relation.is-list {
  left: -20px;
  top: 20px;
  width: 20px;
  height: 20px;
}

.rule-relation.is-item {
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  font-size: 12px;
}

.rule-level {
  position: relative;
  margin-left: 20px;
}

.rule-level.is-multiple {
  border-left: 1px solid #d9d9d9;
  padding-left: 20px;
}

.rule-list {
  position: relative;
  margin-bottom: 10px;
}

.rule-list-inner {
  padding: 10px;
  background: #fafafa;
  border-radius: 4px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  position: relative;
}

.rule-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.rule-item-field {
  width: 200px;
}

.rule-item-operator {
  width: 120px;
}

.rule-item-value {
  width: 200px;
}

.rule-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.rule-icon:hover {
  background-color: #f0f0f0;
}

.rule-icon.add {
  color: #1890ff;
}

.rule-icon.delete {
  color: #ff4d4f;
}

.rule-icon.list-add {
  margin-top: 10px;
  margin-left: 20px;
}

.rule-handler {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s;
  color: #1890ff;
}

.rule-handler:hover {
  border-color: #1890ff;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
}
</style>
