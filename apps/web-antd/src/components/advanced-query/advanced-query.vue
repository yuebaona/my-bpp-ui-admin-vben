<script setup lang="ts">
import type {
  AdvancedQueryEmits,
  AdvancedQueryProps,
  DictItem,
  RuleData
} from './types';
import { computed, ref, watch, onMounted } from 'vue';
import { Button } from 'ant-design-vue';
import Rule from '#/components/rule/index.vue';

const props = withDefaults(defineProps<AdvancedQueryProps>(), {
  fields: () => [],
  operatorsMap: () => ({
    default: [] as DictItem[],
  }),
  defaultLevels: () => [
    {
      relation: 'AND' as const,
      conditions: []
    }
  ],
});

const emit = defineEmits<AdvancedQueryEmits>();

// 状态管理
const selectedTemplate = ref('');
const ruleData = ref<RuleData>();

// 计算属性
const availableFields = computed(() => props.fields);
const operators = computed(() => props.operatorsMap.default || []);

// 转换函数：将你的数据结构转换为 RuleData
const convertDefaultLevelsToRuleData = (defaultLevels: any[]): RuleData => {

  if (!defaultLevels || defaultLevels.length === 0) {
    return getDefaultRuleData();
  }

  const firstLevel = defaultLevels[0];
  if (!firstLevel) {
    return getDefaultRuleData();
  }

  // 如果已经是 RuleData 格式
  if (firstLevel.conditions && Array.isArray(firstLevel.conditions) &&
    firstLevel.conditions.length > 0 &&
    firstLevel.conditions[0].conditions) {
    return { ...firstLevel };
  }

  // 处理你的数据结构
  const result: RuleData = {
    relation: firstLevel.relation || 'AND',
    conditions: []
  };

  if (Array.isArray(firstLevel.conditions)) {
    firstLevel.conditions.forEach((levelItem: any) => {
      if (levelItem.relation && Array.isArray(levelItem.conditions)) {
        const level: any = {
          relation: levelItem.relation,
          conditions: []
        };

        levelItem.conditions.forEach((listItem: any) => {
          if (listItem.relation && Array.isArray(listItem.conditions)) {
            const list: any = {
              relation: listItem.relation,
              conditions: []
            };

            listItem.conditions.forEach((item: any) => {
              const ruleItem = {
                id: item.id || generateId(),
                field: item.field || '',
                rule: item.rule || '',
                value: item.value || '',
                dbType: item.dbType || 'string',
                isEnum: item.isEnum || '0'
              };
              list.conditions.push(ruleItem);
            });

            level.conditions.push(list);
          }
        });

        result.conditions.push(level);
      }
    });
  }
  return result;
};

// 生成ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 获取默认 RuleData
const getDefaultRuleData = (): RuleData => ({
  relation: 'AND',
  conditions: [
    {
      relation: 'AND',
      conditions: [
        {
          relation: 'AND',
          conditions: [
            {
              id: generateId(),
              field: '',
              rule: '',
              value: '',
              dbType: 'string',
              isEnum: '0'
            }
          ]
        }
      ]
    }
  ]
});

// 初始化
onMounted(() => {
  if (props.defaultLevels && props.defaultLevels.length > 0) {
    ruleData.value = convertDefaultLevelsToRuleData(props.defaultLevels);
  } else {
    ruleData.value = getDefaultRuleData();
  }
});

// 监听 props.defaultLevels 变化
watch(
  () => props.defaultLevels,
  (newLevels) => {
    if (newLevels && newLevels.length > 0) {
      ruleData.value = convertDefaultLevelsToRuleData(newLevels);
    } else {
      ruleData.value = getDefaultRuleData();
    }
  },
  { deep: true, immediate: true }
);

// 处理规则变化
const handleRuleChange = (data: RuleData) => {
  ruleData.value = data;
};

// 操作按钮方法
const handleSaveTemplate = () => {
  if (!ruleData.value) {
    return;
  }
  emit('saveTemplate', ruleData.value);
};

const handleReset = () => {
  ruleData.value = convertDefaultLevelsToRuleData([
    {
      relation: 'AND',
      conditions: [
        {
          relation: 'AND',
          conditions: [
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
        },
      ],
    },
  ]);
  selectedTemplate.value = '';
  emit('reset');
};

const handleQuery = () => {
  if (!ruleData.value) {
    return;
  }
  emit('query', ruleData.value);
};
</script>

<template>
  <div class="advanced-query">
    <div class="query-content">
      <div class="rule-wrapper">
        <div v-if="ruleData" class="rule-container">
          <Rule
            :fields="availableFields"
            :operators="operators"
            :rule-data="ruleData"
            @update:rule-data="(data) => ruleData = data"
            @change="handleRuleChange"
          />
        </div>
        <div v-else class="loading">
          加载中...
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <Button @click="handleReset">重置</Button>
        <Button @click="handleSaveTemplate">保存模板</Button>
        <Button type="primary" @click="handleQuery">查询</Button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.advanced-query {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.query-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
}

.rule-wrapper {
  flex: 1;
  min-height: 300px;
  overflow: auto;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;

  .rule-container {
    height: 100%;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #999;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;

  button {
    min-width: 80px;
  }
}
</style>
