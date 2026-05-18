import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace TruckApi {
  /** 车辆信息实体类信息 */
  export interface Truck {
    id: number; // 主键ID
    trkGkey: string; // 车辆全局唯一业务主键
    fltCd: string; // 关联车队代码
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
    remark: string; // 备注
    enableFlg: number; // 是否启用
    dataSrc: string; // 数据来源
  }
}

export const getVehicleListPage = (data: PageParam) => {
  const mockData: TruckApi.Truck[] = [
    {
      id: 1,
      trkGkey: 'TRK202605180001',
      fltCd: 'FLT001',
      trkNo: '粤B12345',
      trkLicNo: '440300123456',
      engNo: 'ENG2026001',
      licExpDt: '2027-05-18',
      trailerNo: '粤B1234挂',
      trailerLicNo: '440300654321',
      trkWtKg: 8500,
      maxLoadWtKg: 25000,
      trkLenM: 12.5,
      trkWidM: 2.5,
      trkColor: '白色',
      trkOwnrNm: '张三',
      trkOwnrPh: '13800138001',
      trkOwnrId: '440301199001011234',
      hazLic: 'HZ2026001',
      attachDt: '2026-01-15',
      autoFlg: 1,
      rfidNo: 'RFID001',
      etcNo: 'ETC001',
      inspDt: '2026-03-20',
      inspBy: '李检',
      remark: '常规运输车辆',
      enableFlg: 1,
      dataSrc: '手动录入',
    },
    {
      id: 2,
      trkGkey: 'TRK202605180002',
      fltCd: 'FLT002',
      trkNo: '粤B67890',
      trkLicNo: '440300789012',
      engNo: 'ENG2026002',
      licExpDt: '2027-08-10',
      trailerNo: '粤B6789挂',
      trailerLicNo: '440300210987',
      trkWtKg: 9200,
      maxLoadWtKg: 30000,
      trkLenM: 16.5,
      trkWidM: 2.6,
      trkColor: '蓝色',
      trkOwnrNm: '李四',
      trkOwnrPh: '13900139002',
      trkOwnrId: '440301198805052345',
      hazLic: '',
      attachDt: '2026-02-20',
      autoFlg: 0,
      rfidNo: 'RFID002',
      etcNo: 'ETC002',
      inspDt: '2026-04-15',
      inspBy: '王检',
      remark: '大型集装箱运输车',
      enableFlg: 1,
      dataSrc: '系统导入',
    },
    {
      id: 3,
      trkGkey: 'TRK202605180003',
      fltCd: 'FLT001',
      trkNo: '粤B11111',
      trkLicNo: '440300345678',
      engNo: 'ENG2026003',
      licExpDt: '2026-12-31',
      trailerNo: '粤B1111挂',
      trailerLicNo: '440300876543',
      trkWtKg: 7800,
      maxLoadWtKg: 20000,
      trkLenM: 10.0,
      trkWidM: 2.4,
      trkColor: '红色',
      trkOwnrNm: '王五',
      trkOwnrPh: '13700137003',
      trkOwnrId: '440301199203033456',
      hazLic: 'HZ2026003',
      attachDt: '2026-03-10',
      autoFlg: 1,
      rfidNo: 'RFID003',
      etcNo: 'ETC003',
      inspDt: '2026-05-01',
      inspBy: '赵检',
      remark: '危险品专用运输车',
      enableFlg: 1,
      dataSrc: '手动录入',
    },
    {
      id: 4,
      trkGkey: 'TRK202605180004',
      fltCd: 'FLT003',
      trkNo: '粤B22222',
      trkLicNo: '440300901234',
      engNo: 'ENG2026004',
      licExpDt: '2027-03-25',
      trailerNo: '粤B2222挂',
      trailerLicNo: '440300432109',
      trkWtKg: 8000,
      maxLoadWtKg: 22000,
      trkLenM: 13.0,
      trkWidM: 2.5,
      trkColor: '绿色',
      trkOwnrNm: '赵六',
      trkOwnrPh: '13600136004',
      trkOwnrId: '440301199507074567',
      hazLic: '',
      attachDt: '2026-04-05',
      autoFlg: 0,
      rfidNo: 'RFID004',
      etcNo: 'ETC004',
      inspDt: '2026-06-18',
      inspBy: '孙检',
      remark: '冷链运输车辆',
      enableFlg: 0,
      dataSrc: '系统导入',
    },
    {
      id: 5,
      trkGkey: 'TRK202605180005',
      fltCd: 'FLT002',
      trkNo: '粤B33333',
      trkLicNo: '440300567890',
      engNo: 'ENG2026005',
      licExpDt: '2027-11-20',
      trailerNo: '粤B3333挂',
      trailerLicNo: '440300098765',
      trkWtKg: 9500,
      maxLoadWtKg: 28000,
      trkLenM: 14.5,
      trkWidM: 2.6,
      trkColor: '黄色',
      trkOwnrNm: '孙七',
      trkOwnrPh: '13500135005',
      trkOwnrId: '440301198912125678',
      hazLic: '',
      attachDt: '2026-05-01',
      autoFlg: 1,
      rfidNo: 'RFID005',
      etcNo: 'ETC005',
      inspDt: '2026-07-22',
      inspBy: '周检',
      remark: '普通货运车辆',
      enableFlg: 1,
      dataSrc: '手动录入',
    },
  ]
}

/** 查询车辆信息实体类分页 */
export function getTruckPage(params: PageParam) {
  return requestClient.get<PageResult<GateTruckApi.Truck>>(
    '/bpp/gate/truck/page',
    {
      params,
    },
  );
}

/** 查询车辆信息实体类详情 */
export function getTruck(id: number) {
  return requestClient.get<GateTruckApi.Truck>(`/bpp/gate/truck/get?id=${id}`);
}

/** 新增车辆信息实体类 */
export function createTruck(data: GateTruckApi.Truck) {
  return requestClient.post('/bpp/gate/truck/create', data);
}

/** 修改车辆信息实体类 */
export function updateTruck(data: GateTruckApi.Truck) {
  return requestClient.put('/bpp/gate/truck/update', data);
}

/** 删除车辆信息实体类 */
export function deleteTruck(id: number) {
  return requestClient.delete(`/bpp/gate/truck/delete?id=${id}`);
}

/** 批量删除车辆信息实体类 */
export function deleteTruckList(ids: number[]) {
  return requestClient.delete(
    `/bpp/gate/truck/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出车辆信息实体类 */
export function exportTruck(params: any) {
  return requestClient.download('/bpp/gate/truck/export-excel', { params });
}
