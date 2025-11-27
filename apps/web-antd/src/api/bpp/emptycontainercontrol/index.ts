import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace EmptyContainerControlApi {
  // 主计划信息VO
  export interface mainPlanVO {
    id: number;
    mainPlanNo: string; //
    acceptancePlanWebNo: string;
    applicantCode: string;
    applicantCompanyName: string;
    payerCodeGate: string;
    paymentTypeGate: string;
    payerCodeSea: string;
    paymentTypeSea: string;
    category: string;
    vesselCode: string;
    vesselName: string;
    vesselVoyage: string;
    plannedOperationTime: string;
    attachmentFile: string;
    handlingPerson: string;
    handlerRemark: string;
    handlerConfirmation: string;
    handlerConfirmTime: string;
    isSystemRate: boolean;
    planStatus: string;
    conclusionTime: string;
    dataSource: string;
    applicantPlanType: string;
    applicantType: string;
    applicantPlanCount: number;
    applicantPlanStart: string;
    applicantPlanEnd: string;
    cargoOwnerCode: string;
    cargoAgentCode: string;
    invoiceTitle: string;
    handlingPhoneNumber: string;
  }
  // 子计划VO
  export interface subPlanVO {
    id: number;
    subPlanNo: string; //子计划号
    status: string; //状态
    placeContainer: string; //是否放箱
    pickupPlanNo: string; //提箱受理计划号
    unloadingSchedule: string; //卸船船期
    tradeType: string; //贸易类型
    containerHolder: string; //持箱人
    iso: string; //ISO
    containerAreaRange: string; //箱区范围
    planQuantity: string; //计划箱量
    mainGateAvailableSlot: string; //主闸可防箱量
    usedSlots: string; // 已用箱量
    availableSlots: string; // 未放箱量
    slotsInOperation: string; // 作业中占用的箱量
    creator: string; // 创建人
    createTime: string; // 创建时间
    updater: string; // 创建人
    updateTime: string; //修改时间
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
  export interface OverLimitWorkSaveReqVO {
    acceptancePlanSaveReqVO: subPlanVO;
    acceptancePlanOverOperationSaveReqVO: AcceptancePlanOverOperationVO;
    acceptancePlanOverOperationContainerSaveReqVOs: AcceptancePlanOverOperationContainerVO[];
    acceptancePlanBillMessageSaveReqVO: AcceptancePlanBillMessageVO;
  }
  // 子计划信息
  // export interface AcceptancePlanOverOperationVO {
  //   id: number;
  //   isAllowedStacking: boolean;
  //   plannedMachineryType: string;
  //   acceptancePlanNo: string;
  //   processInstanceId: string;
  // }
  // // 子计划箱信息
  // export interface AcceptancePlanOverOperationContainerVO {
  //   id: number;
  //   containerNo: string;
  //   containerSize: string;
  //   containerType: string;
  //   containerCargoWeight: number;
  //   containerTotalWeight: number;
  //   containerCargoSize: string;
  //   containerOverlimitDetails: string;
  //   containerPhysicalStatus: string;
  //   containerOperationNode: string;
  //   acceptancePlanNo: string;
  //   overOperationContainerNo: string;
  //   processInstanceId: string;
  //   priceSea: number;
  //   priceGate: number;
  //   machineSpreaderChangeType: string;
  //   machineSpreaderType: string;
  //   plannedSpreaderType: string;
  // }
  // 提单信息表
  // export interface AcceptancePlanBillMessageVO {
  //   id: number;
  //   acceptancePlanNo: string;
  //   billNo: string;
  //   cargoType: string;
  //   cargoName: string;
  //   cargoCount: number;
  //   billType: string;
  // }
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
  data: EmptyContainerControlApi.OverLimitWorkSaveReqVO,
) => {
  return requestClient.post(
    '/bpp/flow/acceptance-plan-over-operation/create',
    data,
  );
};
// 修改主计划信息
export const updateMainPlan = (
  data: EmptyContainerControlApi.OverLimitWorkSaveReqVO,
) => {
  return requestClient.put(
    '/bpp/flow/acceptance-plan-over-operation/update',
    data,
  );
};
// 查询主计划信息详情
export const getMainPlan = (id: number) => {
  return requestClient.get(
    `/bpp/flow/acceptance-plan-over-operation/get?id=${id}`,
  );
};
// 主计划信息分页查询
export const getMainPlanPage = (params: PageParam) => {
  return requestClient.get<
    PageResult<EmptyContainerControlApi.AcceptancePlanOverOperationVO>
  >('/bpp/flow/acceptance-plan-over-operation/page', { params });
};

//删除主计划
export const deleteMainPlan = (id: number) => {
  return requestClient.get(
    `/bpp/flow/acceptance-plan-over-operation/get?id=${id}`,
  );
};

// 创建子计划信息
export const createSubPlan = (
  data: EmptyContainerControlApi.SubPlanSaveReqVO,
) => {
  return requestClient.post(
    '/bpp/flow/sub-plan/create',
    data,
  );
};

// 修改子计划信息
export const updateSubPlan = (
  data: EmptyContainerControlApi.SubPlanSaveReqVO,
) => {
  return requestClient.put(
    '/bpp/flow/sub-plan/update',
    data,
  );
};

// 查询子计划信息详情
export const getSubPlan = (id: number) => {
  return requestClient.get(
    `/bpp/flow/sub-plan/get?id=${id}`,
  );
};
// 子计划分页查询
export const getSubPlanPage = (params: PageParam) => {
  return requestClient.get<
    PageResult<EmptyContainerControlApi.SubPlanSaveReqVO>
  >('/bpp/flow/sub-plan/page', { params });
};

export const deleteSubPlan = (id: number) => {
  return requestClient.get(
    `/bpp/flow/sub-plan/get?id=${id}`,
  );
};

export const getLogQueryData = (params: PageParam) => {
  return requestClient.get<PageResult<EmptyContainerControlApi.SubPlanSaveReqVO>
  >( '/bpp/flow/sub-plan/log-query', { params });
};
