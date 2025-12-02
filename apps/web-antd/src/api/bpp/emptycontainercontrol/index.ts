import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace EmptyContainerControlApi {
  // 主计划信息VO
  export interface mainPlanVO {
    id: number;
    ownerList: Array<string>;
    isoNoList: Array<string>;
    isRelease: boolean;
    pickupPlanNo: string;
    tradeType: string;
    planQuantity: string;
    completedReleaseQuantity: string;
    bayRangeList: {
      emptyContainerControlId: number | string;
      id: number | string;
      yardBay: string;
      yardRaw: string;
    };
    planType: string;
    mainId: string;
    planNo: string;
  }
  // 子计划VO
  export interface subPlanVO {
    id: number;
    planNo: string; // 子计划号
    planStatus: string; // 状态
    isRelease: boolean; // 是否放箱
    pickupPlanNo: string; // 提箱受理计划号
    dischargeVesselSchedule: string; // 卸船船期
    tradeType: string; // 贸易类型
    owners: Array<string>; // 持箱人
    isoNo: Array<string>; // ISO
    bayRanges: string; // 箱区范围
    planQuantity: string; // 计划箱量
    mainGateReleaseQuantity: string; // 主闸可放箱量
    completedReleaseQuantity: string; // 已用箱量
    uncompletedReleaseQuantity: string; // 未放箱量
    activeOccupiedQuantity: string; // 作业中占用的箱量
    planType: string; // 计划类型
    mainId: number; // 主计划ID
    creator: string; // 创建人
    createTime: string; // 创建时间
    updater: string; // 创建人
    updateTime: string; // 修改时间
  }
  // 超限受理计划信息
  export interface AcceptancePlanOverOperationVO {
    id: number;
    isAllowedStacking: boolean;
    plannedMachineryType: string;
    acceptancePlanNo: string;
    processInstanceId: string;
  }
  // 超限受理计划箱信息
  export interface AcceptancePlanOverOperationContainerVO {
    id: number;
    containerNo: string;
    containerSize: string;
    containerType: string;
    containerCargoWeight: number;
    containerTotalWeight: number;
    containerCargoSize: string;
    containerOverlimitDetails: string;
    containerPhysicalStatus: string;
    containerOperationNode: string;
    acceptancePlanNo: string;
    overOperationContainerNo: string;
    processInstanceId: string;
    priceSea: number;
    priceGate: number;
    machineSpreaderChangeType: string;
    machineSpreaderType: string;
    plannedSpreaderType: string;
  }
  // 提单信息表
  export interface AcceptancePlanBillMessageVO {
    id: number;
    acceptancePlanNo: string;
    billNo: string;
    cargoType: string;
    cargoName: string;
    cargoCount: number;
    billType: string;
  }
  // 总数据
  export interface EmptyContainerControlSaveReqVO {
    mainPlanSaveReqVO: mainPlanVO;
    subPlanSaveReqVO: subPlanVO;
    acceptancePlanOverOperationSaveReqVO: AcceptancePlanOverOperationVO;
    acceptancePlanOverOperationContainerSaveReqVOs: AcceptancePlanOverOperationContainerVO[];
    acceptancePlanBillMessageSaveReqVO: AcceptancePlanBillMessageVO;
  }

  // 总数据
  export interface SubPlanSaveReqVO {
    acceptancePlanSaveReqVO: subPlanVO;
    // acceptancePlanOverOperationSaveReqVO: AcceptancePlanOverOperationVO;
    // acceptancePlanOverOperationContainerSaveReqVOs: AcceptancePlanOverOperationContainerVO[];
    // acceptancePlanBillMessageSaveReqVO: AcceptancePlanBillMessageVO;
  }
}

// 创建主计划信息
export const createMainplan = (
  data: EmptyContainerControlApi.mainPlanSaveReqVO,
) => {
  return requestClient.post(
    '/bpp/flow/empty/container-control-main/create',
    data,
  );
};
// 修改主计划信息
export const updateMainPlan = (
  data: EmptyContainerControlApi.mainPlanSaveReqVO,
) => {
  return requestClient.put(
    '/bpp/flow/acceptance-plan-over-operation/update',
    data,
  );
};
// 查询主计划信息详情
export const getMainPlan = (id: number) => {
  return requestClient.get(
    `/bpp/flow/empty/container-control-main/get?id=${id}`,
  );
};

// 主计划信息分页查询
export const getMainPlanPage = (data: EmptyContainerControlApi.mainPlanVO) => {
  return requestClient.post(
    '/bpp/flow/empty/container-control-main/page',
    data,
  );
};

// 删除主计划
export const deleteMainPlan = (id: number) => {
  return requestClient.delete(
    `/bpp/flow/empty/container-control-main/delete?id=${id}`,
  );
};

// 创建子计划信息
export const createSubPlan = (
  data: EmptyContainerControlApi.SubPlanSaveReqVO,
) => {
  return requestClient.post('/bpp/flow/sub-plan/create', data);
};

// 修改子计划信息
export const updateSubPlan = (
  data: EmptyContainerControlApi.SubPlanSaveReqVO,
) => {
  return requestClient.put('/bpp/flow/sub-plan/update', data);
};

// 查询子计划信息详情
export const getSubPlan = (id: number) => {
  return requestClient.get(`/bpp/flow/sub-plan/get?id=${id}`);
};
// 子计划分页查询
export const getSubPlanPage = (data: EmptyContainerControlApi.subPlanVO) => {
  // const requestData = {
  //   ...data,
  //   planType: 'SUB',
  //   mainId: '1994335982955827202',
  // };
  return requestClient.post(
    '/bpp/flow/empty/container-control-main/page',
    data,
  );
};

export const deleteSubPlan = (id: number) => {
  return requestClient.get(`/bpp/flow/sub-plan/get?id=${id}`);
};

export const getLogQueryData = (params: PageParam) => {
  return requestClient.get<
    PageResult<EmptyContainerControlApi.SubPlanSaveReqVO>
  >('/bpp/flow/sub-plan/log-query', { params });
};
