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
