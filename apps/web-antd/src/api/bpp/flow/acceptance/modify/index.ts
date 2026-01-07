import type { PageParam, PageResult } from '@vben/request';
import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace AcceptanceModifyAcceptancePlanModifyInfoApi {
  /** 改单受理原计划信息信息 */
  export interface AcceptancePlanModifyInfo {
    id: number; // 主键ID
    acceptancePlanNo?: string; // 改单受理计划号
    originalAcceptancePlanNo?: string; // 原受理计划号
    originalApplicantPlanType?: string; // 原受理计划类型
    originalPlanStatus?: string; // 改单受理原计划状态
    applicantName?: string; // 申请人
    applicantPlanCount?: number; // 计划数量
    payerCodeGate: string; // 陆侧付费单位代码
    applicantPhone: string; // 申请人联系电话
    originalApplicantPlanStart: string | Dayjs; // 原计划开始时间
    paymentTypeGate: string; // 陆侧付费方式
    cargoOwnerCode: string; // 货主代码
    originalApplicantPlanEnd: string | Dayjs; // 原计划结束时间
    invoiceTitle: string; // 开票抬头
    cargoAgentCode: string; // 货代代码
    fleetCustomerCode: string; // 车队客户代码
    relatedTo: string; // 关联TO
    returnTerminalName: string; // 返场码头名称
    remark: string; // 备注
    status?: string; // 改单记录状态
  }
}

/** 查询改单受理原计划信息分页 */
export function getAcceptancePlanModifyInfoPage(params: PageParam) {
  return requestClient.get<PageResult<AcceptanceModifyAcceptancePlanModifyInfoApi.AcceptancePlanModifyInfo>>(
    '/bpp/flow/acceptanceModify/acceptance-plan-modify-info/page',
    { params },
  );
}

/** 查询改单受理原计划信息详情 */
export function getAcceptancePlanModifyDetail(params: PageParam) {
  return requestClient.get<AcceptanceModifyAcceptancePlanModifyInfoApi.AcceptancePlanModifyInfo>(
    '/bpp/flow/acceptanceModify/acceptance-plan-modify-info/get-modify-detail',
    { params },
  );
}

/** 查询改单受理原计划信息详情 */
export function getAcceptancePlanModifyInfo(id: number) {
  return requestClient.get<AcceptanceModifyAcceptancePlanModifyInfoApi.AcceptancePlanModifyInfo>(
    `/bpp/flow/acceptanceModify/acceptance-plan-modify-info/get?id=${id}`,
  );
}

/** 新增改单受理原计划信息 */
export function createAcceptancePlanModifyInfo(data: AcceptanceModifyAcceptancePlanModifyInfoApi.AcceptancePlanModifyInfo) {
  return requestClient.post('/bpp/flow/acceptanceModify/acceptance-plan-modify-info/create', data);
}

/** 修改改单受理原计划信息 */
export function updateAcceptancePlanModifyInfo(data: AcceptanceModifyAcceptancePlanModifyInfoApi.AcceptancePlanModifyInfo) {
  return requestClient.put('/bpp/flow/acceptanceModify/acceptance-plan-modify-info/update', data);
}

/** 删除改单受理原计划信息 */
export function deleteAcceptancePlanModifyInfo(id: number) {
  return requestClient.delete(`/bpp/flow/acceptanceModify/acceptance-plan-modify-info/delete?id=${id}`);
}

/** 批量删除改单受理原计划信息 */
export function deleteAcceptancePlanModifyInfoList(ids: number[]) {
  return requestClient.delete(
    `/bpp/flow/acceptanceModify/acceptance-plan-modify-info/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出改单受理原计划信息 */
export function exportAcceptancePlanModifyInfo(params: any) {
  return requestClient.download('/bpp/flow/acceptanceModify/acceptance-plan-modify-info/export-excel', { params });
}
