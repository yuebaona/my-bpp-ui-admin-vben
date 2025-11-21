import type { VbenFormSchema } from '#/adapter/form'
import type { VxeTableGridOptions } from '#/adapter/vxe-table'
import type { DescriptionItemSchema } from '#/components/description'

// import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

export interface fileVo {
  fileName: string
  fileUrl: string
}

export function containerAreaRangeColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
    },
    {
      title: '堆场贝位',
      field: 'yardPosition',
      minWidth: 150,
      editRender: { name: 'input' },
    },
    {
      title: '堆场列',
      field: 'yardColumns',
      minWidth: 200,
      slots: { default: 'yardColumns', edit: 'yardColumns' },
    },
    {
      title: '总数（当前可用量）',
      field: 'totalCount',
      minWidth: 150,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '最低准存天数 ♦ ▽ ◁',
      field: 'minStorageDays',
      minWidth: 150,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '最高准存天数 ♦ ▽ ◁',
      field: 'maxStorageDays',
      minWidth: 150,
      editRender: { name: 'input', attrs: { type: 'number' } },
    },
    {
      title: '操作',
      minWidth: 100,
      slots: { default: 'actions' },
      fixed: 'right',
    },
  ];
}

export function containerInfoDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      field: 'serialNumber',
      type: 'seq',
      minWidth: 80,
      slots: { footer: 'serialNumber' },
    },
    {
      title: '箱号',
      field: 'containerNo',
      minWidth: 120,
    },
    {
      title: '尺寸',
      field: 'containerSize',
      minWidth: 80,
    },
    {
      title: '箱型',
      field: 'containerType',
      minWidth: 80,
    },
    {
      title: '货重KG',
      field: 'containerCargoWeight',
      minWidth: 100,
    },
    {
      title: '箱货总重KG',
      field: 'containerTotalWeight',
      minWidth: 120,
    },
    {
      title: '货物尺寸CM',
      field: 'containerCargoSize',
      minWidth: 120,
    },
    {
      title: '超限明细CM',
      field: 'containerOverlimitDetails',
      minWidth: 120,
    },
  ];
}
// 附件详情
export function attachmentDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      field: 'serialNumber',
      type: 'seq',
      minWidth: 80,
    },
    {
      title: '附件名称',
      field: 'fileName',
      minWidth: 120,
    },
    {
      title: '附件地址',
      field: 'filePath',
      minWidth: 80,
    },
    {
      title: '操作',
      minWidth: 120,
      slots: { default: 'actions' },
      fixed: 'right',
    },
  ];
}
export function subPlanFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acceptancePlanWebNo',
      label: '子计划号',
      component: 'Input',
      componentProps: {
        placeholder: '系统自动生成',
        allowClear: true,
        disabled: true,
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '是否放箱',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是（Y）', value: 'Y' },
          { label: '否（N）', value: 'N' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'handlingPerson',
      label: '提箱受理计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提箱受理计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'handlingPhoneNumber',
      label: '卸船船期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入卸船船期',
        allowClear: true,
      },
    },
    {
      fieldName: 'handlePerson',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人，可多条',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'paymentTypeSea',
      label: '贸易类型',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '内贸', value: 'neimao' },
          { label: '外贸', value: 'waimao' },
        ],
      },
    },
    {
      fieldName: 'iso',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        placeholder: '请输入ISO，可多条',
      },
      rules: 'required',
    },
    {
      fieldName: 'containerAreaRange',
      label: '箱区范围',
      component: 'Input',
      renderComponentContent: () => {
        return {
          default: () => null,
        };
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'planQuantity',
      label: '计划箱量',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划箱量',
        allowClear: true,
      },
    },
  ];
}
/** 空箱空箱列表的搜索表单 */
export function acceptancePlanOvrOprFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acceptancePlanNo',
      label: '主计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselName',
      label: '进口航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入进口航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselVoyage',
      label: '箱区',
      component: 'Input',
      componentProps: {
        placeholder: '请输入箱区',
        allowClear: true,
      },
    },
    {
      fieldName: 'billNo',
      label: '贸易类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入贸易类型',
        allowClear: true,
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        placeholder: '请输ISO',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'TimeRangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'PlanNO',
      label: '受理提箱计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入受理提箱计划号',
        allowClear: true,
      },
    },
  ];
}

/** 超限作业申请列表的字段 */
export function subPlanColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'acceptancePlanNo',
      title: '子计划号',
      minWidth: 120,
    },
    {
      field: 'acceptancePlanWebNo',
      title: '状态',
      minWidth: 150,
    },
    {
      field: 'applicantCompanyName',
      title: '是否放箱',
      minWidth: 150,
    },
    {
      field: 'applicantCode',
      title: '申请人',
      minWidth: 120,
    },
    {
      field: 'vesselName',
      title: '提箱受理计划号',
      minWidth: 120,
    },
    {
      field: 'vesselVoyage',
      title: '卸船船期',
      minWidth: 100,
    },
    {
      field: 'category',
      title: '贸易类型',
      minWidth: 100,
    },
    {
      field: 'vesselCode',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'billNo',
      title: 'ISO',
      minWidth: 120,
    },
    {
      field: 'cargoName',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'payerCodeSea',
      title: '计划箱量',
      minWidth: 120,
    },
    {
      field: 'paymentTypeSea',
      title: '主闸可放箱量',
      minWidth: 120,
    },
    {
      field: 'payerCodeGate',
      title: '已放箱量',
      minWidth: 120,
    },
    {
      field: 'paymentTypeGate',
      title: '未放箱量',
      minWidth: 120,
    },
    {
      field: 'handlingPerson',
      title: '作业中占用箱量',
      minWidth: 100,
    },
    {
      field: 'isSystemRate',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'planStatus',
      title: '创建时间',
      minWidth: 100,
    },
    {
      field: 'auditNode',
      title: '修改人',
      minWidth: 100,
    },
    {
      field: 'auditNodeStatus',
      title: '修改时间',
      minWidth: 100,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
// 子计划详情字段
export function subPlanDetailSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'acceptancePlanNo', label: '子计划号' },
    { field: 'applicantCompanyName', label: '申请公司名称' },
    { field: 'handlingPerson', label: '经办人' },
    { field: 'handlingPhoneNumber', label: '经办人联系电话' },
    { field: 'paymentTypeSea', label: '缴费方式（海侧）' },
    { field: 'payerCodeSea', label: '缴费方（海侧）' },
    { field: 'paymentTypeGate', label: '缴费方式（陆侧）' },
    { field: 'payerCodeGate', label: '缴费方（陆侧）' },
    { field: 'category', label: '进出口类别' },
    { field: 'vesselName', label: '作业船名（中文名称）' },
    { field: 'vesselVoyage', label: '作业航次' },
    { field: 'plannedOperationTime', label: '预计作业时间' },
  ]
}

/** 日志查询表单 */
export function logQueryFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'mainPlanNo',
      label: '主计划号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主计划号',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerHolder',
      label: '持箱人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入持箱人',
        allowClear: true,
      },
    },
    {
      fieldName: 'iso',
      label: 'ISO',
      component: 'Input',
      componentProps: {
        placeholder: '请输入ISO',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerArea',
      label: '箱区',
      component: 'Input',
      componentProps: {
        placeholder: '',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 日志查询列表字段 */
export function logQueryColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '序号',
      type: 'seq',
      width: 60,
      align: 'center',
    },
    {
      field: 'mainPlanNo',
      title: '主计划号',
      minWidth: 120,
    },
    {
      field: 'isRelease',
      title: '是否放箱(Y/N)',
      minWidth: 120,
    },
    {
      field: 'acceptancePlanNo',
      title: '提箱受理计划号',
      minWidth: 150,
    },
    {
      field: 'containerHolder',
      title: '持箱人',
      minWidth: 120,
    },
    {
      field: 'tradeType',
      title: '贸易类型',
      minWidth: 100,
    },
    {
      field: 'iso',
      title: 'ISO',
      minWidth: 100,
    },
    {
      field: 'containerAreaRange',
      title: '箱区范围',
      minWidth: 120,
    },
    {
      field: 'mainGateReleaseQty',
      title: '主闸可放箱量',
      minWidth: 120,
    },
    {
      field: 'modifier',
      title: '修改人',
      minWidth: 100,
    },
    {
      field: 'modifyTime',
      title: '修改时间',
      minWidth: 150,
    },
    {
      field: 'modifyType',
      title: '修改类型',
      minWidth: 100,
    },
  ];
}
