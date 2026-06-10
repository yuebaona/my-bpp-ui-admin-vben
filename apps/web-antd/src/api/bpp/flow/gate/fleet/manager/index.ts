import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FleetApi {
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
}

/** 创建车队 */
export function createFleet(data: FleetApi.fleetVO) {
  return requestClient.post('/bpp/flow/gate/fleet/create', data);
}

/** 更新车队信息 */
export function updateFleet(data: FleetApi.fleetVO) {
  return requestClient.put('/bpp/flow/gate/fleet/update', data);
}

/** 删除车队 */
export function deleteFleet(id: number) {
  return requestClient.delete(`/bpp/flow/gate/fleet/delete?id=${id}`);
}

/** 批量删除车队信息 */
export function deleteFleetList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/fleet/delete-list?ids=${ids.join(',')}`,
  );
}

/** 查询车队详情 */
export function getFleetById(id: number) {
  return requestClient.get<FleetApi.fleetVO>(
    `/bpp/flow/gate/fleet/get?id=${id}`,
  );
}

/** 查询车队管理列表 */
export function getFleetPage(params: PageParam) {
  return requestClient.get<PageResult<FleetApi.fleetVO>>(
    '/bpp/flow/gate/fleet/page',
    { params },
  );
}

/** 导出用户 */
export function exportFleet(params: any) {
  return requestClient.download('/bpp/flow/gate/fleet/export-excel', { params });
}

/** 获取可选车队列表 */
export function getSelectableList() {
  return requestClient.get('/bpp/flow/gate/fleet/selectable');
}
