// 字段配置类型
import type { RuleLevel, RuleList } from "#/components/rule/types";

export interface FieldConfig {
  value: string;
  label: string;
}

// 操作符配置类型
export interface OperatorConfig {
  value: string;
  label: string;
}

// 操作符映射类型
export interface OperatorsMap {
  [key: string]: DictItem[];
}

// 条件数据类型
export interface ConditionData {
  field: string;
  operator: string;
  value: string;
  prevRelation?: 'AND' | 'OR';
}

// 层级数据类型
export interface LevelData {
  relation: 'AND' | 'OR';
  conditions: ConditionData[];
}

// 查询参数类型
export interface QueryParams {
  levels: {
    conditions: {
      field: string;
      operator: string;
      prevRelation?: 'AND' | 'OR';
      value: string;
    }[];
    relation: 'AND' | 'OR';
  }[];
}

// 组件Props类型
export interface AdvancedQueryProps {
  fields?: FieldConfig[];
  operatorsMap?: OperatorsMap;
  defaultLevels?: LevelData[];
}

// 组件Emits类型
export interface AdvancedQueryEmits {
  (e: 'query', params: QueryParams): void;
  (e: 'reset'): void;
  (e: 'saveTemplate', name: string): void;
}
export interface DictItem {
  colorType?: string;
  cssClass?: string;
  label: string;
  value: string;
}
export interface RuleData {
  relation: 'AND' | 'OR';
  conditions: RuleLevel[];
}
export const operatorsMap = {
  default: [
    {
      refCode: '=',
      refName: '等于',
      supportedTypes: ['string', 'number', 'date', 'select', 'input', 'textarea', 'datetime', 'time'] as string[],
    },
    {
      refCode: '!=',
      refName: '不等于',
      supportedTypes: ['string', 'number', 'date', 'select', 'input', 'textarea', 'datetime', 'time'] as string[],
    },
    {
      refCode: '>',
      refName: '大于',
      supportedTypes: ['number', 'date', 'datetime'] as string[]
    },
    {
      refCode: '>=',
      refName: '大于等于',
      supportedTypes: ['number', 'date', 'datetime'] as string[]
    },
    {
      refCode: '<',
      refName: '小于',
      supportedTypes: ['number', 'date', 'datetime'] as string[]
    },
    {
      refCode: '<=',
      refName: '小于等于',
      supportedTypes: ['number', 'date', 'datetime'] as string[]
    },
    {
      refCode: 'like',
      refName: '包含',
      supportedTypes: ['string', 'input', 'textarea'] as string[]
    },
    {
      refCode: 'notLike',
      refName: '不包含',
      supportedTypes: ['string', 'input', 'textarea'] as string[]
    },
    {
      refCode: 'isNull',
      refName: '为空',
      supportedTypes: ['string', 'number', 'date', 'select', 'input', 'textarea', 'datetime', 'time'] as string[],
    },
    {
      refCode: 'isNotNull',
      refName: '不为空',
      supportedTypes: ['string', 'number', 'date', 'select', 'input', 'textarea', 'datetime', 'time'] as string[],
    },
    {
      refCode: 'betweenAnd',
      refName: '介于',
      supportedTypes: ['date', 'datetime', 'dateRange'] as string[],
    },
  ] as DictItem[],
};
