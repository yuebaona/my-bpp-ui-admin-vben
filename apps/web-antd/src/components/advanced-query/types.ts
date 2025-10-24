// 字段配置类型
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
