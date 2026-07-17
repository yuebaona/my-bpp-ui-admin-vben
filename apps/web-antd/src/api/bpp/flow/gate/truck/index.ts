import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace TruckViewApi {
  // 车辆信息实体类信息
  export interface truckPageVO {
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
    licExpDt: Dayjs | string; // 行驶证有效期
    trkWtKg: string; // 车辆自重（Kg）
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
    enableFlg: number; // 是否有效
    dataSrc: string; // 数据来源
    createTime: Dayjs | string; // 创建时间
    updateTime: Dayjs | string; // 更新时间
  }

  /** 车辆信息详情 */
  export interface truckVO {
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

  // 车辆限制记录
  export interface truckRstrListVO {
    id: number; // 车队限制记录主键
    fleetName: string; // 车队
    rstrInfo: string; // 限制代码：描述
    truckNo: string; // 车牌号
    driverName: string; // 司机姓名
    rstrStartDt: string; // 限制开始时间
    rstrEndDt: string; // 限制结束时间
    rstrDaysTotal: string; // 最近一次限制时间合计
    createTime: string; // 创建时间
    releaseTime: string; // 限制解除时间
    dataSrc: string; // 限制信息来源
    creator: string; // 创建账号
  }

  /** 车辆限制记录信息 */
  export interface truckRstrVO {
    id: number; // 车队限制记录主键
    fleetName: string; // 车队
    rstrInfo: string; // 限制代码：描述
    truckNo: string; // 车牌号
    driverName: string; // 司机姓名
    rstrStartDt: string; // 限制开始时间
    rstrEndDt: string; // 限制结束时间
    rstrDaysTotal: string; // 最近一次限制时间合计
    createTime: string; // 创建时间
    releaseTime: string; // 限制解除时间
    dataSrc: string; // 限制信息来源
    creator: string; // 创建账号
  }

  export interface rstrCodeVO {
    id?: number; // 限制规则主键
    ruleCd: string; // 限制代码
    ruleDesc: string; // 描述
  }
}

/** 查询车辆信息实体类分页 */
export function getTruckPage(params: PageParam) {
  return requestClient.get<PageResult<TruckViewApi.truckPageVO>>(
    '/bpp/flow/gate/truck/page',
    { params },
  );
}

/** 查询车辆信息实体类详情 */
export function getTruck(id: number) {
  return requestClient.get<TruckViewApi.truckVO>(
    `/bpp/flow/gate/truck/get?id=${id}`,
  );
}

/** 保存车辆信息按钮 */
export function saveTruck(data: TruckViewApi.truckVO) {
  return requestClient.post('/bpp/flow/gate/truck/save', data);
}

/** 日志查询按钮 todo */

/** 导出车辆信息实体类 */
export function exportTruck(params: any) {
  return requestClient.download('/bpp/flow/gate/truck/export-excel', { params });
}

/** 查询车辆限制记录 */
export function getTruckRstrList(id: number) {
  return requestClient.get<TruckViewApi.truckRstrListVO>(
    `/bpp/flow/gate/truck/rstr/list?id=${id}`,
  );
}

/** 查询车辆限制记录详情 */
export function getTruckRstr(id: number) {
  return requestClient.get<TruckViewApi.truckRstrVO>(
    `/bpp/flow/gate/truck/rstr/get?id=${id}`,
  );
}

/** 保存车辆限制记录 */
export function saveTruckRstr(data: TruckViewApi.TruckRstr) {
  return requestClient.post('/bpp/flow/gate/truck/rstr/save', data);
}

/** 获取限制代码 */
// export function getRstrReason(id: number) {
//   return requestClient.get<TruckViewApi.rstrCodeVO>(
//     `/bpp/flow/gate/truck/rstr-code?id=${id}`,
//   );
// }
export function getRstrReason(_id: number) {
  return Promise.resolve([
    { id: 1, ruleCd: 'A001', ruleDesc: '超重限制', rstrDays: 30 },
    { id: 2, ruleCd: 'A002', ruleDesc: '超高限制', rstrDays: 30 },
    { id: 3, ruleCd: 'A003', ruleDesc: '超宽限制', rstrDays: 15 },
    { id: 4, ruleCd: 'B001', ruleDesc: '违规停车', rstrDays: 7 },
    { id: 5, ruleCd: 'B002', ruleDesc: '未按指定路线行驶', rstrDays: 14 },
    { id: 6, ruleCd: 'C001', ruleDesc: '车辆未年检', rstrDays: 90 },
    { id: 7, ruleCd: 'D001', ruleDesc: '安全隐患', rstrDays: 60 },
  ]);
}
