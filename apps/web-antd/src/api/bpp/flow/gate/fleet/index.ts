import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FleetViewApi {
  // 车队信息VO
  export interface fleetVO {
    id?: number; // 车队信息表唯一主键
    fltGkey?: string; // 车队全局唯一业务主键
    fltCd?: string; // 车队代码
    fltNm?: string; // 车队中文名(全称)
    fltShortNm?: string; // 车队缩写
    fltAddr?: string; // 车队详细地址
    rstrCnt?: number; // 已限制次数
    isRstr?: number; // 是否限制
    rstrReason?: string; // 限制原因代码及描述
    rstrDataSrc?: string; // 限制信息来源
    rstrStartDt?: Date; // 限制开始时间
    rstrEndDt?: Date; // 限制结束时间
    lastRstrDt?: string; // 最近一次限制时间
    legalNm?: string; // 企业法人姓名
    legalPh?: string; // 企业法人联系电话
    safetyNm?: string; // 安全负责人姓名
    safetyPh?: string; // 安全负责人联系电话
    bizNm?: string; // 业务对接人姓名
    bizPh?: string; // 业务对接人联系电话
    bizRegNo?: string; // 社会信用代码
    otrAuditNo?: string; // OTR审核编号（外集卡年审编号）
    portRm?: string; // 码头备注
    dataSrc?: string; // 数据来源
    createTime?: Date; // 创建时间
    updateTime?: Date; // 更新时间
    enableFlg?: number; // 是否有效
  }

  // 创建和修改操作返回消息体
  export interface fleetSaveRespVO {
    id?: string; // 车队信息表唯一主键
    message?: string; // 处理结果消息
  }

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

  export interface rstrCodeVO {
    id?: number; // 车队限制记录表唯一主键
    ruleCd: string; // 限制代码
    ruleDesc: string; // 描述
  }
}

/** 保存按钮 */
export function saveFleet(data: FleetViewApi.fleetVO) {
  return requestClient.post('/bpp/flow/gate/fleet/save', data);
}
/** 车队信息列表查询按钮（分页） */
export function pageFleet(params: PageParam) {
  return requestClient.get<PageResult<FleetViewApi.fleetVO>>(
    '/bpp/flow/gate/fleet/page',
    { params },
  );
}

/** 日志查询按钮 todo */

/** 导出按钮 */
export function exportFleet(params: any) {
  return requestClient.download('/bpp/flow/gate/fleet/export-excel', {
    params,
  });
}

/** 获取车队限制信息 */
export function getFleetRstr(fltId: number) {
  return requestClient.get<FleetViewApi.fleetVO>(
    `/bpp/flow/gate/fleet/get-rstr?fltId=${fltId}`,
  );
}
/** 创建车队限制记录 */
export function createFleetRstr(data: FleetViewApi.fleetVO) {
  return requestClient.post('/bpp/flow/gate/fleet/rstr/create', data);
}
/** 手动解除车队限制 */
export function releaseFleetRstr(fltRstrId: number) {
  return requestClient.post(
    `/bpp/flow/gate/fleet/rstr/release?fltRstrId=${fltRstrId}`,
  );
}
/** 获取车队详情 */
export function getFleetDetail(id: number) {
  return requestClient.get<FleetViewApi.fleetVO>(
    `/bpp/flow/gate/fleet/get?id=${id}`,
  );
}

/** 获取限制代码 */
export function getRstrReason(id: number) {
  return requestClient.get<FleetViewApi.rstrCodeVO>(
    `/bpp/flow/gate/fleet/rstr-code?id=${id}`,
  );
}
