import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BppBaseCustomerApi } from '#/api/bpp/base/customer';

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
export function useGridFormSchema(): VbenFormSchema[] {
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
export function useGridColumns(): VxeTableGridOptions<BppBaseCustomerApi.Customer>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'customerCode',
      title: '客户代码',
      minWidth: 120,
    },
    {
      field: 'customerName',
      title: '客户名称',
      minWidth: 120,
    },
    {
      field: 'billingMode',
      title: '付费方式',
      minWidth: 120,
    },
    {
      field: 'paidPortFee',
      title: '港务费月结',
      minWidth: 120,
    },
    {
      field: 'customerType',
      title: '客户角色',
      minWidth: 120,
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 120,
    },
    {
      field: 'status',
      title: '有效标识',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    // {
    //   title: '操作',
    //   width: 200,
    //   fixed: 'right',
    //   slots: { default: 'actions' },
    // },
  ];
}
