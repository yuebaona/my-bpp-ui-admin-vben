import { useDebounceFn } from '@vueuse/core';
import { message } from 'ant-design-vue';

let lastValidationId = 0;

// 防抖消息显示函数
const showValidationMessage = useDebounceFn(
  (id: number, isSuccess: boolean, msg?: string) => {
    // 只显示最新验证的结果
    if (id === lastValidationId) {
      if (isSuccess) {
      } else if (msg) {
        message.warning(msg);
      }
    }
  },
  1000,
);

// 改造后的箱号验证函数
export function validateContainerNo(containerNo: string): null | string {
  const currentId = ++lastValidationId;
  let errorMsg: null | string = null;

  // 1. 基本格式验证
  if (!/^[A-Z]{4}\d{7}$/.test(containerNo)) {
    errorMsg = `箱号${containerNo}格式错误：前四位为字母，后七位为数字`;
  }
  // 2. 第4位必须是U
  else if (containerNo[3] === 'U') {
    const letterValues: Record<string, number> = {
      A: 10,
      B: 12,
      C: 13,
      D: 14,
      E: 15,
      F: 16,
      G: 17,
      H: 18,
      I: 19,
      J: 20,
      K: 21,
      L: 23,
      M: 24,
      N: 25,
      O: 26,
      P: 27,
      Q: 28,
      R: 29,
      S: 30,
      T: 31,
      U: 32,
      V: 34,
      W: 35,
      X: 36,
      Y: 37,
      Z: 38,
    };

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const char = containerNo[i];
      const value = /\d/.test(char)
        ? Number.parseInt(char)
        : letterValues[char];

      if (value === undefined) {
        errorMsg = `箱号${containerNo}格式错误：包含无效字符`;
        break;
      }

      sum += value * 2 ** i;
    }

    if (!errorMsg) {
      let checkDigit = sum % 11;
      checkDigit = checkDigit === 10 ? 0 : checkDigit;

      const providedCheckDigit = Number.parseInt(containerNo[10]);
      if (checkDigit !== providedCheckDigit) {
        errorMsg = `箱号${containerNo}校验位不正确，请检查`;
      }
    }
  }
  // 3. 校验位验证
  else {
    errorMsg = `箱号${containerNo}第4位必须是U（集装箱）`;
  }

  // 调度消息显示
  if (errorMsg) {
    showValidationMessage(currentId, false, errorMsg);
  } else {
    showValidationMessage(currentId, true);
  }

  return errorMsg;
}
