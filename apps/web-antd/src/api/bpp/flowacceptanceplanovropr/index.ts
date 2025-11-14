import type { Dayjs } from 'dayjs';

import { requestClient } from '#/api/request';

export namespace FlowAcceptancePlanOverApi {
  /** 受理计划操作信息 */
  export interface FlowAcceptancePlanOvrOpr {
    acceptancePlanNo?: string; // 受理计划编号
    acceptancePlanWebno: string; // 线上申请编号
    applicantCode: string; // 申请人
    applicantCompanyName: string; // 申请公司名称
    payerCode: string; // 缴费方编码
    payerName: string; // 缴费方名称
    paymentType: string; // 缴费方式
    category: string; // 进出口类别
    vesselCode: string; // 作业船编号
    vesselName: string; // 作业船名（中文船名）
    voyageCode: string; // 作业航次
    plannedOperationTime: Dayjs | string; // 预计作业时间
    isLcl: string; // 是否拼箱
    billNo: string; // 提单号
    cargoName: string; // 货名
    attachmentFile: string; // 附件
    handlingPerson: string; // 经办人
    handlerRemark: string; // 经办人备注
    handlerConfirmation: string; // 经办人确认内容
    resConfirmTime: Dayjs | string; // 经办人确认时间
    isAllowedStacking: string; // 是否落堆
    plannedMachineryType: string; // 预判机械类型
    plannedSpreaderType: string; // 预判作业吊具类型
    isSystemRate: string; // 是否系统费率
    planPrice: number; // 报价金额
    planStatus: string; // 受理状态
    approvalWorkflowCurrentNode: string; // 审批工作流当前节点
    apprWorkflowCurrentStatus: string; // 审批工作流当前状态
    apprResult: string; // 审核意见
    apprWorkflowNextNode: string; // 审批工作流下一节点
    submissionTime: Dayjs | string; // 提交时间
    apprWorkflowComTime: Dayjs | string; // 审批工作流的审结时间
    id: number; // 主键
  }

  /** 变更吊具记录VO */
  export interface MachineSpreaderChangeRecordVO {
    id: number; // 主键ID
    operationType: string; // 现场作业类别
    operationSource: string; // 驱动源
    changeReason: string; // 变更原因
    vesselCode: string; // 作业船名
    voyageCode: string; // 作业航次
    operationNo: string; // 编号
    operationPosition: string; // 作业位置
    machineType: string; // 作业机械类别
    machineNo: string; // 作业机械号
    spreaderType: string; // 作业吊具类型
    startTime: string; // 换吊具开始时间
    endTime: string; // 换吊具结束时间
    operationFile: string; // 现场图片
    remark: string; // 备注
    creator: string; // 创建人
    createTime: string; // 创建时间
    updater: string; // 更新人
    updateTime: string; // 更新时间
    deleted: boolean; // 删除标识
    tenantId: number; // 租户ID
    operationRecordStatus: string; // 操作记录状态
    acceptancePlanNo: string; // 受理计划编号
    operationContainerId: number; // 操作容器ID
    stopCode: string; // 停时原因代码
    stopType: string; // 停时分类代码
    stopStartTime: string; // 停时开始时间
    stopEndTime: string; // 停时结束时间
    stopRemark: string; // 停时备注
  }
}

// 受理计划操作 API
export const FlowAcceptancePlanOvrOprApi = {
  // 查询受理计划操作分页
  getFlowAcceptancePlanOvrOprPage: async (params: any) => {
    return await requestClient.get(
      '/flow/bpp/flow-acceptance-plan-ovr-opr/page',
      { ...params, headers: { tag: 'bpp-flow-server-Hsl' } },
    );
  },

  // 查询受理计划操作详情
  getFlowAcceptancePlanOvrOpr: async (id: number) => {
    return await requestClient.get(
      `/bpp/flow-acceptance-plan-ovr-opr/get?id=${id}`,
    );
  },

  // 新增受理计划操作
  createFlowAcceptancePlanOvrOpr: async (data: FlowAcceptancePlanOverApi.FlowAcceptancePlanOvrOpr) => {
    return await requestClient.post(
      `/bpp/flow-acceptance-plan-ovr-opr/create`,
      data,
    );
  },

  // 修改受理计划操作
  updateFlowAcceptancePlanOvrOpr: async (data: FlowAcceptancePlanOverApi.FlowAcceptancePlanOvrOpr) => {
    return await requestClient.put(
      `/bpp/flow-acceptance-plan-ovr-opr/update`,
      data,
    );
  },

  // 删除受理计划操作
  deleteFlowAcceptancePlanOvrOpr: async (id: number) => {
    return await requestClient.delete(
      `/bpp/flow-acceptance-plan-ovr-opr/delete?id=${id}`,
    );
  },

  /** 批量删除受理计划操作 */
  deleteFlowAcceptancePlanOvrOprList: async (ids: number[]) => {
    return await requestClient.delete(
      `/bpp/flow-acceptance-plan-ovr-opr/delete-list?ids=${ids.join(',')}`,
    );
  },

  // 导出受理计划操作 Excel
  exportFlowAcceptancePlanOvrOpr: async (params: any) => {
    return await requestClient.download(
      `/bpp/flow-acceptance-plan-ovr-opr/export-excel`,
      params,
    );
  },
};
