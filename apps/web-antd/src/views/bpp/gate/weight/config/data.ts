import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getDictDataPage } from '#/api/bpp/base/dict/data';
import { bppBaseDictStore } from '#/store/bpp/base/dict';

const bppBaseDict = bppBaseDictStore();

// 预加载需要的字典数据
const loadDictData = async (dictTypes: string[]) => {
  for (const dictType of dictTypes) {
    bppBaseDict.setBppBaseDictCacheByData(
      (
        await getDictDataPage({
          dictType,
          pageNo: 1,
          pageSize: 100,
        })
      ).list,
      dictType,
    );
  }
};
loadDictData([
  'empty_container_control_main_status',
  'empty_container_control_sub_status',
  'trade_type',
  'empty_container_control_main_operation_type',
]);

// 定义受理状态选项配置
function getPlanStatusOptions(type: string) {
  const dictOptions = bppBaseDict.getBppBaseDictOptions(type) || [];

  // 将字典数据转换为 CellTag 需要的格式
  return dictOptions.map((option) => ({
    value: option.value,
    label: option.label,
    color: option.colorType,
  }));
}

/** 重量配置的搜索表单 */
export function weightConfigSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'gateMode',
      label: '进出闸模式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '进', value: 'in' },
          { label: '出', value: 'out' },
        ],
      },
    },
    {
      fieldName: 'isEmpty',
      label: '空重',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: '空', value: 'empty' },
          { label: '重', value: 'heavy' },
        ],
      },
    },
    {
      fieldName: 'containerType',
      label: '集装箱类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        allowClear: true,
        options: [
          { label: 'ALL', value: 'ALL' },
        ],
      },
    },
  ];
}

/** 车队信息字段 */
export function configInfoColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 50, align: 'center', fixed: 'left' },
    { type: 'checkbox', width: 40, fixed: 'left' },
    {
      field: 'gateType',
      title: '闸口类型',
      minWidth: 150,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
          options: [
            { label: '是', value: '是' },
            { label: '否', value: '否' },
          ],
        },
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '是', value: '是' },
          { label: '否', value: '否' },
        ],
      },
    },
    {
      field: 'gateAccessType',
      title: '进出闸模式',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
          options: [
            { label: '进', value: '进' },
            { label: '出', value: '出' },
          ],
        },
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '进', value: '进' },
          { label: '出', value: '出' },
        ],
      },
    },
    {
      field: 'size',
      title: '尺寸',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
          options: [
            { label: '20', value: 20 },
            { label: '40', value: 40 },
            { label: '45', value: 45 },
            { label: '48', value: 48 },
            { label: '53', value: 53 },
            { label: '通用', value: '通用' },
          ],
        },
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '20', value: 20 },
          { label: '40', value: 40 },
          { label: '45', value: 45 },
          { label: '48', value: 48 },
          { label: '53', value: 53 },
          { label: '通用', value: '通用' },
        ],
      },
    },
    {
      field: 'isEmpty',
      title: '空重',
      minWidth: 120,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
          options: [
            { label: '空', value: '空' },
            { label: '重', value: '重' },
          ],
        },
      },
      editRender: {
        name: 'VxeSelect',
        props: {},
        options: [
          { label: '空', value: '空' },
          { label: '重', value: '重' },
        ],
      },
    },
    {
      field: 'containerType',
      title: '集装箱类型',
      minWidth: 150,
      filters: [{ data: [] }],
      filterRender: {
        name: 'VxeSelect',
        props: {
          placeholder: '请选择',
          clearable: true,
          options: [
            { label: '普通箱', value: '普通箱' },
            { label: '冷藏箱', value: '冷藏箱' },
            { label: '开顶箱', value: '开顶箱' },
            { label: '框架箱', value: '框架箱' },
            { label: '罐箱', value: '罐箱' },
            { label: '通用', value: '通用' },
          ],
        },
      },
      editRender: {
        name: 'VxeSelect',
        props: {
          clearable: true,
        },
        options: [
          { label: '普通箱', value: '普通箱' },
          { label: '冷藏箱', value: '冷藏箱' },
          { label: '开顶箱', value: '开顶箱' },
          { label: '框架箱', value: '框架箱' },
          { label: '罐箱', value: '罐箱' },
          { label: '通用', value: '通用' },
        ],
      },
    },
    {
      field: 'maxWeight',
      title: '最大重量（kg）',
      minWidth: 80,
      filters: [{ data: '' }],
      filterRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true,
        },
      },
      editRender: {
        name: 'VxeInput',
        props: {
          type: 'number',
          clearable: true,
        },
      },
    },
  ];
}
