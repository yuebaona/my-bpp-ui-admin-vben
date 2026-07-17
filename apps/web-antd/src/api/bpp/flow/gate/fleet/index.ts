import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FleetViewApi {
  // 车队信息分页
  export interface fleetPageVO {
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
    rstrStartDt?: Dayjs | string; // 限制开始时间
    rstrEndDt?: Dayjs | string; // 限制结束时间
    lastRstrDt?: Dayjs | string; // 最近一次限制时间
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
    createTime?: Dayjs | string; // 创建时间
    updateTime?: Dayjs | string; // 更新时间
    enableFlg?: number; // 是否有效
  }

  // 车队信息详情
  export interface FleetViewVO {
    id: number; // 主键ID
    fltGkey?: string; // 车队全局唯一业务主键
    fltCd?: string; // 车队代码
    fltNm?: string; // 车队中文名
    fltShortNm?: string; // 车队简写
    fltAddr?: string; // 车队地址
    enableFlg?: number; // 是否有效 (1:是, 0:否)
    rstrCnt?: number; // 已限制次数
    isRstr?: number; // 是否限制 (1:是, 0:否)
    legalNm?: string; // 法人姓名
    legalPh?: string; // 法人电话
    safetyNm?: string; // 安全负责人姓名
    safetyPh?: string; // 安全负责人电话
    bizNm?: string; // 业务姓名
    bizPh?: string; // 业务员电话
    bizRegNo?: string; // 统一信用代码
    otrAuditNo?: string; // 外集卡年审编号
    portRm?: string; // 码头备注
    rstrReason?: string; // 限制原因代码及描述
    rstrDataSrc?: string; // 限制信息来源
    rstrStartDt?: Dayjs | string; // 限制开始时间
    rstrEndtDt?: Dayjs | string; // 限制结束时间
    lastRstrDays?: string; // 最近一次限制时间合计
    dataSrc?: string; // 创建源
    createTime?: Dayjs | string; // 创建时间
    updateTime?: Dayjs | string; // 更新时间
  }

  // 车队限制记录
  export interface FleetViewRstrVO {
    id: number; // 车队限制记录唯一标识
    fltName: string; // 车队名称
    rstrDesc: string; // 限制代码及描述
    rstrStartDt: Dayjs | string; // 限制开始时间
    rstrEndDt: Dayjs | string; // 限制结束时间
    releaseTime: Dayjs | string; // 限制解除时间
    dataSrc: string; // 限制信息来源
    creator: string; // 创建账号
    manualRelFlg: number; // 手动解除
    rstrTotalTime: number; // 限制时间合计
    createTime: Dayjs | string; // 创建时间
  }

  export interface rstrCodeVO {
    id?: number; // 限制规则主键
    ruleCd: string; // 限制代码
    ruleDesc: string; // 描述
  }
}

/** 车队信息列表查询按钮（分页） */
export function pageFleet(params: PageParam) {
  return requestClient.get<PageResult<FleetViewApi.fleetPageVO>>(
    '/bpp/flow/gate/fleet/page',
    { params },
  );
}

/** 获取车队详情 */
export function getFleetDetail(id: number) {
  return requestClient.get<FleetViewApi.FleetViewVO>(
    `/bpp/flow/gate/fleet/get?id=${id}`,
  );
}

/** 保存车队信息按钮 */
export function saveFleet(data: FleetViewApi.FleetViewVO) {
  return requestClient.post('/bpp/flow/gate/fleet/save', data);
}

/** 日志查询按钮 todo */

/** 获取车队限制记录 */
export function getFleetRstrList(id: number) {
  return requestClient.get<FleetViewApi.FleetViewRstrVO>(
    `/bpp/flow/gate/fleet/rstr/list?id=${id}`,
  );
}

/** 获取车队限制信息详情 */
export function getFleetRstrDetail(id: number) {
  return requestClient.get<FleetViewApi.FleetViewRstrVO>(
    `/bpp/flow/gate/fleet/rstr/get?id=${id}`,
  );
}

/** 保存车队限制记录 */
export function saveFleetRstr(data: FleetViewApi.FleetViewRstrVO) {
  return requestClient.post('/bpp/flow/gate/fleet/rstr/save', data);
}

/** 手动解除车队限制 */
export function releaseFleetRstr(id: number) {
  return requestClient.post(`/bpp/flow/gate/fleet/rstr/release?id=${id}`);
}

/** 获取限制代码 */
export function getRstrReason(id: number) {
  return requestClient.get<FleetViewApi.rstrCodeVO>(
    `/bpp/flow/gate/fleet/rstr-code?id=${id}`,
  );
}
