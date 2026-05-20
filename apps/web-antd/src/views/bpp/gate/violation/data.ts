import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ViolationCfgApi } from '#/api/bpp/flow/gate/violation';

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
      fieldName: 'fltGkey',
      label: '车队全局唯一业务主键',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车队全局唯一业务主键',
      },
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'ruleCd',
      label: '规则编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则编码',
      },
    },
    {
      fieldName: 'ruleDesc',
      label: '规则描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则描述',
      },
    },
    {
      fieldName: 'ruleTp',
      label: '规则类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则类型',
      },
    },
    {
      fieldName: 'rstr1Days',
      label: '第一次违规限制天数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入第一次违规限制天数',
      },
    },
    {
      fieldName: 'rstr2Days',
      label: '第二次违规限制天数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入第二次违规限制天数',
      },
    },
    {
      fieldName: 'rstr3Days',
      label: '第三次违规限制天数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入第三次违规限制天数',
      },
    },
    {
      fieldName: 'sortSeq',
      label: '排序',
      component: 'Input',
      componentProps: {
        placeholder: '请输入排序',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'ruleCd',
      label: '规则编码',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入规则编码',
      },
    },
    {
      fieldName: 'ruleDesc',
      label: '规则描述',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入规则描述',
      },
    },
    {
      fieldName: 'ruleTp',
      label: '规则类型',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入规则类型',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<ViolationCfgApi.ViolationCfgVO>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 120,
      visible: false,
    },
    {
      field: 'fltGkey',
      title: '车队全局唯一业务主键',
      minWidth: 120,
      visible: false,
    },
    {
      field: 'ruleCd',
      title: '规则编码',
      minWidth: 120,
    },
    {
      field: 'ruleDesc',
      title: '规则描述',
      minWidth: 120,
    },
    {
      field: 'ruleTp',
      title: '规则类型',
      minWidth: 120,
    },
    {
      field: 'rstr1Days',
      title: '第一次违规限制天数',
      minWidth: 120,
    },
    {
      field: 'rstr2Days',
      title: '第二次违规限制天数',
      minWidth: 120,
    },
    {
      field: 'rstr3Days',
      title: '第三次违规限制天数',
      minWidth: 120,
    },
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
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
