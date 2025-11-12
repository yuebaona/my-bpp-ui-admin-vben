<script setup lang="ts">
import type {
  AdvancedQueryEmits,
  AdvancedQueryProps,
  ConditionData,
  DictItem,
  LevelData,
} from './types';

import { computed, ref, withDefaults } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, Input, Select, Tooltip } from 'ant-design-vue';

// Props定义
const props = withDefaults(defineProps<AdvancedQueryProps>(), {
  fields: () => [],
  operatorsMap: () => ({
    default: [] as DictItem[],
  }),
  defaultLevels: () => [
    {
      relation: 'AND',
      conditions: [
        {
          field: '',
          operator: '',
          value: '',
        },
      ],
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

// 关系切换方法
const toggleLevelRelation = (levelIndex: number) => {
  const level = conditionLevels.value[levelIndex];
  if (level) {
    level.relation = level.relation === 'AND' ? 'OR' : 'AND';
  }
};

const toggleConditionRelation = (levelIndex: number, condIndex: number) => {
  const level = conditionLevels.value[levelIndex];
  if (level) {
    const condition = level.conditions[condIndex];
    if (condition && !condition.prevRelation) {
      condition.prevRelation = 'AND';
    }
    if (condition) {
      condition.prevRelation = condition.prevRelation === 'AND' ? 'OR' : 'AND';
    }
  }
};

const getConditionRelation = (level: LevelData, condIndex: number) => {
  if (condIndex === 0) return '';
  const condition = level.conditions[condIndex];
  return condition?.prevRelation === 'AND' ? '且' : '或';
};

// 条件管理方法
const addLevel = () => {
  conditionLevels.value.push({
    relation: 'AND',
    conditions: [
      {
        field: '',
        operator: '',
        value: '',
      },
    ],
  });
};

const removeLevel = (levelIndex: number) => {
  if (conditionLevels.value.length > 1) {
    conditionLevels.value.splice(levelIndex, 1);
  }
};

const addCondition = (levelIndex: number) => {
  const newCondition: ConditionData = {
    field: '',
    operator: '',
    value: '',
    prevRelation: 'AND',
  };
  conditionLevels.value[levelIndex]?.conditions.push(newCondition);
};

const removeCondition = (levelIndex: number, condIndex: number) => {
  const level = conditionLevels.value[levelIndex];
  if (level?.conditions.length === 1) {
    if (conditionLevels.value.length > 1) {
      removeLevel(levelIndex);
    }
    return;
  }
  level?.conditions.splice(condIndex, 1);
  if (level?.conditions?.[0]?.prevRelation) {
    delete level.conditions[0].prevRelation;
  }
};

// 模板管理
const saveAsTemplate = () => {
  emit('saveTemplate', conditionLevels.value);
};

const saveTemplate = () => {
  emit('saveTemplate', selectedTemplate.value);
};

// 操作按钮方法
const resetRules = () => {
  conditionLevels.value = [...props.defaultLevels];
  emit('reset');
};

const resetAll = () => {
  resetRules();
  selectedTemplate.value = '';
};

const handleQuery = () => {
  const queryParams = {
    levels: conditionLevels.value.map((level) => ({
      relation: level.relation,
      conditions: level.conditions
        .map((cond, index) => ({
          field: cond.field,
          operator: cond.operator,
          value: cond.value,
          prevRelation: index > 0 ? cond.prevRelation : undefined,
        }))
        .filter((cond) => cond.field && cond.operator && cond.value !== ''),
    })),
  };
  emit('query', queryParams);
};
</script>
<template>
  <div class="advanced-query-component">
    <!-- 选项卡区域 -->
    <div class="flex border-b border-gray-200 bg-gray-50">
      <div
        class="cursor-pointer select-none border-b-2 border-transparent px-6 py-3 transition-all duration-300 hover:text-blue-500"
        :class="{
          'border-blue-500 bg-white text-blue-600': activeTab === 'general',
        }"
        @click="activeTab = 'general'"
      >
        通用查询
      </div>
      <div
        class="cursor-pointer select-none border-b-2 border-transparent px-6 py-3 transition-all duration-300 hover:text-blue-500"
        :class="{
          'border-blue-500 bg-white text-blue-600': activeTab === 'advanced',
        }"
        @click="activeTab = 'advanced'"
      >
        高级查询
      </div>
    </div>

    <!-- 高级查询内容 -->
    <div v-if="activeTab === 'advanced'" class="p-5">
      <div class="flex min-h-[400px] flex-col gap-5 md:flex-row">
        <!-- 左侧过滤模板 -->
        <div
          class="w-[200px] border-b border-gray-200 pb-5 md:border-b-0 md:border-r md:pr-5"
        >
          <div class="mb-3 font-bold text-gray-800">过滤模板</div>
        </div>

        <!-- 右侧查询条件 -->
        <div class="flex-1">
          <!-- 条件层级容器 -->
          <div class="condition-container">
            <!-- 条件层级 -->
            <div
              v-for="(level, levelIndex) in conditionLevels"
              :key="levelIndex"
              class="level-group"
            >
              <!-- 层级标题 -->
              <div class="level-header">
                <span class="level-title">条件层级 {{ levelIndex + 1 }}</span>
                <Tooltip title="删除">
                  <Button
                    v-if="conditionLevels.length > 1"
                    type="text"
                    danger
                    size="small"
                    @click="removeLevel(levelIndex)"
                    class="flex items-center"
                  >
                    <template #icon>
                      <IconifyIcon
                        icon="icon-park-outline:delete-five"
                        style="font-size: 16px"
                      />
                    </template>
                    删除层级
                  </Button>
                </Tooltip>
              </div>

              <!-- 层级内容 -->
              <div class="level-content">
                <!-- 条件列表 -->
                <div
                  v-for="(condition, condIndex) in level.conditions"
                  :key="condIndex"
                  class="condition-item"
                >
                  <!-- 条件关系标签 -->
                  <div
                    v-if="condIndex > 0"
                    class="condition-relation-tag"
                    :class="{
                      'relation-or':
                        getConditionRelation(level, condIndex) === '或',
                    }"
                    @click="toggleConditionRelation(levelIndex, condIndex)"
                  >
                    {{ getConditionRelation(level, condIndex) }}
                  </div>

                  <!-- 条件表单 -->
                  <div class="condition-form">
                    <Select
                      v-model:value="condition.field"
                      placeholder="请选择字段"
                      style="width: 200px"
                    >
                      <a-select-option
                        v-for="field in availableFields"
                        :key="field.value"
                        :value="field.value"
                      >
                        {{ field.label }}
                      </a-select-option>
                    </Select>

                    <Select
                      v-model:value="condition.operator"
                      placeholder="请选择"
                      style="width: 120px"
                    >
                      <Select.Option
                        v-for="op in getOperators(condition.field)"
                        :key="op.value"
                        :value="op.value"
                      >
                        {{ op.label }}
                      </Select.Option>
                    </Select>

                    <Input
                      v-model:value="condition.value"
                      placeholder="请输入值"
                      style="width: 200px"
                    />
                    <Tooltip title="删除">
                      <Button
                        type="text"
                        danger
                        size="large"
                        @click="removeCondition(levelIndex, condIndex)"
                        :disabled="
                          level.conditions.length === 1 &&
                          conditionLevels.length === 1
                        "
                      >
                        <template #icon>
                          <IconifyIcon
                            icon="icon-park-outline:delete-five"
                            style="font-size: 18px"
                          />
                        </template>
                      </Button>
                    </Tooltip>
                  </div>
                </div>

                <!-- 添加条件按钮 -->
                <Button
                  type="dashed"
                  @click="addCondition(levelIndex)"
                  class="add-condition-btn"
                >
                  <template #icon>
                    <IconifyIcon icon="mi:add" class="text-lg" />
                  </template>
                  添加条件
                </Button>
              </div>

              <!-- 层级关系分隔线 -->
              <div
                v-if="levelIndex < conditionLevels.length - 1"
                class="level-relation-separator"
                @click="toggleLevelRelation(levelIndex + 1)"
              >
                <div class="separator-line"></div>
                <div
                  class="relation-tag"
                  :class="{
                    'relation-or':
                      conditionLevels[levelIndex + 1]?.relation === 'OR',
                  }"
                >
                  {{
                    conditionLevels[levelIndex + 1]?.relation === 'AND'
                      ? '且'
                      : '或'
                  }}
                </div>
                <div class="separator-line"></div>
              </div>
            </div>
          </div>

          <!-- 新增层级按钮 -->
          <Button type="dashed" @click="addLevel" class="add-level-btn">
            <template #icon>
              <IconifyIcon icon="mi:add" class="text-lg" />
            </template>
            新增层级
          </Button>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="mt-6 flex justify-center gap-3 border-t border-gray-200 pt-5">
        <Button @click="resetRules">重置规则</Button>
        <Button @click="saveAsTemplate">另存为</Button>
        <Button @click="saveTemplate">保存</Button>
        <Button @click="resetAll">重置</Button>
        <Button type="primary" @click="handleQuery">查询</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .condition-item {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .condition-relation-tag {
    align-self: flex-start;
    margin-bottom: 8px;
  }

  .condition-form {
    flex-direction: column;
  }

  .condition-form :deep(.ant-select),
  .condition-form :deep(.ant-input) {
    width: 100% !important;
  }

  .level-relation-separator {
    margin: 16px 0;
  }
}

.advanced-query-component {
  @apply mx-auto w-full max-w-[1200px] rounded-md bg-white shadow-md;
}

/* 条件容器 */
.condition-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 层级组 */
.level-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 层级标题 */
.level-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.level-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 层级内容 */
.level-content {
  padding: 16px;
  background: #f8fbff;
  border: 1px solid #e8f4ff;
  border-radius: 8px;
}

/* 条件项 */
.condition-item {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.condition-item:last-child {
  margin-bottom: 0;
}

/* 条件关系标签 */
.condition-relation-tag {
  min-width: 40px;
  padding: 6px 16px;
  font-size: 12px;
  color: white;
  text-align: center;
  cursor: pointer;
  user-select: none;
  background: #1890ff;
  border-radius: 4px;
  transition: all 0.3s;
}

.condition-relation-tag.relation-or {
  background: #52c41a;
}

.condition-relation-tag:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

/* 条件表单 */
.condition-form {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 8px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

/* 层级关系分隔线 */
.level-relation-separator {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 8px 0;
  cursor: pointer;
}

.separator-line {
  flex: 1;
  height: 1px;
  background: #d9d9d9;
}

.relation-tag {
  min-width: 40px;
  padding: 4px 16px;
  font-size: 12px;
  color: white;
  text-align: center;
  background: #1890ff;
  border-radius: 4px;
  transition: all 0.3s;
}

.relation-tag.relation-or {
  background: #52c41a;
}

.relation-tag:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

/* 按钮样式 */
.add-condition-btn {
  width: 120px;
  margin-top: 8px;
}

.add-level-btn {
  width: 120px;
  margin-top: 16px;
}
</style>
