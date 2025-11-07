import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace FlowOverLimitWorkApi {
  // 受理计划VO
  export interface AcceptancePlanVO {
    id: number;
    acceptancePlanNo: string;
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
    submissionTime: string;
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
  }
  // 超限受理计划信息
  export interface AcceptancePlanOverOperationVO {
    id: number;
    isAllowedStacking: boolean;
    plannedMachineryType: string;
    plannedSpreaderType: string;
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
    AcceptancePlanVO: AcceptancePlanVO;
    AcceptancePlanOverOperationVO: AcceptancePlanOverOperationVO;
    AcceptancePlanOverOperationContainerVO: AcceptancePlanOverOperationContainerVO[];
    AcceptancePlanBillMessageVO: AcceptancePlanBillMessageVO;
  }
}
// 创建超限受理计划信息
export const createAcceptancePlanOverOperation = (
  data: FlowOverLimitWorkApi.OverLimitWorkSaveReqVO,
) => {
  return requestClient.post(
    '/bpp/flow/acceptance-plan-over-operation/create',
    data,
  );
};
// 修改超限受理计划信息
export const updateAcceptancePlanOverOperation = (
  data: FlowOverLimitWorkApi.OverLimitWorkSaveReqVO,
) => {
  return requestClient.put(
    '/bpp/flow/acceptance-plan-over-operation/update',
    data,
  );
};
// 查询超限受理计划信息详情
export const getAcceptancePlanOverOperation = (id: number) => {
  return requestClient.get(
    `/bpp/flow/acceptance-plan-over-operation/get?id=${id}`,
  );
};
// 超限受理计划信息分页查询
export const getAcceptancePlanOverOperationPage = (params: PageParam) => {
  return requestClient.get<
    PageResult<FlowOverLimitWorkApi.AcceptancePlanOverOperationVO>
  >('/bpp/flow/acceptance-plan-over-operation/page', { params });
};
