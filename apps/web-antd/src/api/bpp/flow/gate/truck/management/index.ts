import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace TruckApi {
  /** 车辆信息实体类信息 */
  export interface Truck {
    id: number; // 主键ID
    trkGkey: string; // 车辆全局唯一业务主键
    fltCd: string; // 关联车队代码
    fltNm?: string; // 所属车队中文名
    driverNm: string; // 司机姓名
    trkNo: string; // 车牌号
    trkLicNo: string; // 车辆行驶证编号
    engNo: string; // 发动机编号
    licExpDt: Dayjs | string; // 行驶证有效期
    trailerNo: string; // 挂车车牌编号
    trailerLicNo: string; // 挂车行驶证编号
    trkWtKg: number; // 车身重量
    maxLoadWtKg: number; // 最大可装载重量
    trkLenM: number; // 车辆长度
    trkWidM: number; // 车辆宽度
    trkColor: string; // 车辆前脸颜色
    trkOwnrNm: string; // 车主姓名
    trkOwnrPh: string; // 车主联系电话
    trkOwnrId: string; // 车主身份证编号
    hazLic: string; // 危险品运输许可证
    attachDt: Dayjs | string; // 附件上传日期
    autoFlg: number; // 自动化码头适配标识
    rfidNo: string; // RFID编号
    etcNo: string; // ETC标识号
    inspDt: Dayjs | string; // 年检日期
    inspBy: string; // 年检审核人
    annRevFlag: number; // 是否年审
    remark: string; // 备注
    enableFlg: number; // 是否启用
    dataSrc: string; // 数据来源
  }
}

export interface LogQueryParams extends PageParam {
  mainPlanNo?: string; // 主计划号
  owner?: string; // 持箱人
  iso?: string; // ISO
  yardBay?: string; // 箱区
  createTime?: [string, string]; // 创建时间范围
}

/** 查询车辆信息实体类分页 */
export function getTruckPage(params: PageParam) {
  return requestClient.get<PageResult<TruckApi.Truck>>(
    '/bpp/flow/gate/truck/page',
    { params },
  );
}

/** 查询车辆信息实体类详情 */
export function getTruck(id: number) {
  return requestClient.get<TruckApi.Truck>(`/bpp/flow/gate/truck/get?id=${id}`);
}

/** 新增车辆信息实体类 */
export function createTruck(data: TruckApi.Truck) {
  return requestClient.post('/bpp/flow/gate/truck/create', data);
}

/** 修改车辆信息实体类 */
export function updateTruck(data: TruckApi.Truck) {
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
