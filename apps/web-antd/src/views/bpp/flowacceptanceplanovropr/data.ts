import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DescriptionItemSchema } from '#/components/description';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';
// 文件信息
export interface fileVo {
  fileName: string;
  fileUrl: string;
}
// 现场操作确认表单字段
export function onSiteOperationConfirmFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'machineSpreaderChangeType',
      label: '现场作业类别',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择现场作业类别',
        allowClear: true,
        // 数据字典配置
        api: {
          url: '/api/system/dict-data/type/operation_type',
          method: 'GET',
          params: {
            type: 'operation_type',
          },
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'operationSource',
      label: '驱动源',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择驱动源',
        allowClear: true,
        // 数据字典配置
        api: {
          url: '/api/system/dict-data/type/operation_source',
          method: 'GET',
          params: {
            type: 'operation_source',
          },
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'changeReason',
      label: '变更原因',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择变更原因',
        allowClear: true,
        // 数据字典配置
        api: {
          url: '/api/system/dict-data/type/change_reason',
          method: 'GET',
          params: {
            type: 'change_reason',
          },
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'operationFile',
      label: '现场图片上传',
      component: 'ImageUpload',
      formItemClass: 'md:col-span-2',
      componentProps: {
        multiple: true,
        maxNumber: 9,
      },
      rules: 'required',
    },
    {
      fieldName: 'vesselCode',
      label: '作业船名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业船名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'voyageCode',
      label: '作业航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业航次',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'containerNo',
      label: '箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入箱号',
        allowClear: true,
        disabled: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'operationPosition',
      label: '作业位置',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业位置',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'machineNo',
      label: '作业机械号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业机械号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'spreaderType',
      label: '实际吊具类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业吊具类型',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
      label: '更换换吊具开始时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具开始时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: '更换换吊具结束时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具结束时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'startTimeBack',
      label: '换回原吊具开始时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具开始时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'endTimeBack',
      label: '换回原吊具结束时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择换吊具结束时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
        allowClear: true,
      },
    },
  ];
}
// 箱信息表格数据列表
export function containerInfoColumns(): VxeTableGridOptions['columns'] {
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
      editRender: { name: 'input' },
      formatter({ cellValue }) {
        // 小写字母转换成大写字母
        return cellValue.toUpperCase();
      },
    },
    {
      title: '尺寸',
      field: 'containerSize',
      minWidth: 80,
      editRender: {
        name: 'select',
        options: [
          { label: '20', value: '20' },
          { label: '40', value: '40' },
        ],
      },
    },
    {
      title: '箱型',
      field: 'containerType',
      minWidth: 80,
      editRender: {
        name: 'select',
        options: [
          { label: 'FR', value: 'FR' },
          { label: 'OT', value: 'OT' },
        ],
      },
    },
    {
      title: '货重KG',
      field: 'containerCargoWeight',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      title: '箱货总重KG',
      field: 'containerTotalWeight',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      title: '货物尺寸CM',
      field: 'containerCargoSize',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      title: '超限明细CM',
      field: 'containerOverlimitDetails',
      minWidth: 120,
      editRender: { name: 'input' },
    },
    {
      title: '操作',
      minWidth: 120,
      slots: { default: 'actions' },
      fixed: 'right',
    },
  ];
}
// 箱信息详情表格数据列表
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
// 受理计划表单字段
export function acceptancePlanFormSchema(): VbenFormSchema[] {
  return [
    // 基本信息
    {
      fieldName: 'basic',
      component: 'none',
      label: '基础信息',
      formItemClass: 'md:col-span-2',
    },
    {
      fieldName: 'acceptancePlanWebNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号',
        allowClear: true,
        disabled: true,
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '申请公司名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请公司名称',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'handlingPerson',
      label: '经办人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经办人',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'handlingPhoneNumber',
      label: '经办人联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入经办人联系电话',
        allowClear: true,
      },
      // 更严格的手机号码校验
      rules: z
        .string()
        .min(11, '手机号码必须是11位')
        .max(11, '手机号码必须是11位')
        .regex(/^1[3-9]\d{9}$/, '请输入正确的手机号码格式'),
    },
    {
      fieldName: 'paymentTypeSea',
      label: '缴费方式（海侧）',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '现结', value: 'cash' },
          { label: '账期', value: 'credit' },
          { label: '现付', value: 'spot' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'payerCodeSea',
      label: '缴费方（海侧）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入缴费方（海侧）',
      },
      rules: 'required',
    },
    {
      fieldName: 'paymentTypeGate',
      label: '缴费方式（陆侧）',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '月结', value: 'export' },
          { label: '预收', value: 'import' },
          { label: '现结', value: 'transit' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'payerCodeGate',
      label: '缴费方（陆侧）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入缴费方（海侧）',
      },
      rules: 'required',
    },
    {
      fieldName: 'category',
      label: '进出口类别',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '收箱出口', value: 'export' },
          { label: '卸船进口提箱', value: 'import' },
          { label: '海运中转', value: 'transit' },
          { label: '船翻倒', value: 'additional' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'vesselName',
      label: '作业船名（中文名称）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业船名（中文名称）',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'vesselVoyage',
      label: '作业航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业航次',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'plannedOperationTime',
      label: '预计作业时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: '请选择预计作业时间',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'divider',
      component: 'Divider',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    // 箱信息
    {
      fieldName: 'basic',
      component: 'none',
      label: '箱货信息',
      formItemClass: 'md:col-span-2',
    },
    {
      fieldName: 'billNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'cargoName',
      label: '货名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入货名',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'containerInfo',
      component: 'none',
      label: '箱信息',
      formItemClass: 'w-full p-0 md:col-span-2',
      rules: 'required',
    },
    // 附件
    {
      fieldName: 'attachmentFile',
      label: '附件',
      component: 'Upload',
      formItemClass: 'mt-3',
      rules: 'required',
    },
    {
      fieldName: 'divider',
      component: 'Divider',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'handlerConfirmInfo',
      component: 'none',
      label: '经办人确认信息',
      formItemClass: 'w-full p-0 md:col-span-2',
    },
    {
      fieldName: 'handlerRemark',
      label: '经办人备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入经办人备注',
        allowClear: true,
      },
      formItemClass: 'w-full p-0 md:col-span-2 my-3',
      rules: 'required',
    },
    {
      fieldName: 'handlerConfirmation',
      label: ' 经办人确认',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入经办人确认',
        allowClear: true,
      },
      formItemClass: 'w-full p-0 md:col-span-2 my-3',
      rules: 'required',
    },
    {
      fieldName: 'handlingPersonLast',
      label: '经办人：',
      component: 'text',
    },
  ];
}
/** 超限作业申请列表的搜索表单 */
export function acceptancePlanOvrOprFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'acceptancePlanNo',
      label: '申请编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请编号',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselName',
      label: '作业船名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业船名',
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselVoyage',
      label: '作业航次',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作业航次',
        allowClear: true,
      },
    },
    {
      fieldName: 'billNo',
      label: '提单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'applicantCompanyName',
      label: '申请单位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请单位',
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: '箱号',
      component: 'Input',
      componentProps: {
        placeholder: '请输箱号',
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
      fieldName: 'conclusionTime',
      label: '审结时间',
      component: 'TimeRangePicker',
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
      field: 'acceptancePlanNo',
      title: '申请编号',
      minWidth: 120,
    },
    {
      field: 'acceptancePlanWebNo',
      title: '网上编号',
      minWidth: 150,
    },
    {
      field: 'applicantCompanyName',
      title: '申请单位',
      minWidth: 150,
    },
    {
      field: 'applicantCode',
      title: '申请人',
      minWidth: 120,
    },
    {
      field: 'vesselName',
      title: '作业船名',
      minWidth: 120,
    },
    {
      field: 'vesselVoyage',
      title: '作业航次',
      minWidth: 100,
    },
    {
      field: 'category',
      title: '进出口类别',
      minWidth: 100,
    },
    {
      field: 'vesselCode',
      title: '作业船名代码',
      minWidth: 120,
    },
    {
      field: 'billNo',
      title: '提单号',
      minWidth: 120,
    },
    {
      field: 'cargoName',
      title: '货名',
      minWidth: 120,
    },
    {
      field: 'payerCodeSea',
      title: '海侧缴费方',
      minWidth: 120,
    },
    {
      field: 'paymentTypeSea',
      title: '海侧缴费方式',
      minWidth: 120,
    },
    {
      field: 'payerCodeGate',
      title: '陆侧缴费方',
      minWidth: 120,
    },
    {
      field: 'paymentTypeGate',
      title: '陆侧缴费方式',
      minWidth: 120,
    },
    {
      field: 'handlingPerson',
      title: '经办人',
      minWidth: 100,
    },
    {
      field: 'isSystemRate',
      title: '是否系统费率',
      minWidth: 100,
    },
    {
      field: 'planStatus',
      title: '受理状态',
      minWidth: 100,
    },
    {
      field: 'auditNode',
      title: '审批节点',
      minWidth: 100,
    },
    {
      field: 'auditNodeStatus',
      title: '审批状态',
      minWidth: 100,
    },
    {
      field: 'auditComment',
      title: '审批意见',
      minWidth: 180,
    },
    {
      field: 'nextNode',
      title: '下一节点',
      minWidth: 100,
    },
    {
      field: 'submissionTime',
      title: '提交时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'conclusionTime',
      title: '审结时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
// 超限作业申请详情字段
export function acceptancePlanOvrOprDetailSchema(): DescriptionItemSchema[] {
  return [
    // 基础信息
    { field: 'acceptancePlanNo', label: '申请编号' },
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
      field: 'containerNo',
      title: '箱号',
      minWidth: 150,
    },
    {
      field: 'containerSize',
      title: '尺寸',
      minWidth: 100,
    },
    {
      field: 'containerType',
      title: '箱型',
      minWidth: 100,
    },
    {
      field: 'containerCargoWeight',
      title: '货物重KG',
      minWidth: 100,
    },
    {
      field: 'containerTotalWeight',
      title: '箱货总重KG',
      minWidth: 100,
    },
    {
      field: 'containerCargoSize',
      title: '货物尺寸CM',
      minWidth: 120,
    },
    {
      field: 'containerOverlimitDetails',
      title: '超限明细CM',
      minWidth: 150,
    },
    {
      field: 'containerPhysicalStatus',
      title: '受理节点时箱物理状态',
      minWidth: 150,
    },
    {
      field: 'containerOperationNode',
      title: '现场作业节点',
      minWidth: 150,
    },
  ];
}
// 变更吊具记录的字段配置
export function machineSpreaderChangeRecordGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
    },
    {
      field: 'machineSpreaderChangeType',
      title: '现场作业类别',
      minWidth: 120,
    },
    {
      field: 'vesselName',
      title: '作业船名',
      minWidth: 100,
    },
    {
      field: 'vesselVoyage',
      title: '作业航次',
      minWidth: 100,
    },
    {
      field: 'containerNo',
      title: '箱号',
      minWidth: 150,
    },
    {
      field: 'operationSource',
      title: '驱动源',
      minWidth: 100,
    },
    {
      field: 'changeReason',
      title: '变更原因',
      minWidth: 120,
    },
    {
      field: 'machineType',
      title: '作业机械类别',
      minWidth: 120,
    },
    {
      field: 'machineNo',
      title: '作业机械号',
      minWidth: 120,
    },
    {
      field: 'operationPosition',
      title: '作业位置',
      minWidth: 100,
    },
    {
      field: 'spreaderType',
      title: '作业吊具类型',
      minWidth: 120,
    },
    {
      field: 'startTime',
      title: '换吊具开始时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: '换吊具结束时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'operationFile',
      title: '现场图片',
      minWidth: 100,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
    },
    {
      field: 'creator',
      title: '创建者',
      minWidth: 150,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 150,
    },
  ];
}
