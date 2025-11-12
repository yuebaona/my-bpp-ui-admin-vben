import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getRangePickerDefaultProps } from '#/utils';

// 超限作业申请数据类型
export interface OverLimitPlan {
  id: number;
  acceptance_plan_no: string;
  acceptance_plan_webno: string;
  applicant_code: string;
  applicant_company_name: string;
  payer_code: string;
  payer_name: string;
  payment_type: string;
  category: string;
  vessel_code: string;
  vessel_name: string;
  voyage_code: string;
  voyage_no: string;
  planned_operation_time: string;
  is_jc: string;
  bill_no: string;
  cargo_name: string;
  attachment_file: string;
  handling_person: string;
  handler_remark: string;
  handler_confirmation: string;
  res_confirm_time: string;
  is_allowed: string;
  allowed_time: string;
  planned_machinery_type: string;
  planned_spreader_type: string;
  system_rate: string;
  plan_price: number;
  plan_status: string;
  approval_workflow_current_node: string;
  appro_workflow_current_status: string;
  appr_result: string;
  approval_workflow_next_node: string;
  submission_time: string;
  workflow_com_time: string;
  creator: string;
  create_time: string;
  updater: string;
  update_time: string;
  deleted: number;
  tenant_id: number;
}

// 箱列表数据类型
export interface BoxData {
  id: number;
  container_no: string;
  container_size: string;
  container_type: string;
  container_cargo_weight_kg: number;
  container_total_weight_kg: number;
  container_cargo_size_cm: string;
  container_overlimit_details: string;
  container_physical_status: string;
  container_node: string;
  acceptance_plan_no: string;
  spreader_operation_id: number;
  creator: string;
  create_time: string;
  updater: string;
  update_time: string;
  deleted: number;
  tenant_id: number;
}
// 变更吊具记录数据类型
export interface ToolChangeRecord {
  id: number;
  global_id: string;
  operation_type: string;
  drive_source: string;
  change_reason: string;
  vessel_code: string;
  voyage_code: string;
  container_no: string;
  operation_position: string;
  machine_type: string;
  machine_no: string;
  spreader_type: string;
  start_time: string;
  end_time: string;
  operation_file: string;
  remark: string;
  container_over_id: number;
  machine_stop_id: number;
  creator: string;
  create_time: string;
  updater: string;
  update_time: string;
  deleted: number;
  tenant_id: number;
}

/** 超限作业申请列表的搜索表单 */
export function acceptancePlanOvrOprFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acceptance_plan_no',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入编号',
        allowClear: true,
      },
    },
    {
      fieldName: 'vessel_name',
      label: '作业船名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业船名',
        allowClear: true,
      },
    },
    {
      fieldName: 'voyage_no',
      label: '作业航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'bill_no',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'applicant_company_name',
      label: '申请单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请单位',
        allowClear: true,
      },
    },
    {
      fieldName: 'applicant_company_name',
      label: '箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入箱号',
        allowClear: true,
      },
    },
    {
      fieldName: 'submission_time',
      label: '提交时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'appr_workflow_com_time',
      label: '审结时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 超限作业申请列表的字段 */
export function acceptancePlanOvrOprColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: 'ID',
      minWidth: 80,
    },
    {
      field: 'acceptance_plan_no',
      title: '受理计划编号',
      minWidth: 180,
    },
    {
      field: 'acceptance_plan_webno',
      title: '受理计划Web编号',
      minWidth: 150,
    },
    {
      field: 'applicant_code',
      title: '申请人代码',
      minWidth: 120,
    },
    {
      field: 'applicant_company_name',
      title: '申请公司名称',
      minWidth: 150,
    },
    {
      field: 'payer_code',
      title: '付款方代码',
      minWidth: 120,
    },
    {
      field: 'payer_name',
      title: '付款方名称',
      minWidth: 120,
    },
    {
      field: 'payment_type',
      title: '付款方式',
      minWidth: 100,
    },
    {
      field: 'category',
      title: '类型',
      minWidth: 80,
    },
    {
      field: 'vessel_code',
      title: '船舶代码',
      minWidth: 120,
    },
    {
      field: 'vessel_name',
      title: '作业船名',
      minWidth: 120,
    },
    {
      field: 'voyage_code',
      title: '航次代码',
      minWidth: 100,
    },
    {
      field: 'voyage_no',
      title: '作业航次',
      minWidth: 100,
    },
    {
      field: 'planned_operation_time',
      title: '预计作业时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'is_jc',
      title: '是否JC',
      minWidth: 80,
    },
    {
      field: 'bill_no',
      title: '提单号',
      minWidth: 150,
    },
    {
      field: 'cargo_name',
      title: '货名',
      minWidth: 120,
    },
    {
      field: 'attachment_file',
      title: '附件',
      minWidth: 100,
    },
    {
      field: 'handling_person',
      title: '经办人',
      minWidth: 100,
    },
    {
      field: 'handler_remark',
      title: '经办人备注',
      minWidth: 120,
    },
    {
      field: 'handler_confirmation',
      title: '经办人确认',
      minWidth: 100,
    },
    {
      field: 'res_confirm_time',
      title: '经办人确认时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'is_allowed',
      title: '是否允许',
      minWidth: 100,
    },
    {
      field: 'allowed_time',
      title: '允许时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'planned_machinery_type',
      title: '预计机械类型',
      minWidth: 120,
    },
    {
      field: 'planned_spreader_type',
      title: '预计吊具类型',
      minWidth: 120,
    },
    {
      field: 'system_rate',
      title: '系统费率',
      minWidth: 100,
    },
    {
      field: 'plan_price',
      title: '报价金额',
      minWidth: 100,
    },
    {
      field: 'plan_status',
      title: '受理状态',
      minWidth: 100,
    },
    {
      field: 'approval_workflow_current_node',
      title: '审批工作流当前节点',
      minWidth: 150,
    },
    {
      field: 'appro_workflow_current_status',
      title: '审批工作流当前状态',
      minWidth: 150,
    },
    {
      field: 'appr_result',
      title: '审批结果',
      minWidth: 100,
    },
    {
      field: 'approval_workflow_next_node',
      title: '审批工作流下一节点',
      minWidth: 150,
    },
    {
      field: 'submission_time',
      title: '提交时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'workflow_com_time',
      title: '工作流完成时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'updater',
      title: '更新人',
      minWidth: 100,
    },
    {
      field: 'update_time',
      title: '更新时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'deleted',
      title: '删除标记',
      minWidth: 80,
    },
    {
      field: 'tenant_id',
      title: '租户ID',
      minWidth: 80,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

// 箱列表的字段配置
export function useBoxGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
    },
    {
      field: 'container_no',
      title: '箱号',
      minWidth: 150,
    },
    {
      field: 'container_size',
      title: '尺寸',
      minWidth: 100,
    },
    {
      field: 'container_type',
      title: '箱型',
      minWidth: 100,
    },
    {
      field: 'container_cargo_weight_kg',
      title: '货物重KG',
      minWidth: 100,
    },
    {
      field: 'container_total_weight_kg',
      title: '箱货总重KG',
      minWidth: 100,
    },
    {
      field: 'container_cargo_size_cm',
      title: '货物尺寸CM',
      minWidth: 120,
    },
    {
      field: 'container_overlimit_details',
      title: '超限明细CM',
      minWidth: 150,
    },
    {
      field: 'container_physical_status',
      title: '受理节点时箱物理状态',
      minWidth: 150,
    },
    {
      field: 'container_node',
      title: '现场操作当前节点',
      minWidth: 150,
    },
    {
      field: 'acceptance_plan_no',
      title: '受理计划唯一标识',
      minWidth: 200,
    },
    {
      field: 'spreader_operation_id',
      title: '变更吊具操作记录标识',
      minWidth: 150,
    },
    {
      field: 'id',
      title: '主键',
      minWidth: 80,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 120,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'updater',
      title: '更新人',
      minWidth: 120,
    },
    {
      field: 'update_time',
      title: '更新时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'deleted',
      title: '删除标记',
      minWidth: 80,
    },
    {
      field: 'tenant_id',
      title: '租户ID',
      minWidth: 80,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
// 变更吊具记录的字段配置
export function useToolChangeGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
    },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 80,
    },
    {
      field: 'global_id',
      title: '全局唯一标识',
      minWidth: 150,
    },
    {
      field: 'operation_type',
      title: '现场作业类别',
      minWidth: 120,
    },
    {
      field: 'drive_source',
      title: '驱动源',
      minWidth: 100,
    },
    {
      field: 'change_reason',
      title: '变更原因',
      minWidth: 120,
    },
    {
      field: 'vessel_code',
      title: '作业船名',
      minWidth: 100,
    },
    {
      field: 'voyage_code',
      title: '作业航次',
      minWidth: 100,
    },
    {
      field: 'container_no',
      title: '箱号',
      minWidth: 150,
    },
    {
      field: 'operation_position',
      title: '作业位置',
      minWidth: 100,
    },
    {
      field: 'machine_type',
      title: '作业机械类别',
      minWidth: 120,
    },
    {
      field: 'machine_no',
      title: '作业机械号',
      minWidth: 120,
    },
    {
      field: 'spreader_type',
      title: '作业吊具类型',
      minWidth: 120,
    },
    {
      field: 'start_time',
      title: '换吊具开始时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'end_time',
      title: '换吊具结束时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation_file',
      title: '现场图片',
      minWidth: 100,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
    },
    {
      field: 'container_over_id',
      title: '关联箱计划标识',
      minWidth: 120,
    },
    {
      field: 'machine_stop_id',
      title: '关联机械停止标识',
      minWidth: 120,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'updater',
      title: '更新人',
      minWidth: 100,
    },
    {
      field: 'update_time',
      title: '更新时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'deleted',
      title: '删除标识',
      minWidth: 80,
    },
    {
      field: 'tenant_id',
      title: '租户ID',
      minWidth: 80,
    },
  ];
}
