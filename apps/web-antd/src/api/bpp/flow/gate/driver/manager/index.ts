import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DriverApi {
  // 车队信息VO
  export interface driverVO {
    id: number; // 主键ID
    dvrGkey: string; // 司机全局唯一业务主键
    trkGkey: string; // 车辆全局唯一业务主键
    fltGkey: string; // 车队全局唯一业务主键
    fltCd?: string; // 所属车队代码
    fltNm: string; // 所属车队中文名
    dvrCd: string; // 司机编号
    dvrNm: string; // 司机姓名
    dvrPh: string; // 手机号
    idNo: string; // 身份证号
    dvrLicNo: string; // 驾驶证号
    trkNo: string; // 绑定车牌号
    trkRstrFlg: number; // 绑定车牌号是否被限制
    remark: string; // 备注
    enableFlg: number; // 是否启用
    dataSrc: string; // 数据来源
  }
}

/** 查询司机信息分页 */
export function getDriverPage(params: PageParam) {
  // return requestClient.get<PageResult<DriverApi.driverVO>>(
  //   '/bpp/flow/gate/driver/page',
  //   { params },
  // );
  // 模拟假数据（字段名参考 flow/gate/driver/manager 和 flow/gate/driver/rstr）
  const mockData: DriverManagementApi.driverVO[] = [
    {
      id: 1,
      dvrGkey: 'DVR000001',
      trkGkey: 'TRK000001',
      fltGkey: 'FLT000001',
      fltCd: 'FLT001',
      fltNm: '顺丰车队',
      dvrCd: 'DRV001',
      dvrNm: '张三',
      dvrPh: '13800138001',
      idNo: '440101199001011234',
      dvrLicNo: 'A12345678',
      trkNo: '粤A12345',
      rstrRsn: 'A001：违规超载',
      trkRstrFlg: 0,
      remark: '良好',
      enableFlg: 1,
      dataSrc: 'SYSTEM',
    },
    {
      id: 2,
      dvrGkey: 'DVR000002',
      trkGkey: 'TRK000002',
      fltGkey: 'FLT000002',
      fltCd: 'FLT002',
      fltNm: '中远车队',
      dvrCd: 'DRV002',
      dvrNm: '李四',
      dvrPh: '13800138002',
      idNo: '440301198502022345',
      dvrLicNo: 'B12345678',
      trkNo: '粤B23456',
      rstrRsn: 'A002：超高限制',
      trkRstrFlg: 0,
      remark: '限制中',
      enableFlg: 1,
      dataSrc: 'MANUAL',
    },
    {
      id: 3,
      dvrGkey: 'DVR000003',
      trkGkey: 'TRK000003',
      fltGkey: 'FLT000001',
      fltCd: 'FLT001',
      fltNm: '顺丰车队',
      dvrCd: 'DRV003',
      dvrNm: '王五',
      dvrPh: '13800138003',
      idNo: '440401199203033456',
      dvrLicNo: 'A23456789',
      trkNo: '粤C34567',
      trkRstrFlg: 0,
      remark: '优质司机',
      enableFlg: 1,
      dataSrc: 'SYSTEM',
    },
    {
      id: 4,
      dvrGkey: 'DVR000004',
      trkGkey: 'TRK000004',
      fltGkey: 'FLT000003',
      fltCd: 'FLT003',
      fltNm: '招商车队',
      dvrCd: 'DRV004',
      dvrNm: '赵六',
      dvrPh: '13800138004',
      idNo: '440601198804044567',
      dvrLicNo: 'B23456789',
      trkNo: '粤E45678',
      trkRstrFlg: 1,
      remark: '重点关注',
      enableFlg: 1,
      dataSrc: 'MANUAL',
    },
    {
      id: 5,
      dvrGkey: 'DVR000005',
      trkGkey: 'TRK000005',
      fltGkey: 'FLT000002',
      fltCd: 'FLT002',
      fltNm: '中远车队',
      dvrCd: 'DRV005',
      dvrNm: '孙七',
      dvrPh: '13800138005',
      idNo: '441900199505055678',
      dvrLicNo: 'C12345678',
      trkNo: '粤S56789',
      trkRstrFlg: 0,
      remark: '新入职',
      enableFlg: 1,
      dataSrc: 'SYSTEM',
    },
  ];

  // 分页处理
  const pageNo = params.pageNo || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedList = mockData.slice(startIndex, endIndex);

  return Promise.resolve({
    list: paginatedList,
    total: mockData.length,
  });
}

/** 查询司机信息详情 */
export function getDriver(id: number) {
  // return requestClient.get<DriverApi.driverVO>(`/bpp/flow/gate/driver/get?id=${id}`);

  const mockData: DriverApi.driverVO[] = [
    {
      id: 1,
      dvrGkey: 'DVR000001',
      trkGkey: 'TRK000001',
      fltGkey: 'FLT000001',
      fltCd: 'FLT001',
      fltNm: '顺丰车队',
      dvrCd: 'DRV001',
      dvrNm: '张三',
      dvrPh: '13800138001',
      idNo: '440101199001011234',
      dvrLicNo: 'A12345678',
      trkNo: '粤A12345',
      trkRstrFlg: 0,
      remark: '良好',
      enableFlg: 1,
      dataSrc: 'SYSTEM',
    },
    {
      id: 2,
      dvrGkey: 'DVR000002',
      trkGkey: 'TRK000002',
      fltGkey: 'FLT000002',
      fltCd: 'FLT002',
      fltNm: '中远车队',
      dvrCd: 'DRV002',
      dvrNm: '李四',
      dvrPh: '13800138002',
      idNo: '440301198502022345',
      dvrLicNo: 'B12345678',
      trkNo: '粤B23456',
      trkRstrFlg: 0,
      remark: '限制中',
      enableFlg: 1,
      dataSrc: 'MANUAL',
    },
    {
      id: 3,
      dvrGkey: 'DVR000003',
      trkGkey: 'TRK000003',
      fltGkey: 'FLT000001',
      fltCd: 'FLT001',
      fltNm: '顺丰车队',
      dvrCd: 'DRV003',
      dvrNm: '王五',
      dvrPh: '13800138003',
      idNo: '440401199203033456',
      dvrLicNo: 'A23456789',
      trkNo: '粤C34567',
      trkRstrFlg: 0,
      remark: '优质司机',
      enableFlg: 1,
      dataSrc: 'SYSTEM',
    },
    {
      id: 4,
      dvrGkey: 'DVR000004',
      trkGkey: 'TRK000004',
      fltGkey: 'FLT000003',
      fltCd: 'FLT003',
      fltNm: '招商车队',
      dvrCd: 'DRV004',
      dvrNm: '赵六',
      dvrPh: '13800138004',
      idNo: '440601198804044567',
      dvrLicNo: 'B23456789',
      trkNo: '粤E45678',
      trkRstrFlg: 1,
      remark: '重点关注',
      enableFlg: 1,
      dataSrc: 'MANUAL',
    },
    {
      id: 5,
      dvrGkey: 'DVR000005',
      trkGkey: 'TRK000005',
      fltGkey: 'FLT000002',
      fltCd: 'FLT002',
      fltNm: '中远车队',
      dvrCd: 'DRV005',
      dvrNm: '孙七',
      dvrPh: '13800138005',
      idNo: '441900199505055678',
      dvrLicNo: 'C12345678',
      trkNo: '粤S56789',
      trkRstrFlg: 0,
      remark: '新入职',
      enableFlg: 1,
      dataSrc: 'SYSTEM',
    },
  ];
  const foundData = mockData.find((item) => item.id === id);
  const result = foundData || mockData[0];
  return Promise.resolve(result);
}

/** 新增司机信息 */
export function createDriver(data: DriverApi.driverVO) {
  return requestClient.post('/bpp/flow/gate/driver/create', data);
}

/** 修改司机信息 */
export function updateDriver(data: DriverApi.driverVO) {
  return requestClient.put('/bpp/flow/gate/driver/update', data);
}

/** 删除司机信息 */
export function deleteDriver(id: number) {
  return requestClient.delete(`/bpp/flow/gate/driver/delete?id=${id}`);
}

/** 批量删除司机信息 */
export function deleteDriverList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/gate/driver/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出司机信息 */
export function exportDriver(params: any) {
  return requestClient.download('/bpp/flow/gate/driver/export-excel', { params });
}
