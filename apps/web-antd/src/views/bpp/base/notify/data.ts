import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { BaseNotifyApi } from '#/api/bpp/base/notify';

import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form';
import { getUserByExcludeIdsPage } from '#/api/bpp/base/notify';

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
      fieldName: 'userId',
      label: '用户名',
      component: 'ApiSelect',
      componentProps: {
        api: getUserByExcludeIdsPage,
        labelField: 'nickname',
        valueField: 'id',
        placeholder: '请选择需要通知的人员',
      },
      dependencies: {
        triggerFields: ['userId'],
        show: (values) => !values.userId,
      },
    },
    {
      fieldName: 'notifyName',
      label: '通知人姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入账号',
      },
    },
    {
      fieldName: 'businessLabel',
      label: '业务标签',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.BUSINESS_LABEL),
        labelField: 'key',
        valueField: 'value',
        mode: 'multiple',
        placeholder: '请选择通知所属业务',
      },
    },
    {
      fieldName: 'status',
      label: '是否启用',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'businessLabel',
      label: '业务标签',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.BUSINESS_LABEL),
        labelField: 'key',
        valueField: 'value',
        mode: 'multiple',
        placeholder: '请选择通知所属业务',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '是否启用',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请输入是否启用',
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
// export function useGridColumns(): VxeTableGridOptions<BaseNotifyApi.Notify>['columns'] {
export function useGridColumns(
  onStatusChange?: (
    newStatus: number,
    row: BaseNotifyApi.Notify,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<BaseNotifyApi.Notify>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      title: '序号',
      type: 'seq',
      field: 'serialNumber',
      width: 40,
      align: 'center',
    },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 120,
      visible: false,
    },
    {
      field: 'notifyName',
      title: '通知人姓名',
      minWidth: 120,
    },
    {
      field: 'businessLabel',
      title: '业务标签',
      minWidth: 120,
      formatter: ({ row }) => {
        const dictOptions = getDictOptions(DICT_TYPE.BUSINESS_LABEL);
        if (Array.isArray(row.businessLabel)) {
          return row.businessLabel
            .map((value) => {
              const option = dictOptions.find((item) => item.value === value);
              return option ? option.label || value : value;
            })
            .join('、');
        }
        return row.businessLabel || '-';
      },
    },
    {
      field: 'status',
      title: '是否启用',
      minWidth: 100,
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: 'CellSwitch',
        props: {
          checkedValue: CommonStatusEnum.ENABLE,
          unCheckedValue: CommonStatusEnum.DISABLE,
        },
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
