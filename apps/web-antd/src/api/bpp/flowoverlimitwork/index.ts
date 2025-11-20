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
  // 变更吊具记录表
  export interface MachineSpreaderChangeRecordVO {
    id: number | string;
    operationType: string;
    operationSource: string;
    changeReason: string;
    vesselCode: string;
    vesselVoyage: string;
    operationNo: string;
    operationPosition: string;
    machineSpreaderChangeType: string;
    machineSpreaderType: string;
    machineType: string;
    machineNo: string;
    spreaderType: string;
    startTime: number | string;
    endTime: number | string;
    operationFile: string;
    remark: string;
    creator: string;
    createTime: number | string;
    endTimeBack: number;
    operationRecordStatus: string;
    acceptancePlanNo: string;
    operationContainerId: number;
    stopCode: string;
    stopType: string;
    stopStartTime: number | string;
    stopEndTime: number | string;
    stopRemark: string;
    overOperationContainerIds: string[]; // 用于现场操作新增
  }
  // 总数据
  export interface OverLimitWorkSaveReqVO {
    acceptancePlanSaveReqVO: AcceptancePlanVO;
    acceptancePlanOverOperationSaveReqVO: AcceptancePlanOverOperationVO;
    acceptancePlanOverOperationContainerSaveReqVOs: AcceptancePlanOverOperationContainerVO[];
    acceptancePlanBillMessageSaveReqVO: AcceptancePlanBillMessageVO;
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
// 超限受理计划信息箱分页查询
export const getAcceptancePlanOverOperationContainerPage = (
  params: PageParam,
) => {
  return requestClient.get<
    PageResult<FlowOverLimitWorkApi.AcceptancePlanOverOperationContainerVO>
  >('/bpp/flow/acceptance-plan-over-operation-container/page', { params });
};
// 获得机械吊具变更操作记录分页
export const getMachineSpreaderChangeRecordPage = (data: any) => {
  return requestClient.post('/bpp/flow/machine-spreader-record/page', data);
};
// 现场操作确认
export const confirmMachineSpreaderChangeRecord = (
  data: FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO,
) => {
  return requestClient.post(
    '/bpp/flow/acceptance-plan-over-operation-container/confirm',
    data,
  );
};
// 修改超限受理计划信息
export const updateMachineSpreaderRecord = (
  data: FlowOverLimitWorkApi.MachineSpreaderChangeRecordVO,
) => {
  return requestClient.put('/bpp/flow/machine-spreader-record/update', data);
};
// 删除机械吊具变更操作记录
export const deleteMachineSpreaderRecord = (id: number | string) => {
  return requestClient.delete(
    `/bpp/flow/machine-spreader-record/delete?id=${id}`,
  );
};
// 现场无此操作（实际无作业）
export const acceptancePlanOverOperationContainerNoOperation = (ids: any) => {
  return requestClient.post(
    `/bpp/flow/acceptance-plan-over-operation-container/no-operation?ids=${ids}`,
  );
};
// 无需变更吊具（停止后续作业）
export const acceptancePlanOverOperationContainerComplete = (ids: any) => {
  return requestClient.post(
    `/bpp/flow/acceptance-plan-over-operation-container/complete?ids=${ids}`,
  );
};
