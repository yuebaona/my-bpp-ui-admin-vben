import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';
import dayjs from 'dayjs';
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
  // return requestClient.get<PageResult<GateFleetRstrApi.FleetRstr>>(
  //   '/bpp/flow/gate/fleet/rstr/page',
  //   { params },
  // );
  const list = [
    {
      id: 1, fltGkey: 'FLT000001', fltCd: 'FLT001', fltNm: '顺达物流有限公司',
      rstrRsn: 'A001：违规超载', rstrStartDt: dayjs('2024-03-01').valueOf(), rstrEndDt: dayjs('2024-06-01').valueOf(),
      lastRstrDt: 92, createTime: dayjs('2024-02-15 09:00:00').valueOf(), releaseTime: dayjs('2024-06-01 08:00:00').valueOf(),
      rstrDataSrc: '北港网', createAccount: 'admin', manualRelFlg: 0, remark: '已限制进港', dataSrc: '北港网',
    },
    {
      id: 2, fltGkey: 'FLT000001', fltCd: 'FLT001', fltNm: '顺达物流有限公司',
      rstrRsn: 'B002：超时未完成作业', rstrStartDt: dayjs('2024-02-15').valueOf(), rstrEndDt: dayjs('2024-05-15').valueOf(),
      lastRstrDt: 89, createTime: dayjs('2024-01-20 14:00:00').valueOf(), releaseTime: dayjs('2024-05-15 12:00:00').valueOf(),
      rstrDataSrc: '业务处理平台', createAccount: 'admin', manualRelFlg: 0, remark: '调度限制', dataSrc: '业务处理平台',
    },
    {
      id: 3, fltGkey: 'FLT000003', fltCd: 'FLT003', fltNm: '恒通国际物流有限公司',
      rstrRsn: 'C001：车辆未年检', rstrStartDt: dayjs('2024-01-10').valueOf(), rstrEndDt: dayjs('2024-04-10').valueOf(),
      lastRstrDt: 90, createTime: dayjs('2024-01-05 10:00:00').valueOf(), releaseTime: dayjs('2024-04-10 00:00:00').valueOf(),
      rstrDataSrc: '智慧安防', createAccount: 'operator', manualRelFlg: 1, remark: '已解除', dataSrc: '智慧安防',
    },
    {
      id: 4, fltGkey: 'FLT000003', fltCd: 'FLT003', fltNm: '恒通国际物流有限公司',
      rstrRsn: 'D001：安全隐患', rstrStartDt: dayjs('2024-04-20').valueOf(), rstrEndDt: dayjs('2024-07-20').valueOf(),
      lastRstrDt: 91, createTime: dayjs('2024-04-15 16:30:00').valueOf(), releaseTime: '',
      rstrDataSrc: '业务处理平台', createAccount: 'admin', manualRelFlg: 0, remark: '安全检查', dataSrc: '业务处理平台',
    },
    {
      id: 5, fltGkey: 'FLT000002', fltCd: 'FLT002', fltNm: '通达运输有限公司',
      rstrRsn: 'E001：其他违规', rstrStartDt: dayjs('2024-05-01').valueOf(), rstrEndDt: dayjs('2024-08-01').valueOf(),
      lastRstrDt: 92, createTime: dayjs('2024-04-28 08:00:00').valueOf(), releaseTime: '',
      rstrDataSrc: '北港网', createAccount: 'operator', manualRelFlg: 0, remark: '', dataSrc: '北港网',
    },
  ];
  return Promise.resolve({ list, total: list.length } as PageResult<any>);
}

/** 查询车队限制记录详情 */
export function getFleetRstr(id: number) {
  return requestClient.get<GateFleetRstrApi.FleetRstr>(
    `/bpp/flow/gate/fleet/rstr/get?id=${id}`,
  );
}

/** 新增车队限制记录 */
export function createFleetRstr(data: GateFleetRstrApi.FleetRstr) {
  return requestClient.post('/bpp/flow/gate/fleet/rstr/create', data);
}

/** 修改车队限制记录 */
export function updateFleetRstr(data: GateFleetRstrApi.FleetRstr) {
  return requestClient.put('/bpp/flow/gate/fleet/rstr/update', data);
}

/** 删除车队限制记录 */
export function deleteFleetRstr(id: number) {
  return requestClient.delete(`/bpp/flow/gate/fleet/rstr/delete?id=${id}`);
}

/** 批量删除车队限制记录 */
export function deleteFleetRstrList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/fleet/rstr/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出车队限制记录 */
export function exportFleetRstr(params: any) {
  return requestClient.download('/bpp/flow/gate/fleet/rstr/export-excel', {
    params,
  });
}
