import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';



export namespace EmptyContainerControlApi {
  // 主计划信息VO
  export interface mainPlanVO {
    id: null | number;
    ownerCodeList: Array<string>;
    containerIsoList: Array<string>;
    isRelease: boolean;
    pickupPlanNo: string;
    tradeType: string;
    planQuantity: string;
    completedReleaseQuantity: string;
    bayRangeList: Array<{
      emptyContainerControlId: number | string;
      id: number | string;
      yardBay: string;
      yardRaw: string;
    }>;
    planType: string;
    mainId: string;
    planNo: string;
  }
  // 子计划VO
  export interface subPlanVO {
    id: number;
    ownerCodeList: Array<string>;
    containerIsoList: Array<string>;
    isRelease: boolean;
    pickupPlanNo: string;
    tradeType: string;
    planQuantity: string;
    completedReleaseQuantity: string;
    bayRangeList: Array<{
      emptyContainerControlId: null | string;
      id: null | number;
      yardBay: string;
      yardRaw: string;
    }>;
    planType: string;
    mainId: string;
    planNo: string;
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

  export interface yardRangeVO {
    containerIsoList: Array<string>;
    ownerCodeList: Array<string>;
    tradeType: string;
  }

  export interface YardRangeResponse {
    yard: string;
    yardBayList: string[];
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
}
export interface LogQueryParams extends PageParam {
  mainPlanNo?: string; // 主计划号
  owner?: string; // 持箱人
  iso?: string; // ISO
  yardBay?: string; // 箱区
  createTime?: [string, string]; // 创建时间范围
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

// 主计划分页查询
export const getMainPlanPage = (data: any) => {
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
    `/bpp/flow/empty/container-control-main/sub/delete?id=${id}`,
  );
};

// 日志分页查询
export const getLogQueryPage = (params: LogQueryParams) => {
  return requestClient.get<PageResult<EmptyContainerControlApi.mainLogVO>>(
    '/bpp/flow/empty/container-control-main-log/page',
    { params },
  );
};

// 获取箱区范围
export const getYardRange = (data: EmptyContainerControlApi.yardRangeVO) => {
  return requestClient.post(
    '/bpp/flow/empty/container-control-main/bay/list',
    data,
  );
};

// 新建子计划获取持箱人信息
export const subPlanGetOwnerList = (mainId : number) => {
  return requestClient.get<Array<string>>(
    `/bpp/flow/empty/container-control-main/sub/owner/list?mainId=${mainId}`,
  );
};

// 新建子计划获取ISO信息
export const subPlanGetIsoList = (mainId : number) => {
  return requestClient.get<Array<string>>(
    `/bpp/flow/empty/container-control-main/sub/iso/list?mainId=${mainId}`,
  );
}

