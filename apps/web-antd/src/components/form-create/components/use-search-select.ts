import { reactive } from 'vue';

import { message } from 'ant-design-vue';

/**
 * 搜索选择器配置项
 */
export interface SearchSelectConfig<T = any> {
  /**
   * 搜索API函数
   * @param value 搜索值
   * @returns Promise<T[]> 搜索结果数组
   */
  searchApi: (value: string) => Promise<T[]>;
  /**
   * 标签字段名
   */
  labelField: keyof T;
  /**
   * 值字段名
   */
  valueField: keyof T;
  /**
   * 错误消息
   */
  errorMessage: string;
  /**
   * 是否需要大写转换
   */
  toUpperCase?: boolean;
  /**
   * 字符过滤正则表达式
   */
  filterRegex?: null | RegExp;
  /**
   * 查询模式
   * - 'input': 至少输入指定长度字符后查询
   * - 'click': 点击下拉框就查询
   */
  searchMode?: 'click' | 'input';
  /**
   * 最小搜索长度（仅在searchMode为'input'时生效）
   */
  minSearchLength?: number;
}

/**
 * 搜索选择器返回值
 */
export interface SearchSelectResult<T = any> {
  /**
   * 状态管理
   */
  state: {
    data: Array<{ data: T; label: string; value: string }>;
    fetching: boolean;
    isComposing: boolean;
    originalValue: string[];
    value: string[];
  };
  /**
   * 搜索函数
   */
  search: (value: string) => Promise<void>;
  /**
   * 输入处理函数
   */
  handleInput: (e: Event) => void;
  /**
   * 中文输入法组合开始处理函数
   */
  handleCompositionStart: () => void;
  /**
   * 中文输入法组合结束处理函数
   */
  handleCompositionEnd: (e: CompositionEvent) => void;
}

/**
 * 通用搜索选择器组合式函数
 * @param config 配置项
 * @returns SearchSelectResult
 */
export function useSearchSelect<T = any>(
  config: SearchSelectConfig<T>,
): SearchSelectResult<T> {
  const {
    searchApi,
    labelField,
    valueField,
    errorMessage,
    toUpperCase = true,
    filterRegex,
    searchMode = 'click',
    minSearchLength = 0,
  } = config;

  const state = reactive({
    data: [],
    value: [],
    fetching: false,
    isComposing: false,
    originalValue: [],
  });

  /**
   * 搜索函数
   */
  const search = async (value: string) => {
    if (searchMode === 'input' && value.length < minSearchLength) {
      state.data = [];
      return;
    }
    state.fetching = true;
    try {
      let processedValue = value;
      // 大写转换
      if (toUpperCase) {
        processedValue = processedValue.toUpperCase();
      }
      // 字符过滤
      if (filterRegex) {
        processedValue = processedValue.replaceAll(filterRegex, '');
      }

      const res = await searchApi(processedValue);

      if (res) {
        state.data = res.map((item: T) => ({
          label: String(item[labelField]),
          value: String(item[valueField]),
          data: item,
        }));
      }
    } catch (error) {
      console.error(error);
      message.error(errorMessage);
    } finally {
      state.fetching = false;
    }
  };

  /**
   * 输入处理函数
   */
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    if (state.isComposing) {
      return;
    }

    let value = target.value;
    // 大写转换
    if (toUpperCase) {
      value = value.toUpperCase();
    }
    // 字符过滤
    if (filterRegex) {
      value = value.replaceAll(filterRegex, '');
    }

    target.value = value;
    search(value);
  };

  /**
   * 中文输入法组合开始处理函数
   */
  const handleCompositionStart = () => {
    state.isComposing = true;
  };

  /**
   * 中文输入法组合结束处理函数
   */
  const handleCompositionEnd = (e: CompositionEvent) => {
    state.isComposing = false;
    const target = e.target as HTMLInputElement;

    let value = target.value;
    // 大写转换
    if (toUpperCase) {
      value = value.toUpperCase();
    }
    // 字符过滤
    if (filterRegex) {
      value = value.replaceAll(filterRegex, '');
    }

    target.value = value;
    search(value);
  };

  return {
    state,
    search,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
  };
}
