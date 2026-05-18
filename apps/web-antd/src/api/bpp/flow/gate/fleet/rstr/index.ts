import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace GateFleetRstrApi {
  /** 车队限制记录信息 */
  export interface FleetRstr {
    id: number; // 主键ID
    fltGkey: string; // 车队全局唯一业务主键
    rstrRsn: string; // 限制原因
    rstrStartDt: Dayjs | string; // 限制开始时间
    rstrEndDt: Dayjs | string; // 限制结束时间
    manualRelFlg: number; // 手动解除
    remark: string; // 备注
    dataSrc: string; // 数据来源
  }
}

/** 查询车队限制记录分页 */
export function getFleetRstrPage(params: PageParam) {
  return requestClient.get<PageResult<GateFleetRstrApi.FleetRstr>>(
    '/bpp/gate/fleet/rstr/page',
    { params },
  );
}

/** 查询车队限制记录详情 */
export function getFleetRstr(id: number) {
  return requestClient.get<GateFleetRstrApi.FleetRstr>(
    `/bpp/gate/fleet/rstr/get?id=${id}`,
  );
}

/** 新增车队限制记录 */
export function createFleetRstr(data: GateFleetRstrApi.FleetRstr) {
  return requestClient.post('/bpp/gate/fleet/rstr/create', data);
}

/** 修改车队限制记录 */
export function updateFleetRstr(data: GateFleetRstrApi.FleetRstr) {
  return requestClient.put('/bpp/gate/fleet/rstr/update', data);
}

/** 删除车队限制记录 */
export function deleteFleetRstr(id: number) {
  return requestClient.delete(`/bpp/gate/fleet/rstr/delete?id=${id}`);
}

/** 批量删除车队限制记录 */
export function deleteFleetRstrList(ids: number[]) {
  return requestClient.delete(
    `/bpp/gate/fleet/rstr/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出车队限制记录 */
export function exportFleetRstr(params: any) {
  return requestClient.download('/bpp/gate/fleet/rstr/export-excel', {
    params,
  });
}
