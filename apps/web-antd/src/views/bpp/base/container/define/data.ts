import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function containerTypeColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 50, fixed: 'left' },
    {
      field: 'code',
      title: '代码',
      minWidth: 100,
      fixed: 'left',
    },
    {
      field: 'type',
      title: '箱型',
      minWidth: 100,
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 150,
    },
    {
      field: 'backgroundColor',
      title: '背景色',
      minWidth: 100,
    },
  ];
}

export function containerTypeSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'code',
      label: '代码',
      component: 'Input',
    },
    {
      fieldName: 'type',
      label: '箱型',
      component: 'Input',
    },
  ];
}
