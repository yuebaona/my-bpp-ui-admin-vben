// 组件props类型
export interface AdvancedButtonProps {
  buttonType?: ButtonTypeConfig[];
}
export interface ButtonTypeConfig {
  text: string;
}
export interface AdvancedButtonEmits {
  (e: 'click'): void;
  (e: 'change', params: any): void;
}
