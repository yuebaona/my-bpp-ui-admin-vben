import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CustomConfigFormApi } from '#/api/bpp/flow/custom/config/form';
import type { SystemMenuApi } from '#/api/system/menu';

import { handleTree } from '@vben/utils';

import { getMenuList } from '#/api/system/menu';
import { $t } from '#/locales';
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
      fieldName: 'formKey',
      label: '表单唯一标识',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入表单唯一标识',
      },
    },
    {
      fieldName: 'formName',
      label: '表单名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入表单名称',
      },
    },
    {
      fieldName: 'formPath',
      label: '表单实际组件路径',
      component: 'Input',
      componentProps: {
        placeholder: '请输入表单实际组件路径',
      },
    },
    {
      fieldName: 'menuId',
      label: '对应的菜单',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: async () => {
          const data = await getMenuList();
          data.unshift({
            id: 0,
            name: '顶级部门',
          } as SystemMenuApi.Menu);
          return handleTree(data);
        },
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: '请选择上级菜单',
        filterTreeNode(input: string, node: Recordable<any>) {
          if (!input || input.length === 0) {
            return true;
          }
          const name: string = node.label ?? '';
          if (!name) return false;
          return name.includes(input) || $t(name).includes(input);
        },
        showSearch: true,
        treeDefaultExpandedKeys: [0],
      },
    },
    {
      fieldName: 'formSchema',
      label: '表单项的每一项配置信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入表单项的每一项配置信息',
      },
    },
    {
      fieldName: 'formType',
      label: '所属类型',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入所属类型',
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
      fieldName: 'formKey',
      label: '表单唯一标识',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表单唯一标识',
      },
    },
    {
      fieldName: 'formName',
      label: '表单名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表单名称',
      },
    },
    {
      fieldName: 'formPath',
      label: '表单实际组件路径',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表单实际组件路径',
      },
    },
    {
      fieldName: 'menuId',
      label: '对应的菜单',
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: async () => {
          const data = await getMenuList();
          data.unshift({
            id: 0,
            name: '顶级部门',
          } as SystemMenuApi.Menu);
          return handleTree(data);
        },
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: '请选择上级菜单',
        filterTreeNode(input: string, node: Recordable<any>) {
          if (!input || input.length === 0) {
            return true;
          }
          const name: string = node.label ?? '';
          if (!name) return false;
          return name.includes(input) || $t(name).includes(input);
        },
        showSearch: true,
        treeDefaultExpandedKeys: [0],
      },
    },
    {
      fieldName: 'formSchema',
      label: '表单项的每一项配置信息',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入表单项的每一项配置信息',
      },
    },
    {
      fieldName: 'formType',
      label: '所属类型',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入所属类型',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<CustomConfigFormApi.ConfigForm>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 120,
      formatter: 'formatDateTime',
    },
    {
      field: 'formKey',
      title: '表单唯一标识',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
      },
    },
    {
      field: 'formName',
      title: '表单名称',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
      },
    },
    {
      field: 'formPath',
      title: '表单实际组件路径',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
      },
    },
    {
      field: 'menuId',
      title: '对应的菜单ID',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
      },
    },
    {
      field: 'formSchema',
      title: '表单项的每一项配置信息',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
      },
    },
    {
      field: 'formType',
      title: '所属类型',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
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
