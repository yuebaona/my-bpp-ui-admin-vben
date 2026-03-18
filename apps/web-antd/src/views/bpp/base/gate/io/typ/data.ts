import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BppBaseGateIoTypApi } from '#/api/bpp/base/gate/io/typ';
import { z } from '#/adapter/form';

import { getDictOptions } from '@vben/hooks';
import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';

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
      fieldName: 'businessCode',
      label: '业务代码',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务代码',
      },
    },
    {
      fieldName: 'businessName',
      label: '业务代码名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务代码名称）',
      },
    },
    {
      fieldName: 'pickupLocation',
      label: '提箱地',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入提箱地',
      },
    },
    {
      fieldName: 'deliveryLocation',
      label: '送箱地',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入送箱地',
      },
    },
    {
      fieldName: 'plnValidDays',
      label: '计划有效天数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划有效天数',
      },
    },
    {
      fieldName: 'isValid',
      label: '是否有效',
      component: 'Input',
      componentProps: {
        // placeholder: '请输入是否有效',
        // options: getDictOptions(DICT_TYPE.BIZ_IS_VALID, 'boolean'),
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      fieldName: 'mappingCode',
      label: '接口映射代码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入接口映射代码',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'businessCode',
      label: '业务代码',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入业务代码',
      },
    },
    {
      fieldName: 'mappingCode',
      label: 'TOS代码',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入TOS代码',
      },
    },
    {
      fieldName: 'businessName',
      label: '业务类型名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入业务类型名称',
      },
    },
    {
      fieldName: 'isValid',
      label: '是否有效',
      component: 'Input',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.BIZ_IS_VALID, 'number'),
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
export function useGridColumns(): VxeTableGridOptions<BppBaseGateIoTypApi.GateIoTyp>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'businessCode',
      title: '业务代码',
      minWidth: 120,
    },
    {
      field: 'businessName',
      title: '业务类型名称',
      minWidth: 120,
    },
    {
      field: 'pickupLocation',
      title: '提箱地',
      minWidth: 120,
    },
    {
      field: 'deliveryLocation',
      title: '送箱地',
      minWidth: 120,
    },
    {
      field: 'plnValidDays',
      title: '业务计划有效天数',
      minWidth: 120,
    },
    {
      field: 'isValid',
      title: '是否有效',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.BIZ_IS_VALID },
      },
    },
    {
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 120,
    },
    {
      field: 'creatorName',
      title: '创建人',
      minWidth: 120,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'updaterName',
      title: '更新人',
      minWidth: 120,
    },
    {
      field: 'updateTime',
      title: '更新时间',
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
