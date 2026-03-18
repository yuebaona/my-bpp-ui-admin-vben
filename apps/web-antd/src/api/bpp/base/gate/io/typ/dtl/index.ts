import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace BppBaseGateIoTypDtlApi {
  /** 运输指令类型信息 */
  export interface GateIoTypDtl {
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

// 运输指令类型url
const PREFIX = '/sgc/bpp/base/gate-io-typ-dtl';

/** 查询运输指令类型分页 */
export function getGateIoTypDtlPage(params: PageParam) {
  return requestClient.get<PageResult<BppBaseGateIoTypDtlApi.GateIoTypDtl>>(
    `${PREFIX}/page`,
    { params },
  );
}

/** 查询运输指令类型详情 */
export function getGateIoTypDtl(id: number) {
  return requestClient.get<BppBaseGateIoTypDtlApi.GateIoTypDtl>(
    `${PREFIX}/get?id=${id}`,
  );
}

/** 新增运输指令类型 */
export function createGateIoTypDtl(data: BppBaseGateIoTypDtlApi.GateIoTypDtl) {
  return requestClient.post(`${PREFIX}/create`, data);
}

/** 修改运输指令类型 */
export function updateGateIoTypDtl(data: BppBaseGateIoTypDtlApi.GateIoTypDtl) {
  return requestClient.put(`${PREFIX}/update`, data);
}

/** 删除运输指令类型 */
export function deleteGateIoTypDtl(id: number) {
  return requestClient.delete(`${PREFIX}/delete?id=${id}`);
}

/** 批量删除运输指令类型 */
export function deleteGateIoTypDtlList(ids: number[]) {
  return requestClient.delete(`${PREFIX}/delete-list?ids=${ids.join(',')}`);
}

/** 导出运输指令类型 */
export function exportGateIoTypDtl(params: any) {
  return requestClient.download(`${PREFIX}/export-excel`, { params });
}
