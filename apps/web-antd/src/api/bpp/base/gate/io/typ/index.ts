import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace BppBaseGateIoTypApi {
  /** 受理计划类型信息 */
  export interface GateIoTyp {
          id: number; // 主键id
          businessCode?: string; // 业务代码
          businessName: string; // 业务代码名称
          pickupLocation?: string; // 提箱地
          deliveryLocation?: string; // 送箱地
          plnValidDays: number; // 计划有效天数
          isValid?: string; // 是否有效
          mappingCode?: string; // 接口映射代码
  }
}

// 受理计划类型url
const PREFIX = '/sgc/bpp/base/gate-io-typ';

/** 查询受理计划类型分页 */
export function getGateIoTypPage(params: PageParam) {
  return requestClient.get<PageResult<BppBaseGateIoTypApi.GateIoTyp>>(
    `${PREFIX}/page`,
    { params },
  );
}

/** 查询受理计划类型详情 */
export function getGateIoTyp(id: number) {
  return requestClient.get<BppBaseGateIoTypApi.GateIoTyp>(
    `${PREFIX}/get?id=${id}`,
  );
}

/** 新增受理计划类型 */
export function createGateIoTyp(data: BppBaseGateIoTypApi.GateIoTyp) {
  return requestClient.post(`${PREFIX}/create`, data);
}

/** 修改受理计划类型 */
export function updateGateIoTyp(data: BppBaseGateIoTypApi.GateIoTyp) {
  return requestClient.put(`${PREFIX}/update`, data);
}

/** 删除受理计划类型 */
export function deleteGateIoTyp(id: number) {
  return requestClient.delete(`${PREFIX}/delete?id=${id}`);
}

/** 批量删除受理计划类型 */
export function deleteGateIoTypList(ids: number[]) {
  return requestClient.delete(`${PREFIX}/delete-list?ids=${ids.join(',')}`);
}

/** 导出受理计划类型 */
export function exportGateIoTyp(params: any) {
  return requestClient.download(`${PREFIX}/export-excel`, { params });
}
