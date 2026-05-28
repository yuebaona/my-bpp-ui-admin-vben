import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FleetApi {
  // 车队信息VO
  export interface fleetVO {
    id?: number; // 车队信息表唯一主键
    fltGkey?: string; // 车队全局唯一业务主键
    fltCd?: string; // 车队代码
    fltNm?: string; // 车队全称
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
    bizRegNo?: string; // 营业执照注册号
    otrAuditNo?: string; // OTR审核编号
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

// 主计划分页查询
export const getFleetListPage = (data: pageVO) => {
  // return requestClient.post('/bpp/gate/empty/container-control-main/page', {
  //   ...data,
  //   planType: 'MAIN',
  // });

  // 模拟假数据
  const mockData: FleetApi.fleetVO[] = [
    {
      id: 1,
      fleetCode: 'FLT001',
      fleetCnName: '顺丰车队',
      fleetPhone: '13800138001',
      fleetShortName: '顺丰',
      fleetAddress: '广东省深圳市南山区科技园',
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
      fleetCode: 'FLT002',
      fleetCnName: '中远车队',
      fleetPhone: '13800138002',
      fleetShortName: '中远',
      fleetAddress: '上海市浦东新区外高桥保税区',
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
      fleetCode: 'FLT003',
      fleetCnName: '招商车队',
      fleetPhone: '13800138003',
      fleetShortName: '招商',
      fleetAddress: '广东省广州市黄埔区港前路',
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
      fleetCode: 'FLT004',
      fleetCnName: '马士基车队',
      fleetPhone: '13800138004',
      fleetShortName: '马士基',
      fleetAddress: '天津市滨海新区天津港',
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
export const getFleetById = (id: number) => {
  // return requestClient.get(
  //   `/bpp/gate/empty/container-control-main/get?id=${id}`,
  // );

  const mockData: FleetApi.fleetVO[] = [
    {
      id: 1,
      fleetCode: 'FLT001',
      fleetCnName: '顺丰车队',
      fleetPhone: '13800138001',
      fleetShortName: '顺丰',
      fleetAddress: '广东省深圳市南山区科技园',
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
      fleetCode: 'FLT002',
      fleetCnName: '中远车队',
      fleetPhone: '13800138002',
      fleetShortName: '中远',
      fleetAddress: '上海市浦东新区外高桥保税区',
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
      fleetCode: 'FLT003',
      fleetCnName: '招商车队',
      fleetPhone: '13800138003',
      fleetShortName: '招商',
      fleetAddress: '深圳市南山区招商局大厦',
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
      fleetCode: 'FLT004',
      fleetCnName: '马士基车队',
      fleetPhone: '13800138004',
      fleetShortName: '马士基',
      fleetAddress: '上海市浦东新区陆家嘴',
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
export function getFleet(id: number) {
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
