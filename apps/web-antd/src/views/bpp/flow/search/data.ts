import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getSimpleDictTypeList } from '#/api/bpp/base/dict/type';
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
      fieldName: 'tableName',
      label: '表名',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入表名',
      },
    },
    {
      fieldName: 'columnName',
      label: '字段名',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入字段名',
      },
    },
    {
      fieldName: 'dataType',
      label: '字段类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择字段类型',
      },
    },
    {
      fieldName: 'columnComment',
      label: '字段描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入字段描述',
      },
    },
    {
      fieldName: 'htmlType',
      label: '显示类型',
      rules: 'required',
      component: 'Select',
      componentProps: {
        placeholder: '请选择显示类型',
      },
    },
    {
      fieldName: 'dictType',
      label: '字典类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择字典类型',
      },
    },
    {
      fieldName: 'example',
      label: '数据示例',
      component: 'Input',
      componentProps: {
        placeholder: '请输入数据示例',
      },
    },
  ];
}

// 显示类型
const htmlTypeList = [
  { label: '文本框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期控件', value: 'datetime' },
  { label: '图片上传', value: 'imageUpload' },
  { label: '文件上传', value: 'fileUpload' },
  { label: '富文本控件', value: 'editor' },
];

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'tableName',
      label: '表名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表名',
      },
    },
    {
      fieldName: 'columnName',
      label: '字段名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入字段名',
      },
    },
    {
      fieldName: 'columnComment',
      label: '字段描述',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入字段描述',
      },
    },
    {
      fieldName: 'htmlType',
      label: '显示类型',
      component: 'Select',
      componentProps: {
        options: htmlTypeList,
        allowClear: true,
        placeholder: '请选择显示类型',
      },
    },
    {
      fieldName: 'dictType',
      label: '字典类型',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDictTypeList,
        labelField: 'name',
        valueField: 'type',
        placeholder: '请选字典类型',
        allowClear: true,
        showSearch: true,
        // 关键配置：自定义搜索逻辑
        filterOption: (input: string, option: any) => {
          // option.label 对应 labelField 指定的字段值（即显示的文字）、toLowerCase() 用于实现不区分大小写的搜索
          return option.label.toLowerCase().includes(input.toLowerCase());
        },
      },
    },
    {
      fieldName: 'example',
      label: '数据示例',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入数据示例',
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
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '编号',
      minWidth: 120,
    },
    {
      field: 'tableName',
      title: '表名',
      minWidth: 120,
    },
    {
      field: 'columnName',
      title: '字段名',
      minWidth: 120,
    },
    {
      field: 'dataType',
      title: '字段类型',
      minWidth: 120,
    },
    {
      field: 'columnComment',
      title: '字段描述',
      minWidth: 120,
      slots: { default: 'columnComment' },
    },
    {
      field: 'htmlType',
      title: '显示类型',
      minWidth: 120,
      slots: { default: 'htmlType' },
      params: {
        options: htmlTypeList,
      },
    },
    {
      field: 'dictType',
      title: '字典类型',
      minWidth: 120,
      slots: { default: 'dictType' },
    },
    {
      field: 'example',
      title: '数据示例',
      minWidth: 120,
      slots: { default: 'example' },
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
