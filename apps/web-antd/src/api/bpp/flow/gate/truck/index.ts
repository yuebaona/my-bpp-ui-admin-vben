import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace TruckViewApi {
  /** 车辆信息实体类信息 */
  export interface Truck {
    id: number; // 车辆唯一主键
    licensePlate: string; // 车牌号
    trailerPlate: string; // 挂车车牌号
    fleetCode: string; // 所属车队代码
    fleetName: string; // 所属车队名字
    isRstr: number; // 是否限制
    isAnnualInspe: number; // 是否年审
    rfidNo: string; // rfid编号
    lastGateInDt: Dayjs | string; // 最后进场时间
    fleetRestricted: number; // 所属车队是否限制
    trkRstrCount: number; // 车辆限制次数
    currentTrkRstrSrc: string; // 车辆限制来源
    currentTrkRstrStartDt: Dayjs | string; // 车辆限制开始时间
    currentTrkRstrEndDt: Dayjs | string; // 车辆限制结束时间
    latestRstrDays: string; // 最近一次限制时间合计
    engNo: string; // 发动机编号
    licExpDt: Dayjs | string; // 驾驶证过期日期
    trkWtKg: string; // 车辆总重量 (后端类型已改为String)
    inspDt: Dayjs | string; // 年审时间
    inspBy: string; // 年审人员名称
    autoFlg: number; // 是否适配自动化
    newFlg: number; // 是否新能源
    maxLoadWTKg: string; // 最大载重（千克）(后端类型已改为String)
    trkLenM: string; // 车长（米）(后端类型已改为String)
    trkWidM: string; // 车宽（米）(后端类型已改为String)
    trkColor: string; // 车头颜色
    trkOwnrNm: string; // 车辆所属人姓名
    trkOwnrPh: string; // 车辆所属人联系号码
    trkOwnrId: string; // 车辆所属人身份证号
    hazLic: string; // 危险品许可证
    trkLicNo: string; // 行驶证档案编号
    trailerLicNo: string; // 挂车行驶证号
    remark: string; // 备注
    tmlRm: string; // 码头备注
    etcNo: string; // 车辆ETC号
    affiliationStartTime: Dayjs | string; // 开始挂靠时间
    enableFlg: number; // 是否停用
    dataSrc: string; // 数据来源
    createTime: Dayjs | string; // 创建时间
    updateTime: Dayjs | string; // 更新时间
  }

  /** 车辆信息详情 */
  export interface TruckDetail {
    id: number; // 车辆唯一主键
    trkNo: string; // 车牌号
    rfidNo: string; // RFID编号
    lastGateInDt: Dayjs | string; // 最后进场时间
    lastGateOutDt: Dayjs | string; // 最后出场时间
    enableFlg: number; // 是否有效
    fleetCode: string; // 关联车队代码
    fleetName: string; // 所属车队中文名
    fleetRstr: number; // 所属车队是否被限制
    trkRstrCount: number; // 车辆限制次数
    isRstr: number; // 是否限制
    currentTrkRstrSrc: string; // 车辆限制来源
    currentTrkRstrStartDt: Dayjs | string; // 车辆限制开始时间
    currentTrkRstrEndDt: Dayjs | string; // 车辆限制结束时间
    latestRstrDays: string; // 最近一次限制时间合计
    trailerPlate: string; // 挂车车牌号
    engNo: string; // 发动机编号
    trailerLicNo: string; // 挂车行驶证号
    licExpDt: Dayjs | string; // 行驶证有效期
    trkLicNo: string; // 行驶证档案编号
    trkWtKg: string; // 车辆自重（Kg）
    maxLoadWTKg: string; // 最大载重（Kg）
    isAnnualInspe: number; // 是否年审
    inspDt: Dayjs | string; // 年审时间
    inspBy: string; // 年审员
    etcNo: string; // 车辆ETC号
    trkLenM: number; // 长度
    trkWidM: number; // 宽度
    trkColor: string; // 车头颜色
    trkOwnrNm: string; // 车主姓名
    trkOwnrPh: string; // 车主电话
    trkOwnrId: string; // 车主身份证
    autoFlg: number; // 是否自动化码头
    newFlg: number; // 是否新能源车
    hazLic: string; // 危险品许可证
    rstrCode: string; // 限制代码
    rstrDesc: string; // 限制描述
    affiliationStartTime: Dayjs | string; // 开始挂靠时间
    remark: string; // 备注
    tmlRm: string; // 码头备注
    deleted: boolean; // 是否停用
    dataSrc: string; // 数据来源
    createTime: Dayjs | string; // 创建时间
    updateTime: Dayjs | string; // 更新时间
  }

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

/** 查询车辆信息实体类分页 */
export function getTruckPage(params: PageParam) {
  return requestClient.get<PageResult<TruckViewApi.Truck>>(
    '/bpp/flow/gate/truck/page',
    { params },
  );
}

/** 查询车辆信息实体类详情 */
export function getTruck(id: number) {
  return requestClient.get<TruckViewApi.TruckDetail>(`/bpp/flow/gate/truck/get?id=${id}`);
}

/** 新增车辆信息实体类 */
export function createTruck(data: TruckViewApi.Truck) {
  return requestClient.post('/bpp/flow/gate/truck/create', data);
}

/** 修改车辆信息实体类 */
export function updateTruck(data: TruckViewApi.Truck) {
  return requestClient.put('/bpp/flow/gate/truck/update', data);
}

/** 删除车辆信息实体类 */
export function deleteTruck(id: number) {
  return requestClient.delete(`/bpp/flow/gate/truck/delete?id=${id}`);
}

/** 批量删除车辆信息实体类 */
export function deleteTruckList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/truck/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出车辆信息实体类 */
export function exportTruck(params: any) {
  return requestClient.download('/bpp/flow/gate/truck/export-excel', { params });
}

/** 查询车辆限制记录分页 */
export function getTruckRstrPage(params: PageParam) {
  return requestClient.get<PageResult<TruckViewApi.TruckRstr>>(
    '/bpp/flow/gate/truck/rstr/page',
    { params },
  );
}

/** 查询车辆限制记录详情 */
export function getTruckRstr(id: number) {
  return requestClient.get<TruckViewApi.TruckRstr>(
    `/bpp/flow/gate/truck/rstr/get?id=${id}`,
  );
}

/** 新增车辆限制记录 */
export function createTruckRstr(data: TruckViewApi.TruckRstr) {
  return requestClient.post('/bpp/flow/gate/truck/rstr/create', data);
}

/** 修改车辆限制记录 */
export function updateTruckRstr(data: TruckViewApi.TruckRstr) {
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
