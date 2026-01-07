import type {VbenFormSchema} from '#/adapter/form';
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {FieldEditRuleHeadApi} from '#/api/bpp/flow/field-rule';

import {getRangePickerDefaultProps} from '#/utils';

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
      fieldName: 'ruleCode',
      label: '规则编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
      },
      rules: 'required',
    },
    // {
    //   fieldName: 'type',
    //   label: '类型',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择类型',
    //   },
    // },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
    // {
    //   fieldName: 'deletedTime',
    //   label: '删除时间',
    //   component: 'DatePicker',
    //   componentProps: {
    //     showTime: true,
    //     format: 'YYYY-MM-DD HH:mm:ss',
    //     valueFormat: 'x',
    //   },
    // },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'ruleCode',
      label: '规则编号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入规则编号',
      },
    },
    {
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入规则名称',
      },
    },
    {
      fieldName: 'type',
      label: '类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择类型',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入备注',
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
export function useGridColumns(): VxeTableGridOptions<FieldEditRuleHeadApi.EditRuleHead>['columns'] {
  return [
    {type: 'checkbox', width: 40},
    {
      field: 'id',
      title: '主键',
      minWidth: 120,
    },
    {
      field: 'ruleCode',
      title: '规则编号',
      minWidth: 120,
    },
    {
      field: 'ruleName',
      title: '规则名称',
      minWidth: 120,
    },
    // {
    //   field: 'type',
    //   title: '类型',
    //   minWidth: 120,
    // },
    {
      field: 'remark',
      title: '备注',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    // {
    //   field: 'deletedTime',
    //   title: '删除时间',
    //   minWidth: 120,
    //   formatter: 'formatDateTime',
    // },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: {default: 'actions'},
    },
  ];
}

