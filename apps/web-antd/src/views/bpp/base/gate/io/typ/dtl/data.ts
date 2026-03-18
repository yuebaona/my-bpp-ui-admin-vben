import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BppBaseGateIoTypDtlApi } from '#/api/bpp/base/gate/io/typ/dtl';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'customerCode',
      label: '客户代码',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户代码',
      },
    },
    {
      fieldName: 'customerName',
      label: '客户名称（中文）',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户名称（中文）',
      },
    },
    {
      fieldName: 'customerNameEn',
      label: '客户名称（英文）',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户名称（英文）',
      },
    },
    {
      fieldName: 'customerNameAbbr',
      label: '简称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入简称',
      },
    },
    {
      fieldName: 'contactPerson',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
    },
    {
      fieldName: 'contactPhone',
      label: '联系方式',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系方式',
      },
    },
    {
      fieldName: 'billingMode',
      label: '计费模式',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计费模式',
      },
    },
    {
      fieldName: 'billingMethod',
      label: '结算方式',
      component: 'Input',
      componentProps: {
        placeholder: '请输入结算方式',
      },
    },
    {
      fieldName: 'noticeEmail',
      label: '通知邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入通知邮箱',
      },
    },
    {
      fieldName: 'noticePhone',
      label: '客户通知电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入客户通知电话',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useDtlGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'customerCode',
      label: '客户代码',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入客户代码',
      },
    },
    {
      fieldName: 'customerName',
      label: '客户名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入客户名称',
      },
    },
    {
      fieldName: 'paidPortFee',
      label: '港务费月结',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入港务费月结',
      },
    },
    {
      fieldName: 'customerType',
      label: '客户角色',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入客户角色',
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

/** 列表的字段 */
export function useDtlGridColumns(): VxeTableGridOptions<BppBaseGateIoTypDtlApi.GateIoTypDtl>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'transportOrderCode',
      title: '运输指令代码',
      minWidth: 120,
    },
    {
      field: 'transportOrderName',
      title: '运输指令名称',
      minWidth: 120,
    },
    {
      field: 'gateInOutType',
      title: '送提类型',
      minWidth: 120,
    },
    {
      field: 'contDirection',
      title: '指令箱流向',
      minWidth: 120,
    },
    {
      field: 'emptyFull',
      title: '空重',
      minWidth: 120,
    },
    {
      field: 'transportOrderValidDays',
      title: '指令有效天数',
      minWidth: 120,
    },
    {
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 120,
    },
    {
      field: 'isValid',
      title: '是否有效',
      minWidth: 120,
    },
    {
      field: 'isUsedForPln',
      title: '是否用于受理计划天数',
      minWidth: 120,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
