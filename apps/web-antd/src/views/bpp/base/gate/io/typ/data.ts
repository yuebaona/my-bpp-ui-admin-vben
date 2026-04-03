import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getRangePickerDefaultProps } from '#/utils';

export function gateIOSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'businessCode',
      label: '业务代码',
      component: 'Input',
    },
    {
      fieldName: 'mappingCode',
      label: 'TOS代码',
      component: 'Input',
    },
    {
      fieldName: 'businessName',
      label: '业务类型名称',
      component: 'Input',
    },
    {
      fieldName: 'isValid',
      label: '是否有效',
      component: 'Input',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

export function gateIOColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 50, fixed: 'left' },
    {
      field: 'businessCode',
      title: '业务代码',
      minWidth: 100,
      fixed: 'left',
      editRender: { name: 'input' },
    },
    {
      field: 'businessName',
      title: '业务类型名称',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      field: 'pickupLocation',
      title: '提箱地',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      field: 'deliveryLocation',
      title: '送箱地',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      field: 'plnValidDays',
      title: '业务计划有效天数',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      field: 'isValid',
      title: '是否有效',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 100,
      editRender: { name: 'input' },
    },
    {
      field: 'creatorName',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'updaterName',
      title: '更新人',
      minWidth: 100,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      minWidth: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function transportInstructionColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 50, fixed: 'left' },
    {
      field: 'transportOrderCode',
      title: '运输指令代码',
      minWidth: 100,
      fixed: 'left',
      editRender: { name: 'Input' },
    },
    {
      field: 'businessName',
      title: '业务类型名称',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'transportOrderName',
      title: '运输指令名称',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'gateInOutType',
      title: '送提类型',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'contDirection',
      title: '指令箱流向',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'emptyFull',
      title: '箱空重',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'transportOrderValidDays',
      title: '指令有效期（天）',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'mappingCode',
      title: '接口转换代码',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'isValid',
      title: '是否有效',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'isUsedForPln',
      title: '是否用于受理计划天数',
      minWidth: 100,
      editRender: { name: 'Input' },
    },
    {
      field: 'creatorName',
      title: '创建人',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      field: 'updaterName',
      title: '更新人',
      minWidth: 100,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 100,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      minWidth: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
