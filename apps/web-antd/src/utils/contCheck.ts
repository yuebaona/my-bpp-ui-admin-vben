import { message } from 'ant-design-vue';
export function validateContainerNo(containerNo: string): null | string {
  // 1. 基本格式验证
  if (!/^[A-Z]{4}\d{7}$/.test(containerNo)) {
    message.warning('箱号格式错误：前四位为字母，后七位为数字')
    return
  }

  // 2. 第4位必须是U
  const categoryCode: string | undefined = containerNo[3] as string;
  if (!['U'].includes(categoryCode)) {
    message.warning('箱号第4位必须是U（集装箱）')
    return
  }

  // 3. 校验位验证
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
    const char: string | undefined = containerNo[i] as string;
    const value = /\d/.test(char) ? Number.parseInt(char) : letterValues[char];

    if (value === undefined) {
      message.warning('箱号格式错误：包含无效字符');
      return
    }

    sum += value * 2 ** i;
  }

  let checkDigit = sum % 11;
  if (checkDigit === 10) {
    checkDigit = 0;
  }

  const providedCheckDigit = Number.parseInt(containerNo[10] as string);
  if (checkDigit !== providedCheckDigit) {
    message.warning('箱号格式不正确请检查');
    return
  }
  return null; // 校验通过
}
