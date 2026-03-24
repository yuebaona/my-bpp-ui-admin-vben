import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace AcceptancePlanApi {
  /** 受理计划信息信息 */
  export interface Plan {
    id: number; // 主键ID
    acptPlnNo?: string; // 受理计划号（唯一业务标识）
    acptPlnWebNo: string; // 线上申请编号
    applicantPlanType: string; // 受理计划类型
    planStatus: string; // 受理状态
    planTwentyFtVolume: number; // 20尺计划箱量
    planFortyFtVolume: number; // 40尺计划箱量
    planFortyFiveFtVolume: number; // 45尺计划箱量
    completeTwentyFtVolume: number; // 20尺完成箱量
    completeFortyFtVolume: number; // 40尺完成箱量
    completeFortyFiveFtVolume: number; // 45尺完成箱量
    remainingTwentyFtVolume: number; // 20尺剩余箱量
    remainingFortyFtVolume: number; // 40尺剩余箱量
    remainingFortyFiveFtVolume: number; // 45尺剩余箱量
    vslNameIn: string; // 进口船名（英文）
    vslVoyIn: string; // 进口航次
    vslNameOut: string; // 出口船名（英文）
    vslVoyOut: string; // 出口航次
    vslZhNameIn: string; // 进口船名（中文）
    vslZhNameOut: string; // 出口船名（中文）
    billNo: string; // 提单号
    cargoName: string; // 货名
    tradeTypeIn: string; // 内外贸（进口）
    tradeTypeOut: string; // 内外贸（出口）
    isDirectPickLoadOut: boolean; // 直提
    isDirectPickLoadIn: boolean; // 直装
    imdgCodeOut: string; // 提箱IMDG
    imdgCodeIn: string; // 进箱IMDG
    isPtiValidOut: string; // 提箱PTI
    isPtiValidIn: string; // cwi
    cwi: string; // 进箱PTI
    isDamage: boolean; // 残损
    damageGrade: string; // 残损等级
    applicantPlanStart?: Date; // 计划开始时间
    applicantPlanEnd?: Date; // 计划结束时间
    createTime?: Date; // 创建时间
    updateTime?: Date; // 计划更新时间
    conclusionTime?: Date; // 计划审核时间
    updater: string; // 计划更新人
    relatedBillNo: string; // 关联提单号
    applicantCompanyName: string; // 申请公司名称
    cargoAgentCode: string; // 货代
    cargoOwnerCode: string; // 货主
    payerNameGate: string; // 陆侧缴费方代码
    paymentTypeGate: string; // 陆侧缴费方式
    invoiceTitle: string; // 开票抬头
    isBinding: boolean; // 是否捆绑
    reviewInfo: string; // 拒绝原因
    handlerRemark: string; // 经办人备注
  }
  export interface RecordBase {
    acptPlnNo: string; // 受理计划号
    acptPlnWebNo: string; // 网上受理计划号
    applicantPlanType: string; // 业务类型
    planStatus: string; // 改单计划状态
    applicantCode: string; // 申请人
    payer: string; // 付款人
    createTime: string; // 创建时间
    conclusionTime: string; // 审核时间
    handlerRemark: string; // 备注
    reviewInfo: string; // 拒绝原因
  }
}

/** 查询受理计划信息分页 */
export function getPlanPage(params: PageParam) {
  return requestClient.get<PageResult<AcceptancePlanApi.Plan>>(
    '/bpp/common/acceptance-plan/page',
    { params },
  );
}

/** 查询受理计划信息详情 */
export function getPlan(id: number) {
  return requestClient.get<AcceptancePlanApi.Plan>(
    `/bpp/common/acceptance-plan/get?id=${id}`,
  );
}

/** 新增受理计划信息 */
export function createPlan(data: AcceptancePlanApi.Plan) {
  return requestClient.post('/bpp/common/acceptance-plan/create', data);
}

/** 修改受理计划信息 */
export function updatePlan(data: AcceptancePlanApi.Plan) {
  return requestClient.put('/bpp/common/acceptance-plan/update', data);
}

/** 删除受理计划信息 */
export function deletePlan(id: number) {
  return requestClient.delete(`/bpp/common/acceptance-plan/delete?id=${id}`);
}

/** 批量删除受理计划信息 */
export function deletePlanList(ids: number[]) {
  return requestClient.delete(
    `/acceptance/plan/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出受理计划信息 */
export function exportPlan(params: any) {
  return requestClient.download('/bpp/common/acceptance-plan/export-excel', {
    params,
  });
}
