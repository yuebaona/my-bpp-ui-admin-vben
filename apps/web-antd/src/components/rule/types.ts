// types.ts
export interface Field {
  fldName: string;
  fldLabel: string;
  fldType: 'date' | 'number' | 'select' | 'string';
  options?: Array<{ label: string; value: number | string }>;

}

export interface Operator {
  refCode: string;
  refName: string;
  supportedTypes: string[];
}

export interface RuleItem {
  id: string;
  field: string;
  rule: string;
  value: any;
}

export interface RuleList {
  relation: 'AND' | 'OR';
  conditions: RuleItem[];
}

export interface RuleLevel {
  relation: 'AND' | 'OR';
  conditions: RuleList[];
}

export interface RuleData {
  relation: 'AND' | 'OR';
  conditions: RuleLevel[];
}

// Props 和 Emits 相关的类型
export interface RuleComponentProps {
  fields?: Field[];
  operators?: Operator[];
  ruleData?: RuleData;
}

export type RuleComponentEmits = {
  change: [value: RuleData];
  'update:ruleData': [value: RuleData];
};

// InputComponent 相关的类型
export interface ConditionType {
  id: string;
  field: string;
  rule: string;
  value: any;
  dbType?: string;
  isEnum?: string;
  flexStr01?: string;
  dddsDataFld?: string;
  dddsDispFld?: string;
}

export interface OptionType {
  field: string;
  options: Array<{ label: string; value: number | string }>;
}
// types.ts
export interface Field {
  fldName: string;
  fldLabel: string;
  fldType: string;
  dictType?: string;
  options?: Array<{ label: string; value: any }>;
  tableName?: string;
  dataType?: string;
  isNullable?: string;
  id?: number;
}

export interface DictItem {
  refCode: string;
  refName: string;
  supportedTypes?: string[];
}

export interface RuleItem {
  id: string;
  field: string;
  rule: string;
  value: any;
  dbType: string;
  isEnum: string;
}

export interface RuleList {
  relation: 'AND' | 'OR';
  conditions: RuleItem[];
}

export interface RuleLevel {
  relation: 'AND' | 'OR';
  conditions: RuleList[];
}

export interface RuleData {
  relation: 'AND' | 'OR';
  conditions: RuleLevel[];
}

export interface RuleComponentProps {
  fields: Field[];
  operators: DictItem[];
  ruleData?: any; // 可以是 RuleData 或 LevelData[]
}

// 你的原始数据结构类型
export interface LevelDataItem {
  id: string;
  field: string;
  rule: string;
  value: any;
  dbType: string;
  isEnum: string;
}

export interface LevelDataList {
  relation: 'AND' | 'OR';
  conditions: LevelDataItem[];
}

export interface LevelDataLevel {
  relation: 'AND' | 'OR';
  conditions: LevelDataList[];
}

export interface LevelDataRoot {
  relation: 'AND' | 'OR';
  conditions: LevelDataLevel[];
}

