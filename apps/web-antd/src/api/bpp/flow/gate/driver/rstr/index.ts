import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';
import dayjs from 'dayjs';
import { requestClient } from '#/api/request';

export namespace DriverRstrApi {
  /** 司机限制记录信息 */
  export interface DriverRstr {
    id: number; // 主键ID
    dvrGkey: string; // 司机全局唯一业务主键
    isRstr: number; // 是否限制
    rstrRsn: string; // 限制原因
    rstrCnt?: number; // 已限制次数
    rstrStartDt: string | Dayjs; // 限制开始时间
    rstrEndDt: string | Dayjs; // 限制结束时间
    lastRstrDt?: number; // 最近一次限制时间合计
    fltRstrFlg: number; // 所属车队是否被限制
    manualRelFlg: number; // 手动解除
    remark: string; // 备注
    dataSrc: string; // 数据来源
  }
}

/** 查询司机限制记录分页 */
export function getDriverRstrPage(params: PageParam) {
  // return requestClient.get<PageResult<DriverRstrApi.DriverRstr>>(
  //   '/bpp/flow/gate/driver/rstr/page',
  //   { params },
  // );

  // 模拟假数据
  const mockData: any[] = [
    {
      id: 1,
      dvrGkey: 'DVR000001',
      isRstr: 1,
      fltCd: 'FLT001',
      trkNo: '粤A12345',
      dvrNm: '张三',
      rstrRsn: 'A001：违规超载',
      rstrCnt: 2,
      rstrStartDt: dayjs('2024-03-01 00:00:00').valueOf(),
      rstrEndDt: dayjs('2024-06-01 00:00:00').valueOf(),
      lastRstrDt: 92,
      fltRstrFlg: 0,
      manualRelFlg: 0,
      createTime: dayjs('2024-01-15 10:30:00').valueOf(),
      releaseTime: dayjs('2024-06-01 08:00:00').valueOf(),
      dataSrc: '北港网',
      creator: 'admin',
      remark: '已限制进港',
    },
    {
      id: 2,
      dvrGkey: 'DVR000001',
      isRstr: 1,
      fltCd: 'FLT001',
      trkNo: '粤A12345',
      dvrNm: '张三',
      rstrRsn: 'B002：超时未完成作业',
      rstrCnt: 3,
      rstrStartDt: dayjs('2024-02-15 00:00:00').valueOf(),
      rstrEndDt: dayjs('2024-05-15 00:00:00').valueOf(),
      lastRstrDt: 89,
      fltRstrFlg: 0,
      manualRelFlg: 0,
      createTime: dayjs('2024-02-10 09:15:00').valueOf(),
      releaseTime: dayjs('2024-05-15 12:00:00').valueOf(),
      dataSrc: '业务处理平台',
      creator: 'admin',
      remark: '调度限制',
    },
    {
      id: 3,
      dvrGkey: 'DVR000002',
      isRstr: 1,
      fltCd: 'FLT002',
      trkNo: '粤B67890',
      dvrNm: '李四',
      rstrRsn: 'C003：安全违规',
      rstrCnt: 1,
      rstrStartDt: dayjs('2024-04-01 00:00:00').valueOf(),
      rstrEndDt: dayjs('2024-07-01 00:00:00').valueOf(),
      lastRstrDt: 91,
      fltRstrFlg: 0,
      manualRelFlg: 0,
      createTime: dayjs('2024-03-20 14:25:00').valueOf(),
      releaseTime: dayjs('2024-07-01 16:00:00').valueOf(),
      dataSrc: '北港网',
      creator: 'operator',
      remark: '安全检查未通过',
    },
    {
      id: 4,
      dvrGkey: 'DVR000003',
      isRstr: 1,
      fltCd: 'FLT003',
      trkNo: '粤C13579',
      dvrNm: '王五',
      rstrRsn: 'A002：车辆未年审',
      rstrCnt: 1,
      rstrStartDt: dayjs('2024-01-10 00:00:00').valueOf(),
      rstrEndDt: dayjs('2024-04-10 00:00:00').valueOf(),
      lastRstrDt: 90,
      fltRstrFlg: 1,
      manualRelFlg: 0,
      createTime: dayjs('2024-01-05 08:00:00').valueOf(),
      releaseTime: dayjs('2024-04-10 10:00:00').valueOf(),
      dataSrc: '业务处理平台',
      creator: 'admin',
      remark: '年审过期',
    },
  ];
  return Promise.resolve({
    list: mockData,
    total: mockData.length,
  });
}

/** 查询司机限制记录详情 */
export function getDriverRstr(id: number) {
  return requestClient.get<DriverRstrApi.DriverRstr>(
    `/bpp/flow/gate/driver/rstr/get?id=${id}`,
  );
}

/** 新增司机限制记录 */
export function createDriverRstr(data: DriverRstrApi.DriverRstr) {
  return requestClient.post('/bpp/flow/gate/driver/rstr/create', data);
}

/** 修改司机限制记录 */
export function updateDriverRstr(data: DriverRstrApi.DriverRstr) {
  return requestClient.put('/bpp/flow/gate/driver/rstr/update', data);
}

/** 删除司机限制记录 */
export function deleteDriverRstr(id: number) {
  return requestClient.delete(`/bpp/flow/gate/driver/rstr/delete?id=${id}`);
}

/** 批量删除司机限制记录 */
export function deleteDriverRstrList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/driver/rstr/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出司机限制记录 */
export function exportDriverRstr(params: any) {
  return requestClient.download('/bpp/flow/gate/driver/rstr/export-excel', { params });
}

/** 查询选项（限制代码：描述） */
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
