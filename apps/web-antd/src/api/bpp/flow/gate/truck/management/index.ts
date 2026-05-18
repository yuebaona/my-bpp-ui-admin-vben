import type {Dayjs} from "dayjs";

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

  // 主计划信息VO
  export interface mainPlanVO {
    id: null | number;
    ownerCodeList: Array<string>;
    contIsoList: Array<string>;
    isRelease: boolean;
    pickupPlanNo: string;
    tradeType: string;
    planQuantity: string;
    completedReleaseQuantity: string;
    bayRangeList: Array<{
      eccId: number | string;
      id: number | string;
      yardBay: string;
      yardRaw: string;
    }>;
    planType: string;
    mainId: string;
    planNo: string;
    mainGateReleaseQuantity: string;
    dischargeVslSchedule: string;
  }

  export interface mainLogVO {
    id: string;
    operationType: string;
    operationTimestamp: number;
    operator: number;
    mainId: number;
    mainPlanNo: string;
    mainPlanStatus: string;
    mainIsRelease: boolean;
    mainPickupPlanNo: string;
    mainTradeType: string;
    mainPlanQuantity: string;
    createTime: string;
    owner: string;
    iso: string;
    yardBay: string;
    mainGateAvailableQuantity: string;
  }

  export interface ContainerOwnerVO {
    id?: number;
    ownerCode?: string;
    ownerName?: string;
    ownerCountry?: string;
    ownerMaster?: string;
    ownerLocalNm?: string;
  }

  export interface isoVO {
    id?: number;
    contIso?: string;
    isSpecial?: string;
    containerType?: string;
    containerTypeName?: string;
    containerLength?: string;
    containerHeight?: string;
    isoCode?: string;
  }

  // 箱列表列表
  export interface contIsoList {
    code: number;
    msg: string;
    data: string[];
  }

  // 持箱者列表
  export interface ownerCodeList {
    code: number;
    msg: string;
    data: string[];
  }

  // 卸船船期响应
  export interface VesselAndVoyageResponse {
    code: number;
    msg: string;
    data: string[];
  }

  // 获取模拟选箱数据
  export interface simulateContainerVO {
    planNo?: string;
    bisRelease?: boolean;
    bayRanges?: string;
    bayRangeList: Array<{
      createTime: string;
      maxDays: string;
      minDays: string;
      totalCount: string;
      yardBay: string;
      yardRaw: string;
    }>;
    releaseQuantity?: string;
  }

  // 箱区范围展示信息
  export interface containerAreaDisplayVO {
    ownerCodeList: Array<string>;
    contIsoList: Array<string>;
    bayRangeList: Array<{
      eccId: number | string;
      id: number | string;
      yardBay: string;
      yardRaw: string;
    }>;
    bayRanges: string;
  }
}
export interface LogQueryParams extends PageParam {
  mainPlanNo?: string; // 主计划号
  owner?: string; // 持箱人
  iso?: string; // ISO
  yardBay?: string; // 箱区
  createTime?: [string, string]; // 创建时间范围
}

interface pageVO {
  pageNo?: number;
  pageSize?: number;
  planNo?: string;
  dischargeVslSchedule?: string;
  bayRangeList?: Array<{
    yardBay?: string;
    yardRaw?: string;
  }>;
  tradeType?: string;
  ownerCodeList?: Array<string>;
  contIsoList?: Array<string>;
  createTime?: Array<string>;
  pickupPlanNo?: string;
  planType?: string;
  mainId?: string;
  planStatus?: string;
}

// 主计划分页查询
export const getVehicleListPage = (data: pageVO) => {
  // return requestClient.post('/bpp/gate/empty/container-control-main/page', {
  //   ...data,
  //   planType: 'MAIN',
  // });

  // 模拟假数据
  const mockData: TruckApi.Truck[] = [
    {
      id: 1,
      vehicleCode: 'FLT001',
      vehicleCnName: '顺丰车队',
      vehiclePhone: '13800138001',
      vehicleShortName: '顺丰',
      vehicleAddress: '广东省深圳市南山区科技园',
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
      vehicleCode: 'FLT002',
      vehicleCnName: '中远车队',
      vehiclePhone: '13800138002',
      vehicleShortName: '中远',
      vehicleAddress: '上海市浦东新区外高桥保税区',
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
      vehicleCode: 'FLT003',
      vehicleCnName: '招商车队',
      vehiclePhone: '13800138003',
      vehicleShortName: '招商',
      vehicleAddress: '广东省广州市黄埔区港前路',
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
      vehicleCode: 'FLT004',
      vehicleCnName: '马士基车队',
      vehiclePhone: '13800138004',
      vehicleShortName: '马士基',
      vehicleAddress: '天津市滨海新区天津港',
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
export const getVehicleById = (id: number) => {
  // return requestClient.get(
  //   `/bpp/gate/empty/container-control-main/get?id=${id}`,
  // );

  const mockData: TruckApi.Truck[] = [
    {
      id: 1,
      vehicleCode: 'FLT001',
      vehicleCnName: '顺丰车队',
      vehiclePhone: '13800138001',
      vehicleShortName: '顺丰',
      vehicleAddress: '广东省深圳市南山区科技园',
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
      vehicleCode: 'FLT002',
      vehicleCnName: '中远车队',
      vehiclePhone: '13800138002',
      vehicleShortName: '中远',
      vehicleAddress: '上海市浦东新区外高桥保税区',
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
      vehicleCode: 'FLT003',
      vehicleCnName: '招商车队',
      vehiclePhone: '13800138003',
      vehicleShortName: '招商',
      vehicleAddress: '深圳市南山区招商局大厦',
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
      vehicleCode: 'FLT004',
      vehicleCnName: '马士基车队',
      vehiclePhone: '13800138004',
      vehicleShortName: '马士基',
      vehicleAddress: '上海市浦东新区陆家嘴',
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

/** 查询车辆信息实体类分页 */
export function getTruckPage(params: PageParam) {
  return requestClient.get<PageResult<TruckApi.Truck>>('/bpp/gate/truck/page', {
    params,
  });
}

/** 查询车辆信息实体类详情 */
export function getTruck(id: number) {
  return requestClient.get<TruckApi.Truck>(`/bpp/gate/truck/get?id=${id}`);
}

/** 新增车辆信息实体类 */
export function createTruck(data: TruckApi.Truck) {
  return requestClient.post('/bpp/gate/truck/create', data);
}

/** 修改车辆信息实体类 */
export function updateTruck(data: TruckApi.Truck) {
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
