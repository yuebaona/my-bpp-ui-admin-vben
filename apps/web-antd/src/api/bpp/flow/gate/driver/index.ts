import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DriverViewApi {
  // 司机分页查询响应 VO
  export interface driverPageVO {
    driverId: number; // 司机主键
    driverAccount: string; // 司机账号
    driverName: string; // 司机姓名
    driverPhone: string; // 司机手机号
    driverIdCard: string; // 身份证号
    driverLicenseNo: string; // 驾驶证号
    fleetCode: string; // 所属车队代码
    fleetName: string; // 所属车队中文名
    fleetIsRstr: number; // 所属车队是否被限制 (1:是, 0:否)
    driverIsRstr: number; // 是否限制（司机）(1:是, 0:否)
    driverRstrInfo: string; // 司机限制代码及描述
    driverRstrTimes: number; // 已限制次数
    driverRstrStartTime: string; // 限制开始时间
    driverRstrEndTime: string; // 限制结束时间
    driverRstrLastDaysTotal: string; // 最近一次限制时间合计
    rstrDataSrc: string; // 限制信息来源
    truckNo: string; // 绑定车牌号
    truckIsRstr: number; // 绑定车辆是否被限制 (1:是, 0:否)
    truckLastInTime: string; // 最后进场时间
    truckLastOutTime: string; // 最后出场时间
    portRemark: string; // 码头备注
    dataSrc: string; // 创建源
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
    enableFlg: number; // 是否有效 (1:有效, 0:无效)
  }

  // 司机详情响应 VO
  export interface driverVO {
    driverId: number; // 司机主键
    driverAccount: string; // 司机账号
    driverName: string; // 司机姓名
    driverPhone: string; // 司机手机号
    driverIdCard: string; // 身份证号
    driverLicenseNo: string; // 驾驶证号
    fleetCode: string; // 所属车队代码
    fleetName: string; // 所属车队中文名
    fleetIsRstr: number; // 所属车队是否被限制 (0:否, 1:是)
    truckNo: string; // 绑定车牌号
    truckIsRstr: number; // 绑定车辆是否被限制 (0:否, 1:是)
    truckLastInTime: string; // 最后进场时间
    truckLastOutTime: string; // 最后出场时间
    driverIsRstr: number; // 是否限制（司机）(0:否, 1:是)
    driverRstrTimes: number; // 已限制次数
    driverRstrStartTime: string; // 限制开始时间
    driverRstrEndTime: string; // 限制结束时间
    driverRstrLastDaysTotal: string; // 最近一次限制时间合计
    driverRstrInfo: string; // 限制原因代码及描述
    rstrDataSrc: string; // 限制信息来源
    portRemark: string; // 码头备注
    dataSrc: string; // 创建源
    enableFlg: number; // 是否有效 (0:无效, 1:有效)
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
  }
  // 司机限制记录 VO
  export interface driverRstrListVO {
    rstrId: number; // 限制记录主键ID
    fleetCode: string; // 所属车队代码
    fleetName: string; // 所属车队名称
    truckNo: string; // 绑定车牌号
    driverName: string; // 司机姓名
    rstrInfo: string; // 限制代码及描述
    rstrStartTime: string; // 限制开始时间
    rstrEndTime: string; // 限制结束时间
    rstrDurationTotal: string; // 限制时长合计
    releaseTime: string; // 解除限制时间
    dataSrc: string; // 限制信息来源
    createBy: string; // 创建账号
    createTime: string; // 创建时间
  }

  // 司机限制详情响应 VO
  export interface driverRstrVO {
    fleetCode?: string; // 车队代码
    truckNo?: string; // 车牌号
    driverName?: string; // 司机姓名
    rstrInfo?: string; // 限制代码：描述
    rstrStartTime?: string; // 限制开始时间
    rstrEndTime?: string; // 限制结束时间
    rstrTotalTime?: string; // 限制时间合计
    createTime?: string; // 创建时间
    rstrReleaseTime?: string; // 解除限制时间
    dataSrc?: string; // 限制信息来源
    createBy?: string; // 创建账号
  }

  export interface rstrCodeVO {
    id?: number; // 限制规则表唯一主键
    ruleCd: string; // 限制代码
    ruleDesc: string; // 描述
  }
}

/** 查询司机信息分页获取 */
export function pageFleet(params: PageParam) {
  return requestClient.get<PageResult<DriverViewApi.driverPageVO>>(
    '/bpp/flow/gate/driver/page',
    { params },
  );
}

/** 获取司机详情 */
export function getDriverDetail(id: number) {
  return requestClient.get<DriverViewApi.driverVO>(
    `/bpp/flow/gate/driver/get?id=${id}`,
  );
}

/** 保存司机信息按钮 */
export function saveDriver(data: DriverViewApi.driverVO) {
  return requestClient.post('/bpp/flow/gate/driver/save', data);
}

/** 日志查询按钮 todo */

/** 获取司机限制记录 */
export function getDriverRstrList(id: number) {
  return requestClient.get<DriverViewApi.driverRstrListVO>(
    `/bpp/flow/gate/driver/rstr/list?id=${id}`,
  );
}

/** 获取司机限制信息 */
export function getFleetRstr(id: number) {
  return requestClient.get<DriverViewApi.driverRstrVO>(
    `/bpp/flow/gate/driver/rstr/get?id=${id}`,
  );
}

/** 保存司机限制记录 */
export function saveDriverRstr(data: DriverViewApi.driverRstrVO) {
  return requestClient.post('/bpp/flow/gate/driver/rstr/save', data);
}

/** 手动解除司机限制 */
export function releaseDriverRstr(id: number) {
  return requestClient.post(`/bpp/flow/gate/driver/rstr/release?id=${id}`);
}

/** 获取限制代码 */
export function getRstrReason(id: number) {
  return requestClient.get<DriverViewApi.rstrCodeVO>(
    `/bpp/flow/gate/driver/rstr-code?id=${id}`,
  );
}
