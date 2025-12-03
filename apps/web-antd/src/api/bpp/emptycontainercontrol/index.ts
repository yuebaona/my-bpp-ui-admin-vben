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
export const createMainPlan = (data: EmptyContainerControlApi.mainPlanVO) => {
  return requestClient.post(
    '/bpp/flow/empty/container-control-main/create',
    data,
  );
};
// 修改主计划信息
export const updateMainPlan = (data: EmptyContainerControlApi.mainPlanVO) => {
  return requestClient.put(
    '/bpp/flow/empty/container-control-main/update',
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
    `/bpp/flow/empty/container-control-main/main/delete?id=${id}`,
  );
};

// 创建子计划信息
export const createSubPlan = (data: EmptyContainerControlApi.subPlanVO) => {
  return requestClient.post(
    '/bpp/flow/empty/container-control-main/create',
    data,
  );
};

// 修改子计划信息
export const updateSubPlan = (data: EmptyContainerControlApi.subPlanVO) => {
  return requestClient.put(
    '/bpp/flow/empty/container-control-main/update',
    data,
  );
};

// 查询子计划信息详情
export const getSubPlan = (id: number) => {
  return requestClient.get(
    `/bpp/flow/empty/container-control-main/get?id=${id}`,
  );
};
// 子计划分页查询
export const getSubPlanPage = (data: EmptyContainerControlApi.subPlanVO) => {
  return requestClient.post(
    '/bpp/flow/empty/container-control-main/page',
    data,
  );
};

export const deleteSubPlan = (id: number) => {
  return requestClient.delete(
    `/bpp/flow/empty/container-control-main/delete?id=${id}`,
  );
};

export const getLogQueryData = (params: PageParam) => {
  return requestClient.get<
    PageResult<EmptyContainerControlApi.SubPlanSaveReqVO>
  >('/bpp/flow/sub-plan/log-query', { params });
};
