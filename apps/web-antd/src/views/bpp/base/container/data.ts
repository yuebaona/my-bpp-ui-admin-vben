import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BppBaseContainerApi } from '#/api/bpp/container';

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
      fieldName: 'containerNo',
      label: '集装箱箱号（ISO 6346：4字母+6数字+1校验位，共11位）',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder:
          '请输入集装箱箱号（ISO 6346：4字母+6数字+1校验位，共11位）',
      },
    },
    {
      fieldName: 'containerTypeId',
      label: '关联类型ID（外键 container_type.id）',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联类型ID（外键 container_type.id）',
      },
    },
    {
      fieldName: 'containerSizeId',
      label: '关联尺寸ID（外键 container_size.id）',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联尺寸ID（外键 container_size.id）',
      },
    },
    {
      fieldName: 'containerStatusId',
      label: '关联状态ID（外键 container_status.id）',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联状态ID（外键 container_status.id）',
      },
    },
    {
      fieldName: 'maxWeightKg',
      label: '最大载重',
      component: 'Input',
      componentProps: {
        placeholder: '请输入最大载重',
      },
    },
    {
      fieldName: 'tareWeightKg',
      label: '自重',
      component: 'Input',
      componentProps: {
        placeholder: '请输入自重',
      },
    },
    {
      fieldName: 'productionDate',
      label: '生产日期',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'manufacturer',
      label: '生产厂商',
      component: 'Input',
      componentProps: {
        placeholder: '请输入生产厂商',
      },
    },
    {
      fieldName: 'lastInspectDate',
      label: '最近检验日期',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'nextInspectDate',
      label: '下次检验日期',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'imoNumber',
      label: 'IMO编号（危险品集装箱必备，国际海事组织认证）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入IMO编号（危险品集装箱必备，国际海事组织认证）',
      },
    },
    {
      fieldName: 'cscPlate',
      label: 'CSC安全牌照编号（ISO 1496-1安全认证）',
      component: 'Input',
      componentProps: {
        placeholder: '请输入CSC安全牌照编号（ISO 1496-1安全认证）',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: '集装箱箱号（ISO 6346：4字母+6数字+1校验位，共11位）',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder:
          '请输入集装箱箱号（ISO 6346：4字母+6数字+1校验位，共11位）',
      },
    },
    {
      fieldName: 'containerTypeId',
      label: '关联类型ID（外键 container_type.id）',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入关联类型ID（外键 container_type.id）',
      },
    },
    {
      fieldName: 'containerSizeId',
      label: '关联尺寸ID（外键 container_size.id）',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入关联尺寸ID（外键 container_size.id）',
      },
    },
    {
      fieldName: 'containerStatusId',
      label: '关联状态ID（外键 container_status.id）',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入关联状态ID（外键 container_status.id）',
      },
    },
    {
      fieldName: 'maxWeightKg',
      label: '最大载重',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入最大载重',
      },
    },
    {
      fieldName: 'tareWeightKg',
      label: '自重',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入自重',
      },
    },
    {
      fieldName: 'productionDate',
      label: '生产日期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'manufacturer',
      label: '生产厂商',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入生产厂商',
      },
    },
    {
      fieldName: 'lastInspectDate',
      label: '最近检验日期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'nextInspectDate',
      label: '下次检验日期',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'imoNumber',
      label: 'IMO编号（危险品集装箱必备，国际海事组织认证）',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入IMO编号（危险品集装箱必备，国际海事组织认证）',
      },
    },
    {
      fieldName: 'cscPlate',
      label: 'CSC安全牌照编号（ISO 1496-1安全认证）',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入CSC安全牌照编号（ISO 1496-1安全认证）',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<BppBaseContainerApi.BaseContainer>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: 'ID',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'containerNo',
      title: '集装箱箱号（ISO 6346：4字母+6数字+1校验位，共11位）',
      minWidth: 120,
    },
    {
      field: 'containerTypeId',
      title: '关联类型ID（外键 container_type.id）',
      minWidth: 120,
    },
    {
      field: 'containerSizeId',
      title: '关联尺寸ID（外键 container_size.id）',
      minWidth: 120,
    },
    {
      field: 'containerStatusId',
      title: '关联状态ID（外键 container_status.id）',
      minWidth: 120,
    },
    {
      field: 'maxWeightKg',
      title: '最大载重',
      minWidth: 120,
    },
    {
      field: 'tareWeightKg',
      title: '自重',
      minWidth: 120,
    },
    {
      field: 'productionDate',
      title: '生产日期',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'manufacturer',
      title: '生产厂商',
      minWidth: 120,
    },
    {
      field: 'lastInspectDate',
      title: '最近检验日期',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'nextInspectDate',
      title: '下次检验日期',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'imoNumber',
      title: 'IMO编号（危险品集装箱必备，国际海事组织认证）',
      minWidth: 120,
    },
    {
      field: 'cscPlate',
      title: 'CSC安全牌照编号（ISO 1496-1安全认证）',
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
