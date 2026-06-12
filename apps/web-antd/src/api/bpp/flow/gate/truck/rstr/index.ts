import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace GateTruckRstrApi {
  /** 车辆限制记录信息 */
  export interface TruckRstr {
    id: number; // 主键ID
    trkGkey: string; // 车辆全局唯一业务主键
    rstrRsn: string; // 限制原因代码及描述
    rstrStartDt: string | Dayjs; // 限制开始时间
    rstrEndDt: string | Dayjs; // 限制结束时间
    lastRstrDt?: number; // 最近一次限制时间合计
    fltIsRstr?: number; // 所属车队是否被限制
    isRstr?: number; // 是否限制
    manualRelFlg: number; // 手动解除
    remark: string; // 备注
    dataSrc: string; // 数据来源
  }
}

/** 查询车辆限制记录分页 */
export function getTruckRstrPage(params: PageParam) {
  return requestClient.get<PageResult<GateTruckRstrApi.TruckRstr>>(
    '/bpp/flow/gate/truck/rstr/page',
    { params },
  );
}

/** 查询车辆限制记录详情 */
export function getTruckRstr(id: number) {
  return requestClient.get<GateTruckRstrApi.TruckRstr>(
    `/bpp/flow/gate/truck/rstr/get?id=${id}`,
  );
}

/** 新增车辆限制记录 */
export function createTruckRstr(data: GateTruckRstrApi.TruckRstr) {
  return requestClient.post('/bpp/flow/gate/truck/rstr/create', data);
}

/** 修改车辆限制记录 */
export function updateTruckRstr(data: GateTruckRstrApi.TruckRstr) {
  return requestClient.put('/bpp/flow/gate/truck/rstr/update', data);
}

/** 删除车辆限制记录 */
export function deleteTruckRstr(id: number) {
  return requestClient.delete(`/bpp/flow/gate/truck/rstr/delete?id=${id}`);
}

/** 批量删除车辆限制记录 */
export function deleteTruckRstrList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/truck/rstr/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出车辆限制记录 */
export function exportTruckRstr(params: any) {
  return requestClient.download('/bpp/flow/gate/truck/rstr/export-excel', { params });
}

/** 查询限制代码：描述 */
export function getRestrictionCodeList(params: PageParam) {
  // return requestClient.get<PageResult<GateTruckRstrApi.TruckRstr>>(
  //   '/bpp/flow/gate/truck/rstr/page',
  //   { params },
  // );
  return Promise.resolve([
    { rstrRsn: 'A001: 超重限制' },
    { rstrRsn: 'A002: 超高限制' },
    { rstrRsn: 'A003: 超宽限制' },
    { rstrRsn: 'A004: 超长限制' },
    { rstrRsn: 'B001: 违规停车' },
    { rstrRsn: 'B002: 未按指定路线行驶' },
    { rstrRsn: 'B003: 未按规定时间进入' },
    { rstrRsn: 'C001: 车辆未年检' },
    { rstrRsn: 'C002: 驾驶证过期' },
    { rstrRsn: 'C003: 营运证过期' },
    { rstrRsn: 'D001: 安全隐患' },
    { rstrRsn: 'D002: 设备故障' },
    { rstrRsn: 'E001: 其他违规' },
  ]);
}
