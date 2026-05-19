import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace GateTruckRstrApi {
  /** 车辆限制记录信息 */
  export interface TruckRstr {
    id: number; // 主键ID
    trkGkey: string; // 车辆全局唯一业务主键
    rstrRsn: string; // 限制原因
    rstrStartDt: string | Dayjs; // 限制开始时间
    rstrEndDt: string | Dayjs; // 限制结束时间
    manualRelFlg: number; // 手动解除
    remark: string; // 备注
    dataSrc: string; // 数据来源
  }
}

/** 查询车辆限制记录分页 */
export function getTruckRstrPage(params: PageParam) {
  return requestClient.get<PageResult<GateTruckRstrApi.TruckRstr>>(
    '/bpp/gate/truck/rstr/page',
    { params },
  );
}

/** 查询车辆限制记录详情 */
export function getTruckRstr(id: number) {
  return requestClient.get<GateTruckRstrApi.TruckRstr>(
    `/bpp/gate/truck/rstr/get?id=${id}`,
  );
}

/** 新增车辆限制记录 */
export function createTruckRstr(data: GateTruckRstrApi.TruckRstr) {
  return requestClient.post('/bpp/gate/truck/rstr/create', data);
}

/** 修改车辆限制记录 */
export function updateTruckRstr(data: GateTruckRstrApi.TruckRstr) {
  return requestClient.put('/bpp/gate/truck/rstr/update', data);
}

/** 删除车辆限制记录 */
export function deleteTruckRstr(id: number) {
  return requestClient.delete(`/bpp/gate/truck/rstr/delete?id=${id}`);
}

/** 批量删除车辆限制记录 */
export function deleteTruckRstrList(ids: number[]) {
  return requestClient.delete(
    `/bpp/gate/truck/rstr/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出车辆限制记录 */
export function exportTruckRstr(params: any) {
  return requestClient.download('/bpp/gate/truck/rstr/export-excel', { params });
}


