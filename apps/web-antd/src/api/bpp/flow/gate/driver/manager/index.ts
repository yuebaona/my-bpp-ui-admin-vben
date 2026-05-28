import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DriverApi {
  // 车队信息VO
  export interface driverVO {
    id: number; // 主键ID
    dvrGkey: string; // 司机全局唯一业务主键
    trkGkey: string; // 车辆全局唯一业务主键
    fltGkey: string; // 车队全局唯一业务主键
    dvrCd: string; // 司机编号
    dvrNm: string; // 司机姓名
    dvrPh: string; // 手机号
    idNo: string; // 身份证号
    dvrLicNo: string; // 驾驶证号
    remark: string; // 备注
    enableFlg: number; // 是否启用
    dataSrc: string; // 数据来源
  }
}

// 主计划分页查询
export const getDriverListPage = (data: pageVO) => {
  // return requestClient.post('/bpp/gate/empty/container-control-main/page', {
  //   ...data,
  //   planType: 'MAIN',
  // });

  // 模拟假数据
  const mockData: DriverApi.driverVO[] = [
    {
      id: 1,
      driverCode: 'FLT001',
      driverCnName: '顺丰车队',
      driverPhone: '13800138001',
      driverShortName: '顺丰',
      driverAddress: '广东省深圳市南山区科技园',
      restrictedCount: 0,
      isRestricted: false,
      restrictionReason: '',
      restrictInfoSource: '',
      restrictStartTime: '',
      restrictEndTime: '',
      lastRestrictTimeTotal: 0,
      legalPersonName: '张三',
      legalPersonPhone: '13900139001',
      safetyPersonName: '李四',
      safetyPerson: '李四',
      safetyPersonPhone: '13700137001',
      businessPersonName: '王五',
      responsiblePerson: '王五',
      outerTruckAnnualReviewNo: 'TRK2024001',
      wharfRemark: '优质车队',
      createSource: 'SYSTEM',
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-03-20 14:25:00',
      isValid: '1',
    },
    {
      id: 2,
      driverCode: 'FLT002',
      driverCnName: '中远车队',
      driverPhone: '13800138002',
      driverShortName: '中远',
      driverAddress: '上海市浦东新区外高桥保税区',
      restrictedCount: 2,
      isRestricted: true,
      restrictionReason: '违规操作',
      restrictInfoSource: '港口管理系统',
      restrictStartTime: '2024-03-01 00:00:00',
      restrictEndTime: '2024-06-01 00:00:00',
      lastRestrictTimeTotal: 90,
      legalPersonName: '赵六',
      legalPersonPhone: '13900139002',
      safetyPersonName: '孙七',
      safetyPerson: '孙七',
      safetyPersonPhone: '13700137002',
      businessPersonName: '周八',
      responsiblePerson: '周八',
      outerTruckAnnualReviewNo: 'TRK2024002',
      wharfRemark: '需加强管理',
      createSource: 'MANUAL',
      createTime: '2024-02-10 09:15:00',
      updateTime: '2024-03-15 16:40:00',
      isValid: '1',
    },
    {
      id: 3,
      driverCode: 'FLT003',
      driverCnName: '招商车队',
      driverPhone: '13800138003',
      driverShortName: '招商',
      driverAddress: '广东省广州市黄埔区港前路',
      restrictedCount: 0,
      isRestricted: false,
      restrictionReason: '',
      restrictInfoSource: '',
      restrictStartTime: '',
      restrictEndTime: '',
      lastRestrictTimeTotal: 0,
      legalPersonName: '吴九',
      legalPersonPhone: '13900139003',
      safetyPersonName: '郑十',
      safetyPerson: '郑十',
      safetyPersonPhone: '13700137003',
      businessPersonName: '陈一',
      responsiblePerson: '陈一',
      outerTruckAnnualReviewNo: 'TRK2024003',
      wharfRemark: '合作良好',
      createSource: 'SYSTEM',
      createTime: '2024-01-20 11:00:00',
      updateTime: '2024-03-18 13:30:00',
      isValid: '1',
    },
    {
      id: 4,
      driverCode: 'FLT004',
      driverCnName: '马士基车队',
      driverPhone: '13800138004',
      driverShortName: '马士基',
      driverAddress: '天津市滨海新区天津港',
      restrictedCount: 1,
      isRestricted: true,
      restrictionReason: '超时未完成',
      restrictInfoSource: '调度系统',
      restrictStartTime: '2024-02-15 00:00:00',
      restrictEndTime: '2024-04-15 00:00:00',
      lastRestrictTimeTotal: 60,
      legalPersonName: '刘二',
      legalPersonPhone: '13900139004',
      safetyPersonName: '张三',
      safetyPerson: '张三',
      safetyPersonPhone: '13700137004',
      businessPersonName: '李四',
      responsiblePerson: '李四',
      outerTruckAnnualReviewNo: 'TRK2024004',
      wharfRemark: '国际车队',
      createSource: 'MANUAL',
      createTime: '2024-01-25 14:20:00',
      updateTime: '2024-03-10 10:15:00',
      isValid: '1',
    },
  ];
  return Promise.resolve({
    list: mockData,
    total: mockData.length,
  });
};

// 车队信息详情
export const getDriverById = (id: number) => {
  // return requestClient.get(
  //   `/bpp/gate/empty/container-control-main/get?id=${id}`,
  // );

  const mockData: DriverApi.driverVO[] = [
    {
      id: 1,
      driverCode: 'FLT001',
      driverCnName: '顺丰车队',
      driverPhone: '13800138001',
      driverShortName: '顺丰',
      driverAddress: '广东省深圳市南山区科技园',
      restrictedCount: 0,
      isRestricted: false,
      restrictionReason: '',
      restrictInfoSource: '',
      restrictStartTime: '',
      restrictEndTime: '',
      lastRestrictTimeTotal: 0,
      legalPersonName: '张三',
      legalPersonPhone: '13900139001',
      safetyPersonName: '李四',
      safetyPerson: '李四',
      safetyPersonPhone: '13700137001',
      businessPersonName: '王五',
      responsiblePerson: '王五',
      outerTruckAnnualReviewNo: 'TRK2024001',
      wharfRemark: '优质车队',
      createSource: 'SYSTEM',
      createTime: '2024-01-15 10:30:00',
      updateTime: '2024-03-20 14:25:00',
      isValid: '1',
    },
    {
      id: 2,
      driverCode: 'FLT002',
      driverCnName: '中远车队',
      driverPhone: '13800138002',
      driverShortName: '中远',
      driverAddress: '上海市浦东新区外高桥保税区',
      restrictedCount: 2,
      isRestricted: true,
      restrictionReason: '违规操作',
      restrictInfoSource: '港口管理系统',
      restrictStartTime: '2024-03-01 00:00:00',
      restrictEndTime: '2024-06-01 00:00:00',
      lastRestrictTimeTotal: 90,
      legalPersonName: '赵六',
      legalPersonPhone: '13900139002',
      safetyPersonName: '钱七',
      safetyPerson: '钱七',
      safetyPersonPhone: '13700137002',
      businessPersonName: '孙八',
      responsiblePerson: '孙八',
      outerTruckAnnualReviewNo: 'TRK2024002',
      wharfRemark: '大型车队',
      createSource: 'SYSTEM',
      createTime: '2024-02-01 10:30:00',
      updateTime: '2024-03-25 14:25:00',
      isValid: '1',
    },
    {
      id: 3,
      driverCode: 'FLT003',
      driverCnName: '招商车队',
      driverPhone: '13800138003',
      driverShortName: '招商',
      driverAddress: '深圳市南山区招商局大厦',
      restrictedCount: 1,
      isRestricted: true,
      restrictionReason: '超时未年审',
      restrictInfoSource: '车辆管理系统',
      restrictStartTime: '2024-04-01 00:00:00',
      restrictEndTime: '2024-05-01 00:00:00',
      lastRestrictTimeTotal: 30,
      legalPersonName: '周九',
      legalPersonPhone: '13900139003',
      safetyPersonName: '吴十',
      safetyPerson: '吴十',
      safetyPersonPhone: '13700137003',
      businessPersonName: '郑一',
      responsiblePerson: '郑一',
      outerTruckAnnualReviewNo: 'TRK2024003',
      wharfRemark: '国有企业',
      createSource: 'SYSTEM',
      createTime: '2024-01-20 10:30:00',
      updateTime: '2024-04-01 14:25:00',
      isValid: '1',
    },
    {
      id: 4,
      driverCode: 'FLT004',
      driverCnName: '马士基车队',
      driverPhone: '13800138004',
      driverShortName: '马士基',
      driverAddress: '上海市浦东新区陆家嘴',
      restrictedCount: 0,
      isRestricted: false,
      restrictionReason: '',
      restrictInfoSource: '',
      restrictStartTime: '',
      restrictEndTime: '',
      lastRestrictTimeTotal: 0,
      legalPersonName: '王二',
      legalPersonPhone: '13900139004',
      safetyPersonName: '陈三',
      safetyPerson: '陈三',
      safetyPersonPhone: '13700137004',
      businessPersonName: '林四',
      responsiblePerson: '林四',
      outerTruckAnnualReviewNo: 'TRK2024004',
      wharfRemark: '国际物流',
      createSource: 'SYSTEM',
      createTime: '2024-01-25 10:30:00',
      updateTime: '2024-04-10 14:25:00',
      isValid: '1',
    },
  ];
  const foundData = mockData.find((item) => item.id === id);
  const result = foundData || mockData[0];
  return Promise.resolve(result);
};

/** 查询司机信息分页 */
export function getDriverPage(params: PageParam) {
  return requestClient.get<PageResult<DriverApi.driverVO>>(
    '/bpp/gate/driver/page',
    { params },
  );
}

/** 查询司机信息详情 */
export function getDriver(id: number) {
  return requestClient.get<DriverApi.driverVO>(`/bpp/gate/driver/get?id=${id}`);
}

/** 新增司机信息 */
export function createDriver(data: DriverApi.driverVO) {
  return requestClient.post('/bpp/gate/driver/create', data);
}

/** 修改司机信息 */
export function updateDriver(data: DriverApi.driverVO) {
  return requestClient.put('/bpp/gate/driver/update', data);
}

/** 删除司机信息 */
export function deleteDriver(id: number) {
  return requestClient.delete(`/bpp/gate/driver/delete?id=${id}`);
}

/** 批量删除司机信息 */
export function deleteDriverList(ids: number[]) {
  return requestClient.delete(
    `/bpp/gate/driver/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出司机信息 */
export function exportDriver(params: any) {
  return requestClient.download('/bpp/gate/driver/export-excel', { params });
}
